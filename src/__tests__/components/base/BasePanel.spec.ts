import { expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import BasePanel from "@/components/base/BasePanel.vue";

it("is a section named by its heading, around its content", () => {
  const wrapper = mount(BasePanel, {
    props: { title: "Cart Totals" },
    slots: { default: "<p>Subtotal</p>" },
  });
  const heading = wrapper.get("h2");

  expect(heading.text()).toBe("Cart Totals");
  expect(wrapper.get("section").attributes("aria-labelledby")).toBe(
    heading.attributes("id"),
  );
  expect(wrapper.get("section p").text()).toBe("Subtotal");
});
