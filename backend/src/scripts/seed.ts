import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../config/db";
import { MenuItem } from "../models/MenuItem";
import { User, type UserRole } from "../models/User";

const defaultPassword = "Password@123";

const users: Array<{
  name: string;
  email: string;
  role: UserRole;
}> = [
  {
    name: "Admin User",
    email: "admin@foodtruck.test",
    role: "admin",
  },
  {
    name: "Kitchen User",
    email: "kitchen@foodtruck.test",
    role: "kitchen",
  },
];

const menuItems = [
  {
    name: "Paneer Tikka Wrap",
    description: "Grilled paneer, crunchy onions, mint chutney, and soft roti.",
    price: 149,
    category: "mains",
    isVeg: true,
    isSpicy: true,
    prepTimeMinutes: 12,
    isAvailable: true,
  },
  {
    name: "Loaded Masala Fries",
    description: "Crispy fries tossed with house masala and cheese sauce.",
    price: 119,
    category: "snacks",
    isVeg: true,
    isSpicy: true,
    prepTimeMinutes: 8,
    isAvailable: true,
  },
  {
    name: "Chicken Kathi Roll",
    description: "Juicy chicken, egg layer, onions, and tangy street-style sauce.",
    price: 169,
    category: "mains",
    isVeg: false,
    isSpicy: true,
    prepTimeMinutes: 14,
    isAvailable: true,
  },
  {
    name: "Classic Lemon Iced Tea",
    description: "Fresh brewed tea with lemon and a light sugar finish.",
    price: 79,
    category: "drinks",
    isVeg: true,
    isSpicy: false,
    prepTimeMinutes: 3,
    isAvailable: true,
  },
  {
    name: "Gulab Jamun Cup",
    description: "Warm gulab jamun served with a little rabri drizzle.",
    price: 89,
    category: "desserts",
    isVeg: true,
    isSpicy: false,
    prepTimeMinutes: 4,
    isAvailable: true,
  },
  {
    name: "Roll + Fries Combo",
    description: "Any signature roll with masala fries for a quick pickup meal.",
    price: 229,
    category: "combos",
    isVeg: false,
    isSpicy: true,
    prepTimeMinutes: 15,
    isAvailable: true,
  },
] as const;

async function seedUsers() {
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  for (const user of users) {
    await User.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          name: user.name,
          email: user.email,
          role: user.role,
          passwordHash,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );
  }
}

async function seedMenuItems() {
  for (const item of menuItems) {
    await MenuItem.findOneAndUpdate(
      { name: item.name },
      { $set: item },
      { upsert: true, new: true, runValidators: true }
    );
  }
}

async function main() {
  await connectDb();
  await seedUsers();
  await seedMenuItems();

  console.log("Seed complete");
  console.log(`Admin login: admin@foodtruck.test / ${defaultPassword}`);
  console.log(`Kitchen login: kitchen@foodtruck.test / ${defaultPassword}`);
  console.log(`Menu items seeded: ${menuItems.length}`);
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
