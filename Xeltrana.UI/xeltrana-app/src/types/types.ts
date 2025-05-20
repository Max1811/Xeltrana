export const UserRoles = {
  Admin: 1,
  Client: 2,
};

export enum SizeType {
  Alpha = 1,
  Numeric = 2,
}

export const Gender = {
  Male: "male",
  Female: "female",
};

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

export interface ProductVariant {
  colorId: number;
  sizeId: number;
  stockQuantity: number;
}

export interface ViewProductVariant {
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
  hex: string;
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
