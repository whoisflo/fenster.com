import { expect, it } from "vitest";
import { nextTick, reactive } from "vue";

import { useFormValidation } from "@/composables/useFormValidation";
import { required, validateFields } from "@/lib/validation";

function setup() {
  const values = reactive({ city: "", postalCode: "" });
  const validation = useFormValidation(values, (current) =>
    validateFields(current, {
      city: [required("Enter a city")],
      postalCode: [required("Enter a postal code")],
    }),
  );
  return { values, ...validation };
}

it("shows no errors until the first submit, which checks every field", async () => {
  const { values, errors, validateAll } = setup();

  values.postalCode = "70173";
  await nextTick();
  expect(errors.value).toEqual({});

  expect(validateAll()).toBe(false);
  expect(errors.value).toEqual({ city: "Enter a city" });

  values.city = "Stuttgart";
  expect(validateAll()).toBe(true);
});

it("updates errors while typing after a submit, in form order", async () => {
  const { values, errors, validateAll, firstInvalidField } = setup();
  validateAll();
  expect(firstInvalidField.value).toBe("city");

  values.city = "Stuttgart";
  await nextTick();

  expect(errors.value).toEqual({ postalCode: "Enter a postal code" });
  expect(firstInvalidField.value).toBe("postalCode");
});
