import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipboardList, Edit, Plus } from "lucide-react-native";
import { type Href, router } from "expo-router";
import { BottomTabBar, TAB_BAR_HEIGHT, type TabItem } from "@/components/ui/BottomTabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { ProfileMenuButton } from "@/components/ui/ProfileMenu";
import { getOrders, updateOrderStatus } from "@/features/orders/api";
import type { OrderStatus } from "@/features/orders/types";
import { formatCurrency } from "@/lib/utils/currency";
import { getErrorMessage } from "@/lib/utils/errors";

const STATUS_SEQUENCE: OrderStatus[] = ["pending", "accepted", "preparing", "ready", "completed"];

function nextStatus(current: OrderStatus): OrderStatus | null {
  const idx = STATUS_SEQUENCE.indexOf(current);
  if (idx === -1 || idx === STATUS_SEQUENCE.length - 1) return null;
  return STATUS_SEQUENCE[idx + 1] ?? null;
}

const adminTabs: TabItem[] = [
  { label: "Menu", icon: Edit, href: "/admin" },
  { label: "Orders", icon: ClipboardList, href: "/admin/orders" },
  { label: "Add item", icon: Plus, href: "/admin/menu/new" },
];

export default function AdminOrdersScreen() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => getOrders(),
    refetchInterval: 10_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
    onError: (error) => Alert.alert("Update failed", getErrorMessage(error)),
  });

  const activeOrders = ordersQuery.data?.filter(
    (o) => !["completed", "cancelled"].includes(o.status)
  ) ?? [];

  const completedOrders = ordersQuery.data?.filter(
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
          Orders
        </Text>
        <ProfileMenuButton />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: TAB_BAR_HEIGHT + 20 }}>
        <Text style={{ fontSize: 30, fontWeight: "800", color: "#09090b" }}>Live orders</Text>
        <Text style={{ marginTop: 6, fontSize: 15, color: "#52525b", marginBottom: 20 }}>
          All active orders across the truck.
        </Text>

        {/* Active */}
        {ordersQuery.isLoading ? null : activeOrders.length === 0 ? (
          <EmptyState title="No active orders" message="New orders will appear here." />
        ) : (
          <View style={{ gap: 12, marginBottom: 28 }}>
            {activeOrders.map((order) => {
              const next = nextStatus(order.status);
              return (
                <View
                  key={order._id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#fed7aa",
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <View>
                      <Text style={{ fontSize: 18, fontWeight: "800", color: "#09090b" }}>
                        Token #{order.tokenNumber}
                      </Text>
                      <Text style={{ fontSize: 13, color: "#71717a", marginTop: 2 }}>
                        {order.customerName} · {order.customerPhone}
                      </Text>
                    </View>
                    <OrderStatusBadge status={order.status} />
                  </View>

                  <View style={{ marginTop: 10, gap: 4 }}>
                    {order.items.map((item) => (
                      <Text key={`${order._id}-${item.menuItem}`} style={{ fontSize: 13, color: "#3f3f46" }}>
                        {item.quantity}× {item.name}
                      </Text>
                    ))}
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#09090b", marginTop: 4 }}>
                      {formatCurrency(order.totalAmount)}
                    </Text>
                  </View>

                  {next ? (
                    <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                      <View
                        style={{
                          flex: 1,
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: "#09090b",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          onPress={() => statusMutation.mutate({ id: order._id, status: next })}
                          style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}
                        >
                          Move to {next}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 40,
                          paddingHorizontal: 14,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: "#fca5a5",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          onPress={() => statusMutation.mutate({ id: order._id, status: "cancelled" })}
                          style={{ fontSize: 13, fontWeight: "600", color: "#dc2626" }}
                        >
                          Cancel
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}

        {/* Done today */}
        {completedOrders.length > 0 ? (
          <>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>
              Done today ({completedOrders.length})
            </Text>
            <View style={{ gap: 8 }}>
              {completedOrders.map((order) => (
                <View
                  key={order._id}
                  style={{
                    backgroundColor: "#f9fafb",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#e4e4e7",
                    padding: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: "#09090b" }}>
                      Token #{order.tokenNumber}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#71717a", marginTop: 2 }}>
                      {order.customerName} · {formatCurrency(order.totalAmount)}
                    </Text>
                  </View>
                  <OrderStatusBadge status={order.status} />
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>

      <BottomTabBar tabs={adminTabs} />
    </SafeAreaView>
  );
}
