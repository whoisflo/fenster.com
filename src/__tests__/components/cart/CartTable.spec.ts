import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CartItemRow from "@/components/cart/CartItemRow.vue";
import CartItemSkeleton from "@/components/cart/CartItemSkeleton.vue";
import CartTable from "@/components/cart/CartTable.vue";
import {
  sampleAddedItem,
  sampleCartItems,
} from "@/__tests__/fixtures/cartItems";
import { getButton } from "@/__tests__/helpers";

describe("CartTable", () => {
  it("shows one row per item in a named list", () => {
    const items = sampleCartItems();
    const wrapper = mount(CartTable, { props: { items, status: "success" } });

    expect(wrapper.findAllComponents(CartItemRow)).toHaveLength(items.length);
    expect(wrapper.findAllComponents(CartItemSkeleton)).toHaveLength(0);
    expect(wrapper.get("ul").attributes("aria-label")).toBe("Cart items");
  });

  it("shows skeletons while loading", () => {
    const wrapper = mount(CartTable, {
      props: { items: [], status: "loading" },
    });

    expect(wrapper.findAllComponents(CartItemSkeleton)).toHaveLength(5);
    expect(wrapper.get("ul").attributes("aria-busy")).toBe("true");
  });

  it("shows skeletons before the first load starts, so an empty cart never flashes", () => {
    const wrapper = mount(CartTable, { props: { items: [], status: "idle" } });

    expect(wrapper.findAllComponents(CartItemSkeleton)).toHaveLength(5);
    expect(wrapper.text()).not.toContain("Your cart is empty.");
  });

  it("shows as many skeletons as asked for", () => {
    const wrapper = mount(CartTable, {
      props: { items: [], status: "loading", skeletonCount: 2 },
    });

    expect(wrapper.findAllComponents(CartItemSkeleton)).toHaveLength(2);
  });

  it("keeps existing lines visible while loading", () => {
    const wrapper = mount(CartTable, {
      props: { items: [sampleAddedItem()], status: "loading" },
    });

    expect(wrapper.findAllComponents(CartItemSkeleton)).toHaveLength(5);
    expect(wrapper.findAllComponents(CartItemRow)).toHaveLength(1);
  });

  it("reports a failed load and offers a retry", async () => {
    const wrapper = mount(CartTable, { props: { items: [], status: "error" } });

    expect(wrapper.get('[role="alert"]').text()).toContain(
      "We couldn't load your products.",
    );

    await getButton(wrapper, "Try again").trigger("click");

    expect(wrapper.emitted("retry")).toEqual([[]]);
  });

  it("does not call the cart empty while the load error shows", () => {
    const wrapper = mount(CartTable, { props: { items: [], status: "error" } });

    expect(wrapper.text()).not.toContain("Your cart is empty.");
  });

  it("shows the empty state when the cart has no items", () => {
    const wrapper = mount(CartTable, {
      props: { items: [], status: "success" },
    });

    expect(wrapper.get('[role="status"]').text()).toContain(
      "Your cart is empty.",
    );
    expect(wrapper.text()).toContain("Use Add Item to add a product.");
    expect(wrapper.find("ul").exists()).toBe(false);
  });

  it("passes quantity changes on with the item key", async () => {
    const wrapper = mount(CartTable, {
      props: { items: sampleCartItems(), status: "success" },
    });

    await getButton(wrapper, "Increase quantity of Mens Cotton Jacket").trigger(
      "click",
    );

    expect(wrapper.emitted("updateQuantity")).toEqual([["product-3", 2]]);
  });

  it("passes removals on with the item key", async () => {
    const wrapper = mount(CartTable, {
      props: { items: sampleCartItems(), status: "success" },
    });

    await getButton(wrapper, "Remove Mens Cotton Jacket").trigger("click");

    expect(wrapper.emitted("remove")).toEqual([["product-3"]]);
  });
});
