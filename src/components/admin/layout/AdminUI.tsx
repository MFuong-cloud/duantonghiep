"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const adminInputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111111] px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition";

type AdminCardProps = {
  children: ReactNode;
  className?: string;
};

export function AdminCard({ children, className }: AdminCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 p-6 shadow-sm transition-colors duration-300 space-y-6",
        className
      )}
    >
      {children}
    </section>
  );
}

type AdminPageHeaderProps = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  icon,
  actions,
  meta,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
      <div className="space-y-2 max-w-3xl">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="inline-flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-200 p-2">
              {icon}
            </span>
          )}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            {meta && <div className="text-xs text-gray-500">{meta}</div>}
          </div>
        </div>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

type AdminFormFieldProps = {
  label: ReactNode;
  children: ReactNode;
  required?: boolean;
  description?: ReactNode;
  className?: string;
};

export function AdminFormField({
  label,
  children,
  required,
  description,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {children}
    </div>
  );
}


