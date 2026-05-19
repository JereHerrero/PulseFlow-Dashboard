"use client";

import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  Command,
  Download,
  Filter,
  Loader2,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  activityItems,
  customers,
  CustomerStatus,
  dictionary,
  Locale,
  metricItems,
  navItems,
  pipelineItems,
  revenueSeries,
  secondaryNavItems,
  SectionId,
  segments,
  SortKey,
  trendIcons,
} from "@/components/mock-data";

type DemoCustomer = {
  id: string;
  company: string;
  owner: string;
  plan: string;
  status: CustomerStatus;
  arr: number;
  seats: number;
  renewalDate: string;
  usage: number;
  region: string;
};
type ModalState = "workflow" | "export" | "customer" | "addCustomer" | null;
type Toast = {
  id: string;
  message: string;
};

const statusStyles: Record<CustomerStatus, string> = {
  healthy: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
  expansion: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20",
  atRisk: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20",
  onboarding: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
};

function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es-AR" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "es" ? "es-AR" : "en-US", {
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

function StatusPill({ status, locale }: { status: CustomerStatus; locale: Locale }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[status]}`}>
      {dictionary[locale].statuses[status]}
    </span>
  );
}

function LanguageToggle({
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
          aria-label={`${dictionary[locale].app.language} ${item.toUpperCase()}`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function SidebarContent({
  locale,
  activeSection,
  collapsed,
  onSectionChange,
  onToggleCollapsed,
}: {
  locale: Locale;
  activeSection: SectionId;
  collapsed: boolean;
  onSectionChange: (section: SectionId) => void;
  onToggleCollapsed: () => void;
}) {
  const t = dictionary[locale];

  return (
    <div className="flex h-full flex-col">
      <div className={`flex h-16 items-center gap-3 px-4 ${collapsed ? "justify-center" : ""}`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-white shadow-glow dark:bg-white dark:text-ink">
          PF
        </div>
        <div className={collapsed ? "hidden" : ""}>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">PulseFlow</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.app.console}</p>
        </div>
      </div>

      <div className={`px-3 ${collapsed ? "hidden" : ""}`}>
        <button type="button" className="focus-ring flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-mint" />
            {t.app.workspace}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <nav className="mt-5 flex-1 space-y-1 px-3">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange(item.id)}
            title={collapsed ? t.nav[item.id] : undefined}
            className={`focus-ring flex w-full animate-slide-in items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-900 ${collapsed ? "justify-center" : ""} ${
              activeSection === item.id
                ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                : "text-slate-600 dark:text-slate-300"
            }`}
            style={{ animationDelay: `${index * 35}ms` }}
          >
            <item.icon className="h-4 w-4" />
            <span className={collapsed ? "sr-only" : ""}>{t.nav[item.id]}</span>
          </button>
        ))}
      </nav>

      <div className="space-y-1 px-3 pb-4">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="focus-ring hidden w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 lg:flex"
          aria-label={collapsed ? t.app.expandSidebar : t.app.collapseSidebar}
          title={collapsed ? t.app.expandSidebar : t.app.collapseSidebar}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          <span className={collapsed ? "sr-only" : ""}>{collapsed ? t.app.expandSidebar : t.app.collapseSidebar}</span>
        </button>
        {secondaryNavItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? t.nav[item.id] : undefined}
          >
            <item.icon className="h-4 w-4" />
            <span className={collapsed ? "sr-only" : ""}>{t.nav[item.id]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricCards({ locale }: { locale: Locale }) {
  const t = dictionary[locale];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metricItems.map((metric, index) => {
        const TrendIcon = trendIcons[metric.trend];
        return (
          <article
            key={metric.id}
            className="glass-panel group animate-fade-up rounded-lg p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:scale-105 dark:bg-slate-900 dark:text-slate-200">
                <metric.icon className="h-5 w-5" />
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                  metric.trend === "down"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : metric.trend === "neutral"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                }`}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {metric.change}
              </span>
            </div>
            <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">{t.metrics[metric.id].label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">{metric.value}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t.metrics[metric.id].detail}</p>
          </article>
        );
      })}
    </div>
  );
}

function RevenueChart({ locale }: { locale: Locale }) {
  const t = dictionary[locale];
  const max = Math.max(...revenueSeries.map((item) => item.revenue + item.expansion));

  return (
    <section className="glass-panel rounded-lg p-5 shadow-sm lg:col-span-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{t.chart.title}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.chart.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full bg-pulse-500" />
            {t.chart.baseArr}
          </span>
          <span className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full bg-mint" />
            {t.chart.expansion}
          </span>
        </div>
      </div>

      <div className="mt-8 h-72">
        <div className="flex h-full items-end gap-2 sm:gap-3">
          {revenueSeries.map((item, index) => (
            <div key={item.month} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div className="flex h-full w-full items-end justify-center gap-1 rounded-lg bg-slate-100/70 px-1 py-2 dark:bg-slate-900/70">
                <div
                  className="animate-bar-grow w-full max-w-5 rounded-md bg-pulse-500 transition-all duration-500 group-hover:bg-pulse-600"
                  style={{ height: `${(item.revenue / max) * 100}%`, animationDelay: `${index * 45}ms` }}
                />
                <div
                  className="animate-bar-grow w-full max-w-5 rounded-md bg-mint transition-all duration-500 group-hover:bg-emerald-500"
                  style={{ height: `${(item.expansion / max) * 100}%`, animationDelay: `${index * 45 + 80}ms` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.months[item.month]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomerTable({
  locale,
  searchQuery,
  customersList,
  loading,
  statusFilter,
  sortKey,
  onAddCustomer,
  onSearch,
  onStatusFilter,
  onSort,
  onViewDetails,
  onUpdateStatus,
  onDeleteCustomer,
}: {
  locale: Locale;
  searchQuery: string;
  customersList: readonly DemoCustomer[];
  loading: boolean;
  statusFilter: CustomerStatus | "all";
  sortKey: SortKey;
  onAddCustomer: () => void;
  onSearch: (value: string) => void;
  onStatusFilter: (value: CustomerStatus | "all") => void;
  onSort: (value: SortKey) => void;
  onViewDetails: (customer: DemoCustomer) => void;
  onUpdateStatus: (customerId: string, status: CustomerStatus) => void;
  onDeleteCustomer: (customerId: string) => void;
}) {
  const t = dictionary[locale];
  const headers = [
    t.table.columns.company,
    t.table.columns.owner,
    t.table.columns.plan,
    t.table.columns.status,
    t.table.columns.arr,
    t.table.columns.seats,
    t.table.columns.renewal,
    t.table.columns.action,
  ];

  return (
    <section className="glass-panel rounded-lg shadow-sm xl:col-span-2">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">{t.table.title}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.table.description}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onAddCustomer}
              className="focus-ring inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-ink px-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 dark:bg-white dark:text-ink"
            >
              <Plus className="h-4 w-4" />
              {t.table.addCustomer}
            </button>
            <label className="focus-within:ring-pulse-500/50 flex h-9 min-w-52 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-sm ring-2 ring-transparent transition dark:border-slate-800 dark:bg-slate-950">
              <Search className="h-4 w-4" />
              <input
                value={searchQuery}
                onChange={(event) => onSearch(event.target.value)}
                placeholder={t.table.search}
                name="customer-search"
                className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
            </label>
            <label className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <Filter className="h-4 w-4" />
              <select
                value={statusFilter}
                onChange={(event) => onStatusFilter(event.target.value as CustomerStatus | "all")}
                className="bg-transparent text-slate-700 outline-none dark:text-slate-200"
                aria-label={t.table.filter}
              >
                <option value="all">{t.table.allStatuses}</option>
                <option value="healthy">{t.statuses.healthy}</option>
                <option value="expansion">{t.statuses.expansion}</option>
                <option value="atRisk">{t.statuses.atRisk}</option>
              </select>
            </label>
            <label className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              {t.table.sortBy}
              <select
                value={sortKey}
                onChange={(event) => onSort(event.target.value as SortKey)}
                className="bg-transparent text-slate-700 outline-none dark:text-slate-200"
                aria-label={t.table.sortBy}
              >
                <option value="arr">{t.sort.arr}</option>
                <option value="seats">{t.sort.seats}</option>
                <option value="renewalDate">{t.sort.renewalDate}</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.12em] text-slate-400">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-5 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {loading &&
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  {headers.map((header) => (
                    <td key={header} className="px-5 py-4">
                      <div className="h-4 w-full max-w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading && customersList.map((customer) => (
              <tr key={customer.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      {customer.company
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <span className="font-semibold text-slate-950 dark:text-white">{customer.company}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{customer.owner}</td>
                <td className="px-5 py-4 font-medium">{customer.plan}</td>
                <td className="px-5 py-4">
                  <select
                    value={customer.status}
                    onChange={(event) => onUpdateStatus(customer.id, event.target.value as CustomerStatus)}
                    className="focus-ring rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    aria-label={t.table.editStatus}
                  >
                    {(["healthy", "expansion", "atRisk", "onboarding"] as const).map((status) => (
                      <option key={status} value={status}>
                        {t.statuses[status]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4 font-semibold">{formatCurrency(customer.arr, locale)}</td>
                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{customer.seats}</td>
                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{formatDate(customer.renewalDate, locale)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetails(customer)}
                      className="focus-ring inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    >
                      {t.table.viewDetails}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCustomer(customer.id)}
                      className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 shadow-sm transition hover:-translate-y-0.5 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                      aria-label={`${t.table.deleteCustomer} ${customer.company}`}
                      title={t.table.deleteCustomer}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && customersList.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  <div className="mx-auto max-w-sm rounded-lg border border-dashed border-slate-300 p-6 dark:border-slate-700">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">{t.table.empty}</p>
                    <button
                      type="button"
                      onClick={onAddCustomer}
                      className="focus-ring mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-ink px-3 text-sm font-semibold text-white dark:bg-white dark:text-ink"
                    >
                      <Plus className="h-4 w-4" />
                      {t.table.addCustomer}
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ActivityFeed({ locale }: { locale: Locale }) {
  const t = dictionary[locale];

  return (
    <section className="glass-panel rounded-lg p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{t.activity.title}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.activity.description}</p>
        </div>
        <button type="button" className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900">
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-5">
        {activityItems.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 ${activity.color}`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="font-medium text-slate-950 dark:text-white">{t.activity[activity.id].title}</p>
                <span className="text-xs text-slate-400">{activity.timeAgo}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{t.activity[activity.id].description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SegmentPanel({ locale }: { locale: Locale }) {
  const t = dictionary[locale];

  return (
    <section className="glass-panel rounded-lg p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-950 dark:text-white">{t.chart.revenueMix}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.chart.revenueMixDetail}</p>
      <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
        {segments.map((segment) => (
          <div key={segment.id} className={segment.color} style={{ width: `${segment.value}%` }} />
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {segments.map((segment) => (
          <div key={segment.id} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className={`h-2.5 w-2.5 rounded-full ${segment.color}`} />
              {t.segments[segment.id]}
            </span>
            <span className="font-semibold">{segment.value}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PipelinePanel({ locale }: { locale: Locale }) {
  const t = dictionary[locale];

  return (
    <section className="glass-panel rounded-lg p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-950 dark:text-white">{t.chart.expansionPipeline}</p>
      <div className="mt-5 space-y-3">
        {pipelineItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/70 p-3 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950/60">
            <span className="flex items-center gap-3 text-sm font-medium">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <item.icon className="h-4 w-4" />
              </span>
              {t.pipeline[item.id]}
            </span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionPanel({ locale, activeSection }: { locale: Locale; activeSection: SectionId }) {
  const t = dictionary[locale];

  if (activeSection === "overview") {
    return null;
  }

  return (
    <section className="glass-panel mb-4 rounded-lg p-5 shadow-sm">
      <p className="text-lg font-semibold text-slate-950 dark:text-white">{t.sections[activeSection].title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{t.sections[activeSection].body}</p>
    </section>
  );
}

function SettingsPanel({
  locale,
  onLocaleChange,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const t = dictionary[locale];
  const rows = [t.settings.notifications, t.settings.security, t.settings.enterpriseSso, t.settings.dataRetention];

  return (
    <section className="glass-panel mb-4 rounded-lg p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{t.settings.title}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.sections.settings.body}</p>
        </div>
        <LanguageToggle locale={locale} onChange={onLocaleChange} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/60">
            <span className="text-sm font-medium">{row}</span>
            <span className="rounded-full bg-mint/15 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {t.settings.enabled}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Modal({
  children,
  onClose,
  title,
  description,
  closeLabel,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
  description: string;
  closeLabel: string;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
      <button className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" aria-label={closeLabel} onClick={onClose} />
      <section className="glass-panel relative w-full max-w-lg animate-fade-up rounded-lg p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-slate-950 dark:text-white">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label={closeLabel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-[70] space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="flex animate-fade-up items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-soft dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
          <Check className="h-4 w-4 text-mint" />
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function LoginScreen({
  locale,
  loading,
  onLocaleChange,
  onLogin,
}: {
  locale: Locale;
  loading: boolean;
  onLocaleChange: (locale: Locale) => void;
  onLogin: () => void;
}) {
  const t = dictionary[locale];
  const [email, setEmail] = useState("demo@pulseflow.app");
  const [password, setPassword] = useState("password123");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = t.login.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = t.login.emailInvalid;
    }

    if (!password) {
      nextErrors.password = t.login.passwordRequired;
    } else if (password.length < 6) {
      nextErrors.password = t.login.passwordMin;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onLogin();
  }

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10 text-[rgb(var(--text))]">
      <div className="absolute right-5 top-5 flex gap-2">
        <LanguageToggle locale={locale} onChange={onLocaleChange} />
        <ThemeToggle />
      </div>
      <section className="glass-panel w-full max-w-md animate-scale-in rounded-lg p-6 shadow-soft">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-white shadow-glow dark:bg-white dark:text-ink">
            PF
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">PulseFlow</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.login.hint}</p>
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">{t.login.title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{t.login.subtitle}</p>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium">
            {t.login.email}
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((current) => ({ ...current, email: undefined }));
              }}
              aria-invalid={Boolean(errors.email)}
              className={`focus-ring mt-2 h-11 w-full rounded-lg border bg-white px-3 text-sm dark:bg-slate-950 ${
                errors.email ? "border-rose-300 ring-rose-500/10 dark:border-rose-500/40" : "border-slate-200 dark:border-slate-800"
              }`}
              placeholder={t.login.emailPlaceholder}
            />
            {errors.email && <span className="mt-1.5 block text-xs font-medium text-rose-500">{errors.email}</span>}
          </label>
          <label className="block text-sm font-medium">
            {t.login.password}
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
              aria-invalid={Boolean(errors.password)}
              className={`focus-ring mt-2 h-11 w-full rounded-lg border bg-white px-3 text-sm dark:bg-slate-950 ${
                errors.password ? "border-rose-300 ring-rose-500/10 dark:border-rose-500/40" : "border-slate-200 dark:border-slate-800"
              }`}
              placeholder={t.login.passwordPlaceholder}
            />
            {errors.password && <span className="mt-1.5 block text-xs font-medium text-rose-500">{errors.password}</span>}
          </label>
          <button
            type="submit"
            disabled={loading}
            className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-ink"
          >
            {loading ? t.login.loading : t.login.submit}
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
        <div className="mt-5 rounded-lg border border-slate-200 bg-white/60 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
          <p className="mb-2 font-semibold text-slate-700 dark:text-slate-200">{t.login.demoCredentials}</p>
          <div className="flex flex-col gap-1 font-mono">
            <span>demo@pulseflow.app</span>
            <span>password123</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen animate-fade-up px-4 py-6 sm:px-6 lg:pl-80 lg:pr-8">
      <div className="mb-6 h-10 w-72 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-panel h-36 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="glass-panel h-80 animate-pulse rounded-lg xl:col-span-2" />
        <div className="glass-panel h-80 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

function AddCustomerForm({
  locale,
  onCancel,
  onSubmit,
}: {
  locale: Locale;
  onCancel: () => void;
  onSubmit: (customer: DemoCustomer) => void;
}) {
  const t = dictionary[locale];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      id: `customer-${Date.now()}`,
      company: String(formData.get("company") || "New Customer"),
      owner: String(formData.get("owner") || "Account Owner"),
      plan: String(formData.get("plan") || "Growth"),
      status: String(formData.get("status") || "healthy") as CustomerStatus,
      arr: Number(formData.get("arr") || 24000),
      seats: Number(formData.get("seats") || 24),
      renewalDate: String(formData.get("renewalDate") || "2026-11-15"),
      usage: 82,
      region: String(formData.get("region") || "LATAM"),
    });
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
      {[
        ["company", t.modal.company, "Atlas Cloud"],
        ["owner", t.modal.owner, "Sofia Reyes"],
        ["plan", t.modal.plan, "Scale"],
        ["region", t.modal.region, "LATAM"],
      ].map(([name, label, placeholder]) => (
        <label key={name} className="block text-sm font-medium">
          {label}
          <input
            name={name}
            className="focus-ring mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
            placeholder={placeholder}
          />
        </label>
      ))}
      <label className="block text-sm font-medium">
        {t.modal.arr}
        <input
          name="arr"
          type="number"
          defaultValue="24000"
          className="focus-ring mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
        />
      </label>
      <label className="block text-sm font-medium">
        {t.modal.seats}
        <input
          name="seats"
          type="number"
          defaultValue="24"
          className="focus-ring mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
        />
      </label>
      <label className="block text-sm font-medium">
        {t.table.columns.status}
        <select
          name="status"
          className="focus-ring mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
        >
          {(["healthy", "expansion", "atRisk", "onboarding"] as const).map((status) => (
            <option key={status} value={status}>
              {t.statuses[status]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        {t.modal.renewalDate}
        <input
          name="renewalDate"
          type="date"
          defaultValue="2026-11-15"
          className="focus-ring mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
        />
      </label>
      <div className="flex justify-end gap-2 pt-2 sm:col-span-2">
        <button type="button" onClick={onCancel} className="focus-ring h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium dark:border-slate-800 dark:bg-slate-950">
          {t.modal.cancel}
        </button>
        <button type="submit" className="focus-ring h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white dark:bg-white dark:text-ink">
          {t.modal.add}
        </button>
      </div>
    </form>
  );
}

export function Dashboard() {
  const [locale, setLocale] = useState<Locale>("es");
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("arr");
  const [modal, setModal] = useState<ModalState>(null);
  const [customerRows, setCustomerRows] = useState<DemoCustomer[]>(() => customers.map((customer) => ({ ...customer })));
  const [selectedCustomer, setSelectedCustomer] = useState<DemoCustomer | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const t = dictionary[locale];

  useEffect(() => {
    const storedLocale = window.localStorage.getItem("pulseflow-locale") as Locale | null;
    const storedSidebar = window.localStorage.getItem("pulseflow-sidebar-collapsed");
    const storedAuth = window.localStorage.getItem("pulseflow-authenticated");

    if (storedLocale === "es" || storedLocale === "en") {
      setLocale(storedLocale);
    }
    if (storedSidebar) {
      setSidebarCollapsed(storedSidebar === "true");
    }
    if (storedAuth === "true") {
      setAuthenticated(true);
      setDashboardLoading(true);
      window.setTimeout(() => setDashboardLoading(false), 650);
    }
  }, []);

  const addToast = (message: string) => {
    const id = `${message}-${Date.now()}`;
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2600);
  };

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...customerRows]
      .filter((customer) => {
        const matchesSearch = [customer.company, customer.owner, customer.plan, customer.region]
          .join(" ")
          .toLowerCase()
          .includes(query);
        const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortKey === "renewalDate") {
          return new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
        }
        return b[sortKey] - a[sortKey];
      });
  }, [customerRows, searchQuery, sortKey, statusFilter]);

  const changeSection = (section: SectionId) => {
    setActiveSection(section);
    setMenuOpen(false);
    addToast(t.toast.sectionChanged);
  };

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    window.localStorage.setItem("pulseflow-locale", nextLocale);
    addToast(dictionary[nextLocale].toast.languageChanged);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("pulseflow-sidebar-collapsed", String(next));
      return next;
    });
  };

  const login = () => {
    setAuthLoading(true);
    window.setTimeout(() => {
      window.localStorage.setItem("pulseflow-authenticated", "true");
      setAuthenticated(true);
      setAuthLoading(false);
      setDashboardLoading(true);
      window.setTimeout(() => {
        setDashboardLoading(false);
        window.setTimeout(() => addToast(t.toast.welcome), 180);
      }, 700);
    }, 650);
  };

  const logout = () => {
    window.localStorage.removeItem("pulseflow-authenticated");
    setAuthenticated(false);
    setActiveSection("overview");
    setToasts([]);
  };

  const openCustomer = (customer: DemoCustomer) => {
    setSelectedCustomer(customer);
    setModal("customer");
    addToast(t.toast.openedCustomer);
  };

  const addCustomer = (customer: DemoCustomer) => {
    setCustomerRows((current) => [customer, ...current]);
    setModal(null);
    addToast(t.toast.customerAdded);
  };

  const updateCustomerStatus = (customerId: string, status: CustomerStatus) => {
    setCustomerRows((current) => current.map((customer) => (customer.id === customerId ? { ...customer, status } : customer)));
  };

  const deleteCustomer = (customerId: string) => {
    setCustomerRows((current) => current.filter((customer) => customer.id !== customerId));
    addToast(t.toast.customerRemoved);
  };

  if (!authenticated) {
    return <LoginScreen locale={locale} loading={authLoading} onLocaleChange={changeLocale} onLogin={login} />;
  }

  if (dashboardLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen animate-fade-up bg-[rgb(var(--surface))] text-[rgb(var(--text))]">
      <aside className={`fixed inset-y-0 left-0 z-30 hidden border-r border-slate-200/80 bg-white/70 backdrop-blur-xl transition-[width] duration-300 dark:border-slate-800 dark:bg-slate-950/70 lg:block ${sidebarCollapsed ? "w-20" : "w-72"}`}>
        <SidebarContent
          locale={locale}
          activeSection={activeSection}
          collapsed={sidebarCollapsed}
          onSectionChange={changeSection}
          onToggleCollapsed={toggleSidebar}
        />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/40" aria-label={t.app.closeMenu} onClick={() => setMenuOpen(false)} />
          <aside className="relative h-full w-[min(21rem,86vw)] border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <button
              className="focus-ring absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
              onClick={() => setMenuOpen(false)}
              aria-label={t.app.closeMenu}
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              locale={locale}
              activeSection={activeSection}
              collapsed={false}
              onSectionChange={changeSection}
              onToggleCollapsed={toggleSidebar}
            />
          </aside>
        </div>
      )}

      <div className={`transition-[padding] duration-300 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[rgb(var(--surface))]/82 px-4 py-3 backdrop-blur-xl dark:border-slate-800 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 lg:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label={t.app.openMenu}
              >
                <Menu className="h-4 w-4" />
              </button>
              <label className="hidden h-10 min-w-[18rem] items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 text-sm text-slate-400 shadow-sm focus-within:ring-2 focus-within:ring-pulse-500/50 dark:border-slate-800 dark:bg-slate-950/80 md:flex">
                <Search className="h-4 w-4" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t.app.searchPlaceholder}
                  name="global-search"
                  className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
                />
                <span className="ml-auto flex items-center gap-1 rounded-md border border-slate-200 px-1.5 py-0.5 text-xs dark:border-slate-700">
                  <Command className="h-3 w-3" /> K
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModal("workflow")}
                className="focus-ring hidden h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 sm:flex"
              >
                <Sparkles className="h-4 w-4 text-pulse-500" />
                {t.app.automations}
              </button>
              <button
                type="button"
                onClick={() => addToast(t.toast.notificationsRead)}
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                aria-label={t.app.notifications}
              >
                <Bell className="h-4 w-4" />
              </button>
              <LanguageToggle locale={locale} onChange={changeLocale} />
              <ThemeToggle />
              <button
                type="button"
                onClick={logout}
                className="focus-ring hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 sm:flex"
                aria-label={t.app.logout}
                title={t.app.logout}
              >
                <LogOut className="h-4 w-4" />
              </button>
              <div className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pulse-500 to-mint text-sm font-semibold text-white shadow-sm" aria-label={t.app.profile}>
                MC
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="animate-fade-up">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-mint" />
                {t.app.liveHealth}
              </div>
              <h1 className="text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
                {t.sections[activeSection].title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                {activeSection === "overview" ? t.app.description : t.sections[activeSection].body}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setModal("export")}
                className="focus-ring h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              >
                {t.app.export}
              </button>
              <button
                type="button"
                onClick={() => setModal("workflow")}
                className="focus-ring h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 dark:bg-white dark:text-ink"
              >
                {t.app.createWorkflow}
              </button>
            </div>
          </section>

          {activeSection === "settings" && <SettingsPanel locale={locale} onLocaleChange={changeLocale} />}
          <SectionPanel locale={locale} activeSection={activeSection} />

          <MetricCards locale={locale} />

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
            <RevenueChart locale={locale} />
            <div className="grid gap-4">
              <SegmentPanel locale={locale} />
              <PipelinePanel locale={locale} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
            <CustomerTable
              locale={locale}
              searchQuery={searchQuery}
              customersList={filteredCustomers}
              loading={dashboardLoading}
              statusFilter={statusFilter}
              sortKey={sortKey}
              onAddCustomer={() => setModal("addCustomer")}
              onSearch={setSearchQuery}
              onStatusFilter={setStatusFilter}
              onSort={setSortKey}
              onViewDetails={openCustomer}
              onUpdateStatus={updateCustomerStatus}
              onDeleteCustomer={deleteCustomer}
            />
            <ActivityFeed locale={locale} />
          </div>
        </main>
      </div>

      {modal === "workflow" && (
        <Modal
          title={t.modal.workflowTitle}
          description={t.modal.workflowDescription}
          closeLabel={t.modal.close}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              {t.modal.workflowName}
              <input className="focus-ring mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950" placeholder={t.modal.workflowNamePlaceholder} />
            </label>
            <label className="block text-sm font-medium">
              {t.modal.trigger}
              <input className="focus-ring mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950" placeholder={t.modal.triggerPlaceholder} />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(null)} className="focus-ring h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium dark:border-slate-800 dark:bg-slate-950">
                {t.modal.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setModal(null);
                  addToast(t.toast.workflowCreated);
                }}
                className="focus-ring h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white dark:bg-white dark:text-ink"
              >
                {t.modal.create}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal === "export" && (
        <Modal
          title={t.modal.exportTitle}
          description={t.modal.exportDescription}
          closeLabel={t.modal.close}
          onClose={() => setModal(null)}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[t.modal.exportCsv, t.modal.exportPdf].map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => {
                  setModal(null);
                  addToast(t.toast.exportReady);
                }}
                className="focus-ring flex min-h-28 flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold shadow-sm transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-950"
              >
                <Download className="h-5 w-5 text-pulse-500" />
                {t.modal.download} {format}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {modal === "addCustomer" && (
        <Modal
          title={t.modal.addCustomerTitle}
          description={t.modal.addCustomerDescription}
          closeLabel={t.modal.close}
          onClose={() => setModal(null)}
        >
          <AddCustomerForm locale={locale} onCancel={() => setModal(null)} onSubmit={addCustomer} />
        </Modal>
      )}

      {modal === "customer" && selectedCustomer && (
        <Modal
          title={`${t.modal.customerTitle}: ${selectedCustomer.company}`}
          description={t.modal.customerDescription}
          closeLabel={t.modal.close}
          onClose={() => setModal(null)}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [t.details.annualRevenue, formatCurrency(selectedCustomer.arr, locale)],
              [t.details.seats, selectedCustomer.seats.toString()],
              [t.details.usage, `${selectedCustomer.usage}%`],
              [t.details.region, selectedCustomer.region],
              [t.details.owner, selectedCustomer.owner],
              [t.details.nextRenewal, formatDate(selectedCustomer.renewalDate, locale)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
                <p className="mt-2 text-lg font-semibold">{value}</p>
              </div>
            ))}
            <div className="sm:col-span-2">
              <StatusPill status={selectedCustomer.status} locale={locale} />
            </div>
          </div>
        </Modal>
      )}

      <Toasts toasts={toasts} />
    </div>
  );
}
