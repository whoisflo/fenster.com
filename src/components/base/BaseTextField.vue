<script setup lang="ts">
import { useId, useTemplateRef, type InputHTMLAttributes } from "vue";

defineProps<{
  label: string;
  hideLabel?: boolean;
  placeholder?: string;
  error?: string | null;
  autocomplete?: InputHTMLAttributes["autocomplete"];
  inputmode?: InputHTMLAttributes["inputmode"];
}>();

const value = defineModel<string>({ required: true });

const inputId = useId();
const errorId = useId();
const inputEl = useTemplateRef<HTMLInputElement>("input");

defineExpose({
  focus: () => inputEl.value?.focus(),
});
</script>

<template>
  <div>
    <label
      :for="inputId"
      :class="hideLabel ? 'sr-only' : 'mb-1 block text-sm font-bold text-navy'"
    >
      {{ label }}
    </label>
    <input
      :id="inputId"
      ref="input"
      v-model="value"
      type="text"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
      class="w-full border-b bg-transparent py-2 text-navy outline-hidden transition placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
      :class="
        error
          ? 'border-red-600 focus:shadow-[0_1px_0_0_var(--color-red-600)]'
          : 'border-field-line focus:border-navy focus:shadow-[0_1px_0_0_var(--color-navy)]'
      "
    />
    <p v-if="error" :id="errorId" class="mt-1 text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template>
