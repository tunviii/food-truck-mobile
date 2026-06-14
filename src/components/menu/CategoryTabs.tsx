import { Pressable, ScrollView, Text } from "react-native";

type CategoryTabsProps = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
};

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {categories.map((category) => {
        const active = category === selected;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            className={`h-10 justify-center rounded-full px-4 ${
              active ? "bg-zinc-950" : "border border-orange-200 bg-white"
            }`}
          >
            <Text className={`text-sm font-semibold ${active ? "text-white" : "text-zinc-700"}`}>
              {category}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
