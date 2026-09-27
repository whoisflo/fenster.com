import { afterEach, expect, it } from "vitest";
import { enableAutoUnmount, mount, type VueWrapper } from "@vue/test-utils";

import ShippingCalculator from "@/components/cart/ShippingCalculator.vue";
import { getButton } from "@/__tests__/helpers";

enableAutoUnmount(afterEach);

function mountCalculator(props = {}) {
  return mount(ShippingCalculator, {
    props: { quote: null, loading: false, disabled: false, ...props },
    attachTo: document.body,
  });
}

function field(wrapper: VueWrapper, label: string) {
  const labelElement = wrapper
    .findAll("label")
    .find((candidate) => candidate.text() === label);
  if (!labelElement) throw new Error(`No field labelled "${label}"`);
  return wrapper.get<HTMLInputElement>(`#${labelElement.attributes("for")}`);
}

it("explains what is missing and moves focus to the first problem", async () => {
  const wrapper = mountCalculator();
  await field(wrapper, "City").setValue("Stuttgart");

  await wrapper.get("form").trigger("submit");

  expect(wrapper.text()).toContain("Enter an address");
  expect(wrapper.text()).toContain("Enter a postal code");
  expect(document.activeElement).toBe(field(wrapper, "Address").element);
  expect(wrapper.emitted("calculate")).toBeUndefined();
});

it("sends the trimmed destination when the form is valid", async () => {
  const wrapper = mountCalculator();
  await field(wrapper, "City").setValue("  Stuttgart ");
  await field(wrapper, "Address").setValue("Königstraße 1");
  await field(wrapper, "Postal code").setValue("70173");

  await wrapper.get("form").trigger("submit");

  expect(wrapper.emitted("calculate")).toEqual([
    [{ city: "Stuttgart", address: "Königstraße 1", postalCode: "70173" }],
  ]);
});

it("shows that shipping is being calculated", () => {
  const wrapper = mountCalculator({ loading: true });

  expect(getButton(wrapper, "Calculating…").attributes("aria-disabled")).toBe(
    "true",
  );
});

it("is disabled with a hint, and hides an old quote, while the cart is empty", () => {
  const wrapper = mountCalculator({
    disabled: true,
    quote: {
      destination: {
        city: "Stuttgart",
        address: "Königstraße 1",
        postalCode: "70173",
      },
      costCents: 1200,
    },
  });

  expect(wrapper.get("fieldset").element.disabled).toBe(true);
  expect(wrapper.text()).toContain("Add items to calculate shipping.");
  expect(wrapper.text()).not.toContain("Shipping to");
});
