import { Text, View } from "react-native";

type BadgeProps = {
  label: string;
  tone?: "neutral" | "green" | "orange" | "red";
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-100 text-emerald-800"
      : tone === "orange"
        ? "bg-orange-100 text-orange-800"
        : tone === "red"
          ? "bg-red-100 text-red-800"
          : "bg-zinc-100 text-zinc-700";

  return (
    <View className={`self-start rounded-full px-3 py-1 ${toneClass.split(" ")[0]}`}>
      <Text className={`text-xs font-semibold ${toneClass.split(" ")[1]}`}>{label}</Text>
    </View>
  );
}
