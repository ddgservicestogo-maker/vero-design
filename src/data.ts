/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Service } from './types';

export const CONTACT_INFO = {
  phoneUI: '+228 79654100',
  phoneWhatsApp: '22879654100', // Togo country code +228
  address: 'Kpogan Agbétiko, Lomé, Togo',
  workingHours: 'Lundi - Samedi : 08h00 - 19h00 (Dimanche sur rendez-vous)',
  email: 'vero.design.couture@gmail.com',
  instagram: 'vero_design_couture',
  facebook: 'Véro-Design Couture',
};

export const SERVICES_LIST: Service[] = [
  {
    id: 'retouche',
    title: 'Services de Retouche',
    description: 'Ajustement parfait et réparation soignée pour donner une seconde vie à vos vêtements préférés.',
    iconName: 'Scissors',
    details: [
      'Ourlets simples et invisibles (pantalons, robes, jupes)',
      'Cintrage et ajustement de vestes et chemises',
      'Remplacement de fermetures éclair et boutons',
      'Reprise de taille et ajustements morphologiques'
    ]
  },
  {
    id: 'vetements-personnalises',
    title: 'Création de Vêtements Personnalisés',
    description: 'Des vêtements uniques, coupés et assemblés à vos mensurations exactes selon vos inspirations et votre style.',
    iconName: 'Sparkles',
    details: [
      'Création à partir de croquis ou de photos de référence',
      'Prise de mesures professionnelle en atelier',
      'Conseil sur le choix des matières et des motifs',
      'Prêt-à-porter haut de gamme pour femmes et hommes'
    ]
  },
  {
    id: 'ceremonie',
    title: 'Confection de Tenues de Cérémonie',
    description: 'Sublimez vos plus grands événements avec des tenues d’exception (mariages, dotes, baptêmes, galas).',
    iconName: 'Crown',
    details: [
      'Tenues traditionnelles africaines en Wax de haute qualité',
      'Robes de mariée sur-mesure et robes de cortège',
      'Robes de cocktail et tenues de soirée élégantes',
      'Harmonie de foulards (Gele) et d’accessoires coordonnés'
    ]
  },
  {
    id: 'accessoires-textiles',
    title: "Création d'Accessoires Textiles",
    description: 'Des accessoires élégants pour protéger votre coiffure et agrémenter vos tenues au quotidien.',
    iconName: 'Gem',
    details: [
      'Bonnets de nuit réversibles en satin double face pour préserver les cheveux',
      'Chouchous (scrunchies) de différentes tailles et coloris en satin',
      'Pochettes de soirée assorties à vos tenues de cérémonie',
      'Bandeaux (headbands) et turbans stylisés'
    ]
  },
  {
    id: 'linge-maison',
    title: 'Confection de Linge de Maison',
    description: 'Apportez une touche de charme et de personnalisation à votre cuisine et à vos espaces de vie.',
    iconName: 'Home',
    details: [
      'Tabliers de cuisine ajustables brodés "Chef"',
      'Nappes de table, chemins de table et serviettes assorties',
      'Housses de coussins décoratifs avec tissus combinés',
      'Gants de cuisine et maniques de protection stylées'
    ]
  }
];

export const PRODUCTS_LIST: Product[] = [
  {
    id: 'robe-ceremonie-wax',
    name: 'Robe de Cérémonie Wax Impérial',
    category: 'Tenues de Cérémonie',
    description: 'Spectaculaire robe longue de cérémonie avec volants élégants et col structuré, façonnée dans un Wax africain premium. Livrée avec son foulard (Gele) assorti.',
    price: 'Sur devis (Dès 25 000 FCFA)',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
    badge: 'Populaire',
    details: ['Tissu Wax 100% coton ciré lourd', 'Volants asymétriques en cascade', 'Foulard (Gele) de cérémonie coordonné', 'Ajustement parfait garanti']
  },
  {
    id: 'tailleur-chic-blanc',
    name: 'Ensemble Tailleur Blanc Floral',
    category: 'Prêt-à-porter & Tailleurs',
    description: 'Tailleur deux pièces ultra-chic composé d’une veste croisée cintrée à boutons recouverts et d’une jupe assortie. Orné d’élégantes broderies florales vert émeraude.',
    price: 'Sur devis (Dès 35 000 FCFA)',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    badge: 'Tendance',
    details: ['Tissu crêpe de soie lourd haut de gamme', 'Broderies florales exécutées avec minutie', 'Veste à épaulettes structurées', 'Jupe droite doublée']
  },
  {
    id: 'bonnet-satin-premium',
    name: 'Bonnet de Nuit en Satin Double Face',
    category: 'Accessoires en Satin',
    description: 'Le secret de beauté pour vos cheveux. Ce bonnet double couche réduit le frottement nocturne, évite la déshydratation des boucles et prévient la casse.',
    price: '3 500 FCFA',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800',
    badge: 'Best-Seller',
    details: ['Satin de soie fluide double épaisseur', 'Bande élastique douce et hypoallergénique', 'Modèle réversible (deux couleurs)', 'Adapté pour tresses, boucles, dreadlocks']
  },
  {
    id: 'chouchous-satin-premium',
    name: 'Chouchous Soyeux en Satin',
    category: 'Accessoires en Satin',
    description: 'Chouchous colorés qui maintiennent vos coiffures sans casser la fibre capillaire ni laisser de pli. Disponibles en une variété de coloris étincelants.',
    price: '1 000 FCFA / unité',
    image: 'https://images.unsplash.com/photo-1621644040604-db9cfbaec7cf?auto=format&fit=crop&q=80&w=800',
    badge: 'Nouveau',
    details: ['100% satin de soie glissant', 'Élastique interne de haute résistance', 'Large choix de coloris (Pastels & Joyaux)', 'Protège les cheveux des fourches']
  },
  {
    id: 'tablier-cuisine-chef',
    name: 'Tablier Ajustable "Chef"',
    category: 'Linge de Maison & Accessoires',
    description: 'Tablier bicolore haut de gamme, mariant coton lourd et finitions soignées. Équipé d’une grande poche avant fonctionnelle pour tous vos ustensiles.',
    price: '5 000 FCFA',
    image: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80&w=800',
    badge: 'Exclusif',
    details: ['Toile de coton épais traité antitaches', 'Grande poche ventrale compartimentée', 'Sangles croisées réglables', 'Broderie "Chef" de qualité']
  },
  {
    id: 'robe-evasee-wax',
    name: 'Robe Évasée d’Été en Wax',
    category: 'Prêt-à-porter & Tailleurs',
    description: 'Une ravissante robe d’été fluide avec une coupe évasée qui sublime la silhouette. Parfaite pour exprimer votre élégance naturelle lors des journées ensoleillées.',
    price: '18 000 FCFA',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
    badge: 'Édition Limitée',
    details: ['Tissu 100% coton Wax authentique', 'Décolleté en V flatteur', 'Poches latérales discrètes', 'Zip invisible au dos']
  }
];

/**
 * Generates a direct WhatsApp redirection URL with prefilled text for a specific product
 */
export function getProductWhatsAppLink(product: Product): string {
  const message = `Bonjour Véro-Design Couture ! 🌸

Je suis très intéressé(e) par l'une de vos créations :
✨ *${product.name}* (${product.category})
💰 Prix : *${product.price}*

Pouvez-vous me dire si elle est disponible ou si je peux passer commande pour mes mesures ? Merci !`;

  return `https://wa.me/${CONTACT_INFO.phoneWhatsApp}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a WhatsApp URL for custom tailor orders
 */
export function getCustomOrderWhatsAppLink(serviceTitle: string, clientName: string, fabricOption: string, details: string): string {
  const fabricText = fabricOption === 'vero' 
    ? "Fourni par l'atelier Véro-Design" 
    : "Je fournis mon propre tissu";
    
  const message = `Bonjour Véro-Design Couture ! ✂️✨

Je souhaite faire une demande de création personnalisée :
👤 Nom complet : *${clientName}*
👗 Type de service : *${serviceTitle}*
🧵 Choix du tissu : *${fabricText}*
📝 Détails de mon projet :
"${details}"

Pouvez-vous me recontacter pour discuter du devis et convenir d'un rendez-vous pour la prise de mesures ? Merci !`;

  return `https://wa.me/${CONTACT_INFO.phoneWhatsApp}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a general contact WhatsApp link
 */
export function getGeneralWhatsAppLink(): string {
  const message = `Bonjour Véro-Design Couture ! 🌸
Je visite votre site web vitrine et j'aimerais avoir plus d'informations sur vos créations et vos services de couture.`;
  return `https://wa.me/${CONTACT_INFO.phoneWhatsApp}?text=${encodeURIComponent(message)}`;
}
