import { Text, View, Platform } from "react-native";
import App from "../src/App";

export default function Index() {
  // For web, render the React web app located in src/App.tsx
  if (Platform.OS === "web") {
    return <App />;
  }

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
