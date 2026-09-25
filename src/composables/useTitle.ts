import { watchEffect, type Ref } from 'vue'

/** Keeps document.title in sync with a reactive source. */
export function useTitle(title: Ref<string>) {
  watchEffect(() => {
    document.title = title.value
  })
}
