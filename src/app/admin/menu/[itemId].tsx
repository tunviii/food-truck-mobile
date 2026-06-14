import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import {
  deleteMenuItem,
  getMenuItems,
  updateMenuItem,
} from "@/features/menu/api";
import { getErrorMessage } from "@/lib/utils/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditMenuItemScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const queryClient = useQueryClient();
  const menuQuery = useQuery({
    queryKey: ["admin-menu"],
    queryFn: () => getMenuItems(true),
  });
  const item = menuQuery.data?.find((candidate) => candidate._id === itemId);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (!item) return;
    setName(item.name);
    setPrice(String(item.price));
    setCategory(item.category);
    setPrepTimeMinutes(String(item.prepTimeMinutes));
    setIsVeg(item.isVeg);
    setIsSpicy(item.isSpicy);
    setIsAvailable(item.isAvailable);
  }, [item]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateMenuItem(String(itemId), {
        name: name.trim(),
        price: Number(price),
        category: category.trim(),
        prepTimeMinutes: Number(prepTimeMinutes),
        imageUrl: item?.imageUrl ?? "",
        isVeg,
        isSpicy,
        isAvailable,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      router.back();
    },
    onError: (error) => Alert.alert("Update failed", getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteMenuItem(String(itemId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      router.back();
    },
    onError: (error) => Alert.alert("Delete failed", getErrorMessage(error)),
  });

  if (menuQuery.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-orange-50 px-5 py-6">
        <Text className="text-zinc-700">Loading item...</Text>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView className="flex-1 bg-orange-50 px-5 py-6">
        <EmptyState
          title="Item not found"
          message="Go back and choose another menu item."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <Text className="text-3xl font-bold text-zinc-950">Edit item</Text>
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
            <View className="mt-3 flex-row items-center justify-between">
              <Text className="font-semibold text-zinc-950">Available</Text>
              <Switch value={isAvailable} onValueChange={setIsAvailable} />
            </View>
          </View>
          <Button
            title="Save changes"
            loading={updateMutation.isPending}
            onPress={() => updateMutation.mutate()}
          />
          <Button
            title="Delete item"
            variant="danger"
            loading={deleteMutation.isPending}
            onPress={() => deleteMutation.mutate()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
