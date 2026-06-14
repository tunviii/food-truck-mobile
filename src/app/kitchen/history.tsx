import { useQuery } from "@tanstack/react-query";
import { Bell, ClipboardList } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { BottomTabBar, TAB_BAR_HEIGHT, type TabItem } from "@/components/ui/BottomTabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProfileMenuButton } from "@/components/ui/ProfileMenu";
import { getOrders } from "@/features/orders/api";
import { formatCurrency } from "@/lib/utils/currency";
import { getErrorMessage } from "@/lib/utils/errors";

const kitchenTabs: TabItem[] = [
  { label: "Queue", icon: Bell, href: "/kitchen" },
  { label: "History", icon: ClipboardList, href: "/kitchen/history" },
];

export default function KitchenHistoryScreen() {
  const ordersQuery = useQuery({
    queryKey: ["kitchen-history"],
    queryFn: () => getOrders(),
    refetchInterval: 30_000,
  });

  const doneOrders = ordersQuery.data?.filter(
    (o) => o.status === "completed" || o.status === "cancelled"
  ) ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff7ed" }}>
      {/* Fixed top bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#fed7aa",
          backgroundColor: "#fff7ed",
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#c2410c", textTransform: "uppercase", letterSpacing: 1 }}>
          Kitchen
        </Text>
        <ProfileMenuButton />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: TAB_BAR_HEIGHT + 20 }}>
        <Text style={{ fontSize: 30, fontWeight: "800", color: "#09090b" }}>History</Text>
        <Text style={{ marginTop: 6, fontSize: 15, color: "#52525b", marginBottom: 20 }}>
          Completed and cancelled orders today.
        </Text>

        {ordersQuery.isLoading ? (
          <ActivityIndicator color="#ea580c" />
        ) : ordersQuery.isError ? (
          <EmptyState title="Could not load history" message={getErrorMessage(ordersQuery.error)} />
        ) : doneOrders.length === 0 ? (
          <EmptyState title="Nothing yet" message="Completed orders will appear here." />
        ) : (
          <View style={{ gap: 10 }}>
            {doneOrders.map((order) => (
              <View
                key={order._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#e4e4e7",
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#09090b" }}>
                    Token #{order.tokenNumber}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#71717a", marginTop: 2 }}>
                    {order.customerName} · {formatCurrency(order.totalAmount)}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#a1a1aa", marginTop: 2 }}>
                    {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                  </Text>
                </View>
                <OrderStatusBadge status={order.status} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <BottomTabBar tabs={kitchenTabs} />
    </SafeAreaView>
  );
}
