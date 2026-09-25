import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import ProductImage from "@/components/cart/ProductImage.vue";

describe("ProductImage", () => {
  it("shows the product image", () => {
    const wrapper = mount(ProductImage, {
      props: { src: "https://example.com/bag.png", alt: "Canvas Tote Bag" },
    });

    const image = wrapper.get("img");
    expect(image.attributes("src")).toBe("https://example.com/bag.png");
    expect(image.attributes("alt")).toBe("Canvas Tote Bag");
  });

  it("shows a placeholder when there is no image", () => {
    const wrapper = mount(ProductImage, {
      props: { src: null, alt: "Canvas Tote Bag" },
    });

    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("Canvas Tote Bag");
  });

  it("falls back to the placeholder when the image fails to load", async () => {
    const wrapper = mount(ProductImage, {
      props: { src: "https://example.com/broken.png", alt: "Canvas Tote Bag" },
    });

    await wrapper.get("img").trigger("error");

    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.attributes("role")).toBe("img");
  });

  it("tries again when it gets a new image", async () => {
    const wrapper = mount(ProductImage, {
      props: { src: "https://example.com/broken.png", alt: "Canvas Tote Bag" },
    });
    await wrapper.get("img").trigger("error");

    await wrapper.setProps({ src: "https://example.com/bag.png" });

    expect(wrapper.get("img").attributes("src")).toBe(
      "https://example.com/bag.png",
    );
  });

  it("hides a decorative placeholder from screen readers", () => {
    const wrapper = mount(ProductImage, { props: { src: null, alt: "" } });

    expect(wrapper.attributes("aria-hidden")).toBe("true");
    expect(wrapper.attributes("role")).toBeUndefined();
  });
});
