"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border max-w-sm animate-slide-in ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                : toast.type === "error"
                  ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                  : toast.type === "warning"
                    ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                    : "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
            }`}
          >
            <div className="flex-1">
              <p
                className={`font-medium text-sm ${
                  toast.type === "success"
                    ? "text-emerald-800 dark:text-emerald-200"
                    : toast.type === "error"
                      ? "text-red-800 dark:text-red-200"
                      : toast.type === "warning"
                        ? "text-yellow-800 dark:text-yellow-200"
                        : "text-blue-800 dark:text-blue-200"
                }`}
              >
                {toast.title}
              </p>
              {toast.message && (
                <p
                  className={`text-sm mt-1 ${
                    toast.type === "success"
                      ? "text-emerald-600 dark:text-emerald-300"
                      : toast.type === "error"
                        ? "text-red-600 dark:text-red-300"
                        : toast.type === "warning"
                          ? "text-yellow-600 dark:text-yellow-300"
                          : "text-blue-600 dark:text-blue-300"
                  }`}
                >
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
