import { expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CartItemRow from "@/components/cart/CartItemRow.vue";
import { cartItem } from "@/__tests__/fixtures/cartItems";

it("shows a placeholder, the title, price, quantity and line total", () => {
  const wrapper = mount(CartItemRow, {
    props: { item: cartItem({ quantity: 2 }) },
  });
  const text = wrapper.text();

  expect(wrapper.find("img").exists()).toBe(false);
  expect(wrapper.find('.bg-placeholder[aria-hidden="true"]').exists()).toBe(
    true,
  );
  expect(text).toContain("Mens Cotton Jacket");
  expect(text).toContain("$55.99");
  expect(text).toContain("$111.98");
  expect(wrapper.get("input").element.value).toBe("2");
});
