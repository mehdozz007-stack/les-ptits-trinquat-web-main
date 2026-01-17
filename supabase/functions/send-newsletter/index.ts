import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// XSS Protection - échappe les caractères spéciaux HTML
function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface SendNewsletterRequest {
  newsletterId: string;
}

export const handler = async (req: Request): Promise<Response> => {
  // Gérer les requêtes OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Vérifier le header Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // 2. Vérifier le JWT
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error("Invalid JWT token", claimsError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = claimsData.claims.sub;
    if (!userId) {
      console.error("No user ID in JWT claims");
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // 3. Utiliser la SERVICE_ROLE_KEY pour accéder à la table user_roles (bypass RLS)
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseServiceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Vérifier que l'utilisateur est admin
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      console.error("Error checking admin role", roleError);
      return new Response(
        JSON.stringify({ error: "Permission check failed" }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (!roleData) {
      console.error("User is not admin", userId);
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: corsHeaders }
      );
    }

    // 5. Parser la requête
    const body: SendNewsletterRequest = await req.json();
    const { newsletterId } = body;

    if (!newsletterId) {
      return new Response(
        JSON.stringify({ error: "Missing newsletterId" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 6. Récupérer la newsletter
    const { data: newsletter, error: newsletterError } = await supabase
      .from("newsletters")
      .select("*")
      .eq("id", newsletterId)
      .maybeSingle();

    if (newsletterError || !newsletter) {
      console.error("Newsletter not found", newsletterError);
      return new Response(
        JSON.stringify({ error: "Newsletter not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // 7. Récupérer les abonnés actifs avec consentement
    const { data: subscribers, error: subscribersError } = await supabase
      .from("newsletter_subscribers")
      .select("email, first_name")
      .eq("is_active", true)
      .eq("consent", true);

    if (subscribersError) {
      console.error("Error fetching subscribers", subscribersError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch subscribers" }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      console.warn("No active subscribers found");
      return new Response(
        JSON.stringify({ error: "No subscribers to send to" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 8. Vérifier la clé Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // 9. Sanitizer le contenu (XSS protection)
    const sanitizedSubject = escapeHtml(newsletter.subject);
    const sanitizedContent = newsletter.content; // Peut contenir du HTML intentionnel

    // 10. Envoyer les emails via Resend
    const emails = subscribers.map((sub: any) => sub.email);
    const batchSize = 100;
    let sentCount = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);

      for (const email of batch) {
        const subscriber = subscribers.find((s: any) => s.email === email);
        const firstName = subscriber?.first_name || "Cher(e) parent";

        try {
          const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: "noreply@les-ptits-trinquat.fr",
              to: email,
              subject: sanitizedSubject,
              html: `
                <p>Bonjour ${escapeHtml(firstName)},</p>
                ${sanitizedContent}
                <hr />
                <p><em>Vous recevez cet email car vous êtes abonné à la newsletter de Les P'tits Trinquât.</em></p>
                <p><a href="https://les-ptits-trinquat.fr/unsubscribe?email=${encodeURIComponent(email)}">Se désabonner</a></p>
              `,
            }),
          });

          if (!resendResponse.ok) {
            console.error(
              `Failed to send email to ${email}:`,
              await resendResponse.text()
            );
          } else {
            sentCount++;
          }
        } catch (error) {
          console.error(`Error sending email to ${email}:`, error);
        }
      }
    }

    // 11. Mettre à jour le statut de la newsletter
    const { error: updateError } = await supabase
      .from("newsletters")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        recipients_count: sentCount,
      })
      .eq("id", newsletterId);

    if (updateError) {
      console.error("Error updating newsletter status", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update newsletter status" }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(
      `Newsletter ${newsletterId} sent successfully to ${sentCount} recipients`
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: `Newsletter sent to ${sentCount} recipients`,
        recipientCount: sentCount,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Unexpected error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
