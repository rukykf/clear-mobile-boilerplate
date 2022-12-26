import React from "react";
import { Text, View } from "react-native";

export default function DisplayPhotoEntry({
  entry,
}: {
  entry: Entry;
}): JSX.Element {
  return (
    <View>
      <Text>{JSON.stringify(entry)}</Text>
    </View>
  );
}

export interface Entry {
  entryId: string;
  createdAt: string;
  base64Image: string;
}
