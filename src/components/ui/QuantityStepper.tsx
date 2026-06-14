import { Minus, Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type QuantityStepperProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantityStepper({ value, onDecrease, onIncrease }: QuantityStepperProps) {
  return (
    <View className="h-10 flex-row items-center overflow-hidden rounded-lg border border-orange-200 bg-white">
      <Pressable onPress={onDecrease} className="h-10 w-10 items-center justify-center">
        <Minus size={16} color="#18181b" />
      </Pressable>
      <Text className="w-8 text-center text-base font-semibold text-zinc-950">{value}</Text>
      <Pressable onPress={onIncrease} className="h-10 w-10 items-center justify-center">
        <Plus size={16} color="#18181b" />
      </Pressable>
    </View>
  );
}
