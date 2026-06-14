import { register } from "@/features/auth/api";
import { getRoleHome } from "@/features/auth/routes";
import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/features/auth/types";
import { Link, router, type Href } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const roleOptions: Array<{ label: string; value: UserRole }> = [
  { label: "Customer", value: "customer" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Admin", value: "admin" },
];

export default function SignupScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup() {
    if (!name.trim() || !email.trim() || password.length < 8) {
      Alert.alert(
        "Check details",
        "Enter your name, email, and an 8 character password.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });
      await setSession(session);
      router.replace(getRoleHome(session.user.role) as Href);
    } catch (error) {
      Alert.alert(
        "Signup failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 32,
        }}
      >
        <View className="mb-8">
          <Text className="text-sm font-semibold uppercase text-orange-700">
            Food Truck
          </Text>
          <Text className="mt-2 text-4xl font-bold text-zinc-950">
            Create your account
          </Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="mb-2 text-sm font-semibold text-zinc-800">
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
              className="h-12 rounded-lg border border-orange-200 bg-white px-4 text-base text-zinc-950"
            />
          </View>

          <View>
            <Text className="mb-2 text-sm font-semibold text-zinc-800">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="h-12 rounded-lg border border-orange-200 bg-white px-4 text-base text-zinc-950"
            />
          </View>

          <View>
            <Text className="mb-2 text-sm font-semibold text-zinc-800">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
              className="h-12 rounded-lg border border-orange-200 bg-white px-4 text-base text-zinc-950"
            />
          </View>

          <View>
            <Text className="mb-2 text-sm font-semibold text-zinc-800">
              Role
            </Text>
            <View className="flex-row gap-2">
              {roleOptions.map((option) => {
                const selected = option.value === role;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setRole(option.value)}
                    className={`h-11 flex-1 items-center justify-center rounded-lg border ${
                      selected
                        ? "border-orange-600 bg-orange-600"
                        : "border-orange-200 bg-white"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${selected ? "text-white" : "text-zinc-700"}`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            onPress={handleSignup}
            disabled={isSubmitting}
            className="mt-2 h-12 items-center justify-center rounded-lg bg-zinc-950"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-semibold text-white">
                Sign up
              </Text>
            )}
          </Pressable>
        </View>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-zinc-600">Already have an account? </Text>
          <Link href={"/auth/login" as Href} asChild>
            <Pressable>
              <Text className="font-semibold text-orange-700">Log in</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
