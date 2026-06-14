import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import type { Order, OrderStatus } from "@/features/orders/types";
import { formatCurrency } from "@/lib/utils/currency";

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "accepted",
  accepted: "cooking",
  cooking: "ready",
  ready: "completed",
};

export function StaffOrderCard({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (status: OrderStatus) => void;
}) {
  const next = nextStatus[order.status];

  return (
    <View className="rounded-lg border border-orange-100 bg-white p-4">
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-lg font-bold text-zinc-950">Token #{order.tokenNumber}</Text>
          <Text className="text-sm text-zinc-600">{order.customerName} • {order.customerPhone}</Text>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>
      <View className="mt-3 gap-1">
        {order.items.map((item) => (
          <Text key={`${order._id}-${item.menuItem}`} className="text-sm text-zinc-700">
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>
      <Text className="mt-3 text-base font-bold text-zinc-950">{formatCurrency(order.totalAmount)}</Text>
      {next ? <Button className="mt-4" title={`Mark ${next}`} onPress={() => onUpdate(next)} /> : null}
      {order.status !== "cancelled" && order.status !== "completed" ? (
        <Button className="mt-2" title="Cancel" variant="danger" onPress={() => onUpdate("cancelled")} />
      ) : null}
    </View>
  );
}
