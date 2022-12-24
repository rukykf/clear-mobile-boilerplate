import { useNavigation } from "@react-navigation/native";
import { Camera, CameraType } from "expo-camera";
import React from "react";
import {
  Alert,
  Button,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

let camera: Camera | null = null;

export default function App() {
  let [previewVisible, setPreviewVisible] = React.useState(false);
  let [capturedImage, setCapturedImage] = React.useState<any>(null);
  let [permission, requestPermission] = Camera.useCameraPermissions();
  let [cameraType, setCameraType] = React.useState(CameraType.back);
  let navigation = useNavigation();

  const takePictureAsync = async () => {
    console.log("Checking in...");
    if (camera) {
      const capturedPhoto = await camera.takePictureAsync({
        base64: true,
      });
      console.log(capturedPhoto);
      setPreviewVisible(true);
      setCapturedImage(capturedPhoto);
    }
  };

  const savePhoto = () => {
    let photoBase64 = "data:image/jpg;base64," + capturedImage.base64;
    console.log(photoBase64);
    Alert.alert("Entry saved!");
    navigation.navigate("Home");
  };
  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
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
                await takePictureAsync();
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
  console.log("sdsfds", photo);
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
