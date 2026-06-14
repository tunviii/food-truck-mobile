import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createMenuItem } from "@/features/menu/api";
import { getErrorMessage } from "@/lib/utils/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const defaultCategory = "mains";

export default function NewMenuItemScreen() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("10");
  const [isVeg, setIsVeg] = useState(true);
  const [isSpicy, setIsSpicy] = useState(false);

  const mutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      router.back();
    },
    onError: (error) => Alert.alert("Create failed", getErrorMessage(error)),
  });

  function submit() {
    mutation.mutate({
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      prepTimeMinutes: Number(prepTimeMinutes),
      imageUrl: "",
      isVeg,
      isSpicy,
      isAvailable: true,
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <Text className="text-3xl font-bold text-zinc-950">New item</Text>
        <View className="mt-6 gap-4">
          <Input label="Name" value={name} onChangeText={setName} />
          <Input
            label="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <Input label="Category" value={category} onChangeText={setCategory} />
          <Input
            label="Prep time minutes"
            value={prepTimeMinutes}
            onChangeText={setPrepTimeMinutes}
            keyboardType="numeric"
          />
          <View className="rounded-lg border border-orange-100 bg-white p-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-zinc-950">Vegetarian</Text>
              <Switch value={isVeg} onValueChange={setIsVeg} />
            </View>
            <View className="mt-3 flex-row items-center justify-between">
              <Text className="font-semibold text-zinc-950">Spicy</Text>
              <Switch value={isSpicy} onValueChange={setIsSpicy} />
            </View>
          </View>
          <Button
            title="Create item"
            loading={mutation.isPending}
            onPress={submit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
