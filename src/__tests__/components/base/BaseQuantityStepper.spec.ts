import { expect, it } from "vitest";
import { mount, type DOMWrapper, type VueWrapper } from "@vue/test-utils";

import BaseQuantityStepper from "@/components/base/BaseQuantityStepper.vue";

function mountStepper(
  modelValue = 3,
  range: { min?: number; max?: number } = {},
) {
  const wrapper: VueWrapper = mount(BaseQuantityStepper, {
    props: {
      modelValue,
      label: "Wool Beanie",
      ...range,
      "onUpdate:modelValue": (value: number) =>
        wrapper.setProps({ modelValue: value }),
    },
  });
  return {
    wrapper,
    input: wrapper.get("input"),
    decrease: wrapper.get(
      'button[aria-label="Decrease quantity of Wool Beanie"]',
    ),
    increase: wrapper.get(
      'button[aria-label="Increase quantity of Wool Beanie"]',
    ),
    emitted: () => wrapper.emitted("update:modelValue"),
  };
}

const finishEditing = (
  input: Pick<DOMWrapper<HTMLInputElement>, "trigger">,
  how: string,
) =>
  how === "blur"
    ? input.trigger("blur")
    : input.trigger("keydown", { key: how });

it("changes the quantity with − and +, shown in an input named after the product", async () => {
  const { input, decrease, increase, emitted } = mountStepper(3);

  await increase.trigger("click");
  await decrease.trigger("click");
  await decrease.trigger("click");

  expect(input.attributes("aria-label")).toBe("Quantity of Wool Beanie");
  expect(emitted()).toEqual([[4], [3], [2]]);
  expect(input.element.value).toBe("2");
});

it("makes − unavailable at the minimum and + at the maximum", () => {
  const atMinimum = mountStepper(1);
  const atMaximum = mountStepper(99);
  const fixed = mountStepper(5, { min: 5, max: 5 });

  expect(atMinimum.decrease.attributes("aria-disabled")).toBe("true");
  expect(atMinimum.increase.attributes("aria-disabled")).toBeUndefined();
  expect(atMaximum.increase.attributes("aria-disabled")).toBe("true");
  expect(fixed.decrease.attributes("aria-disabled")).toBe("true");
  expect(fixed.increase.attributes("aria-disabled")).toBe("true");
});

it.each([
  ["7", "blur", 7],
  ["8", "Enter", 8],
  ["150", "blur", 99],
  ["0", "blur", 1],
])('commits "%s" on %s as %i', async (text, how, quantity) => {
  const { input, emitted } = mountStepper(3);

  await input.setValue(text);
  await finishEditing(input, how);

  expect(emitted()).toEqual([[quantity]]);
  expect(input.element.value).toBe(String(quantity));
});

it.each([
  ["abc", "blur"],
  ["7", "Escape"],
])('reverts "%s" on %s', async (text, how) => {
  const { input, emitted } = mountStepper(3);

  await input.setValue(text);
  await finishEditing(input, how);

  expect(emitted()).toBeUndefined();
  expect(input.element.value).toBe("3");
});

it("explains invalid text until it is fixed", async () => {
  const { wrapper, input } = mountStepper(3);

  await input.setValue("abc");

  expect(input.attributes("aria-invalid")).toBe("true");
  expect(wrapper.get(`#${input.attributes("aria-describedby")}`).text()).toBe(
    "Whole numbers only",
  );

  await input.setValue("5");

  expect(input.attributes("aria-invalid")).toBeUndefined();
});

it("follows quantity changes from the parent", async () => {
  const { wrapper, input } = mountStepper(3);

  await wrapper.setProps({ modelValue: 5 });

  expect(input.element.value).toBe("5");
});
