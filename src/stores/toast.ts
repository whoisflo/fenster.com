import { defineStore } from "pinia";
import { ref } from "vue";

import { MAX_TOASTS, TOAST_DURATION_MS } from "@/config";

export type ToastTone = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);
  let nextId = 1;

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  function show(message: string, tone: ToastTone = "info") {
    const toast: Toast = { id: nextId++, message, tone };
    toasts.value = [...toasts.value, toast].slice(-MAX_TOASTS);
    setTimeout(() => dismiss(toast.id), TOAST_DURATION_MS);
  }

  return { toasts, show, dismiss };
});
