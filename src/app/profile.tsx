import { router } from "expo-router";
import { ChevronLeft, LogOut, Mail, Shield, User } from "lucide-react-native";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/features/auth/store";

const ROLE_LABEL: Record<string, string> = {
  customer: "Customer",
  kitchen: "Kitchen Staff",
  admin: "Admin",
};

const ROLE_DESCRIPTION: Record<string, string> = {
  customer: "Browse the menu and place pickup orders.",
  kitchen: "View and manage incoming orders.",
  admin: "Full access to menu and order management.",
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#f4f4f5",
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: "#fff7ed",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, color: "#a1a1aa", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 }}>
          {label}
        </Text>
        <Text style={{ fontSize: 15, color: "#09090b", fontWeight: "500", marginTop: 2 }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  function handleSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/auth/login");
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff7ed" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 20,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#fed7aa",
            })}
          >
            <ChevronLeft size={20} color="#09090b" />
          </Pressable>
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 17,
              fontWeight: "700",
              color: "#09090b",
            }}
          >
            Profile
          </Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Avatar card */}
        <View style={{ alignItems: "center", paddingVertical: 28 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: "#18181b",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 32 }}>
              {initials}
            </Text>
          </View>
          <Text
            style={{
              marginTop: 14,
              fontSize: 22,
              fontWeight: "800",
              color: "#09090b",
            }}
          >
            {user?.name}
          </Text>
          <View
            style={{
              marginTop: 8,
              backgroundColor: "#18181b",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {ROLE_LABEL[user?.role ?? ""] ?? user?.role}
            </Text>
          </View>
          {user?.role && ROLE_DESCRIPTION[user.role] ? (
            <Text
              style={{
                marginTop: 10,
                fontSize: 13,
                color: "#71717a",
                textAlign: "center",
                paddingHorizontal: 40,
              }}
            >
              {ROLE_DESCRIPTION[user.role]}
            </Text>
          ) : null}
        </View>

        {/* Info section */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: "#fff",
            borderRadius: 16,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: "#fed7aa",
          }}
        >
          <InfoRow
            icon={<User size={18} color="#c2410c" />}
            label="Full name"
            value={user?.name ?? "—"}
          />
          <InfoRow
            icon={<Mail size={18} color="#c2410c" />}
            label="Email"
            value={user?.email ?? "—"}
          />
          <InfoRow
            icon={<Shield size={18} color="#c2410c" />}
            label="Role"
            value={ROLE_LABEL[user?.role ?? ""] ?? user?.role ?? "—"}
          />
        </View>

        {/* Sign out */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              height: 52,
              borderRadius: 14,
              backgroundColor: "#fef2f2",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              borderWidth: 1,
              borderColor: "#fecaca",
            })}
          >
            <LogOut size={18} color="#dc2626" />
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#dc2626" }}>
              Sign out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
