import { expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CartItemRow from "@/components/cart/CartItemRow.vue";
import { cartItem, sampleAddedItem } from "@/__tests__/fixtures/cartItems";

it("shows a placeholder, the product details, price, quantity and line total", () => {
  const wrapper = mount(CartItemRow, {
    props: { item: cartItem({ quantity: 2 }) },
  });
  const text = wrapper.text();

  expect(wrapper.find("img").exists()).toBe(false);
  expect(wrapper.find('.bg-placeholder[aria-hidden="true"]').exists()).toBe(
    true,
  );
  expect(text).toContain("Mens Cotton Jacket");
  expect(text).toContain("Category: men's clothing");
  expect(text).toContain("Rating: 4.7 (500 reviews)");
  expect(text).toContain("$55.99");
  expect(text).toContain("$111.98");
  expect(wrapper.get("input").element.value).toBe("2");
});

it("leaves out details an added product does not have", () => {
  const wrapper = mount(CartItemRow, { props: { item: sampleAddedItem() } });

  expect(wrapper.text()).not.toContain("Category");
  expect(wrapper.text()).not.toContain("Rating");
});
