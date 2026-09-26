import { describe, expect, it } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";

import CartTotals from "@/components/cart/CartTotals.vue";
import { getButton } from "@/__tests__/helpers";

const totals = {
  subtotalCents: 24220,
  shippingCents: 1200,
  taxCents: 4844,
  totalCents: 30264,
  checkoutDisabled: false,
};

function valueOf(wrapper: VueWrapper, label: string) {
  const row = wrapper
    .findAll("dl > div")
    .find((candidate) => candidate.get("dt").text() === label);
  if (!row) throw new Error(`No row labelled "${label}"`);
  return row.get("dd");
}

describe("CartTotals", () => {
  it("is a panel named Cart Totals", () => {
    const wrapper = mount(CartTotals, { props: totals });

    expect(wrapper.get("h2").text()).toBe("Cart Totals");
  });

  it("shows subtotal, shipping, tax and total", () => {
    const wrapper = mount(CartTotals, { props: totals });

    expect(valueOf(wrapper, "Subtotal").text()).toBe("$242.20");
    expect(valueOf(wrapper, "Shipping").text()).toBe("$12.00");
    expect(valueOf(wrapper, "Tax (20%)").text()).toBe("$48.44");
    expect(valueOf(wrapper, "Total").text()).toBe("$302.64");
  });

  it("shows a dash until shipping is calculated", () => {
    const wrapper = mount(CartTotals, {
      props: { ...totals, shippingCents: null },
    });

    expect(valueOf(wrapper, "Shipping").text()).toBe("—");
  });

  it("announces changes to the total", () => {
    const wrapper = mount(CartTotals, { props: totals });

    expect(valueOf(wrapper, "Total").attributes("aria-live")).toBe("polite");
  });

  it("asks to check out", async () => {
    const wrapper = mount(CartTotals, { props: totals });

    await getButton(wrapper, "Proceed To Checkout").trigger("click");

    expect(wrapper.emitted("checkout")).toEqual([[]]);
  });

  it("cannot check out an empty cart", () => {
    const wrapper = mount(CartTotals, {
      props: { ...totals, checkoutDisabled: true },
    });

    expect(getButton(wrapper, "Proceed To Checkout").element.disabled).toBe(
      true,
    );
  });
});
