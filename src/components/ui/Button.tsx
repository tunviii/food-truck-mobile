import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";

type ButtonProps = PressableProps & {
  title: string;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

export function Button({ title, variant = "primary", loading, disabled, className = "", ...props }: ButtonProps) {
  const style =
    variant === "primary"
      ? "bg-zinc-950"
      : variant === "danger"
        ? "bg-red-600"
        : "border border-orange-200 bg-white";
  const textStyle = variant === "secondary" ? "text-zinc-900" : "text-white";

  return (
    <Pressable
      disabled={disabled || loading}
      className={`h-12 items-center justify-center rounded-lg ${style} ${disabled || loading ? "opacity-60" : ""} ${className}`}
      {...props}
    >
      {loading ? <ActivityIndicator color={variant === "secondary" ? "#18181b" : "#fff"} /> : <Text className={`text-base font-semibold ${textStyle}`}>{title}</Text>}
    </Pressable>
  );
}
