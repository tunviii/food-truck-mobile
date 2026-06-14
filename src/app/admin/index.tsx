import { Badge } from "@/components/ui/Badge";
import {
    BottomTabBar,
    TAB_BAR_HEIGHT,
    type TabItem,
} from "@/components/ui/BottomTabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProfileMenuButton } from "@/components/ui/ProfileMenu";
import { getMenuItems, updateMenuItemAvailability } from "@/features/menu/api";
import { formatCurrency } from "@/lib/utils/currency";
import { getErrorMessage } from "@/lib/utils/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, type Href } from "expo-router";
import { ClipboardList, Edit, Edit3, Plus } from "lucide-react-native";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminHomeScreen() {
  const queryClient = useQueryClient();
  const menuQuery = useQuery({
    queryKey: ["admin-menu"],
    queryFn: () => getMenuItems(true),
  });

  const availabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      updateMenuItemAvailability(id, isAvailable),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] }),
    onError: (error) => Alert.alert("Update failed", getErrorMessage(error)),
  });

  const adminTabs: TabItem[] = [
    { label: "Menu", icon: Edit, href: "/admin" },
    { label: "Orders", icon: ClipboardList, href: "/admin/orders" },
    { label: "Add item", icon: Plus, href: "/admin/menu/new" },
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
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#c2410c",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Admin
        </Text>
        <ProfileMenuButton />
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: TAB_BAR_HEIGHT + 20,
        }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: "800", color: "#09090b" }}>
            Menu items
          </Text>
          <Text style={{ marginTop: 6, fontSize: 15, color: "#52525b" }}>
            Manage menu items and availability.
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          {menuQuery.isLoading ? (
            <ActivityIndicator color="#ea580c" />
          ) : menuQuery.isError ? (
            <EmptyState
              title="Could not load menu"
              message={getErrorMessage(menuQuery.error)}
            />
          ) : menuQuery.data?.length === 0 ? (
            <EmptyState
              title="No menu items"
              message="Create your first food truck item."
            />
          ) : (
            menuQuery.data?.map((item) => (
              <View
                key={item._id}
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#fed7aa",
                  backgroundColor: "#fff",
                  padding: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#09090b",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{ marginTop: 4, fontSize: 13, color: "#71717a" }}
                    >
                      {item.category} • {formatCurrency(item.price)}
                    </Text>
                  </View>
                  <Badge
                    label={item.isAvailable ? "Available" : "Hidden"}
                    tone={item.isAvailable ? "green" : "red"}
                  />
                </View>
                <View style={{ marginTop: 14, flexDirection: "row", gap: 8 }}>
                  <Pressable
                    onPress={() =>
                      availabilityMutation.mutate({
                        id: item._id,
                        isAvailable: !item.isAvailable,
                      })
                    }
                    style={{
                      flex: 1,
                      height: 42,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#fed7aa",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        color: "#09090b",
                        fontSize: 14,
                      }}
                    >
                      {item.isAvailable ? "Mark unavailable" : "Mark available"}
                    </Text>
                  </Pressable>
                  <Link
                    href={
                      {
                        pathname: "/admin/menu/[itemId]",
                        params: { itemId: item._id },
                      } as Href
                    }
                    asChild
                  >
                    <Pressable
                      style={{
                        width: 42,
                        height: 42,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: "#09090b",
                      }}
                    >
                      <Edit3 size={18} color="#fff" />
                    </Pressable>
                  </Link>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <BottomTabBar tabs={adminTabs} />
    </SafeAreaView>
  );
}
