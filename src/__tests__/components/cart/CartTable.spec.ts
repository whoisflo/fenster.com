import { afterEach, expect, it } from "vitest";
import {
  enableAutoUnmount,
  flushPromises,
  mount,
  type VueWrapper,
} from "@vue/test-utils";

import CartItemRow from "@/components/cart/CartItemRow.vue";
import CartItemSkeleton from "@/components/cart/CartItemSkeleton.vue";
import CartTable from "@/components/cart/CartTable.vue";
import type { CartItem, LoadStatus } from "@/types/cart";
import {
  sampleAddedItem,
  sampleCartItems,
} from "@/__tests__/fixtures/cartItems";
import { getButton } from "@/__tests__/helpers";

enableAutoUnmount(afterEach);

function mountTable(items: CartItem[], status: LoadStatus = "success") {
  let current = items;
  const wrapper: VueWrapper = mount(CartTable, {
    props: {
      items,
      status,
      onRemove: (key: string) => {
        current = current.filter((item) => item.key !== key);
        return wrapper.setProps({ items: current });
      },
    },
    attachTo: document.body,
  });
  return wrapper;
}

it("lists one line per item", () => {
  const wrapper = mountTable(sampleCartItems());

  expect(wrapper.get("ul").attributes("aria-label")).toBe("Cart items");
  expect(wrapper.findAllComponents(CartItemRow)).toHaveLength(5);
  expect(wrapper.findAllComponents(CartItemSkeleton)).toHaveLength(0);
});

it.each(["idle", "loading"] as const)(
  "shows five hidden skeletons above existing lines while %s",
  (status) => {
    const wrapper = mountTable([sampleAddedItem()], status);
    const skeletons = wrapper.findAllComponents(CartItemSkeleton);

    expect(skeletons).toHaveLength(5);
    expect(skeletons.every((s) => s.attributes("aria-hidden") === "true")).toBe(
      true,
    );
    expect(wrapper.findAllComponents(CartItemRow)).toHaveLength(1);
    expect(wrapper.get("ul").attributes("aria-busy")).toBe("true");
  },
);

it("reports a failed load and offers a retry, without calling the cart empty", async () => {
  const wrapper = mountTable([], "error");

  expect(wrapper.get('[role="alert"]').text()).toContain(
    "We couldn't load your products.",
  );
  expect(wrapper.text()).not.toContain("Your cart is empty.");

  await getButton(wrapper, "Try again").trigger("click");

  expect(wrapper.emitted("retry")).toEqual([[]]);
});

it("shows the empty state when there is nothing to list", () => {
  const wrapper = mountTable([]);

  expect(wrapper.get('[role="status"]').text()).toContain(
    "Your cart is empty.",
  );
  expect(wrapper.find("ul").exists()).toBe(false);
});

it("passes quantity changes and removals on with the item key", async () => {
  const wrapper = mountTable(sampleCartItems());

  await getButton(wrapper, "Increase quantity of Mens Cotton Jacket").trigger(
    "click",
  );
  await getButton(wrapper, "Remove Mens Cotton Jacket").trigger("click");

  expect(wrapper.emitted("updateQuantity")).toEqual([["product-3", 2]]);
  expect(wrapper.emitted("remove")).toEqual([["product-3"]]);
});

it("moves focus to the next line after a removal, or the previous one at the end", async () => {
  const wrapper = mountTable(sampleCartItems());
  const remove = (title: string) => getButton(wrapper, `Remove ${title}`);

  await remove("Mens Cotton Jacket").trigger("click");
  await flushPromises();
  expect(document.activeElement).toBe(remove("Mens Casual Slim Fit").element);

  remove("Mens Casual Premium Slim Fit T-Shirts").element.focus();
  await remove(
    "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
  ).trigger("click");
  await flushPromises();
  expect(document.activeElement).toBe(remove("Mens Casual Slim Fit").element);
});
