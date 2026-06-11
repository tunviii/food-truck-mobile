import { Counter } from "../models/Counter";
import { MenuItem } from "../models/MenuItem";
import { Order, type OrderStatus } from "../models/Order";

type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    notes?: string;
  }>;
};

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  placed: ["accepted", "cancelled"],
  accepted: ["cooking", "cancelled"],
  cooking: ["ready", "cancelled"],
  ready: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

async function nextTokenNumber() {
  const counter = await Counter.findOneAndUpdate(
    { key: "orderToken" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
}

export async function createOrder(input: CreateOrderInput) {
  const ids = input.items.map((item) => item.menuItemId);
  const menuItems = await MenuItem.find({ _id: { $in: ids }, isAvailable: true });

  if (menuItems.length !== ids.length) {
    throw new Error("One or more menu items are unavailable");
  }

  const orderItems = input.items.map((item) => {
    const menuItem = menuItems.find((candidate) => candidate.id === item.menuItemId);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    return {
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
      notes: item.notes ?? "",
      prepTimeMinutes: menuItem.prepTimeMinutes,
    };
  });

  const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const estimatedPrepTimeMinutes = Math.max(...orderItems.map((item) => item.prepTimeMinutes));

  return Order.create({
    tokenNumber: await nextTokenNumber(),
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    items: orderItems,
    totalAmount,
    estimatedPrepTimeMinutes,
  });
}

export async function listOrders(status?: OrderStatus) {
  return Order.find(status ? { status } : {}).sort({ createdAt: -1 });
}

export async function findOrderByToken(tokenNumber: number) {
  return Order.findOne({ tokenNumber });
}

export async function updateOrderStatus(id: string, status: OrderStatus, cancelReason?: string) {
  const order = await Order.findById(id);
  if (!order) {
    return null;
  }

  if (!allowedTransitions[order.status as OrderStatus].includes(status)) {
    throw new Error(`Cannot move order from ${order.status} to ${status}`);
  }

  order.status = status;
  if (status === "cancelled") {
    order.cancelReason = cancelReason ?? "";
  }

  await order.save();
  return order;
}
