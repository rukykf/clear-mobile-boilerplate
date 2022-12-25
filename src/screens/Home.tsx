import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, View } from "react-native";

export default function Home(): JSX.Element {
  const navigation = useNavigation();

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
    </View>
  );
}
