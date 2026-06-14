import { useAuthStore } from "@/features/auth/store";
import { router } from "expo-router";
import { LogOut, User } from "lucide-react-native";
import { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

const ROLE_LABEL: Record<string, string> = {
  customer: "Customer",
  kitchen: "Kitchen Staff",
  admin: "Admin",
};

export function ProfileMenuButton() {
  const [open, setOpen] = useState(false);
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
          setOpen(false);
          await signOut();
          router.replace("/auth/login");
        },
      },
    ]);
  }

  function handleViewProfile() {
    setOpen(false);
    router.push("/profile");
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: "#fff",
          borderWidth: 2,
          borderColor: "#ea580c",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <Text style={{ color: "#ea580c", fontWeight: "800", fontSize: 15 }}>
          {initials}
        </Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.35)",
              justifyContent: "flex-end",
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  paddingHorizontal: 20,
                  paddingTop: 8,
                  paddingBottom: 40,
                }}
              >
                {/* drag handle */}
                <View
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "#e4e4e7",
                    alignSelf: "center",
                    marginBottom: 20,
                  }}
                />

                {/* avatar + info */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 24,
                  }}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: "#18181b",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{ color: "#fff", fontWeight: "700", fontSize: 20 }}
                    >
                      {initials}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "700",
                        color: "#09090b",
                      }}
                      numberOfLines={1}
                    >
                      {user?.name ?? "—"}
                    </Text>
                    <Text
                      style={{ fontSize: 13, color: "#71717a", marginTop: 2 }}
                      numberOfLines={1}
                    >
                      {user?.email ?? "—"}
                    </Text>
                    <View
                      style={{
                        marginTop: 6,
                        alignSelf: "flex-start",
                        backgroundColor: "#fff7ed",
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "600",
                          color: "#c2410c",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {ROLE_LABEL[user?.role ?? ""] ?? user?.role}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* divider */}
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#f4f4f5",
                    marginBottom: 12,
                  }}
                />

                {/* View profile */}
                <Pressable
                  onPress={handleViewProfile}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.6 : 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingVertical: 14,
                    paddingHorizontal: 4,
                  })}
                >
                  <User size={20} color="#09090b" />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: "#09090b",
                    }}
                  >
                    View profile
                  </Text>
                </Pressable>

                {/* Sign out */}
                <Pressable
                  onPress={handleSignOut}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.6 : 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingVertical: 14,
                    paddingHorizontal: 4,
                  })}
                >
                  <LogOut size={20} color="#dc2626" />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      color: "#dc2626",
                    }}
                  >
                    Sign out
                  </Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
