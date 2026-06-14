import { useQuery } from "@tanstack/react-query";
import { Link, type Href } from "expo-router";
import { MapPin, ShoppingCart, UtensilsCrossed } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { MenuCard } from "@/components/menu/MenuCard";
import { BottomTabBar, TAB_BAR_HEIGHT, type TabItem } from "@/components/ui/BottomTabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProfileMenuButton } from "@/components/ui/ProfileMenu";
import { useCartStore } from "@/features/cart/store";
import { getMenuItems } from "@/features/menu/api";
import { formatCurrency } from "@/lib/utils/currency";
import { getErrorMessage } from "@/lib/utils/errors";

export default function CustomerMenuScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const addItem = useCartStore((state) => state.addItem);
  const totalItems = useCartStore((state) => state.totalItems());
  const totalAmount = useCartStore((state) => state.totalAmount());
  const lastOrderToken = useCartStore((state) => state.lastOrderToken);

  const menuQuery = useQuery({
    queryKey: ["menu"],
    queryFn: () => getMenuItems(false),
  });

  const categories = useMemo(() => {
    const apiCategories = menuQuery.data?.map((item) => item.category) ?? [];
    return ["All", ...Array.from(new Set(apiCategories))];
  }, [menuQuery.data]);

  const filteredItems = useMemo(() => {
    const items = menuQuery.data ?? [];
    return selectedCategory === "All" ? items : items.filter((item) => item.category === selectedCategory);
  }, [menuQuery.data, selectedCategory]);

  const customerTabs: TabItem[] = [
    { label: "Menu", icon: UtensilsCrossed, href: "/menu" },
    { label: "Cart", icon: ShoppingCart, href: "/cart", badge: totalItems },
    { label: "My Order", icon: MapPin, href: "/track", badge: lastOrderToken ? undefined : undefined },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff7ed" }}>
      {/* Fixed top bar — always visible */}
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
          Food Truck
        </Text>
        <ProfileMenuButton />
      </View>

      {/* Track my order banner */}
      {lastOrderToken ? (
        <Link href={{ pathname: "/track", params: { tokenNumber: String(lastOrderToken) } } as Href} asChild>
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginHorizontal: 20,
              marginBottom: 8,
              backgroundColor: "#fff7ed",
              borderWidth: 1.5,
              borderColor: "#fdba74",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
            })}
          >
            <MapPin size={16} color="#ea580c" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#09090b" }}>
                Track order #{lastOrderToken}
              </Text>
              <Text style={{ fontSize: 11, color: "#71717a", marginTop: 1 }}>Tap to see live pickup status</Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#ea580c" }}>→</Text>
          </Pressable>
        </Link>
      ) : null}

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: TAB_BAR_HEIGHT + 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: "800", color: "#09090b" }}>Today&apos;s menu</Text>
          <Text style={{ marginTop: 6, fontSize: 15, color: "#52525b" }}>Choose your favorites and place a pickup order.</Text>
        </View>

        {menuQuery.isLoading ? (
          <View style={{ paddingVertical: 64 }}>
            <ActivityIndicator color="#ea580c" />
          </View>
        ) : menuQuery.isError ? (
          <EmptyState title="Menu unavailable" message={getErrorMessage(menuQuery.error)} />
        ) : (
          <View className="gap-4">
            <CategoryTabs categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
            {filteredItems.length === 0 ? (
              <EmptyState title="No items here" message="Try another category." />
            ) : (
              filteredItems.map((item) => <MenuCard key={item._id} item={item} onAdd={addItem} />)
            )}
          </View>
        )}
      </ScrollView>

      <BottomTabBar tabs={customerTabs} />
    </SafeAreaView>
  );
}
