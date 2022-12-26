import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { enableScreens } from "react-native-screens";
import ComparePhotoWithOldEntry from "screens/ComparePhotoWithOldEntry";
import Home from "screens/Home";
import ListEntries from "screens/ListEntries";
import { RootParamList } from "screens/navigation/types";
import NewPhotoEntry from "screens/NewPhotoEntry";
import RegistrationLogin from "screens/RegistrationLogin";

enableScreens();

const Root = createStackNavigator<RootParamList>();

export default function Navigation(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkForAuthToken = async () => {
      const authToken = await SecureStore.getItemAsync("auth-token");
      if (authToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkForAuthToken().catch((error) => {
      console.log(`Error retrieving auth: ${error}`);
    });
  }, [setIsAuthenticated]);

  return (
    <NavigationContainer<RootParamList>>
      <Root.Navigator
        initialRouteName={isAuthenticated ? "Home" : "RegistrationLogin"}
      >
        <Root.Screen name="Home" component={Home} />
        <Root.Screen
          name="ComparePhotoWithOldEntry"
          component={ComparePhotoWithOldEntry}
        />
        <Root.Screen name="NewPhotoEntry" component={NewPhotoEntry} />
        <Root.Screen name="ListEntries" component={ListEntries} />
        <Root.Screen name="RegistrationLogin" component={RegistrationLogin} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
