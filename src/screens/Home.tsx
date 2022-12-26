import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Alert, Button, View } from "react-native";

export default function Home(): JSX.Element {
  const navigation = useNavigation();

  const logout = async () => {
    await SecureStore.deleteItemAsync("auth-token");
    Alert.alert("Logged out successfully!");
    navigation.navigate("RegistrationLogin", {});
  };

  return (
    <View>
      <View style={{ margin: 20 }}>
        <Button
          title="Create New Photo Entry"
          onPress={() => navigation.navigate("NewPhotoEntry", {})}
        />
      </View>
      <View style={{ margin: 20 }}>
        <Button
          title="View Previous Entries"
          onPress={() => navigation.navigate("ListEntries", {})}
        />
      </View>
      <View style={{ margin: 20 }}>
        <Button
          title="Compare Photo With Past Entry"
          onPress={() => navigation.navigate("ComparePhotoWithOldEntry", {})}
        />
      </View>
      <View style={{ margin: 20 }}>
        <Button
          title="Logout"
          onPress={async () => {
            await logout();
          }}
        />
      </View>
    </View>
  );
}
