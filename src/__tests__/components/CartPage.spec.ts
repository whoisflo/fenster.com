import { afterEach, describe, expect, it, vi } from "vitest";
import {
  enableAutoUnmount,
  flushPromises,
  mount,
  type VueWrapper,
} from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

import CartPage from "@/components/CartPage.vue";
import CartItemRow from "@/components/cart/CartItemRow.vue";
import CartItemSkeleton from "@/components/cart/CartItemSkeleton.vue";
import { useToastStore } from "@/stores/toast";
import { getButton } from "@/__tests__/helpers";
import { mockFakeStoreApi } from "@/__tests__/mockFakeStoreApi";

enableAutoUnmount(afterEach);

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function mountPage() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(CartPage, { global: { plugins: [pinia] } });
}

async function mountLoadedPage() {
  mockFakeStoreApi();
  const wrapper = mountPage();
  await flushPromises();
  return wrapper;
}

function rows(wrapper: VueWrapper) {
  return wrapper.findAllComponents(CartItemRow);
}

function totalsText(wrapper: VueWrapper) {
  return wrapper.get("section[aria-labelledby] dl").text();
}

function toastMessages() {
  return useToastStore().toasts.map((toast) => toast.message);
}

describe("CartPage", () => {
  it("shows skeletons first, then the products from the API", async () => {
    mockFakeStoreApi();
    const wrapper = mountPage();

    expect(wrapper.findAllComponents(CartItemSkeleton)).toHaveLength(5);

    await flushPromises();

    expect(wrapper.findAllComponents(CartItemSkeleton)).toHaveLength(0);
    expect(rows(wrapper)).toHaveLength(5);
    expect(wrapper.text()).toContain("Mens Cotton Jacket");
  });

  it("shows the item count once the cart has loaded", async () => {
    mockFakeStoreApi();
    const wrapper = mountPage();

    expect(wrapper.get("h1").text()).toBe("Shopping Cart");

    await flushPromises();

    expect(wrapper.get("h1").text()).toContain("(5 items)");
  });

  it("totals the cart with 20% tax", async () => {
    const wrapper = await mountLoadedPage();

    const totals = totalsText(wrapper);
    expect(totals).toContain("$899.23");
    expect(totals).toContain("$179.85");
    expect(totals).toContain("$1,079.08");
  });

  it("updates the line, the count and the totals when a quantity changes", async () => {
    const wrapper = await mountLoadedPage();

    await getButton(wrapper, "Increase quantity of Mens Cotton Jacket").trigger(
      "click",
    );

    expect(wrapper.text()).toContain("$111.98");
    expect(wrapper.get("h1").text()).toContain("(6 items)");
    expect(totalsText(wrapper)).toContain("$955.22");
  });

  it("removes a line and updates the totals", async () => {
    const wrapper = await mountLoadedPage();

    await getButton(wrapper, "Remove Mens Cotton Jacket").trigger("click");

    expect(rows(wrapper)).toHaveLength(4);
    expect(wrapper.text()).not.toContain("Mens Cotton Jacket");
    expect(totalsText(wrapper)).toContain("$843.24");
  });

  it("clears the cart and confirms it", async () => {
    const wrapper = await mountLoadedPage();

    await getButton(wrapper, "Clear Cart").trigger("click");

    expect(rows(wrapper)).toHaveLength(0);
    expect(wrapper.text()).toContain("Your cart is empty.");
    expect(totalsText(wrapper)).toContain("$0.00");
    expect(toastMessages()).toContain("Cart cleared");
  });

  it("adds an item through the API and confirms it", async () => {
    const wrapper = await mountLoadedPage();

    await getButton(wrapper, "Add Item").trigger("click");
    await flushPromises();

    expect(rows(wrapper)).toHaveLength(6);
    expect(wrapper.text()).toContain("Canvas Tote Bag");
    expect(toastMessages()).toContain("Added Canvas Tote Bag");
  });

  it("tells the user when adding an item fails", async () => {
    const wrapper = await mountLoadedPage();
    mockFakeStoreApi({ failPost: true });

    await getButton(wrapper, "Add Item").trigger("click");
    await flushPromises();

    expect(rows(wrapper)).toHaveLength(5);
    expect(toastMessages()).toContain(
      "Couldn't add the item. Please try again.",
    );
  });

  it("reports a failed load and loads again on retry", async () => {
    mockFakeStoreApi({ failGet: true });
    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toContain(
      "We couldn't load your products.",
    );

    mockFakeStoreApi();
    await getButton(wrapper, "Try again").trigger("click");
    await flushPromises();

    expect(rows(wrapper)).toHaveLength(5);
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it("adds calculated shipping to the total", async () => {
    const wrapper = await mountLoadedPage();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    const inputs = wrapper.findAll("form input");
    await inputs[0]!.setValue("Stuttgart");
    await inputs[1]!.setValue("Königstraße 1");
    await inputs[2]!.setValue("70173");
    await wrapper.get("form").trigger("submit");
    await vi.advanceTimersByTimeAsync(600);

    expect(wrapper.text()).toContain("Shipping to Stuttgart 70173: $15.00");
    expect(totalsText(wrapper)).toContain("$1,094.08");
  });

  it("explains that checkout is not part of the demo", async () => {
    const wrapper = await mountLoadedPage();

    await getButton(wrapper, "Proceed To Checkout").trigger("click");

    expect(toastMessages()).toContain("Checkout isn't part of this demo.");
  });
});
