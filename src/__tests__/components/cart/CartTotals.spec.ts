import { expect, it } from "vitest";
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

it("shows subtotal, shipping, tax and an announced total", () => {
  const wrapper = mount(CartTotals, { props: totals });

  expect(valueOf(wrapper, "Subtotal").text()).toBe("$242.20");
  expect(valueOf(wrapper, "Shipping").text()).toBe("$12.00");
  expect(valueOf(wrapper, "Tax (20%)").text()).toBe("$48.44");
  expect(valueOf(wrapper, "Total").text()).toBe("$302.64");
  expect(valueOf(wrapper, "Total").attributes("aria-live")).toBe("polite");
});

it("shows a dash until shipping is calculated", () => {
  const wrapper = mount(CartTotals, {
    props: { ...totals, shippingCents: null },
  });

  expect(valueOf(wrapper, "Shipping").text()).toBe("—");
});

it("blocks checkout for an empty cart", () => {
  const wrapper = mount(CartTotals, {
    props: { ...totals, checkoutDisabled: true },
  });

  expect(
    getButton(wrapper, "Proceed To Checkout").attributes("aria-disabled"),
  ).toBe("true");
});
