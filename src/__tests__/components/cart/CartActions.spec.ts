import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CartActions from "@/components/cart/CartActions.vue";
import { getButton } from "@/__tests__/helpers";

describe("CartActions", () => {
  it("asks to add an item", async () => {
    const wrapper = mount(CartActions, {
      props: { adding: false, canClear: true },
    });

    await getButton(wrapper, "Add Item").trigger("click");

    expect(wrapper.emitted("add")).toEqual([[]]);
  });

  it("shows that an item is being added and blocks a second click", () => {
    const wrapper = mount(CartActions, {
      props: { adding: true, canClear: true },
    });

    expect(getButton(wrapper, "Adding…").element.disabled).toBe(true);
  });

  it("asks to clear the cart", async () => {
    const wrapper = mount(CartActions, {
      props: { adding: false, canClear: true },
    });

    await getButton(wrapper, "Clear Cart").trigger("click");

    expect(wrapper.emitted("clear")).toEqual([[]]);
  });

  it("cannot clear a cart that is already empty", () => {
    const wrapper = mount(CartActions, {
      props: { adding: false, canClear: false },
    });

    expect(getButton(wrapper, "Clear Cart").element.disabled).toBe(true);
  });
});
