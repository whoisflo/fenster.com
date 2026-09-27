import { computed, shallowRef, watch } from "vue";

import type { FieldErrors } from "@/lib/validation";

export function useFormValidation<
  Values extends { [K in keyof Values]: string },
>(
  values: Values,
  validate: (values: Values) => FieldErrors<keyof Values & string>,
) {
  type Field = keyof Values & string;

  const errors = shallowRef<FieldErrors<Field>>({});
  let submitted = false;

  // Nobody sees errors before the first submit; from then on they follow every change.
  watch(
    () => ({ ...values }),
    () => {
      if (submitted) errors.value = validate(values);
    },
  );

  function validateAll(): boolean {
    submitted = true;
    errors.value = validate(values);
    return Object.keys(errors.value).length === 0;
  }

  const firstInvalidField = computed(() =>
    (Object.keys(values) as Field[]).find((field) => errors.value[field]),
  );

  return { errors, validateAll, firstInvalidField };
}
