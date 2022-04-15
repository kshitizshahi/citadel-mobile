import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Toast from "react-native-toast-message";
import { LOGIN_URL } from "../config/apiEndPoints";

const Login = ({ navigation }) => {
  const loginSchema = yup
    .object({
      email: yup
        .string()
        .email("Invalid email address.")
        .required("This field is required."),
      password: yup.string().required("This field is required."),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
  });

  const loginHandler = async (data) => {
    try {
      const response = await axios.post(`${LOGIN_URL}`, {
        email: data.email,
        password: data.password,
      });
      if (response.data) {
        Toast.show({
          type: "success",
          text1: `${response.data.message}`,
        });
        navigation.navigate("My Order");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message}`,
      });
    }
  };
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.heading}> Login </Text>

        <Text style={styles.label}> Email </Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
          name="email"
        />
        <Text style={styles.error}>{errors.email?.message || "\u00A0"}</Text>

        <Text style={styles.label}> Password </Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry={true}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
          name="password"
        />
        <Text style={styles.error}>{errors.password?.message || "\u00A0"}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(loginHandler)}
        >
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.link}>
          Not Registered?{" "}
          <Text
            onPress={() => navigation.navigate("Register")}
            style={[
              styles.link,
              { color: "#185638", fontFamily: "OpenSans_600SemiBold" },
            ]}
          >
            Create an account
          </Text>
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  loginContainer: {
    padding: 10,
    marginHorizontal: 23,
    marginVertical: 40,
    flex: 1,
  },
  heading: {
    fontSize: 35,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "OpenSans_400Regular",
  },
  label: {
    fontSize: 15,
    fontFamily: "OpenSans_500Medium",
    marginLeft: 0,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#a4a4a4",
    padding: 10,
    marginTop: 8,
    color: "#000",
    fontSize: 17,
    borderRadius: 3,
    fontFamily: "OpenSans_400Regular",
  },
  button: {
    backgroundColor: "#1f1d1d",
    padding: 8.5,
    marginTop: 20,
    color: "#fff",
    borderRadius: 3,
  },
  btnText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "OpenSans_400Regular",
  },

  link: {
    color: "#1f1d1d",
    marginTop: 20,
    fontSize: 16,
    fontFamily: "OpenSans_400Regular",
  },

  error: {
    color: "#ff0033",
    fontSize: 12.1,
    marginVertical: 2,
    fontFamily: "OpenSans_400Regular",
  },
});

export default Login;
