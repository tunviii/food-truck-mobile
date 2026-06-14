import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, ClipboardList } from "lucide-react-native";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StaffOrderCard } from "@/components/staff/StaffOrderCard";
import { BottomTabBar, TAB_BAR_HEIGHT, type TabItem } from "@/components/ui/BottomTabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProfileMenuButton } from "@/components/ui/ProfileMenu";
import { getOrders, updateOrderStatus } from "@/features/orders/api";
import type { OrderStatus } from "@/features/orders/types";
import { getErrorMessage } from "@/lib/utils/errors";

export default function KitchenHomeScreen() {
  const queryClient = useQueryClient();
  const ordersQuery = useQuery({
    queryKey: ["staff-orders"],
    queryFn: () => getOrders(),
    refetchInterval: 10_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-orders"] });
    },
    onError: (error) => Alert.alert("Update failed", getErrorMessage(error)),
  });

  const activeOrders = ordersQuery.data?.filter((order) => !["completed", "cancelled"].includes(order.status)) ?? [];

  const kitchenTabs: TabItem[] = [
    { label: "Queue", icon: Bell, href: "/kitchen", badge: activeOrders.length || undefined },
    { label: "History", icon: ClipboardList, href: "/kitchen/history" },
  ];

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
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: "800", color: "#09090b" }}>Kitchen queue</Text>
          <Text style={{ marginTop: 6, fontSize: 15, color: "#52525b" }}>Accept and move orders through the pickup flow.</Text>
        </View>

        <View style={{ gap: 14 }}>
          {ordersQuery.isLoading ? (
            <ActivityIndicator color="#ea580c" />
          ) : ordersQuery.isError ? (
            <EmptyState title="Could not load orders" message={getErrorMessage(ordersQuery.error)} />
          ) : activeOrders.length === 0 ? (
            <EmptyState title="No active orders" message="New customer orders will appear here." />
          ) : (
            activeOrders.map((order) => (
              <StaffOrderCard
                key={order._id}
                order={order}
                onUpdate={(status) => statusMutation.mutate({ id: order._id, status })}
              />
            ))
          )}
        </View>
      </ScrollView>
      <BottomTabBar tabs={kitchenTabs} />
    </SafeAreaView>
  );
}
