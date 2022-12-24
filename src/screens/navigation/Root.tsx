import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { enableScreens } from "react-native-screens";
import Home from "screens/Home";
import ImageComparison from "screens/ImageComparison";
import PhotoToBase64 from "screens/PhotoToBase64";
import { RootParamList } from "screens/navigation/types";

enableScreens();

const Root = createStackNavigator<RootParamList>();

export default function Navigation(): JSX.Element {
  return (
    <NavigationContainer<RootParamList>>
      <Root.Navigator initialRouteName="ImageComparison">
        <Root.Screen name="Home" component={Home} />
        <Root.Screen name="ImageComparison" component={ImageComparison} />
        <Root.Screen name="Photos" component={PhotoToBase64} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
