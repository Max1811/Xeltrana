import { ProductVariantCreate, ProductVariant } from "../../types/types";

export function mapProductVariantCreateToVariants(
  productVariantCreate: ProductVariantCreate
): ProductVariant[] {
  const variants: ProductVariant[] = [];

  for (const color of productVariantCreate.availableItems) {
    for (const size of color.sizes) {
      variants.push({
        colorId: color.colorId,
        sizeId: size.sizeId,
        stockQuantity: size.stockAmount,
      });
    }
  }

  return variants;
}

export function mapVariantsToProductVariantCreate(
  variants: ProductVariant[]
): ProductVariantCreate {
  const colorMap = new Map<
    number,
    {
      colorId: number;
      color: string;
      hexCode: string;
      sizes: { sizeId: number; size: string; stockAmount: number }[];
    }
  >();

  for (const variant of variants) {
    if (!colorMap.has(variant.colorId)) {
      colorMap.set(variant.colorId, {
        colorId: variant.colorId,
        sizes: [],
        color: variant.color ?? "",
        hexCode: variant.hexCode ?? "",
      });
    }

    const colorEntry = colorMap.get(variant.colorId)!;
    colorEntry.sizes.push({
      sizeId: variant.sizeId,
      stockAmount: variant.stockQuantity,
      size: variant.size ?? "",
    });
  }

  return {
    availableItems: Array.from(colorMap.values()),
  };
}
