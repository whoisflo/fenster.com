import { afterEach, expect, it, vi } from "vitest";
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

const rows = (wrapper: VueWrapper) => wrapper.findAllComponents(CartItemRow);
const totals = (wrapper: VueWrapper) =>
  wrapper.get("section[aria-labelledby] dl").text();
const toasts = () => useToastStore().toasts.map((toast) => toast.message);

it("shows skeletons while loading, then the lines, item count and totals", async () => {
  mockFakeStoreApi();
  const wrapper = mountPage();

  expect(wrapper.findAllComponents(CartItemSkeleton)).toHaveLength(5);
  expect(wrapper.get("h1").text()).toBe("Shopping Cart");
  expect(wrapper.text()).not.toContain("Add items to calculate shipping.");

  await flushPromises();

  expect(rows(wrapper)).toHaveLength(5);
  expect(wrapper.get("h1").text()).toContain("(5 items)");
  expect(totals(wrapper)).toContain("$899.23");
  expect(totals(wrapper)).toContain("$179.85");
  expect(totals(wrapper)).toContain("$1,079.08");
});

it("updates the line, count and totals when a quantity changes", async () => {
  const wrapper = await mountLoadedPage();

  await getButton(wrapper, "Increase quantity of Mens Cotton Jacket").trigger(
    "click",
  );

  expect(wrapper.text()).toContain("$111.98");
  expect(wrapper.get("h1").text()).toContain("(6 items)");
  expect(totals(wrapper)).toContain("$955.22");
});

it("removes a line and updates the totals", async () => {
  const wrapper = await mountLoadedPage();

  await getButton(wrapper, "Remove Mens Cotton Jacket").trigger("click");

  expect(rows(wrapper)).toHaveLength(4);
  expect(totals(wrapper)).toContain("$843.24");
});

it("clears the cart, confirms it and asks for items before shipping", async () => {
  const wrapper = await mountLoadedPage();

  await getButton(wrapper, "Clear Cart").trigger("click");

  expect(wrapper.text()).toContain("Your cart is empty.");
  expect(wrapper.text()).toContain("Add items to calculate shipping.");
  expect(totals(wrapper)).toContain("$0.00");
  expect(toasts()).toContain("Cart cleared");
});

it("adds an item through the API and confirms it", async () => {
  const wrapper = await mountLoadedPage();

  await getButton(wrapper, "Add Item").trigger("click");
  await flushPromises();

  expect(rows(wrapper)).toHaveLength(6);
  expect(toasts()).toContain("Added Canvas Tote Bag");
});

it("tells the user when adding an item fails", async () => {
  const wrapper = await mountLoadedPage();
  mockFakeStoreApi({ failPost: true });

  await getButton(wrapper, "Add Item").trigger("click");
  await flushPromises();

  expect(rows(wrapper)).toHaveLength(5);
  expect(toasts()).toContain("Couldn't add the item. Please try again.");
});

it("reports a failed load and loads again on retry", async () => {
  mockFakeStoreApi({ failGet: true });
  const wrapper = mountPage();
  await flushPromises();
  expect(wrapper.find('[role="alert"]').exists()).toBe(true);

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

  const [city, address, postalCode] = wrapper.findAll("form input");
  await city!.setValue("Stuttgart");
  await address!.setValue("Königstraße 1");
  await postalCode!.setValue("70173");
  await wrapper.get("form").trigger("submit");
  await vi.advanceTimersByTimeAsync(600);

  expect(wrapper.text()).toContain("Shipping to Stuttgart 70173: $15.00");
  expect(totals(wrapper)).toContain("$1,094.08");
});

it("explains that checkout is not part of the demo", async () => {
  const wrapper = await mountLoadedPage();

  await getButton(wrapper, "Proceed To Checkout").trigger("click");

  expect(toasts()).toContain("Checkout isn't part of this demo.");
});
