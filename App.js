// import { StatusBar } from "expo-status-bar";
import { StyleSheet, StatusBar, View } from "react-native";
import Login from "./pages/Login";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "./pages/Register";
import Order from "./pages/Order";
import Toast from "react-native-toast-message";
import { toastConfig } from "./config/toastConfig";
import OrderDetails from "./pages/OrderDetails";
import axios from "axios";
import { BASE_URL } from "./config/apiEndPoints";

const Stack = createNativeStackNavigator();
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";

export default function App() {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "rgb(254,254,254)",
    },
  };

  return (
    <>
      <NavigationContainer theme={MyTheme}>
        <View style={styles.container}>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="My Order" component={Order} />
            <Stack.Screen name="Order Details" component={OrderDetails} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: "#fff",
  },
});
