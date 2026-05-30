"""
generate-ph-assets.py
=====================
Génère les 7 visuels (x 2 variantes = 14 PNG) pour le launch Product Hunt
de KONVERT le 2 juin 2026.

USAGE:
    # Option 1 — sourcer l'env depuis kirin
    export FAL_KEY="sk-..."   # voir /Users/mac/nexara/projets/kirin/app/.env.local
    python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py

    # Option 2 — sourcer directement depuis le .env.local kirin
    source /Users/mac/nexara/projets/kirin/app/.env.local && \\
    python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py

    # Régénérer un slot unique (si un slot a raté)
    python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py --slot cover-ph
    python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py --slot hero-before-after
    python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py --slot wizard-flow
    python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py --slot page-annotee
    python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py --slot templates-grid
    python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py --slot dashboard
    python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py --slot tunnel-essai

REQUIREMENTS:
    Python 3.9+, module `requests` (pip install requests — OU disponible en macOS system Python)

OUTPUT:
    /Users/mac/nexara/konvert/launch/assets/ph-{slot_name}-v{1|2}.png  (14 fichiers)

COST ESTIMATE:
    - 4 calls ideogram/v3  @ ~$0.05/img = $0.20
    - 10 calls flux/schnell @ ~$0.003/img = $0.03
    - Total indicatif : ~$0.23 USD (sans retry)
    - Avec 3x retry max par slot (rare) : max ~$0.70 USD

MODELES:
    - fal-ai/ideogram/v3  : slots texte-in-image (cover-ph, page-annotee)
    - fal-ai/flux/schnell : tous les autres slots (rapide, economique)

TEMPS EXECUTION:
    ~2-4 minutes en sequentiel (ideogram ~20s/img, schnell ~5s/img)
"""

import os
import sys
import time
import json
import argparse
import requests
from pathlib import Path
from datetime import datetime

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------

OUTPUT_DIR = Path("/Users/mac/nexara/konvert/launch/assets")
MAX_RETRIES = 3
POLL_INTERVAL_S = 3
POLL_TIMEOUT_S = 180  # 3 minutes max par generation

FAL_BASE_URL = "https://queue.fal.run"

# Couleurs brand KONVERT (pour les prompts)
CORAL = "#ff6154"
CORAL_LIGHT = "#ff8160"
BG_COLOR = "#fafafa"

# Cost estimates par modele (USD/image)
COST_PER_IMAGE = {
    "fal-ai/ideogram/v3": 0.05,
    "fal-ai/flux/schnell": 0.003,
}

# ---------------------------------------------------------------------------
# SLOTS DEFINITION — 7 slots x 2 variantes = 14 PNG
# ---------------------------------------------------------------------------

SLOTS: list[dict] = [
    # -----------------------------------------------------------------------
    # SLOT 1 — Cover PH (P0) — modele ideogram/v3 pour texte integre
    # Format 1280x720 — cover obligatoire PH
    # -----------------------------------------------------------------------
    {
        "name": "cover-ph",
        "model": "fal-ai/ideogram/v3",
        "priority": "P0",
        "image_size": {"width": 1280, "height": 720},
        "prompts": [
            (
                "Clean minimal product landing page interface screenshot on off-white #fafafa background, "
                "centered composition, large coral red gradient logo text 'KONVERT' at top center, "
                "below it the tagline text 'Turn any product link into a page that sells', "
                "below it smaller text 'June 2 on ProductHunt', "
                "accent color coral #ff6154 to light orange #ff8160 gradient on key text, "
                "modern SaaS design aesthetic, generous white space, no clutter, "
                "professional product announcement visual, sans-serif typography, 8K render quality"
            ),
            (
                "Elegant SaaS launch cover image, pure off-white background #fafafa, "
                "bold centered headline text 'KONVERT' in coral gradient #ff6154 to #ff8160, "
                "subtitle text beneath: 'AI pages that convert — from any product link in 30s', "
                "small badge bottom right corner: 'Launching June 2 on ProductHunt' in coral, "
                "minimal flat UI illustration of a product page on right side, "
                "clean Swiss design grid, professional typographic hierarchy, "
                "no dark backgrounds, light and airy composition, high resolution"
            ),
        ],
    },

    # -----------------------------------------------------------------------
    # SLOT 2 — Hero Before/After (P0) — flux/schnell
    # Split screen: gauche page moche, droite page KONVERT generee
    # -----------------------------------------------------------------------
    {
        "name": "hero-before-after",
        "model": "fal-ai/flux/schnell",
        "priority": "P0",
        "image_size": {"width": 1280, "height": 720},
        "prompts": [
            (
                "Side-by-side split screen comparison UI screenshot on white background, "
                "left half labeled 'Before' shows a cluttered ugly Shopify product page "
                "with bad typography, misaligned elements, generic stock photo, no CTA hierarchy, "
                "muted grey tones, labeled with small red 'Before' badge top left, "
                "right half labeled 'After' shows a beautiful modern conversion-optimized product page "
                "with clean layout, coral accent color #ff6154, clear headline, benefit bullets, CTA button, "
                "labeled with green 'After — 30 seconds' badge top right, "
                "thin vertical divider line between halves, "
                "bottom overlay bar in off-white: text 'Conversion-optimized. In 30 seconds.' in dark grey, "
                "professional product demo screenshot style, high resolution, clean UI mockup"
            ),
            (
                "Clean split-screen product page comparison mockup, white background, "
                "left panel: messy e-commerce product page — wall of text, no visual hierarchy, "
                "outdated design, low contrast colors, labeled 'Generic page' in grey text, "
                "right panel: sleek modern Shopify landing page generated by AI — "
                "bold hook headline, social proof badges, emoji bullet points, sticky CTA button in coral #ff6154, "
                "FAQ accordion section, mobile-first responsive layout, "
                "labeled 'KONVERT page — 30 seconds' in coral text, "
                "arrow icon pointing right between panels, "
                "off-white footer strip with text '30 seconds. From any product link.', "
                "product UI demo screenshot, sharp edges, no blur, 4K quality"
            ),
        ],
    },

    # -----------------------------------------------------------------------
    # SLOT 3 — Wizard 3 etapes (P0) — flux/schnell
    # Paste link -> Choose template -> Page generated
    # -----------------------------------------------------------------------
    {
        "name": "wizard-flow",
        "model": "fal-ai/flux/schnell",
        "priority": "P0",
        "image_size": {"width": 1280, "height": 720},
        "prompts": [
            (
                "Three-step SaaS onboarding flow UI screenshot on white background, "
                "horizontal step-by-step layout with clear progression arrows between steps, "
                "Step 1 left panel: input field with placeholder text 'Paste product link (AliExpress, Amazon...)', "
                "coral paste icon, clean input box with shadow, "
                "Step 2 center panel: template picker grid showing 4 miniature page templates in coral/beige tones, "
                "label 'Choose your template' above, "
                "Step 3 right panel: fully generated product page preview with scroll indicator, "
                "green checkmark 'Done' badge, label 'Page ready in 30s', "
                "coral arrows connecting the three steps, step numbers 1 2 3 in coral circles above each panel, "
                "bottom text: 'From URL to page in 3 clicks.', off-white background #fafafa, "
                "clean modern SaaS UI design, professional screenshot mockup"
            ),
            (
                "Horizontal three-panel wizard UI mockup, pure white background, no dark elements, "
                "left panel (step 1): browser-style URL bar input showing 'aliexpress.com/item/...' being typed, "
                "coral underline accent, label '1. Paste your product link', "
                "center panel (step 2): grid of 6 page template thumbnails, one highlighted in coral border, "
                "label '2. Pick a template (40+ available)', "
                "right panel (step 3): compressed full-page preview of generated landing page, "
                "export/push buttons visible (Shopify green, WooCommerce blue), "
                "label '3. Page generated. Push live.', "
                "connecting arrows in coral #ff6154 between panels, "
                "progress dots at bottom in coral, minimal flat UI illustration style, "
                "SaaS product demo quality, 4K sharp render"
            ),
        ],
    },

    # -----------------------------------------------------------------------
    # SLOT 4 — Page generee avec annotations (P0) — ideogram/v3 (texte)
    # Long screenshot avec labels sur sections : Hook, Social Proof, FAQ, CTA
    # -----------------------------------------------------------------------
    {
        "name": "page-annotee",
        "model": "fal-ai/ideogram/v3",
        "priority": "P0",
        "image_size": {"width": 1280, "height": 720},
        "prompts": [
            (
                "Annotated product landing page screenshot UI mockup, white background, "
                "full e-commerce landing page visible showing: hero section at top with product image and headline, "
                "benefit bullets section, social proof with star ratings, FAQ accordion, CTA button in coral #ff6154, "
                "four annotation callout labels with arrows pointing to page sections: "
                "label 'Hook headline' pointing to hero, "
                "label 'Social Proof' pointing to reviews section, "
                "label 'FAQ — handles objections' pointing to FAQ, "
                "label 'CTA — above the fold' pointing to buy button, "
                "callout boxes in coral border with white fill and dark text labels, "
                "annotation arrows in coral #ff6154, "
                "top bar label: 'KONVERT — AI-generated, conversion-optimized', "
                "clean professional annotated UI diagram, high resolution, no dark background"
            ),
            (
                "Product page conversion anatomy diagram mockup on off-white #fafafa background, "
                "left side shows full rendered product landing page: modern clean Shopify-style layout, "
                "coral accents, product image placeholder, headline, price, CTA button, "
                "right side has four floating annotation cards connected by lines to page sections: "
                "card 1: 'Hook — addresses pain point in first 5 words', "
                "card 2: 'Trust signals — 4.8 stars, 247 reviews', "
                "card 3: 'Objection handling — 5-question FAQ', "
                "card 4: 'Primary CTA — coral, above fold, sticky on mobile', "
                "annotation lines in coral, cards in white with coral left border, "
                "header text top: 'Every section. Optimized by AI.', "
                "footer text: 'Generated in 30 seconds from any product URL', "
                "professional infographic quality, clean typography, 4K resolution"
            ),
        ],
    },

    # -----------------------------------------------------------------------
    # SLOT 5 — Templates grid (P1) — flux/schnell
    # Mosaique 6-8 templates, overlay "40+ templates"
    # -----------------------------------------------------------------------
    {
        "name": "templates-grid",
        "model": "fal-ai/flux/schnell",
        "priority": "P1",
        "image_size": {"width": 1280, "height": 720},
        "prompts": [
            (
                "Product page template gallery grid UI mockup, white background, "
                "6 product landing page template previews in a 3x2 grid layout, "
                "each template thumbnail shows a different industry style: "
                "luxury perfume page, fitness supplement page, tech gadget page, "
                "fashion clothing page, beauty skincare page, home decor page, "
                "each thumbnail in a rounded card with subtle shadow, "
                "top right overlay badge in coral #ff6154: '40+ Templates', "
                "grid label at top: 'Templates for every niche', "
                "coral accent border on one highlighted template card, "
                "clean flat minimal design, professional SaaS UI, off-white background #fafafa, "
                "modern e-commerce aesthetic, high resolution screenshot mockup"
            ),
            (
                "Eight product landing page template thumbnails arranged in a clean grid, off-white background, "
                "thumbnails show diverse e-commerce niches: sports nutrition, luxury watch, skincare serum, "
                "baby products, gaming accessories, organic food, fashion sneakers, pet products, "
                "each card has rounded corners subtle shadow, different color schemes per niche, "
                "coral #ff6154 highlight glow on 2 featured templates, "
                "large text overlay top-right corner: '40+ ready-to-use templates', "
                "small text bottom: 'Luxury. Gadget. Beauty. Fitness. Fashion. DTC. And more.', "
                "filter tab bar at top in light grey: 'All | Trending | DTC | Fashion | Tech', "
                "clean grid layout professional SaaS product screenshot, 4K quality"
            ),
        ],
    },

    # -----------------------------------------------------------------------
    # SLOT 6 — Dashboard (P1) — flux/schnell
    # Dashboard propre avec pages generees listees
    # -----------------------------------------------------------------------
    {
        "name": "dashboard",
        "model": "fal-ai/flux/schnell",
        "priority": "P1",
        "image_size": {"width": 1280, "height": 720},
        "prompts": [
            (
                "Clean SaaS dashboard UI screenshot, white background, "
                "left sidebar navigation with icons: Dashboard, Pages, Templates, Integrations, Settings, "
                "sidebar background light grey, active item highlighted in coral #ff6154, "
                "main content area shows 'My Pages' list with 5 generated product pages listed: "
                "each row shows: product thumbnail, page title, date created, status badge (Live/Draft), "
                "edit/preview/push buttons in coral outline style, "
                "top header: search bar, 'Create New Page' coral CTA button top right, "
                "metrics bar at top showing: '12 pages created', '3 pushed to Shopify', 'avg CVR +18%', "
                "clean professional dashboard design, minimal flat SaaS UI, "
                "no dark mode, off-white background, high resolution"
            ),
            (
                "KONVERT SaaS analytics dashboard mockup, pure white background, "
                "top navigation bar with logo placeholder left, user menu right, coral accent on active tab, "
                "main area divided: left panel 30% width showing page list with 4 items — "
                "each item shows small page preview, product name, creation date, 'Shopify Live' or 'WooCommerce Draft' badge, "
                "right panel 70% width showing selected page preview in iframe, "
                "above iframe: action buttons 'Edit', 'Push to Shopify' (coral), 'Copy link', 'Delete', "
                "stats strip at very top: '8 pages', '2 languages', '1 store connected', "
                "minimal clean professional SaaS UI design, light color palette, coral CTA accents, "
                "no black backgrounds, screenshot mockup quality"
            ),
        ],
    },

    # -----------------------------------------------------------------------
    # SLOT 7 — Tunnel /essai (P1) — flux/schnell
    # Screenshot du tunnel gratuit — input URL + resultat 30s
    # -----------------------------------------------------------------------
    {
        "name": "tunnel-essai",
        "model": "fal-ai/flux/schnell",
        "priority": "P1",
        "image_size": {"width": 1280, "height": 720},
        "prompts": [
            (
                "Free trial landing page UI screenshot on white background, "
                "clean centered layout, "
                "large bold headline at top: '1 free product page. No account needed.', "
                "below it: large URL input field with placeholder 'Paste your AliExpress or Amazon link here', "
                "coral CTA button right of input: 'Generate my page →', "
                "below input: trust signals strip '30-second generation • No credit card • Works with Shopify & WooCommerce', "
                "small icons: lightning bolt (speed), lock (no CC), checkmark (compatibility), "
                "below trust strip: a loading/progress state showing 'Analyzing product...' spinner in coral, "
                "then result preview: compact product page thumbnail sliding in from bottom, "
                "'Your page is ready' green checkmark header, "
                "minimal off-white background #fafafa, coral accent #ff6154, SaaS landing page quality"
            ),
            (
                "Two-state UI mockup side by side on white background showing free trial flow: "
                "left panel (state 1 — input): clean centered page with headline 'Try KONVERT free — 30 seconds', "
                "large URL paste input with AliExpress URL typed in, coral 'Generate' button, "
                "below: '10,000+ pages generated. 0 credit cards required.' social proof, "
                "right panel (state 2 — result): same page but now showing generated product page preview, "
                "coral success banner at top: 'Your page is ready! Push to Shopify or download HTML', "
                "two CTA buttons: 'Push to Shopify' (coral filled) and 'Create free account' (coral outline), "
                "thin arrow connecting left to right panel with '30 seconds' label, "
                "off-white #fafafa background, professional SaaS conversion demo screenshot, high res"
            ),
        ],
    },
]


# ---------------------------------------------------------------------------
# API FUNCTIONS
# ---------------------------------------------------------------------------

def get_fal_key() -> str:
    """Lit la FAL_KEY depuis l'environnement. Leve SystemExit si absente."""
    key = os.environ.get("FAL_KEY", "").strip()
    if not key:
        print("\n[ERREUR] FAL_KEY non trouvee dans l'environnement.")
        print("Solutions :")
        print("  export FAL_KEY='sk-...'")
        print("  OU: source /Users/mac/nexara/projets/kirin/app/.env.local")
        print("  OU: source /Users/mac/nexara/moteur/agents-ia/.env.shared")
        sys.exit(1)
    return key


def build_payload(slot: dict, prompt: str) -> dict:
    """Construit le payload JSON pour l'API fal.ai selon le modele."""
    model = slot["model"]
    size = slot["image_size"]

    if "ideogram" in model:
        return {
            "prompt": prompt,
            "image_size": size,
            "style_type": "DESIGN",
            "magic_prompt_option": "OFF",
            "color_palette": {
                "members": [
                    {"color": "#ff6154", "weight": 0.4},
                    {"color": "#ff8160", "weight": 0.2},
                    {"color": "#fafafa", "weight": 0.4},
                ]
            },
        }
    else:
        # flux/schnell et autres
        return {
            "prompt": prompt,
            "image_size": size,
            "num_inference_steps": 4,
            "num_images": 1,
        }


def submit_generation(model: str, payload: dict, fal_key: str) -> str:
    """
    Soumet une generation en queue mode.
    Retourne le request_id.
    Raise RuntimeError si la soumission echoue.
    """
    url = f"{FAL_BASE_URL}/{model}"
    headers = {
        "Authorization": f"Key {fal_key}",
        "Content-Type": "application/json",
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=30)

    if resp.status_code not in (200, 201, 202):
        raise RuntimeError(
            f"Submit failed HTTP {resp.status_code}: {resp.text[:300]}"
        )

    data = resp.json()
    request_id = data.get("request_id") or data.get("id")
    if not request_id:
        raise RuntimeError(f"Pas de request_id dans la reponse: {data}")

    return request_id


def poll_status(
    model: str,
    request_id: str,
    fal_key: str,
    timeout: int = POLL_TIMEOUT_S,
) -> dict:
    """
    Poll le statut de la generation jusqu'a completion ou timeout.
    Retourne le resultat JSON complet.
    Raise RuntimeError si timeout ou erreur.
    """
    status_url = f"{FAL_BASE_URL}/{model}/requests/{request_id}/status"
    result_url = f"{FAL_BASE_URL}/{model}/requests/{request_id}"
    headers = {"Authorization": f"Key {fal_key}"}

    elapsed = 0
    while elapsed < timeout:
        resp = requests.get(status_url, headers=headers, timeout=15)

        if resp.status_code == 200:
            data = resp.json()
            status = data.get("status", "")

            if status == "COMPLETED":
                # Fetch le vrai resultat
                result_resp = requests.get(result_url, headers=headers, timeout=15)
                if result_resp.status_code == 200:
                    return result_resp.json()
                raise RuntimeError(
                    f"Result fetch failed HTTP {result_resp.status_code}"
                )

            elif status in ("FAILED", "CANCELLED"):
                error = data.get("error", "Unknown error")
                raise RuntimeError(f"Generation {status}: {error}")

            # IN_QUEUE ou IN_PROGRESS — continuer
        elif resp.status_code == 404:
            # Peut arriver juste apres soumission — attendre
            pass
        else:
            print(f"    [WARN] Poll HTTP {resp.status_code} — on continue")

        time.sleep(POLL_INTERVAL_S)
        elapsed += POLL_INTERVAL_S
        print(f"    ... en attente ({elapsed}s / {timeout}s max)", end="\r")

    raise RuntimeError(f"Timeout apres {timeout}s pour request {request_id}")


def extract_image_url(result: dict) -> str:
    """
    Extrait l'URL de l'image depuis la reponse fal.ai.
    Supporte plusieurs formats de reponse (ideogram, flux, etc.).
    """
    # Format ideogram/v3 et flux standard
    images = result.get("images") or result.get("image") or []
    if isinstance(images, list) and len(images) > 0:
        img = images[0]
        if isinstance(img, dict):
            return img.get("url") or img.get("image_url", "")
        if isinstance(img, str):
            return img

    # Fallback: chercher url directement
    if "url" in result:
        return result["url"]

    raise RuntimeError(f"Impossible d'extraire l'URL image de: {list(result.keys())}")


def download_image(image_url: str, output_path: Path) -> None:
    """
    Telecharge l'image depuis image_url et la sauvegarde en output_path.
    Raise RuntimeError si le download echoue.
    """
    resp = requests.get(image_url, timeout=60, stream=True)
    if resp.status_code != 200:
        raise RuntimeError(
            f"Download failed HTTP {resp.status_code} pour {image_url}"
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as f:
        for chunk in resp.iter_content(chunk_size=8192):
            f.write(chunk)


def run_single_generation(
    slot: dict,
    prompt: str,
    output_path: Path,
    fal_key: str,
    attempt: int = 1,
) -> bool:
    """
    Execute le pipeline complet pour 1 image : submit -> poll -> download.
    Retourne True si succes, False si echec apres max retries.
    """
    model = slot["model"]
    payload = build_payload(slot, prompt)

    for retry in range(1, MAX_RETRIES + 1):
        try:
            print(f"    Submit vers {model} (tentative {retry}/{MAX_RETRIES})...")
            request_id = submit_generation(model, payload, fal_key)
            print(f"    Request ID: {request_id}")

            result = poll_status(model, request_id, fal_key)
            print()  # newline apres le \r du polling

            image_url = extract_image_url(result)
            print(f"    Telechargement image...")
            download_image(image_url, output_path)

            size_kb = output_path.stat().st_size // 1024
            print(f"    Sauvegarde: {output_path.name} ({size_kb} KB)")
            return True

        except Exception as e:
            print(f"\n    [ERREUR tentative {retry}/{MAX_RETRIES}] {e}")
            if retry < MAX_RETRIES:
                wait = retry * 5
                print(f"    Nouvel essai dans {wait}s...")
                time.sleep(wait)
            else:
                print(f"    [ECHEC] Apres {MAX_RETRIES} tentatives — slot a skipper manuellement")
                return False

    return False


def run_slot(
    slot_index: int,
    total_slots: int,
    slot: dict,
    fal_key: str,
) -> tuple[int, float]:
    """
    Orchestre les 2 variantes d'un slot.
    Retourne (nb_succes, cout_genere).
    """
    name = slot["name"]
    model = slot["model"]
    cost_per_img = COST_PER_IMAGE.get(model, 0.01)
    successes = 0
    cost = 0.0

    print(f"\n{'='*60}")
    print(f"SLOT {slot_index}/{total_slots} — {name.upper()}  [{slot['priority']}]")
    print(f"Modele: {model}  |  Cout/img: ${cost_per_img:.3f}")
    print(f"{'='*60}")

    for variant_idx, prompt in enumerate(slot["prompts"], start=1):
        output_path = OUTPUT_DIR / f"ph-{name}-v{variant_idx}.png"
        print(f"\n  Variante {variant_idx}/2 → {output_path.name}")

        # Skip si fichier existe deja
        if output_path.exists():
            size_kb = output_path.stat().st_size // 1024
            print(f"  [SKIP] Fichier existe deja ({size_kb} KB) — skip")
            successes += 1
            continue

        ts_start = time.time()
        ok = run_single_generation(slot, prompt, output_path, fal_key)
        elapsed = time.time() - ts_start

        if ok:
            successes += 1
            cost += cost_per_img
            print(f"  Duree: {elapsed:.1f}s | Cout: ${cost_per_img:.3f}")
        else:
            print(f"  [ECHEC] {output_path.name} non genere — relancer avec --slot {name}")

    return successes, cost


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Genere les 14 assets visuels PH pour KONVERT launch 2 juin 2026"
    )
    parser.add_argument(
        "--slot",
        type=str,
        default=None,
        help="Regenerer un slot specifique (ex: cover-ph, hero-before-after, ...)",
    )
    args = parser.parse_args()

    # Lecture FAL_KEY securisee
    fal_key = get_fal_key()

    # Filtrage optionnel par slot
    slots_to_run = SLOTS
    if args.slot:
        slots_to_run = [s for s in SLOTS if s["name"] == args.slot]
        if not slots_to_run:
            valid = ", ".join(s["name"] for s in SLOTS)
            print(f"[ERREUR] Slot '{args.slot}' introuvable. Slots valides: {valid}")
            sys.exit(1)
        print(f"[INFO] Mode regen selectif — slot: {args.slot}")

    # Estimation cout totale avant lancement
    total_images = sum(len(s["prompts"]) for s in slots_to_run)
    estimated_cost = sum(
        len(s["prompts"]) * COST_PER_IMAGE.get(s["model"], 0.01)
        for s in slots_to_run
    )

    print("\n" + "="*60)
    print("KONVERT — GENERATION ASSETS PRODUCT HUNT")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Output: {OUTPUT_DIR}")
    print(f"Slots a generer: {len(slots_to_run)}")
    print(f"Images a generer: {total_images}")
    print(f"Cout estime: ${estimated_cost:.2f} USD")
    print("="*60)
    print("\nDemarrage dans 3s... (Ctrl+C pour annuler)")
    time.sleep(3)

    # Execution
    total_success = 0
    total_cost_real = 0.0

    for idx, slot in enumerate(slots_to_run, start=1):
        successes, cost = run_slot(idx, len(slots_to_run), slot, fal_key)
        total_success += successes
        total_cost_real += cost

    # Bilan final
    total_attempted = sum(len(s["prompts"]) for s in slots_to_run)
    total_failed = total_attempted - total_success

    print("\n" + "="*60)
    print("BILAN GENERATION")
    print("="*60)
    print(f"Images generees   : {total_success}/{total_attempted}")
    print(f"Echecs            : {total_failed}")
    print(f"Cout reel         : ${total_cost_real:.3f} USD")
    print(f"Output directory  : {OUTPUT_DIR}")

    if total_failed > 0:
        print("\n[ACTION REQUISE] Slots a regenerer manuellement:")
        for slot in slots_to_run:
            for vi, _ in enumerate(slot["prompts"], 1):
                fp = OUTPUT_DIR / f"ph-{slot['name']}-v{vi}.png"
                if not fp.exists():
                    print(f"  python3 {__file__} --slot {slot['name']}")
                    break

    print("\nDone.")


if __name__ == "__main__":
    main()
