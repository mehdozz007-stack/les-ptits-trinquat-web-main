import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, PhoneCallIcon } from "lucide-react";
import heroImage from "@/assets/hero-children.jpg";
import logoBorisVian from "@/assets/logos/logo-boris-vian.jpg";
import logoMdh from "@/assets/logos/logo-mdh-new-web.jpg";
import logoTrinquat from "@/assets/logos/trinquatcompagnie.jpg";
import logoAssadia from "@/assets/logos/logoAssadia.svg";

const footerLinks = {
  navigation: [
    { label: "Accueil", href: "/" },
    { label: "Événements", href: "/evenements" },
    { label: "Comptes-rendus", href: "/comptes-rendus" },
    { label: "Partenaires", href: "/partenaires" },
  ],
  association: [
    { label: "À propos", href: "/a-propos" },
    { label: "Le bureau", href: "/a-propos#bureau" },
    { label: "Adhérer", href: "/a-propos#adherer" },
    { label: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/LesPtitsTrinquats", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/Les_ptits_trinquat?fbclid=IwY2xjawOmlxFleHRuA2FlbQIxMABicmlkETFnZjNRdDdMVHp6cHdIM3pwc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHvXM-UMnkp69r5uScbYVykNF5ZVtr9MQa1_k2se0iqZ3IfRUEmOZXgHqWCes_aem_hUyrVdxiVyWFisTvxVlyRw&brid=boREg9T10BACz4NodPBJ3w", label: "Instagram" },
  { icon: Mail, href: "mailto:parents.frank.dickens@gmail.com", label: "Email" },
  { icon: PhoneCallIcon, href: "https://www.helloasso.com/associations/les-p-tits-trinquat", label: "HelloAsso" },
];

const officialPartners = [
  {
    id: 1,
    name: "Boris Vian",
    logo: logoBorisVian,
    alt: "Logo École Boris Vian",
    website: "https://www.montpellier.fr/territoire/lieux-equipements/maison-pour-tous-boris-vian#/search@43.5960982,3.8918619,15.00",
  },
  {
    id: 2,
    name: "Maison de heidelberg",
    logo: logoMdh,
    alt: "Logo Maison de heidelberg",
    website: "https://maison-de-heidelberg.org/",
  },
  {
    id: 3,
    name: "Trinquat Compagnie",
    logo: logoTrinquat,
    alt: "Logo Trinquat Compagnie",
    website: "https://www.helloasso.com/associations/trinquat-et-compagnie",
  },
  {
    id: 4,
    name: "Assadia Montpellier",
    logo: logoAssadia,
    alt: "Logo Assadia Montpellier",
    website: "https://share.google/37woMOO85tI3B7MuX",
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-foreground text-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 watercolor-blob" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-secondary/20 watercolor-blob" />
      </div>

      <div className="container relative py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <span className="text-xl font-bold text-primary-foreground">
                  <img
                  src={heroImage}
                  alt="Logo enfants"
                  className="h-10 w-10 rounded-xl object-cover"
                  />
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Les P'tits Trinquat</h3>
                <p className="text-sm text-background/70">Association parents d'élèves</p>
              </div>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              Ensemble pour l'épanouissement de nos enfants au sein du groupe scolaire Anne Frank – Charles Dickens.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-background/50">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Association */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-background/50">
              Association
            </h4>
            <ul className="space-y-2">
              {footerLinks.association.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-background/50">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-sm text-background/70">
                  686 Avenue du Pont Trinquat <br /> 34070 Montpellier
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <Link to="/contact" className="text-sm text-background/70 transition-colors hover:text-primary">Ecrivez-nous 🧡</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-center gap-8 border-t border-background/10 pt-8">
          {/* Official Partners Section */}
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-background/50">
              ✨ Nos partenaires officiels ✨
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {officialPartners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center transition-all hover:scale-105"
                  aria-label={`Visiter ${partner.name}`}
                >
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    className="h-20 w-auto object-contain md:h-24 rounded-lg"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Copyright & Legal Links */}
          <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6 md:gap-8">
            <p className="text-sm text-background/50">
              © {new Date().getFullYear()} Les P'tits Trinquat. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <a href="/documents/mentions-legales.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-background/50 hover:text-primary">
                Mentions légales
              </a>
              <a href="/documents/confidentialite.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-background/50 hover:text-primary">
                Confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
