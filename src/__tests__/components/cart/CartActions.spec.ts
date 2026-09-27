import { expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CartActions from "@/components/cart/CartActions.vue";
import { getButton } from "@/__tests__/helpers";

it("blocks Add Item while adding and Clear Cart while the cart is empty", () => {
  const wrapper = mount(CartActions, {
    props: { adding: true, canClear: false },
  });

  expect(getButton(wrapper, "Adding…").attributes("aria-disabled")).toBe(
    "true",
  );
  expect(getButton(wrapper, "Clear Cart").attributes("aria-disabled")).toBe(
    "true",
  );
});
