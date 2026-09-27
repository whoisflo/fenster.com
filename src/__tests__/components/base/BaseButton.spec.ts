import { afterEach, expect, it, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { h } from "vue";

import BaseButton from "@/components/base/BaseButton.vue";

enableAutoUnmount(afterEach);

function mountButton(
  props: { disabled?: boolean; loading?: boolean; loadingText?: string } = {},
) {
  const onClick = vi.fn();
  const wrapper = mount(BaseButton, {
    props,
    attrs: { onClick },
    slots: { default: "Add Item" },
  });
  return { button: wrapper.get("button"), onClick };
}

it("is a plain button that passes clicks on", async () => {
  const { button, onClick } = mountButton();

  await button.trigger("click");

  expect(button.attributes("type")).toBe("button");
  expect(onClick).toHaveBeenCalledOnce();
});

it.each([
  [{ disabled: true }, "Add Item"],
  [{ loading: true, loadingText: "Adding…" }, "Adding…"],
])(
  "with %o it stays focusable but unavailable and ignores clicks",
  async (props, label) => {
    const { button, onClick } = mountButton(props);

    await button.trigger("click");

    expect(button.text()).toBe(label);
    expect(button.attributes("aria-disabled")).toBe("true");
    expect(button.element.disabled).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  },
);

it.each([
  [false, 1],
  [true, 0],
])(
  "with loading %s it submits its form %i time(s)",
  async (loading, submits) => {
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    const wrapper = mount(
      {
        render: () =>
          h("form", { onSubmit }, [
            h(BaseButton, { type: "submit", loading }, () => "Calculate"),
          ]),
      },
      { attachTo: document.body },
    );

    await wrapper.get("button").trigger("click");

    expect(onSubmit).toHaveBeenCalledTimes(submits);
  },
);
