import posthog from 'posthog-js'

export const track = {
  // ── Tunnel essai gratuit ──────────────────────────────
  essaiStarted: (productUrl?: string) =>
    posthog.capture('essai_started', { product_url: productUrl }),

  essaiEmailCaptured: () =>
    posthog.capture('essai_email_captured'),

  pageGenerated: (source: 'public' | 'dashboard') =>
    posthog.capture('page_generated', { source }),

  previewViewed: (previewId: string) =>
    posthog.capture('preview_viewed', { preview_id: previewId }),

  // ── Auth ─────────────────────────────────────────────
  signupStarted: () =>
    posthog.capture('signup_started'),

  signupCompleted: (method: 'email' | 'google' = 'email') =>
    posthog.capture('signup_completed', { method }),

  loginCompleted: () =>
    posthog.capture('login_completed'),

  // ── Pricing & Stripe ─────────────────────────────────
  pricingPageViewed: () =>
    posthog.capture('pricing_page_viewed'),

  planSelected: (plan: 'starter' | 'pro' | 'agency' | 'enterprise', price: number) =>
    posthog.capture('plan_selected', { plan, price }),

  checkoutStarted: (plan: string) =>
    posthog.capture('checkout_started', { plan }),

  upgradeCTAClicked: (location: string) =>
    posthog.capture('upgrade_cta_clicked', { location }),

  // ── Dashboard ────────────────────────────────────────
  dashboardViewed: () =>
    posthog.capture('dashboard_viewed'),

  newPageWizardStarted: () =>
    posthog.capture('new_page_wizard_started'),

  newPageWizardStepCompleted: (step: number, stepName: string) =>
    posthog.capture('new_page_wizard_step_completed', { step, step_name: stepName }),

  newPageWizardCompleted: () =>
    posthog.capture('new_page_wizard_completed'),

  pagePublished: () =>
    posthog.capture('page_published'),

  pageEdited: () =>
    posthog.capture('page_edited'),

  pageDeleted: () =>
    posthog.capture('page_deleted'),

  storeConnected: (type: 'shopify' | 'woocommerce') =>
    posthog.capture('store_connected', { store_type: type }),

  // ── Retention ────────────────────────────────────────
  subscriptionCancelled: (reason?: string) =>
    posthog.capture('subscription_cancelled', { reason }),
}

// Identifier l'utilisateur connecté dans PostHog
export function identifyUser(userId: string, props?: { email?: string; plan?: string; created_at?: string }) {
  posthog.identify(userId, props)
}

// Réinitialiser à la déconnexion
export function resetUser() {
  posthog.reset()
}
