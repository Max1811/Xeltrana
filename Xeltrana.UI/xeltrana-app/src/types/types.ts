export const UserRoles = {
  Admin: 1,
  Client: 2,
};

export const Gender = {
  Male: "male",
  Female: "female",
};

export enum SizeType {
  Clothes = 0,
  Shoes = 1,
  Accessories = 2,
}

export interface User {
  id: number;
  name: string;
  userRole: UserRole;
}

export interface UserRole {
  id: number;
  role: string;
}

export interface Product extends BaseProduct {
  productVariants: ProductVariant[];
}

export interface ViewProduct extends BaseProduct {
  productVariants: ViewProductVariant[];
}

interface BaseProduct {
  id: number;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  categoryId: number;
  categoryName: string;
  audienceId: number;
  images: string[];
}

export interface ProductVariantCreate {
  availableItems: ColorCreate[];
}

interface ColorCreate {
  color: string;
  colorId: number;
  hexCode: string;
  sizes: ProductSizeCreate[];
}

interface ProductSizeCreate {
  sizeId: number;
  size: string;
  stockAmount: number;
}

export interface ProductVariant {
  colorId: number;
  color?: string;
  hexCode?: string;
  sizeId: number;
  size?: string;
  stockQuantity: number;
}

export interface ViewProductVariant {
  id: number;
  color: string;
  colorId: number;
  hexCode: string;
  size: string;
  sizeId: number;
}

export interface ProductSize {
  name: string;
  id: SizeType;
  type: number;
}

export interface Color {
  id: number;
  name: string;
  hexCode: string;
}
