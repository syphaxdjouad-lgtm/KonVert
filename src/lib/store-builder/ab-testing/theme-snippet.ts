// Store Builder for Shopify — snippet thème (JS vanilla) à embarquer sur la
// page produit. Cf. spec KAKASHI §A.2/A.3 (docs/store-builder-sprint8-spec.md).
//
// Livrable "fourni" à embarquer dans le thème (konvert-dawn, repo séparé —
// hors scope git de ce sprint). Contrainte impérative de konvert-dawn/README.md
// "golden rule" : NE JAMAIS modifier un fichier Dawn core (`sections/main-
// product.liquid` en est un) — la seule exception tolérée est d'insérer une
// nouvelle entrée dans `templates/*.json` (`sections` + `order`). Ce script
// est donc packagé comme un **custom element** (`<konvert-ab-test>`, pattern
// déjà utilisé partout dans Dawn — ex: `<price-per-item>`) posé par une
// section Konvert dédiée (`sections/konvert-ab-test.liquid`, custom, pas
// core), et cible le DOM déjà rendu par Dawn via des SÉLECTEURS STABLES
// (`.product__title h1`, `.product__title h2`, `.product__description`)
// plutôt que des `id` qui nécessiteraient d'éditer main-product.liquid.
//
// ⚠️ CODÉ MAIS NON VALIDÉ SUR UN VRAI STORE : jamais injecté dans un thème
// Shopify réel, jamais exécuté dans un vrai navigateur pointant sur une
// vraie page produit. Testé uniquement pour validité syntaxique JS et
// présence des éléments attendus (cf. __tests__/theme-snippet.test.ts).
//
// Pourquoi une chaîne générée plutôt qu'un fichier .js statique versionné
// dans ce repo : l'URL de l'API (`appUrl`) doit pointer vers l'environnement
// réel (prod vs preview) au moment de l'embarquement dans le thème — la
// fonction est paramétrée plutôt que hardcodée.

/**
 * Génère le script A/B test à embarquer dans le thème. Auto-suffisant
 * (aucune dépendance externe), taille cible < 2 Ko minifié (cf. spec A.2.4).
 *
 * Contrat avec `sections/konvert-ab-test.liquid` : le custom element
 * `<konvert-ab-test>` doit porter `data-product-id="{{ product.id }}"`.
 * Le shop domain est lu depuis le global standard Shopify `window.Shopify.shop`
 * (injecté par Shopify lui-même via `content_for_header`, aucune donnée à
 * passer manuellement).
 */
export function buildAbTestSnippet(appUrl: string): string {
  const baseUrl = appUrl.replace(/\/$/, '')

  return `(function () {
  'use strict';

  var API_BASE = '${baseUrl}';
  var COOKIE_NAME = '_kv_ab';
  var COOKIE_MAX_AGE_DAYS = 365;

  // ─── Cookie first-party ───────────────────────────────────────────────
  function readCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function writeCookie(name, value, days) {
    var maxAge = days * 24 * 60 * 60;
    document.cookie = name + '=' + encodeURIComponent(value) + '; Max-Age=' + maxAge + '; Path=/; SameSite=Lax';
  }

  function uuidv4() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    // Fallback pour navigateurs sans crypto.randomUUID (pas de garantie
    // cryptographique ici, non-critique : simple identifiant visiteur).
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getVisitorId() {
    var existing = readCookie(COOKIE_NAME);
    if (existing) return existing;
    var id = uuidv4();
    writeCookie(COOKIE_NAME, id, COOKIE_MAX_AGE_DAYS);
    return id;
  }

  // ─── FNV-1a 32-bit — DOIT rester identique à src/lib/store-builder/ab-testing/hash.ts ───
  function fnv1aHash(input) {
    var hash = 0x811c9dc5;
    for (var i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
    }
    return hash >>> 0;
  }

  function assignVariant(visitorId, abTestId) {
    var bucket = fnv1aHash(visitorId + ':' + abTestId) % 100;
    return bucket < 50 ? 'a' : 'b';
  }

  // --- Custom element : pose par sections/konvert-ab-test.liquid (section
  // Konvert custom, PAS un fichier Dawn core) juste apres le rendu de
  // main-product.liquid, avec l'attribut data-product-id sur l'element.
  // Pattern custom element = convention Dawn native (ex: price-per-item),
  // permet de ne JAMAIS toucher aux fichiers Dawn core.
  function KonvertAbTest() {
    return Reflect.construct(HTMLElement, [], KonvertAbTest);
  }
  KonvertAbTest.prototype = Object.create(HTMLElement.prototype);
  KonvertAbTest.prototype.constructor = KonvertAbTest;

  KonvertAbTest.prototype.connectedCallback = function () {
    var shop = window.Shopify && window.Shopify.shop;
    var productId = this.getAttribute('data-product-id');
    if (!shop || !productId) return;

    var visitorId = getVisitorId();

    function trackEvent(payload, useBeacon) {
      var body = JSON.stringify(payload);
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(API_BASE + '/api/shopify/events', new Blob([body], { type: 'application/json' }));
        return;
      }
      fetch(API_BASE + '/api/shopify/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true,
      }).catch(function () {});
    }

    function injectCartAttributes(form, testId, variant) {
      var fields = [
        ['attributes[konvert_ab_test_id]', testId],
        ['attributes[konvert_ab_variant]', variant],
        ['attributes[konvert_ab_visitor_id]', visitorId],
      ];
      for (var i = 0; i < fields.length; i++) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = fields[i][0];
        input.value = fields[i][1];
        input.setAttribute('data-konvert-ab', 'true');
        form.appendChild(input);
      }
    }

    fetch(API_BASE + '/api/shopify/ab-tests/active?shop=' + encodeURIComponent(shop) + '&product_id=' + encodeURIComponent(productId))
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (config) {
        if (!config) return;

        var activeTests = [];

        if (config.h1_title_test) {
          var variant = assignVariant(visitorId, config.h1_title_test.id);
          activeTests.push({ id: config.h1_title_test.id, variant: variant });
          if (variant === 'b') {
            // Selecteurs stables Dawn (jamais d'id ajoute dans main-product.liquid,
            // cf. golden rule) : .product__title est porte a la fois par le
            // wrapper et par le lien du h2, donc .product__title h1, .product__title h2
            // trouve les deux titres reellement rendus par Dawn.
            var headings = document.querySelectorAll('.product__title h1, .product__title h2');
            for (var i = 0; i < headings.length; i++) {
              headings[i].textContent = config.h1_title_test.variant_b_text;
            }
          }
        }

        if (config.description_test) {
          var descVariant = assignVariant(visitorId, config.description_test.id);
          activeTests.push({ id: config.description_test.id, variant: descVariant });
          if (descVariant === 'b') {
            var descEls = document.querySelectorAll('.product__description');
            for (var d = 0; d < descEls.length; d++) {
              descEls[d].innerHTML = config.description_test.variant_b_text;
            }
          }
        }

        if (!activeTests.length) return;

        // page_view — dénominateur du taux de conversion (cf. spec A.3).
        for (var t = 0; t < activeTests.length; t++) {
          trackEvent({
            shop_domain: shop,
            ab_test_id: activeTests[t].id,
            variant: activeTests[t].variant,
            visitor_id: visitorId,
            event_type: 'page_view',
          }, false);
        }

        // add_to_cart — signal précoce, jamais seul déclencheur de gagnant.
        var cartForm = document.querySelector('form[action*="/cart/add"]');
        if (cartForm) {
          for (var f = 0; f < activeTests.length; f++) {
            injectCartAttributes(cartForm, activeTests[f].id, activeTests[f].variant);
          }
          cartForm.addEventListener('submit', function () {
            for (var s = 0; s < activeTests.length; s++) {
              trackEvent({
                shop_domain: shop,
                ab_test_id: activeTests[s].id,
                variant: activeTests[s].variant,
                visitor_id: visitorId,
                event_type: 'add_to_cart',
              }, true);
            }
          });
        }
      })
      .catch(function () {});
  };

  if (!window.customElements.get('konvert-ab-test')) {
    window.customElements.define('konvert-ab-test', KonvertAbTest);
  }
})();
`
}
