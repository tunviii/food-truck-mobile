import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOrders } from "@/features/orders/api";
import { formatCurrency } from "@/lib/utils/currency";
import { getErrorMessage } from "@/lib/utils/errors";

export default function KitchenOrderDetailScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const ordersQuery = useQuery({
    queryKey: ["staff-orders"],
    queryFn: () => getOrders(),
  });

  const order = ordersQuery.data?.find((candidate) => candidate._id === orderId);

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        {ordersQuery.isLoading ? (
          <ActivityIndicator color="#ea580c" />
        ) : ordersQuery.isError ? (
          <EmptyState title="Could not load order" message={getErrorMessage(ordersQuery.error)} />
        ) : !order ? (
          <EmptyState title="Order not found" message="Go back to the kitchen queue and choose another order." />
        ) : (
          <View className="rounded-lg border border-orange-100 bg-white p-4">
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-2xl font-bold text-zinc-950">Token #{order.tokenNumber}</Text>
                <Text className="mt-1 text-sm text-zinc-600">
                  {order.customerName} • {order.customerPhone}
                </Text>
              </View>
              <OrderStatusBadge status={order.status} />
            </View>

            <View className="mt-5 gap-2 border-t border-orange-100 pt-4">
              {order.items.map((item) => (
                <Text key={`${order._id}-${item.menuItem}`} className="text-base text-zinc-700">
                  {item.quantity}x {item.name}
                </Text>
              ))}
            </View>

            <Text className="mt-5 text-xl font-bold text-zinc-950">{formatCurrency(order.totalAmount)}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
