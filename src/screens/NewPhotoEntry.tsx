import { useNavigation } from "@react-navigation/native";
import { Camera, CameraType } from "expo-camera";
import * as SecureStore from "expo-secure-store";

import React from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { graphql, useMutation } from "react-relay";

let camera: Camera | null = null;

const NewPhotoEntryQuery = graphql`
  mutation NewPhotoEntryQuery($input: String!, $token: String!) {
    createNewEntry(base64Image: $input, authToken: $token)
  }
`;

export default function NewPhotoEntry(): JSX.Element {
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState<any>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraType, setCameraType] = React.useState(CameraType.back);
  const [commitMutation, isUploadingPhoto] = useMutation(NewPhotoEntryQuery);

  const navigation = useNavigation();

  const takePicture = async () => {
    if (camera) {
      const capturedPhoto = await camera.takePictureAsync({
        base64: true,
      });
      setPreviewVisible(true);
      setCapturedImage(capturedPhoto);
    }
  };

  const savePhoto = async () => {
    const authToken = await SecureStore.getItemAsync("auth-token");
    commitMutation({
      variables: { input: capturedImage.base64, token: authToken },
      onCompleted: resetAfterSuccessfulUpload,
      onError: resetAfterFailedUpload,
    });
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
  };

  const resetAfterSuccessfulUpload = () => {
    Alert.alert(
      "Image Uploaded Successfully! You can take another picture now or go back to the home screen with the back button"
    );
    retakePicture();
  };

  const resetAfterFailedUpload = () => {
    Alert.alert(
      "Something Went Wrong While Saving! Taking you back to the home screen..."
    );
    navigation.navigate("Home", {});
  };

  const switchCamera = () => {
    if (cameraType === CameraType.back) {
      setCameraType(CameraType.front);
    } else {
      setCameraType(CameraType.back);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (isUploadingPhoto) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {previewVisible && capturedImage ? (
        <CameraPreview
          photo={capturedImage}
          savePhoto={savePhoto}
          retakePicture={retakePicture}
        />
      ) : (
        <Camera
          type={cameraType}
          style={styles.camera}
          ref={(ref) => {
            camera = ref;
          }}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={switchCamera} style={styles.button}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await takePicture();
              }}
              style={styles.button}
            >
              <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    margin: 10,
  },
});

const CameraPreview = ({ photo, retakePicture, savePhoto }: any) => {
  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={retakePicture}
            style={{
              width: 130,
              height: 40,

              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
              }}
            >
              Re-take
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={savePhoto}
            style={{
              width: 130,
              height: 40,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
              }}
            >
              save photo
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};
