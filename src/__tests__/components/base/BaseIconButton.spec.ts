import { expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

import BaseIconButton from "@/components/base/BaseIconButton.vue";

it("is named by its label and shows only a decorative icon", () => {
  const wrapper = mount(BaseIconButton, {
    props: { icon: "close", label: "Remove Wool Beanie" },
  });

  const button = wrapper.get("button");
  expect(button.attributes("aria-label")).toBe("Remove Wool Beanie");
  expect(button.get("svg").attributes("aria-hidden")).toBe("true");
  expect(button.text()).toBe("");
});

it.each([
  [false, undefined, 1],
  [true, "true", 0],
])(
  "with disabled %s it stays focusable and passes on the right clicks",
  async (disabled, ariaDisabled, clicks) => {
    const onClick = vi.fn();
    const wrapper = mount(BaseIconButton, {
      props: { icon: "minus", label: "Decrease quantity", disabled },
      attrs: { onClick },
    });
    const button = wrapper.get("button");

    await button.trigger("click");

    expect(button.element.disabled).toBe(false);
    expect(button.attributes("aria-disabled")).toBe(ariaDisabled);
    expect(onClick).toHaveBeenCalledTimes(clicks);
  },
);
