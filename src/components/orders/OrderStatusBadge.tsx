import { Badge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/features/orders/types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const tone = status === "ready" || status === "completed" ? "green" : status === "cancelled" ? "red" : "orange";
  return <Badge label={status.toUpperCase()} tone={tone} />;
}
