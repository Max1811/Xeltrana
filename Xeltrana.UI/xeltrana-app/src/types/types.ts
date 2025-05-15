export const UserRoles = {
  Admin: 1,
  Client: 2,
};

export enum SizeType {
  Alpha = 1,
  Numeric = 2,
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

export interface Product {
  id: number;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  categoryId: number;
  categoryName: string;
  audienceId: number;
  images: string[];
  productVariants: ProductVariant[];
}

export interface ProductVariant {
  colorId: number;
  color?: Color;
  productSizes: ProductSize[];
}

export interface ProductSize {
  size: string;
  sizeId: SizeType;
  quantity: number;
}

export interface Color {
  id: number;
  name: string;
  hex: string;
}

// interface CreateProductRequest {
//   name: string;
//   description: string;
//   price: number;
//   categoryId: number;
//   audienceId: number;
//   tempRef: string;
//   productVariants: ProductVariant[];
// }
