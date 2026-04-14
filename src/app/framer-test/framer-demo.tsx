"use client";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { useState } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const tokens = {
  bg: "#08080f",
  surface: "#0f0f1a",
  border: "#1e1e2e",
  primary: "#7c3aed",
  primaryLight: "#a78bfa",
  text: "#f8fafc",
  muted: "#64748b",
  success: "#10b981",
} as const;

// ─── Nav Items ────────────────────────────────────────────────────────────────
const navItems = ["Accueil", "Pages", "Stores", "Analytics", "Agence"] as const;

// ─── Stat Cards ───────────────────────────────────────────────────────────────
const statCards = [
  { label: "Pages créées", value: "47", accent: tokens.primaryLight },
  { label: "Taux de conversion", value: "+23%", accent: tokens.success },
  { label: "Stores connectés", value: "3", accent: tokens.primaryLight },
] as const;

// ─── Activity Feed ────────────────────────────────────────────────────────────
const activityItems = [
  { text: "Sneaker Pro v2 — page générée", time: "il y a 2 min" },
  { text: "Jordan Edition — mis à jour", time: "il y a 18 min" },
  { text: "Adidas Bundle — publié", time: "il y a 1 h" },
] as const;

// ─── Animation Variants ───────────────────────────────────────────────────────

const lidVariants = {
  closed: { rotateX: 90 },
  open: {
    rotateX: 0,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 18,
      delay: 0.1,
    },
  },
};

const logoInScreenVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
      delay: 0.7,
    },
  },
  gone: {
    opacity: 0,
    scale: 0.85,
    transition: { duration: 0.3, delay: 1.3 },
  },
};

const dashboardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 1.5,
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};

const sidebarContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 1.7,
      staggerChildren: 0.08,
    },
  },
};

const sidebarItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

const statsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 2.0,
      staggerChildren: 0.1,
    },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 160, damping: 18 },
  },
};

const activityContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 2.4,
      staggerChildren: 0.09,
    },
  },
};

const activityItemVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 180, damping: 22 },
  },
};

const toastVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 220,
      damping: 18,
      delay: 2.5,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.25 },
  },
};

const replayButtonVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 3.5, duration: 0.4 },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SidebarNavItem({
  label,
  active,
  reduced,
}: {
  label: string;
  active: boolean;
  reduced: boolean;
}) {
  return (
    <motion.div
      variants={sidebarItemVariants}
      whileHover={
        reduced
          ? {}
          : {
              x: 4,
              backgroundColor: `${tokens.primary}22`,
              transition: { duration: 0.15 },
            }
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        borderRadius: 8,
        cursor: "pointer",
        backgroundColor: active ? `${tokens.primary}33` : "transparent",
        color: active ? tokens.primaryLight : tokens.muted,
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        userSelect: "none" as const,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: active ? tokens.primary : tokens.border,
          flexShrink: 0,
        }}
      />
      {label}
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  accent,
  reduced,
}: {
  label: string;
  value: string;
  accent: string;
  reduced: boolean;
}) {
  return (
    <motion.div
      variants={statCardVariants}
      whileHover={
        reduced
          ? {}
          : {
              scale: 1.03,
              boxShadow: `0 0 20px ${tokens.primary}44`,
              transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20,
              },
            }
      }
      style={{
        flex: 1,
        backgroundColor: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 10,
        padding: "14px 12px",
        cursor: "default",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: tokens.muted,
          marginBottom: 6,
          fontWeight: 500,
          textTransform: "uppercase" as const,
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: accent,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </motion.div>
  );
}

function ActivityRow({ text, time }: { text: string; time: string }) {
  return (
    <motion.div
      variants={activityItemVariants}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: `1px solid ${tokens.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: tokens.primary,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 11, color: tokens.text }}>{text}</span>
      </div>
      <span
        style={{
          fontSize: 10,
          color: tokens.muted,
          flexShrink: 0,
          marginLeft: 8,
        }}
      >
        {time}
      </span>
    </motion.div>
  );
}

// ─── Float loop as a separate component to avoid variant conflict ─────────────
function FloatingToast({ replayKey }: { replayKey: number }) {
  return (
    <motion.div
      key={`toast-${replayKey}`}
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: "absolute",
        bottom: -24,
        right: -148,
        backgroundColor: tokens.surface,
        border: `1px solid ${tokens.success}55`,
        borderRadius: 12,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxShadow: `0 4px 24px ${tokens.success}33`,
        whiteSpace: "nowrap" as const,
        zIndex: 10,
      }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 3.0,
        }}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <span style={{ color: tokens.success, fontSize: 14, lineHeight: 1 }}>
          ✓
        </span>
        <span style={{ color: tokens.text, fontSize: 12, fontWeight: 500 }}>
          Page générée en{" "}
          <strong style={{ color: tokens.success }}>28 sec</strong>
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KonvertFramerDemo() {
  const [replayKey, setReplayKey] = useState(0);
  const reduced = useReducedMotion() ?? false;

  function handleReplay() {
    setReplayKey((k) => k + 1);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: tokens.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        fontFamily:
          "'Outfit', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 40% at 50% 60%, ${tokens.primary}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          color: tokens.muted,
          fontSize: 13,
          marginBottom: 32,
          letterSpacing: "0.04em",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        Tes produits méritent des pages qui vendent.
      </motion.p>

      {/* ── Scene wrapper ── */}
      <div style={{ position: "relative", zIndex: 1 }} key={replayKey}>

        {/* ── Laptop ── */}
        <div
          style={{
            perspective: 1200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Lid */}
          <motion.div
            variants={reduced ? {} : lidVariants}
            initial="closed"
            animate="open"
            style={{
              width: 560,
              height: 340,
              backgroundColor: "#131326",
              borderRadius: "14px 14px 0 0",
              border: `2px solid ${tokens.border}`,
              borderBottom: "none",
              overflow: "hidden",
              transformOrigin: "bottom center",
              position: "relative",
              boxShadow: `0 -4px 40px ${tokens.primary}22`,
            }}
          >
            {/* Screen bezel */}
            <div
              style={{
                position: "absolute",
                inset: 10,
                backgroundColor: tokens.bg,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* Logo fade-in during opening */}
              <motion.div
                variants={reduced ? {} : logoInScreenVariants}
                initial="hidden"
                animate="gone"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 3,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      backgroundColor: tokens.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#fff",
                      boxShadow: `0 0 28px ${tokens.primary}88`,
                    }}
                  >
                    K
                  </div>
                  <span
                    style={{
                      color: tokens.primaryLight,
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                    }}
                  >
                    KONVERT
                  </span>
                </div>
              </motion.div>

              {/* Dashboard */}
              <motion.div
                variants={reduced ? {} : dashboardVariants}
                initial="hidden"
                animate="visible"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "row",
                  zIndex: 2,
                }}
              >
                {/* Sidebar */}
                <motion.div
                  variants={reduced ? {} : sidebarContainerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    width: 132,
                    backgroundColor: tokens.surface,
                    borderRight: `1px solid ${tokens.border}`,
                    padding: "16px 10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    flexShrink: 0,
                  }}
                >
                  {/* Sidebar logo */}
                  <motion.div
                    variants={sidebarItemVariants}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                      paddingLeft: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 7,
                        backgroundColor: tokens.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      K
                    </div>
                    <span
                      style={{
                        color: tokens.text,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                      }}
                    >
                      KONVERT
                    </span>
                  </motion.div>

                  {navItems.map((item, i) => (
                    <SidebarNavItem
                      key={item}
                      label={item}
                      active={i === 0}
                      reduced={reduced}
                    />
                  ))}
                </motion.div>

                {/* Main area */}
                <div
                  style={{
                    flex: 1,
                    padding: "16px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    overflow: "hidden",
                  }}
                >
                  {/* Header row */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.35 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: tokens.text,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Bonjour 👋 — Tableau de bord
                    </span>
                    <span
                      style={{
                        backgroundColor: `${tokens.primary}33`,
                        color: tokens.primaryLight,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 20,
                        border: `1px solid ${tokens.primary}55`,
                        letterSpacing: "0.04em",
                      }}
                    >
                      Pro
                    </span>
                  </motion.div>

                  {/* Stat Cards */}
                  <motion.div
                    variants={reduced ? {} : statsContainerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: "flex", gap: 8 }}
                  >
                    {statCards.map((card) => (
                      <StatCard
                        key={card.label}
                        label={card.label}
                        value={card.value}
                        accent={card.accent}
                        reduced={reduced}
                      />
                    ))}
                  </motion.div>

                  {/* CTA Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring" as const,
                      stiffness: 160,
                      damping: 18,
                      delay: 2.2,
                    }}
                    whileHover={
                      reduced
                        ? {}
                        : {
                            boxShadow: `0 0 18px ${tokens.primary}66`,
                            scale: 1.02,
                            transition: {
                              type: "spring" as const,
                              stiffness: 300,
                              damping: 18,
                            },
                          }
                    }
                    whileTap={
                      reduced
                        ? {}
                        : {
                            scale: 0.96,
                            transition: {
                              type: "spring" as const,
                              stiffness: 400,
                              damping: 20,
                            },
                          }
                    }
                    style={{
                      backgroundColor: tokens.primary,
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "9px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      alignSelf: "flex-start",
                      fontFamily: "inherit",
                    }}
                  >
                    + Créer une page
                  </motion.button>

                  {/* Activity Feed */}
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.3, duration: 0.3 }}
                      style={{
                        fontSize: 11,
                        color: tokens.muted,
                        fontWeight: 600,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.06em",
                        marginBottom: 6,
                      }}
                    >
                      Activité récente
                    </motion.div>
                    <motion.div
                      variants={reduced ? {} : activityContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {activityItems.map((item) => (
                        <ActivityRow
                          key={item.text}
                          text={item.text}
                          time={item.time}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Base / keyboard tray */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            style={{
              width: 580,
              height: 18,
              backgroundColor: "#131326",
              borderRadius: "0 0 8px 8px",
              border: `2px solid ${tokens.border}`,
              borderTop: `1px solid ${tokens.border}`,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 80,
                height: 4,
                backgroundColor: tokens.border,
                borderRadius: 4,
              }}
            />
          </motion.div>
        </div>

        {/* ── Floating Toast (AnimatePresence for exit) ── */}
        <AnimatePresence>
          <FloatingToast key={`toast-outer-${replayKey}`} replayKey={replayKey} />
        </AnimatePresence>
      </div>

      {/* ── Replay Button ── */}
      <motion.button
        variants={replayButtonVariants}
        initial="hidden"
        animate="visible"
        onClick={handleReplay}
        whileHover={
          reduced
            ? {}
            : {
                scale: 1.05,
                borderColor: tokens.primary,
                color: tokens.primaryLight,
                boxShadow: `0 0 14px ${tokens.primary}44`,
                transition: {
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 18,
                },
              }
        }
        whileTap={
          reduced
            ? {}
            : {
                scale: 0.95,
                transition: {
                  type: "spring" as const,
                  stiffness: 400,
                  damping: 20,
                },
              }
        }
        style={{
          marginTop: 60,
          backgroundColor: "transparent",
          border: `1px solid ${tokens.border}`,
          color: tokens.muted,
          borderRadius: 10,
          padding: "10px 24px",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: 8,
          position: "relative",
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: 16 }}>↺</span>
        Rejouer l'animation
      </motion.button>
    </div>
  );
}
