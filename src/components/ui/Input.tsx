import { Text, TextInput, View, type TextInputProps } from "react-native";

type InputProps = TextInputProps & {
  label: string;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <View>
      <Text className="mb-2 text-sm font-semibold text-zinc-800">{label}</Text>
      <TextInput
        className={`h-12 rounded-lg border border-orange-200 bg-white px-4 text-base text-zinc-950 ${className}`}
        placeholderTextColor="#a1a1aa"
        {...props}
      />
    </View>
  );
}
