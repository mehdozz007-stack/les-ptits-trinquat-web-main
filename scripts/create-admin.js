import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Les variables d\'environnement Supabase sont manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin(email, password) {
  try {
    console.log('📝 Création de l\'utilisateur...');
    
    // Créer l'utilisateur via l'API d'authentification
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Confirmer l'email automatiquement
    });

    if (authError) {
      console.error('❌ Erreur lors de la création de l\'utilisateur:', authError.message);
      if (authError.message.includes('already registered')) {
        console.log('ℹ️  Cet utilisateur existe déjà. Je vais ajouter le rôle admin...');
        // Continuer pour ajouter le rôle
        const { data: existingUser } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('email', email)
          .single();
        
        if (existingUser) {
          console.log('✅ Utilisateur trouvé, ajout du rôle admin...');
        }
      } else {
        process.exit(1);
      }
    } else {
      console.log(`✅ Utilisateur créé: ${user.user.id}`);
    }

    // Récupérer l'ID utilisateur
    const { data: userData, error: getUserError } = await supabase.auth.admin.getUserById(
      user?.user?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === email).id
    );

    if (getUserError) {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur:', getUserError.message);
      process.exit(1);
    }

    const userId = userData.user.id;
    console.log(`📌 ID utilisateur: ${userId}`);

    // Ajouter le rôle admin dans la table user_roles
    console.log('👤 Ajout du rôle admin...');
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert(
        {
          user_id: userId,
          role: 'admin',
        },
        { onConflict: 'user_id,role' }
      );

    if (roleError) {
      console.error('❌ Erreur lors de l\'ajout du rôle:', roleError.message);
      process.exit(1);
    }

    console.log(`\n✅ SUCCÈS! Administrateur créé avec succès!\n`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Mot de passe: ${password}`);
    console.log(`👤 Rôle: admin`);
    console.log(`\nVous pouvez maintenant accéder à: http://localhost:8081/admin/newsletter`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Exécuter
const email = process.argv[2] || 'mehdozz007@gmail.com';
const password = process.argv[3] || 'poiuytreza4U!';

console.log(`\n🚀 Création d'un administrateur\n`);
createAdmin(email, password);
