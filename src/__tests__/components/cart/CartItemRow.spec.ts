import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CartItemRow from "@/components/cart/CartItemRow.vue";
import { cartItem, sampleAddedItem } from "@/__tests__/fixtures/cartItems";
import { getButton } from "@/__tests__/helpers";

describe("CartItemRow", () => {
  it("shows the product title and details", () => {
    const wrapper = mount(CartItemRow, { props: { item: cartItem() } });

    expect(wrapper.text()).toContain("Mens Cotton Jacket");
    expect(wrapper.text()).toContain("Category: men's clothing");
    expect(wrapper.text()).toContain("Rating: 4.7 (500 reviews)");
  });

  it("shows the unit price and the line total", () => {
    const wrapper = mount(CartItemRow, {
      props: { item: cartItem({ quantity: 2 }) },
    });

    expect(wrapper.text()).toContain("$55.99");
    expect(wrapper.text()).toContain("$111.98");
  });

  it("hides details the product does not have", () => {
    const wrapper = mount(CartItemRow, { props: { item: sampleAddedItem() } });

    expect(wrapper.text()).not.toContain("Category");
    expect(wrapper.text()).not.toContain("Rating");
  });

  it("names each cell for screen readers", () => {
    const wrapper = mount(CartItemRow, { props: { item: cartItem() } });

    expect(wrapper.text()).toContain("Price");
    expect(wrapper.text()).toContain("Quantity");
    expect(wrapper.text()).toContain("Total");
  });

  it("shows the quantity in the stepper", () => {
    const wrapper = mount(CartItemRow, {
      props: { item: cartItem({ quantity: 2 }) },
    });

    expect(wrapper.get("input").element.value).toBe("2");
  });

  it("asks to remove the line when ✕ is clicked", async () => {
    const wrapper = mount(CartItemRow, { props: { item: cartItem() } });

    await getButton(wrapper, "Remove Mens Cotton Jacket").trigger("click");

    expect(wrapper.emitted("remove")).toEqual([[]]);
  });

  it("asks for a new quantity when the stepper changes", async () => {
    const wrapper = mount(CartItemRow, {
      props: { item: cartItem({ quantity: 2 }) },
    });

    await getButton(wrapper, "Increase quantity of Mens Cotton Jacket").trigger(
      "click",
    );

    expect(wrapper.emitted("updateQuantity")).toEqual([[3]]);
  });
});
