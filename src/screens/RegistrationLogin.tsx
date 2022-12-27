import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { graphql, useMutation } from "react-relay";

const RegistrationLoginQuery = graphql`
  mutation RegistrationLoginQuery(
    $usernameInput: String!
    $passwordInput: String!
  ) {
    getAuthToken(username: $usernameInput, password: $passwordInput)
  }
`;

export default function RegistrationLogin(): JSX.Element {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);
  const [commitMutation, isGettingAuthToken] = useMutation(
    RegistrationLoginQuery
  );
  const navigation = useNavigation();

  useEffect(() => {
    if (usernameValue.length > 0 && passwordValue.length > 0) {
      setDisableSubmitButton(false);
    } else {
      setDisableSubmitButton(true);
    }
  }, [usernameValue, passwordValue]);

  const loginOrRegisterUser = async () => {
    commitMutation({
      variables: { usernameInput: usernameValue, passwordInput: passwordValue },
      onCompleted: navigateToHome,
      onError: displayErrorMessage,
    });
  };

  const navigateToHome = (value) => {
    const saveAuthToken = async () => {
      await SecureStore.setItemAsync("auth-token", value.getAuthToken);
      Alert.alert("Login worked!");
      navigation.navigate("Home", {});
    };

    saveAuthToken().catch((error) =>
      Alert.alert("Login failed! Try again later")
    );
  };

  const displayErrorMessage = (error) => {
    console.log(`Error logging user in: ${JSON.stringify(error)}`);
    Alert.alert("Something went wrong! Try again later");
  };

  return (
    <SafeAreaView style={{ margin: 20 }}>
      <Text>Username</Text>
      <TextInput
        style={styles.input}
        value={usernameValue}
        onChangeText={setUsernameValue}
      />
      <Text>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={passwordValue}
        onChangeText={setPasswordValue}
      />
      {isGettingAuthToken ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Submit"
          disabled={disableSubmitButton}
          onPress={loginOrRegisterUser}
        />
      )}

      <View>
        <Text>
          The auth flow isn't wired up to a database. Just type in any username and
          password, anything will work fine, so long as there's an actual input
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
