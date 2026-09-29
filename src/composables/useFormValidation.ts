import { computed, shallowRef } from "vue";

import type { FieldErrors } from "@/lib/validation";

export function useFormValidation<
  Values extends { [K in keyof Values]: string },
>(
  values: Values,
  validate: (values: Values) => FieldErrors<keyof Values & string>,
) {
  type Field = keyof Values & string;

  const submitted = shallowRef(false);
  const errors = computed<FieldErrors<Field>>(() =>
    submitted.value ? validate(values) : {},
  );

  function validateAll(): boolean {
    submitted.value = true;
    return Object.keys(errors.value).length === 0;
  }

  const firstInvalidField = computed(() =>
    (Object.keys(values) as Field[]).find((field) => errors.value[field]),
  );

  return { errors, validateAll, firstInvalidField };
}
