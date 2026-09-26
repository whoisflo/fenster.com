import { afterEach, describe, expect, it } from "vitest";
import { enableAutoUnmount, mount, type VueWrapper } from "@vue/test-utils";

import ShippingCalculator from "@/components/cart/ShippingCalculator.vue";
import { getButton } from "@/__tests__/helpers";

enableAutoUnmount(afterEach);

const quote = {
  destination: {
    city: "Stuttgart",
    address: "Königstraße 1",
    postalCode: "70173",
  },
  costCents: 1200,
};

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

describe("ShippingCalculator", () => {
  it("is a panel named Calculate Shipping", () => {
    const wrapper = mountCalculator();

    expect(wrapper.get("h2").text()).toBe("Calculate Shipping");
  });

  it("has a labelled field for city, address and postal code", () => {
    const wrapper = mountCalculator();

    expect(wrapper.findAll("label").map((label) => label.text())).toEqual([
      "City",
      "Address",
      "Postal code",
    ]);
  });

  it("shows what is missing when submitted empty", async () => {
    const wrapper = mountCalculator();

    await wrapper.get("form").trigger("submit");

    expect(wrapper.text()).toContain("Enter a city");
    expect(wrapper.text()).toContain("Enter an address");
    expect(wrapper.text()).toContain("Enter a postal code");
    expect(wrapper.emitted("calculate")).toBeUndefined();
  });

  it("moves focus to the first invalid field", async () => {
    const wrapper = mountCalculator();
    await field(wrapper, "City").setValue("Stuttgart");

    await wrapper.get("form").trigger("submit");

    expect(document.activeElement).toBe(field(wrapper, "Address").element);
  });

  it("clears an error as soon as the field is fixed", async () => {
    const wrapper = mountCalculator();
    await wrapper.get("form").trigger("submit");

    await field(wrapper, "City").setValue("Stuttgart");

    expect(wrapper.text()).not.toContain("Enter a city");
    expect(wrapper.text()).toContain("Enter an address");
  });

  it("sends the trimmed destination when the form is valid", async () => {
    const wrapper = mountCalculator();
    await field(wrapper, "City").setValue("  Stuttgart ");
    await field(wrapper, "Address").setValue("Königstraße 1");
    await field(wrapper, "Postal code").setValue("70173");

    await wrapper.get("form").trigger("submit");

    expect(wrapper.emitted("calculate")).toEqual([[quote.destination]]);
  });

  it("shows the calculated shipping", () => {
    const wrapper = mountCalculator({ quote });

    expect(wrapper.text()).toContain("Shipping to Stuttgart 70173: $12.00");
  });

  it("shows that shipping is being calculated", () => {
    const wrapper = mountCalculator({ loading: true });

    expect(getButton(wrapper, "Calculating…").element.disabled).toBe(true);
  });

  it("is disabled with a hint while the cart is empty", () => {
    const wrapper = mountCalculator({ disabled: true, quote });

    expect(wrapper.get("fieldset").element.disabled).toBe(true);
    expect(wrapper.text()).toContain("Add items to calculate shipping.");
    expect(wrapper.text()).not.toContain("Shipping to");
  });
});
