import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CartPage from "@/components/CartPage.vue";
import CartActions from "@/components/cart/CartActions.vue";
import CartTable from "@/components/cart/CartTable.vue";
import CartTotals from "@/components/cart/CartTotals.vue";
import ShippingCalculator from "@/components/cart/ShippingCalculator.vue";

describe("CartPage", () => {
  it("is the main content of the page, titled Shopping Cart", () => {
    const wrapper = mount(CartPage);

    expect(wrapper.get("main h1").text()).toContain("Shopping Cart");
  });

  it("shows how many items are in the cart", () => {
    const wrapper = mount(CartPage);

    expect(wrapper.get("h1").text()).toContain("(5 items)");
  });

  it("shows the cart, its actions, the totals and the shipping calculator", () => {
    const wrapper = mount(CartPage);

    for (const section of [
      CartTable,
      CartActions,
      CartTotals,
      ShippingCalculator,
    ]) {
      expect(wrapper.findComponent(section).exists()).toBe(true);
    }
  });

  it("totals the cart lines", () => {
    const wrapper = mount(CartPage);

    expect(wrapper.text()).toContain("$899.23");
    expect(wrapper.text()).toContain("$179.85");
    expect(wrapper.text()).toContain("$1,079.08");
  });
});
