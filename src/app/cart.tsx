import { useMutation } from "@tanstack/react-query";
import { router, type Href } from "expo-router";
import { MapPin, ShoppingCart, UtensilsCrossed } from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { BottomTabBar, TAB_BAR_HEIGHT, type TabItem } from "@/components/ui/BottomTabBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { useCartStore } from "@/features/cart/store";
import { createOrder } from "@/features/orders/api";
import { formatCurrency } from "@/lib/utils/currency";
import { getErrorMessage } from "@/lib/utils/errors";

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const setLastOrderToken = useCartStore((state) => state.setLastOrderToken);
  const totalAmount = useCartStore((state) => state.totalAmount());
  const totalItems = useCartStore((state) => state.totalItems());
  const lastOrderToken = useCartStore((state) => state.lastOrderToken);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const customerTabs: TabItem[] = [
    { label: "Menu", icon: UtensilsCrossed, href: "/menu" },
    { label: "Cart", icon: ShoppingCart, href: "/cart", badge: totalItems },
    { label: "My Order", icon: MapPin, href: "/track" },
  ];

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      clearCart();
      setLastOrderToken(order.tokenNumber);
      router.replace({ pathname: "/order-success", params: { tokenNumber: String(order.tokenNumber) } } as Href);
    },
    onError: (error) => {
      Alert.alert("Order failed", getErrorMessage(error));
    },
  });

  function submitOrder() {
    if (items.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      Alert.alert("Missing details", "Enter your name and phone number.");
      return;
    }

    orderMutation.mutate({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        notes: item.notes,
      })),
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff7ed" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: TAB_BAR_HEIGHT + 20 }}>
        <Text style={{ fontSize: 30, fontWeight: "800", color: "#09090b" }}>Cart</Text>
        <Text style={{ marginTop: 6, fontSize: 15, color: "#52525b" }}>Review items and place your pickup order.</Text>

        <View style={{ marginTop: 20, gap: 12 }}>
          {items.length === 0 ? (
            <EmptyState title="Your cart is empty" message="Add something tasty from the menu." />
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.menuItemId}
                item={item}
                onIncrease={() => increment(item.menuItemId)}
                onDecrease={() => decrement(item.menuItemId)}
                onRemove={() => removeItem(item.menuItemId)}
              />
            ))
          )}
        </View>

        {items.length > 0 ? (
          <View style={{ marginTop: 20, gap: 14, borderRadius: 14, borderWidth: 1, borderColor: "#fed7aa", backgroundColor: "#fff", padding: 16 }}>
            <Input label="Name" value={customerName} onChangeText={setCustomerName} placeholder="Pickup name" />
            <Input
              label="Phone"
              value={customerPhone}
              onChangeText={setCustomerPhone}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#f4f4f5", paddingTop: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#3f3f46" }}>Total</Text>
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#09090b" }}>{formatCurrency(totalAmount)}</Text>
            </View>
            <Button title="Place order" loading={orderMutation.isPending} onPress={submitOrder} />
          </View>
        ) : null}
      </ScrollView>
      <BottomTabBar tabs={customerTabs} />
    </SafeAreaView>
  );
}
