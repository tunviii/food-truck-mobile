import { login } from "@/features/auth/api";
import { getRoleHome } from "@/features/auth/routes";
import { useAuthStore } from "@/features/auth/store";
import { isAxiosError } from "axios";
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

export default function LoginScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await login(email.trim(), password);
      await setSession(session);
      router.replace(getRoleHome(session.user.role) as Href);
    } catch (error) {
      if (
        isAxiosError(error) &&
        [400, 401].includes(error.response?.status ?? 0)
      ) {
        Alert.alert("Login failed", "Invalid email or password");
      } else {
        Alert.alert(
          "Login failed",
          error instanceof Error ? error.message : "Please try again.",
        );
      }
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
            Welcome back
          </Text>
          <Text className="mt-2 text-4xl font-bold text-zinc-950">Log in</Text>
        </View>

        <View className="gap-4">
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
              placeholder="Your password"
              secureTextEntry
              className="h-12 rounded-lg border border-orange-200 bg-white px-4 text-base text-zinc-950"
            />
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={isSubmitting}
            className="mt-2 h-12 items-center justify-center rounded-lg bg-zinc-950"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-semibold text-white">Log in</Text>
            )}
          </Pressable>
        </View>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-zinc-600">New here? </Text>
          <Link href="/" asChild>
            <Pressable>
              <Text className="font-semibold text-orange-700">
                Create account
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
