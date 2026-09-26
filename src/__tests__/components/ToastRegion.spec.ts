import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createPinia, setActivePinia, type Pinia } from "pinia";

import ToastRegion from "@/components/ToastRegion.vue";
import { useToastStore } from "@/stores/toast";
import { getButton } from "@/__tests__/helpers";

enableAutoUnmount(afterEach);

describe("ToastRegion", () => {
  let pinia: Pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  const mountRegion = () =>
    mount(ToastRegion, { global: { plugins: [pinia] } });

  it("is a polite live region, so screen readers announce new messages", () => {
    const wrapper = mountRegion();

    expect(wrapper.attributes("aria-live")).toBe("polite");
  });

  it("shows the messages from the toast store", async () => {
    const wrapper = mountRegion();

    useToastStore().show("Added Canvas Tote Bag", "success");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Added Canvas Tote Bag");
  });

  it("dismisses a message", async () => {
    const wrapper = mountRegion();
    const toast = useToastStore();
    toast.show("Cart cleared");
    await wrapper.vm.$nextTick();

    await getButton(wrapper, "Dismiss notification").trigger("click");

    expect(toast.toasts).toEqual([]);
    expect(wrapper.text()).not.toContain("Cart cleared");
  });
});
