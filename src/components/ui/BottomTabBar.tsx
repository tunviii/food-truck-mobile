import { router, usePathname } from "expo-router";
import { type LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type TabItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  /** optional red badge count */
  badge?: number;
};

type BottomTabBarProps = {
  tabs: TabItem[];
};

export function BottomTabBar({ tabs }: BottomTabBarProps) {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: insets.bottom,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#fed7aa",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href || pathname.startsWith(tab.href + "/");
        const Icon = tab.icon;

        return (
          <Pressable
            key={tab.href}
            onPress={() => router.push(tab.href as any)}
            style={({ pressed }) => ({
              flex: 0,
              minWidth: 88,
              opacity: pressed ? 0.7 : 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              paddingHorizontal: 6,
              marginHorizontal: 4,
              gap: 4,
            })}
          >
            <View style={{ position: "relative" }}>
              <Icon
                size={22}
                color={isActive ? "#ea580c" : "#a1a1aa"}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              {tab.badge != null && tab.badge > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -8,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: "#ea580c",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 3,
                  }}
                >
                  <Text
                    style={{ fontSize: 9, fontWeight: "800", color: "#fff" }}
                  >
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text
              style={{
                fontSize: 10,
                fontWeight: isActive ? "700" : "500",
                color: isActive ? "#ea580c" : "#a1a1aa",
              }}
            >
              {tab.label}
            </Text>
            {isActive ? (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: 2,
                  borderBottomLeftRadius: 2,
                  borderBottomRightRadius: 2,
                  backgroundColor: "#ea580c",
                }}
              />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

/** Height to add as paddingBottom to scroll content so it clears the tab bar */
export const TAB_BAR_HEIGHT = 72;
