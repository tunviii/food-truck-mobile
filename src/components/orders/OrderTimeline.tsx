import { Text, View } from "react-native";
import type { OrderStatus } from "@/features/orders/types";

const statuses: OrderStatus[] = ["placed", "accepted", "cooking", "ready", "completed"];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = statuses.indexOf(status);

  if (status === "cancelled") {
    return <Text className="text-sm font-semibold text-red-700">This order was cancelled.</Text>;
  }

  return (
    <View className="gap-3">
      {statuses.map((item, index) => {
        const done = index <= currentIndex;
        return (
          <View key={item} className="flex-row items-center gap-3">
            <View className={`h-4 w-4 rounded-full ${done ? "bg-orange-600" : "bg-zinc-200"}`} />
            <Text className={`text-sm font-semibold capitalize ${done ? "text-zinc-950" : "text-zinc-400"}`}>
              {item}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
