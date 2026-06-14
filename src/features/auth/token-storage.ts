import * as SecureStore from "expo-secure-store";

const authTokenKey = "food_truck_auth_token";

export async function getAuthToken() {
  return SecureStore.getItemAsync(authTokenKey);
}

export async function saveAuthToken(token: string) {
  await SecureStore.setItemAsync(authTokenKey, token);
}

export async function deleteAuthToken() {
  await SecureStore.deleteItemAsync(authTokenKey);
}
