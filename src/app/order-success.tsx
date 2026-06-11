import { View, Text } from "react-native";

export default function OrderSuccessScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-center text-2xl font-semibold text-zinc-950">Order placed</Text>
      <Text className="mt-2 text-center text-base text-zinc-600">
        Your pickup token will appear here once the order flow is connected.
      </Text>
    </View>
  );
}
