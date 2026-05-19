"use client";

import Link from "next/link";
import { ArrowRight, Check, Fingerprint } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Locale } from "@/components/mock-data";

type AuthCardProps = {
  mode: "sign-in" | "sign-up";
};

const authCopy = {
  es: {
    brand: "PulseFlow",
    eyebrow: "Operaciones de ingresos",
    hero: "El sistema operativo detrás de un crecimiento SaaS más saludable.",
    bullets: ["Inteligencia de ingresos", "Salud de clientes", "Control de flujos"],
    security: "Seguridad del espacio",
    protectedMrr: "MRR protegido este mes",
    uptime: "99.98% uptime",
    workspaceName: "Nombre del espacio",
    workspacePlaceholder: "Operaciones Acme",
    email: "Email",
    emailPlaceholder: "vos@empresa.com",
    password: "Contraseña",
    signIn: {
      title: "Bienvenido de nuevo",
      subtitle: "Ingresá a la consola operativa de PulseFlow.",
      action: "Ingresar",
      alternateLabel: "¿Nuevo en PulseFlow?",
      alternateAction: "Crear espacio",
      alternateHref: "/sign-up",
    },
    signUp: {
      title: "Creá tu espacio PulseFlow",
      subtitle: "Lanzá un centro de comando para ingresos, clientes y retención.",
      action: "Iniciar espacio",
      alternateLabel: "¿Ya tenés acceso?",
      alternateAction: "Ingresar",
      alternateHref: "/sign-in",
    },
  },
  en: {
    brand: "PulseFlow",
    eyebrow: "Revenue operations",
    hero: "The operating system behind healthier SaaS growth.",
    bullets: ["Revenue intelligence", "Customer health", "Workflow control"],
    security: "Workspace security",
    protectedMrr: "Protected MRR this month",
    uptime: "99.98% uptime",
    workspaceName: "Workspace name",
    workspacePlaceholder: "Acme Operations",
    email: "Email",
    emailPlaceholder: "you@company.com",
    password: "Password",
    signIn: {
      title: "Welcome back",
      subtitle: "Sign in to the PulseFlow operations console.",
      action: "Sign in",
      alternateLabel: "New to PulseFlow?",
      alternateAction: "Create workspace",
      alternateHref: "/sign-up",
    },
    signUp: {
      title: "Create your PulseFlow workspace",
      subtitle: "Launch a command center for revenue, customers, and retention.",
      action: "Start workspace",
      alternateLabel: "Already have access?",
      alternateAction: "Sign in",
      alternateHref: "/sign-in",
    },
  },
} as const;

function AuthLanguageToggle({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div className="flex h-10 rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {(["es", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`focus-ring min-w-9 rounded-md px-2 text-xs font-semibold transition ${
            locale === item
              ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
              : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function AuthCard({ mode }: AuthCardProps) {
  const [locale, setLocale] = useState<Locale>("es");
  const t = authCopy[locale];
  const current = mode === "sign-in" ? t.signIn : t.signUp;
  const isSignUp = mode === "sign-up";

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[rgb(var(--surface))] text-[rgb(var(--text))] lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden border-r border-slate-200/80 p-10 dark:border-slate-800 lg:block">
        <div className="absolute inset-0 grid-paper opacity-80" />
        <div className="absolute left-14 top-24 h-72 w-72 rounded-full bg-pulse-500/20 blur-3xl" />
        <div className="absolute bottom-12 right-10 h-80 w-80 rounded-full bg-mint/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between">
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white shadow-glow dark:bg-white dark:text-ink">
              PF
            </span>
            {t.brand}
          </Link>

          <div className="max-w-xl animate-fade-up">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-pulse-600 dark:text-pulse-100">
              {t.eyebrow}
            </p>
            <h1 className="text-5xl font-semibold leading-tight tracking-normal text-slate-950 dark:text-white">
              {t.hero}
            </h1>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {t.bullets.map((item) => (
                <div key={item} className="glass-panel rounded-lg p-4 text-sm font-medium">
                  <Check className="mb-4 h-4 w-4 text-mint" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-lg p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Fingerprint className="h-4 w-4" />
              {t.security}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold">$284.6K</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.protectedMrr}</p>
              </div>
              <div className="rounded-lg bg-mint/15 px-3 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {t.uptime}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-10">
        <div className="absolute right-5 top-5 flex gap-2">
          <AuthLanguageToggle locale={locale} onChange={setLocale} />
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md animate-fade-up">
          <Link href="/" className="mb-10 flex items-center gap-3 text-sm font-semibold lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white dark:bg-white dark:text-ink">
              PF
            </span>
            {t.brand}
          </Link>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-2xl font-semibold tracking-normal">{current.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{current.subtitle}</p>

            <form className="mt-8 space-y-4">
              {isSignUp && (
                <label className="block text-sm font-medium">
                  {t.workspaceName}
                  <input
                    name="workspace"
                    autoComplete="organization"
                    className="focus-ring mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-800 dark:bg-slate-900"
                    placeholder={t.workspacePlaceholder}
                  />
                </label>
              )}
              <label className="block text-sm font-medium">
                {t.email}
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="focus-ring mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-800 dark:bg-slate-900"
                  placeholder={t.emailPlaceholder}
                />
              </label>
              <label className="block text-sm font-medium">
                {t.password}
                <input
                  type="password"
                  name="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="focus-ring mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-800 dark:bg-slate-900"
                  placeholder="********"
                />
              </label>
              <button
                type="button"
                className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 dark:bg-white dark:text-ink"
              >
                {current.action}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {current.alternateLabel}{" "}
            <Link className="font-semibold text-pulse-600 dark:text-pulse-100" href={current.alternateHref}>
              {current.alternateAction}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
