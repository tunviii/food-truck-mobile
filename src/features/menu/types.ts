export type MenuCategory = string;

export type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  isVeg: boolean;
  isSpicy: boolean;
  prepTimeMinutes: number;
  isAvailable: boolean;
};

export type MenuItemInput = {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isVeg: boolean;
  isSpicy: boolean;
  prepTimeMinutes: number;
  isAvailable: boolean;
};
