import { describe, expect, it } from "vitest";
import { nextTick, reactive } from "vue";

import { useFormValidation } from "@/composables/useFormValidation";
import { required, validateFields } from "@/lib/validation";

function setup(initial = { city: "", postalCode: "" }) {
  const values = reactive({ ...initial });
  const validate = (current: typeof values) =>
    validateFields(current, {
      city: [required("Enter a city")],
      postalCode: [required("Enter a postal code")],
    });

  return { values, ...useFormValidation(values, validate) };
}

describe("useFormValidation", () => {
  it("shows no errors before the first submit", () => {
    const { errors } = setup();

    expect(errors.value).toEqual({});
  });

  it("validates every field on submit", () => {
    const { errors, validateAll } = setup();

    expect(validateAll()).toBe(false);
    expect(errors.value).toEqual({
      city: "Enter a city",
      postalCode: "Enter a postal code",
    });
  });

  it("reports a valid form", () => {
    const { errors, validateAll } = setup({
      city: "Stuttgart",
      postalCode: "70173",
    });

    expect(validateAll()).toBe(true);
    expect(errors.value).toEqual({});
  });

  it("does not validate while typing before the first submit", async () => {
    const { values, errors } = setup({
      city: "Stuttgart",
      postalCode: "70173",
    });

    values.city = "";
    await nextTick();

    expect(errors.value).toEqual({});
  });

  it("updates errors while typing after the first submit", async () => {
    const { values, errors, validateAll } = setup();
    validateAll();

    values.city = "Stuttgart";
    await nextTick();

    expect(errors.value).toEqual({ postalCode: "Enter a postal code" });
  });

  it("names the first invalid field in form order", async () => {
    const { values, validateAll, firstInvalidField } = setup();
    validateAll();

    expect(firstInvalidField.value).toBe("city");

    values.city = "Stuttgart";
    await nextTick();

    expect(firstInvalidField.value).toBe("postalCode");
  });

  it("starts over after a reset", async () => {
    const { values, errors, validateAll, reset } = setup();
    validateAll();

    reset();
    values.postalCode = "7";
    await nextTick();

    expect(errors.value).toEqual({});
  });
});
