import type { DOMWrapper, VueWrapper } from "@vue/test-utils";

export function getButton(
  wrapper: VueWrapper,
  name: string,
): DOMWrapper<HTMLButtonElement> {
  const button = wrapper
    .findAll("button")
    .find(
      (candidate) =>
        candidate.text() === name ||
        candidate.attributes("aria-label") === name,
    );

  if (!button) throw new Error(`No button named "${name}"`);
  return button;
}
