import { Stack } from "expo-router";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "../stores/store";   // đường dẫn tới store của bạn

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider theme={MD3LightTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </Provider>
  );
}
