import { Badge } from "@/components/ui/Badge";
import type { MenuItem } from "@/features/menu/types";
import { formatCurrency } from "@/lib/utils/currency";
import { Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type MenuCardProps = {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
};

export function MenuCard({ item, onAdd }: MenuCardProps) {
  return (
    <View className="rounded-lg border border-orange-100 bg-white p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-zinc-950">{item.name}</Text>
        </View>
        <Text className="text-base font-bold text-zinc-950">
          {formatCurrency(item.price)}
        </Text>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-2">
        <Badge label={item.category} />
        <Badge
          label={item.isVeg ? "Veg" : "Non-veg"}
          tone={item.isVeg ? "green" : "red"}
        />
        {item.isSpicy ? <Badge label="Spicy" tone="orange" /> : null}
        <Badge label={`${item.prepTimeMinutes} min`} />
      </View>

      <Pressable
        onPress={() => onAdd(item)}
        disabled={!item.isAvailable}
        className={`mt-4 h-11 flex-row items-center justify-center gap-2 rounded-lg ${
          item.isAvailable ? "bg-orange-600" : "bg-zinc-300"
        }`}
      >
        <Plus size={18} color="#fff" />
        <Text className="font-semibold text-white">
          {item.isAvailable ? "Add" : "Unavailable"}
        </Text>
      </Pressable>
    </View>
  );
}
