import { afterEach, beforeEach, expect, it } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";

import ToastRegion from "@/components/ToastRegion.vue";
import { useToastStore } from "@/stores/toast";
import { getButton } from "@/__tests__/helpers";

enableAutoUnmount(afterEach);

function mountRegion() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(ToastRegion, { global: { plugins: [pinia] } });
}

let wrapper: ReturnType<typeof mountRegion>;

beforeEach(async () => {
  wrapper = mountRegion();
  useToastStore().show("Cart cleared");
  await nextTick();
});

it("shows messages in a polite live region", () => {
  expect(wrapper.attributes("aria-live")).toBe("polite");
  expect(wrapper.text()).toContain("Cart cleared");
});

it("dismisses a message", async () => {
  await getButton(wrapper, "Dismiss notification").trigger("click");

  expect(useToastStore().toasts).toEqual([]);
  expect(wrapper.text()).not.toContain("Cart cleared");
});
