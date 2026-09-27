import { expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import BaseTextField from "@/components/base/BaseTextField.vue";

it("keeps a hidden label for screen readers and links errors to the field", async () => {
  const wrapper = mount(BaseTextField, {
    props: { modelValue: "", label: "City", hideLabel: true },
  });
  const input = wrapper.get("input");
  const label = wrapper.get("label");

  expect(label.attributes("for")).toBe(input.attributes("id"));
  expect(label.classes()).toContain("sr-only");
  expect(input.attributes("aria-invalid")).toBeUndefined();

  await wrapper.setProps({ error: "Enter a city" });

  expect(input.attributes("aria-invalid")).toBe("true");
  expect(wrapper.get(`#${input.attributes("aria-describedby")}`).text()).toBe(
    "Enter a city",
  );
});
