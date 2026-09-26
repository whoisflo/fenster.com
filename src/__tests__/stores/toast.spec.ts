import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import { useToastStore } from "@/stores/toast";

describe("useToastStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows a message, as info unless told otherwise", () => {
    const toast = useToastStore();

    toast.show("Cart cleared");
    toast.show("Added Canvas Tote Bag", "success");

    expect(toast.toasts).toMatchObject([
      { message: "Cart cleared", tone: "info" },
      { message: "Added Canvas Tote Bag", tone: "success" },
    ]);
  });

  it("gives every message its own id", () => {
    const toast = useToastStore();

    toast.show("One");
    toast.show("Two");

    const [first, second] = toast.toasts;
    expect(first?.id).not.toBe(second?.id);
  });

  it("hides a message after four seconds", () => {
    const toast = useToastStore();
    toast.show("Cart cleared");

    vi.advanceTimersByTime(3999);
    expect(toast.toasts).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(toast.toasts).toHaveLength(0);
  });

  it("keeps at most three messages, dropping the oldest", () => {
    const toast = useToastStore();

    for (const message of ["One", "Two", "Three", "Four"]) toast.show(message);

    expect(toast.toasts.map((item) => item.message)).toEqual([
      "Two",
      "Three",
      "Four",
    ]);
  });

  it("can dismiss a message early", () => {
    const toast = useToastStore();
    toast.show("One");
    toast.show("Two");

    toast.dismiss(toast.toasts[0]!.id);

    expect(toast.toasts.map((item) => item.message)).toEqual(["Two"]);
  });
});
