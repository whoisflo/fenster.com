import { expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CartItemRow from "@/components/cart/CartItemRow.vue";
import { cartItem, sampleAddedItem } from "@/__tests__/fixtures/cartItems";

it("shows the image, title, price, quantity and line total", () => {
  const wrapper = mount(CartItemRow, {
    props: { item: cartItem({ quantity: 2 }) },
  });
  const text = wrapper.text();

  expect(wrapper.get("img").attributes()).toMatchObject({
    src: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    alt: "",
  });
  expect(text).toContain("Mens Cotton Jacket");
  expect(text).toContain("$55.99");
  expect(text).toContain("$111.98");
  expect(wrapper.get("input").element.value).toBe("2");
});

it("shows a placeholder when there is no image or it fails to load", async () => {
  const withoutImage = mount(CartItemRow, {
    props: { item: sampleAddedItem() },
  });
  const failedImage = mount(CartItemRow, { props: { item: cartItem() } });
  await failedImage.get("img").trigger("error");

  for (const wrapper of [withoutImage, failedImage]) {
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.find('.bg-placeholder[aria-hidden="true"]').exists()).toBe(
      true,
    );
  }
});
