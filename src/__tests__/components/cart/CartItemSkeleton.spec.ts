import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CartItemSkeleton from "@/components/cart/CartItemSkeleton.vue";

describe("CartItemSkeleton", () => {
  it("is a list item, so it can stand in for a cart line", () => {
    const wrapper = mount(CartItemSkeleton);

    expect(wrapper.element.tagName).toBe("LI");
  });

  it("is hidden from screen readers", () => {
    const wrapper = mount(CartItemSkeleton);

    expect(wrapper.attributes("aria-hidden")).toBe("true");
  });
});
