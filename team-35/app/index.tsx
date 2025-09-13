import { Text, View, Platform } from "react-native";
import App from "../src/App";

export default function Index() {
  // デバッグログ追加
  console.log("Platform.OS:", Platform.OS);
  
  // For web, render the React web app located in src/App.tsx
  if (Platform.OS === "web") {
    console.log("Loading src/App for web platform");
    return <App />;
  }

  console.log("Loading native placeholder");
  // For native (iOS/Android) keep the original placeholder
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
