import { Text, View } from "react-native";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View className="items-center justify-center rounded-lg border border-dashed border-orange-200 bg-white p-6">
      <Text className="text-center text-lg font-semibold text-zinc-950">{title}</Text>
      <Text className="mt-2 text-center text-sm text-zinc-600">{message}</Text>
    </View>
  );
}
