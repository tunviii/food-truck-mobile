import { Schema, model, type InferSchemaType, Types } from "mongoose";

export const orderStatuses = ["placed", "accepted", "cooking", "ready", "completed", "cancelled"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

const orderItemSchema = new Schema(
  {
    menuItem: { type: Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    notes: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    tokenNumber: { type: Number, required: true, unique: true, index: true },
    customerName: { type: String, trim: true, required: true },
    customerPhone: { type: String, trim: true, required: true },
    items: { type: [orderItemSchema], required: true },
    status: { type: String, enum: orderStatuses, default: "placed", index: true },
    totalAmount: { type: Number, required: true, min: 0 },
    estimatedPrepTimeMinutes: { type: Number, required: true, min: 1 },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    cancelReason: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export type OrderDocument = InferSchemaType<typeof orderSchema>;
export const Order = model("Order", orderSchema);
