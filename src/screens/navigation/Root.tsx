import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { enableScreens } from "react-native-screens";
import ComparePhotoWithOldEntry from "screens/ComparePhotoWithOldEntry";
import Home from "screens/Home";
import ListEntries from "screens/ListEntries";
import { RootParamList } from "screens/navigation/types";
import NewPhotoEntry from "screens/NewPhotoEntry";

enableScreens();

const Root = createStackNavigator<RootParamList>();

export default function Navigation(): JSX.Element {
  return (
    <NavigationContainer<RootParamList>>
      <Root.Navigator initialRouteName="Home">
        <Root.Screen name="Home" component={Home} />
        <Root.Screen
          name="ComparePhotoWithOldEntry"
          component={ComparePhotoWithOldEntry}
        />
        <Root.Screen name="NewPhotoEntry" component={NewPhotoEntry} />
        <Root.Screen name="ListEntries" component={ListEntries} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
