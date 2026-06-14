import { Link, useLocalSearchParams, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderSuccessScreen() {
  const { tokenNumber } = useLocalSearchParams<{ tokenNumber?: string }>();

  return (
    <SafeAreaView className="flex-1 bg-orange-50 px-5 py-6">
      <View className="flex-1 justify-center">
        <Text className="text-sm font-semibold uppercase text-orange-700">Order placed</Text>
        <Text className="mt-2 text-4xl font-bold text-zinc-950">Token #{tokenNumber ?? "--"}</Text>
        <Text className="mt-3 text-base text-zinc-600">
          Keep this token handy. You can track your pickup status anytime.
        </Text>

        <Link href={{ pathname: "/track", params: { tokenNumber } } as Href} asChild>
          <Pressable className="mt-8 h-12 items-center justify-center rounded-lg bg-zinc-950">
            <Text className="text-base font-semibold text-white">Track order</Text>
          </Pressable>
        </Link>

        <Link href={"/menu" as Href} asChild>
          <Pressable className="mt-3 h-12 items-center justify-center rounded-lg border border-orange-200 bg-white">
            <Text className="text-base font-semibold text-zinc-950">Back to menu</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
