import { Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import type { CartItem } from "@/features/cart/types";
import { formatCurrency } from "@/lib/utils/currency";

type CartItemRowProps = {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
  return (
    <View className="rounded-lg border border-orange-100 bg-white p-4">
      <View className="flex-row justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-zinc-950">{item.name}</Text>
          <Text className="mt-1 text-sm text-zinc-600">{formatCurrency(item.price)} each</Text>
        </View>
        <Pressable onPress={onRemove} className="h-10 w-10 items-center justify-center rounded-lg bg-red-50">
          <Trash2 size={18} color="#dc2626" />
        </Pressable>
      </View>
      <View className="mt-4 flex-row items-center justify-between">
        <QuantityStepper value={item.quantity} onDecrease={onDecrease} onIncrease={onIncrease} />
        <Text className="text-base font-bold text-zinc-950">{formatCurrency(item.price * item.quantity)}</Text>
      </View>
    </View>
  );
}
