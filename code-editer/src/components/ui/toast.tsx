"use client";

import * as React from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  XIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const toast = ToastPrimitive.createToastManager();

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-9999 mx-auto w-auto max-w-sm outline-none sm:right-6 sm:left-auto sm:mx-0 sm:w-full sm:max-w-md flex flex-col gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border border-gray-800/80 bg-[#12121c]/95 text-gray-100 shadow-2xl backdrop-blur-xl will-change-transform outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "data-[type=success]:border-emerald-500/40 data-[type=success]:shadow-emerald-500/10",
        "data-[type=error]:border-rose-500/40 data-[type=error]:shadow-rose-500/10",
        "data-[type=warning]:border-amber-500/40 data-[type=warning]:shadow-amber-500/10",
        "data-[type=info]:border-blue-500/40 data-[type=info]:shadow-blue-500/10",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0 data-starting-style:transform-[translateY(150%)]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]",
        "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        className,
      )}
      {...props}
    />
  );
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-3.5 overflow-hidden px-4.5 py-3.5 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-expanded:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(
        "text-sm font-bold text-gray-100 tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn(
        "text-xs text-gray-400 leading-relaxed font-normal",
        className,
      )}
      {...props}
    />
  );
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0 rounded-xl font-semibold", className)}
      {...props}
    />
  );
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        "relative shrink-0 text-gray-400 hover:text-white hover:bg-gray-800/80 rounded-xl p-1.5 transition-colors cursor-pointer",
        className,
      )}
      {...props}
    >
      {children ?? <XIcon className="w-4 h-4" aria-hidden="true" />}
    </ToastPrimitive.Close>
  );
}

function ToastIcon({ type }: { type: string | undefined }) {
  let icon: React.ReactNode = null;
  let bgClass = "bg-gray-800/50 border-gray-700/40";

  if (type === "success") {
    icon = (
      <CircleCheckIcon
        className="w-4 h-4 text-emerald-400"
        aria-hidden="true"
      />
    );
    bgClass = "bg-emerald-500/15 border-emerald-500/30";
  }

  if (type === "info") {
    icon = <InfoIcon className="w-4 h-4 text-blue-400" aria-hidden="true" />;
    bgClass = "bg-blue-500/15 border-blue-500/30";
  }

  if (type === "warning") {
    icon = (
      <TriangleAlertIcon
        className="w-4 h-4 text-amber-400"
        aria-hidden="true"
      />
    );
    bgClass = "bg-amber-500/15 border-amber-500/30";
  }

  if (type === "error") {
    icon = (
      <OctagonXIcon className="w-4 h-4 text-rose-400" aria-hidden="true" />
    );
    bgClass = "bg-rose-500/15 border-rose-500/30";
  }

  if (type === "loading") {
    icon = (
      <Loader2Icon
        className="w-4 h-4 text-purple-400 animate-spin"
        aria-hidden="true"
      />
    );
    bgClass = "bg-purple-500/15 border-purple-500/30";
  }

  if (!icon) {
    return null;
  }

  return (
    <span
      data-slot="toast-icon"
      className={cn(
        "shrink-0 flex items-center justify-center p-2 rounded-xl border shadow-inner",
        bgClass,
      )}
    >
      {icon}
    </span>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}

interface ToasterProps extends ToastPrimitive.Provider.Props {
  className?: string;
  viewportClassName?: string;
}

function Toaster({
  children,
  toastManager = toast,
  className,
  viewportClassName,
  ...props
}: ToasterProps) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport className={cn(viewportClassName, className)}>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
};
