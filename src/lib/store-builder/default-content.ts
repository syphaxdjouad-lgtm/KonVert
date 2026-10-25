import type { StoreBuilderOutput, Vertical } from './schema'

// ─── Fallback figé — utilisé si le générateur échoue après retries ─────────
//
// `generateStoreBuilderContent` bascule ici uniquement si `generateObject`
// lève `NoObjectGeneratedError` (JSON malformé/hors-schéma persistant après
// les retries du SDK) ou si le filet de sécurité R5 (`assertNoForbiddenKeys`)
// détecte une anomalie structurelle après un retry. Le flux d'import produit
// ne doit JAMAIS planter à cause d'un aléa LLM (cf. spec §8.2).
//
// Contenu repris fidèlement des gabarits déjà écrits par ZARA dans
// `konvert-dawn/templates/product.<vertical>.json` /
// `konvert-dawn/docs/verticals-copy.md`, reformaté pour satisfaire le schéma
// Zod (`schema.ts`) — chaque objet est validé par un test unitaire dédié
// (`default-content.test.ts`) contre `buildStoreBuilderOutputSchema`.

const DROPSHIPPING_CONTENT: StoreBuilderOutput = {
  hero: {
    h1_title: '[Nom du produit] — l\'essentiel, sans détour',
    subtitle: 'Complétez cette accroche avec le bénéfice principal de votre produit.',
  },
  description_html:
    '<p>[Décrivez ici la galère quotidienne que vit votre acheteur — une phrase concrète, pas abstraite.]</p>' +
    '<p>Les solutions classiques ne suffisent pas : [expliquez pourquoi, ou ce que ça coûte de ne rien faire].</p>' +
    '<p>Ce produit change ça : [listez 3 bénéfices concrets, pas des caractéristiques techniques].</p>' +
    '<p>[Ajoutez une preuve vérifiable : matière, dimensions, compatibilité, garantie réelle.]</p>',
  faq: [
    {
      question: 'Combien de temps avant de recevoir ma commande ?',
      answer_html:
        '<p>Votre commande est traitée sous [délai de traitement réel] puis expédiée. Le délai de livraison est de [délai réel, ex. 5 à 10 jours ouvrés] selon votre pays. Vous recevez un numéro de suivi par email dès l\'expédition.</p>',
    },
    {
      question: 'Puis-je retourner le produit s\'il ne me convient pas ?',
      answer_html: '<p>[Décrivez votre politique de retour réelle : délai, conditions, qui paie le retour.]</p>',
    },
    {
      question: 'Quels moyens de paiement acceptez-vous ?',
      answer_html:
        '<p>Nous acceptons [moyens de paiement réellement activés sur votre boutique, ex. carte bancaire, PayPal, Apple Pay].</p>',
    },
    {
      question: 'Comment suivre ma commande ?',
      answer_html:
        '<p>Dès l\'expédition, vous recevez un email avec un lien de suivi en temps réel. [Précisez le ou les transporteurs utilisés si besoin.]</p>',
    },
  ],
  guarantees: [
    {
      icon: 'truck',
      title: 'Livraison suivie',
      text_html: '<p>Votre commande est expédiée sous [délai de traitement réel] avec un numéro de suivi envoyé par email.</p>',
    },
    {
      icon: 'return',
      title: 'Retours faciles',
      text_html: '<p>Un souci ? Vous avez [délai réel, ex. 14 jours] pour nous contacter et organiser un retour.</p>',
    },
    {
      icon: 'lock',
      title: 'Paiement 100% sécurisé',
      text_html: '<p>Vos données bancaires sont protégées. Paiement via [moyens réellement activés, ex. Shopify Payments, PayPal].</p>',
    },
    {
      icon: 'chat_bubble',
      title: 'Support réactif',
      text_html: '<p>Une question avant ou après votre achat ? Notre équipe répond sous [délai réel, ex. 24h] par email.</p>',
    },
  ],
  comparison_table: {
    heading: 'Pourquoi choisir [Nom de votre marque]',
    subheading: 'Comparé à une boutique classique',
    criteria_column_label: 'Critère',
    us_column_label: '[Nom de votre marque]',
    them_column_label: 'Boutique classique',
    rows: [
      { label: 'Suivi de commande', us_value: 'yes', them_value: 'custom', them_text: '[à vérifier]' },
      { label: 'Paiement sécurisé', us_value: 'yes', them_value: 'custom', them_text: '[à vérifier]' },
      {
        label: 'Délai de livraison',
        us_value: 'custom',
        us_text: '[Précisez votre délai réel, ex. 5-8 jours]',
        them_value: 'custom',
        them_text: '[Variable]',
      },
      {
        label: 'Service client',
        us_value: 'custom',
        us_text: '[Précisez votre délai de réponse réel, ex. sous 24h]',
        them_value: 'custom',
        them_text: '[Variable]',
      },
    ],
  },
  urgency_bar: {
    message_default: 'Commande avant 17h : expédition aujourd\'hui',
    message_with_stock: 'Il reste [count] en stock — commande vite',
  },
  founder_story: {
    heading: 'Pourquoi on a créé [Nom de votre marque]',
    story_html:
      '<p>Tout a commencé quand [décrivez le déclic réel : une frustration, une découverte, un besoin non résolu].</p>' +
      '<p>On a testé, raté, recommencé — jusqu\'à trouver [nom du produit ou de la gamme]. [Ajoutez ici ce qui rend votre démarche différente : sourcing, qualité, service client...]</p>' +
      '<p>Aujourd\'hui, [décrivez où vous en êtes et votre mission actuelle].</p>',
    founder_role: 'Fondateur',
  },
  exit_intent: {
    heading: 'Avant de partir...',
    text_html: '<p>[Nom du produit] pourrait ne plus être en stock la prochaine fois. [Ajoutez votre offre réelle ici si vous en avez une.]</p>',
    cta_label: 'Je finalise ma commande',
  },
}

const BEAUTE_CONTENT: StoreBuilderOutput = {
  hero: {
    h1_title: '[Nom du produit] — l\'essentiel de votre routine',
    subtitle: 'Complétez cette accroche avec le bénéfice sensoriel de votre soin.',
  },
  description_html:
    '<p>[Décrivez la sensation ou le problème de peau que votre cliente reconnaît immédiatement.]</p>' +
    '<p>Formulé avec [ingrédient(s) réel(s) et leur rôle expliqué simplement, sans jargon labo].</p>' +
    '<p>[Ce que la peau peut ressentir avec un usage régulier — formulation prudente, sans promesse de résultat garanti.]</p>' +
    '<p>[Rappel discret du geste simple : appliquer matin/soir, routine complète disponible.]</p>',
  faq: [
    {
      question: 'Ce produit convient-il à mon type de peau ?',
      answer_html:
        '<p>[Précisez les types de peau testés/recommandés pour votre formule réelle.] En cas de doute, faites un test sur une petite zone du bras 48h avant la première application complète.</p>',
    },
    {
      question: 'Quels sont les ingrédients ?',
      answer_html:
        '<p>La liste complète des ingrédients (INCI) est disponible sur l\'emballage et sur la fiche produit. [Personnalisez avec vos ingrédients actifs réels et leur rôle.]</p>',
    },
    {
      question: 'Sous combien de temps puis-je voir un effet ?',
      answer_html:
        '<p>[Indiquez un délai réaliste basé sur vos propres retours ou ceux de votre fournisseur — évitez toute promesse de résultat garanti, chaque peau réagit différemment.]</p>',
    },
    {
      question: 'Le produit est-il testé dermatologiquement ?',
      answer_html:
        '<p>[Répondez uniquement si vous avez un certificat réel. Si ce n\'est pas le cas, indiquez-le honnêtement plutôt que de laisser un doute.]</p>',
    },
  ],
  guarantees: [
    {
      icon: 'truck',
      title: 'Livraison soignée',
      text_html: '<p>Votre commande part sous [délai de traitement réel], emballée avec soin. Vous suivez chaque étape par email.</p>',
    },
    {
      icon: 'return',
      title: 'Satisfait ou remboursé',
      text_html:
        '<p>Le produit ne vous convient pas ? Vous avez [délai réel, ex. 30 jours] pour le retourner. [Précisez si un produit entamé est accepté.]</p>',
    },
    {
      icon: 'lock',
      title: 'Paiement sécurisé',
      text_html: '<p>Vos informations bancaires sont chiffrées et protégées à chaque commande.</p>',
    },
    {
      icon: 'chat_bubble',
      title: 'Une question sur votre peau ?',
      text_html: '<p>Notre équipe vous répond sous [délai réel] pour vous aider à choisir la routine adaptée.</p>',
    },
  ],
  comparison_table: {
    heading: 'Pourquoi choisir [Nom de votre marque]',
    subheading: 'Comparé à une alternative générique',
    criteria_column_label: 'Critère',
    us_column_label: '[Nom de votre marque]',
    them_column_label: 'Alternative générique',
    rows: [
      { label: 'Liste INCI complète et transparente', us_value: 'yes', them_value: 'custom', them_text: '[à vérifier]' },
      {
        label: 'Testé dermatologiquement',
        us_value: 'custom',
        us_text: '[Cochez "Oui" uniquement si vous avez un certificat/test réel]',
        them_value: 'custom',
        them_text: '[Variable]',
      },
      {
        label: 'Sans ingrédient controversé',
        us_value: 'custom',
        us_text: '[Précisez si applicable à votre formule réelle, ex. sans parabènes]',
        them_value: 'custom',
        them_text: '[Variable]',
      },
      {
        label: 'Politique de retour',
        us_value: 'custom',
        us_text: '[Précisez votre délai réel, ex. 30 jours]',
        them_value: 'custom',
        them_text: '[Variable]',
      },
    ],
  },
  urgency_bar: {
    message_default: 'Commande avant 17h, expédiée aujourd\'hui avec soin',
    message_with_stock: 'Il reste [count] en stock ce mois-ci',
  },
  founder_story: {
    heading: 'Notre histoire',
    story_html:
      '<p>Tout a commencé quand [décrivez le déclic réel : une peau difficile à satisfaire, une routine qui ne fonctionnait jamais, une rencontre avec un ingrédient].</p>' +
      '<p>On a voulu une formule [décrivez votre exigence réelle : sans ingrédient controversé, testée, transparente sur les ingrédients].</p>' +
      '<p>Aujourd\'hui, [décrivez votre mission actuelle et votre engagement réel envers vos clientes].</p>',
    founder_role: 'Fondatrice',
  },
  exit_intent: {
    heading: 'Avant de partir...',
    text_html: '<p>Votre peau mérite ce moment. [Ajoutez une offre réelle ici si vous souhaitez en proposer une.]</p>',
    cta_label: 'Je termine ma commande',
  },
}

const TECH_CONTENT: StoreBuilderOutput = {
  hero: {
    h1_title: '[Nom du produit] — l\'essentiel côté specs',
    subtitle: 'Complétez cette accroche avec la preuve technique la plus convaincante.',
  },
  description_html:
    '<p>[Décrivez la frustration technique précise que votre acheteur reconnaît : batterie qui lâche, câble qui casse, appareil non compatible.]</p>' +
    '<p>Ce produit résout ça grâce à [1-2 caractéristiques techniques réelles et vérifiables : autonomie, puissance, matériaux, norme de connectivité].</p>' +
    '<p>[Ce que l\'acheteur gagne au quotidien avec ces caractéristiques — usage concret, pas une promesse abstraite.]</p>' +
    '<p>[Certification, norme, compatibilité listée, garantie réelle — un fait vérifiable.]</p>',
  faq: [
    {
      question: 'Est-ce compatible avec mon téléphone / appareil ?',
      answer_html:
        '<p>[Listez les appareils, marques ou systèmes réellement compatibles, ex. iOS 15+ et Android 10+.] En cas de doute, contactez-nous avant commande.</p>',
    },
    {
      question: 'Combien de temps dure la batterie / l\'autonomie ?',
      answer_html:
        '<p>[Précisez votre chiffre réel testé, ex. "20h d\'autonomie en utilisation continue".] Le temps de charge complet est de [durée réelle, ex. 1h30].</p>',
    },
    {
      question: 'Que contient exactement la boîte ?',
      answer_html: '<p>[Listez le contenu réel du packaging : produit, câble, notice, accessoires inclus.]</p>',
    },
    {
      question: 'Le produit est-il garanti ?',
      answer_html:
        '<p>[Précisez votre durée de garantie réelle, ex. 2 ans] contre les défauts de fabrication. [Ajoutez la procédure réelle en cas de panne : contact SAV, échange, remboursement.]</p>',
    },
  ],
  guarantees: [
    {
      icon: 'check_mark',
      title: 'Garantie [durée réelle, ex. 2 ans]',
      text_html:
        '<p>Un défaut de fabrication ? Vous êtes couvert pendant [durée réelle]. [Précisez la procédure réelle : échange, réparation, remboursement.]</p>',
    },
    {
      icon: 'truck',
      title: 'Livraison suivie',
      text_html: '<p>Votre commande est expédiée sous [délai de traitement réel] avec un numéro de suivi envoyé par email.</p>',
    },
    {
      icon: 'chat_bubble',
      title: 'SAV réactif',
      text_html: '<p>Un souci technique ? Notre équipe répond sous [délai réel, ex. 24h] et vous accompagne jusqu\'à la résolution.</p>',
    },
    {
      icon: 'lock',
      title: 'Paiement 100% sécurisé',
      text_html: '<p>Vos données bancaires sont protégées. Paiement via [moyens réellement activés, ex. Shopify Payments, PayPal].</p>',
    },
  ],
  comparison_table: {
    heading: 'Pourquoi choisir [Nom de votre marque]',
    subheading: 'Comparé à un accessoire premier prix',
    criteria_column_label: 'Critère',
    us_column_label: '[Nom de votre marque]',
    them_column_label: 'Marque générique',
    rows: [
      {
        label: 'Compatibilité',
        us_value: 'custom',
        us_text: '[Listez les appareils/OS réellement compatibles, ex. iOS et Android]',
        them_value: 'custom',
        them_text: '[Variable]',
      },
      {
        label: 'Autonomie / performance',
        us_value: 'custom',
        us_text: '[Précisez votre chiffre réel, ex. 20h d\'écoute continue]',
        them_value: 'custom',
        them_text: '[Variable]',
      },
      {
        label: 'Garantie',
        us_value: 'custom',
        us_text: '[Précisez votre durée réelle, ex. 2 ans]',
        them_value: 'custom',
        them_text: '[Souvent 6 mois ou moins]',
      },
      {
        label: 'Prix',
        us_value: 'custom',
        us_text: '[Précisez votre positionnement réel, ex. "prix juste, sans intermédiaire"]',
        them_value: 'custom',
        them_text: '[Variable]',
      },
    ],
  },
  urgency_bar: {
    message_default: 'Commande avant 17h : expédition le jour même',
    message_with_stock: 'Il reste [count] en stock — commande avant rupture',
  },
  founder_story: {
    heading: 'Pourquoi on a créé [Nom de votre marque]',
    story_html:
      '<p>Tout a commencé quand [décrivez le déclic réel : un accessoire qui a lâché trop vite, une compatibilité jamais annoncée clairement, un SAV injoignable ailleurs].</p>' +
      '<p>On a voulu des produits [décrivez votre exigence réelle : testés, garantis, avec un vrai support après achat] — sans le prix gonflé des grandes marques ni la fragilité du premier prix.</p>' +
      '<p>Aujourd\'hui, [décrivez où vous en êtes et votre mission actuelle].</p>',
    founder_role: 'Fondateur',
  },
  exit_intent: {
    heading: 'Avant de partir...',
    text_html: '<p>[Nom du produit] pourrait ne plus être en stock la prochaine fois. [Ajoutez votre offre réelle ici si vous en avez une.]</p>',
    cta_label: 'Je finalise ma commande',
  },
}

export const DEFAULT_TEMPLATE_CONTENT: Record<Vertical, StoreBuilderOutput> = {
  dropshipping: DROPSHIPPING_CONTENT,
  beaute: BEAUTE_CONTENT,
  tech: TECH_CONTENT,
}
