import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, MapPin, ShoppingCart, UtensilsCrossed } from "lucide-react-native";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { BottomTabBar, TAB_BAR_HEIGHT, type TabItem } from "@/components/ui/BottomTabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCartStore } from "@/features/cart/store";
import { getOrderByToken } from "@/features/orders/api";
import { formatCurrency } from "@/lib/utils/currency";
import { getErrorMessage } from "@/lib/utils/errors";

export default function TrackScreen() {
  const { tokenNumber } = useLocalSearchParams<{ tokenNumber?: string }>();
  const token = Number(tokenNumber);
  const totalItems = useCartStore((s) => s.totalItems());

  const customerTabs: TabItem[] = [
    { label: "Menu", icon: UtensilsCrossed, href: "/menu" },
    { label: "Cart", icon: ShoppingCart, href: "/cart", badge: totalItems },
    { label: "My Order", icon: MapPin, href: "/track" },
  ];

  const orderQuery = useQuery({
    queryKey: ["order", token],
    queryFn: () => getOrderByToken(token),
    enabled: Number.isInteger(token) && token > 0,
    refetchInterval: 10_000,
  });

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
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#fff",
            borderWidth: 1.5,
            borderColor: "#fed7aa",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <ChevronLeft size={18} color="#09090b" />
        </Pressable>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#09090b" }}>
          Track order
        </Text>
        {/* spacer to balance the back button */}
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {!token || !Number.isInteger(token) ? (
          <EmptyState
            title="No order to track"
            message="Place an order first and your pickup status will appear here."
          />
        ) : orderQuery.isLoading ? (
          <View style={{ paddingVertical: 64, alignItems: "center" }}>
            <ActivityIndicator color="#ea580c" size="large" />
            <Text style={{ marginTop: 12, fontSize: 14, color: "#71717a" }}>
              Looking up token #{token}…
            </Text>
          </View>
        ) : orderQuery.isError ? (
          <EmptyState title="Order not found" message={getErrorMessage(orderQuery.error)} />
        ) : orderQuery.data ? (
          <View>
            {/* Token header */}
            <View
              style={{
                backgroundColor: "#09090b",
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: 0.8 }}>
                Pickup Token
              </Text>
              <Text style={{ fontSize: 48, fontWeight: "900", color: "#fff", marginTop: 4 }}>
                #{orderQuery.data.tokenNumber}
              </Text>
              <Text style={{ fontSize: 14, color: "#a1a1aa", marginTop: 2 }}>
                {orderQuery.data.customerName}
              </Text>
              <View style={{ marginTop: 12, alignSelf: "flex-start" }}>
                <OrderStatusBadge status={orderQuery.data.status} />
              </View>
            </View>

            {/* Timeline */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#fed7aa",
                padding: 20,
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#09090b", marginBottom: 16 }}>
                Order progress
              </Text>
              <OrderTimeline status={orderQuery.data.status} />
            </View>

            {/* Items */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#fed7aa",
                padding: 20,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#09090b", marginBottom: 12 }}>
                Your order
              </Text>
              {orderQuery.data.items.map((item) => (
                <View
                  key={`${item.menuItem}-${item.name}`}
                  style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}
                >
                  <Text style={{ fontSize: 14, color: "#3f3f46" }}>
                    {item.quantity}× {item.name}
                  </Text>
                </View>
              ))}
              <View
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: "#f4f4f5",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#09090b" }}>Total</Text>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#09090b" }}>
                  {formatCurrency(orderQuery.data.totalAmount)}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
      <BottomTabBar tabs={customerTabs} />
    </SafeAreaView>
  );
}
