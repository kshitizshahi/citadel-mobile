import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
import { REGISTER_URL } from "../config/apiEndPoints";

const Register = ({ navigation }) => {
  const registerSchema = yup
    .object({
      firstName: yup.string().required("This field is required."),
      lastName: yup.string().required("This field is required."),
      email: yup
        .string()
        .email("Invalid email address.")
        .required("This field is required."),

      phoneNumber: yup
        .string()
        .required("This field is required.")
        .matches(/^[1-9]+[0-9]*$/, "Invalid phone number")
        .min(10, "Phone number should be at least 10 digits."),

      password: yup
        .string()
        .required("This field is required.")
        .min(8, "Password must be at least 8 characters."),

      confirmPassword: yup
        .string()
        .required("This field is required.")
        .test("checkPassword", "Password does not match", (value) => {
          return value === getValues("password");
        }),
    })
    .required();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
  });

  const registerHandler = async (data) => {
    try {
      const response = await axios.post(`${REGISTER_URL}`, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
        isSeller: false,
      });
      if (response.data) {
        Toast.show({
          type: "success",
          text1: `${response.data.message}`,
        });
        navigation.navigate("Login");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${error.response.data.message}`,
      });
    }
  };
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <ScrollView style={styles.registerContainer}>
        <View>
          <Text style={styles.heading}> Create Account </Text>

          <View>
            <Text style={styles.label}> First Name </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="First Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
              name="firstName"
            />
            <Text style={styles.error}>
              {errors.firstName?.message || "\u00A0"}
            </Text>
          </View>

          <View>
            <Text style={styles.label}> Last Name </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Last Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
              name="lastName"
            />
            <Text style={styles.error}>
              {errors.lastName?.message || "\u00A0"}
            </Text>
          </View>

          <View>
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
            <Text style={styles.error}>
              {errors.email?.message || "\u00A0"}
            </Text>
          </View>

          <View>
            <Text style={styles.label}> Phone Number </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder=" Phone Number"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
              name="phoneNumber"
            />
            <Text style={styles.error}>
              {errors.phoneNumber?.message || "\u00A0"}
            </Text>
          </View>

          <View>
            <Text style={styles.label}> Password </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter Password"
                  style={styles.input}
                  secureTextEntry={true}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              name="password"
            />
            <Text style={styles.error}>
              {errors.password?.message || "\u00A0"}
            </Text>
          </View>

          <View>
            <Text style={styles.label}> Confirm Password </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Re-enter password"
                  style={styles.input}
                  secureTextEntry={true}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              name="confirmPassword"
            />
            <Text style={styles.error}>
              {errors.confirmPassword?.message || "\u00A0"}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(registerHandler)}
            >
              <Text style={styles.btnText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.link}>
              Already have an account?{" "}
              <Text
                onPress={() => navigation.navigate("Login")}
                style={[
                  styles.link,
                  { color: "#185638", fontFamily: "OpenSans_600SemiBold" },
                ]}
              >
                Log In
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  registerContainer: {
    padding: 10,
    marginHorizontal: 15,
    flex: 1,
  },
  heading: {
    fontSize: 23,
    textAlign: "center",
    marginBottom: 25,
    fontFamily: "OpenSans_400Regular",
  },
  label: {
    fontSize: 13.5,
    fontFamily: "OpenSans_500Medium",
    marginLeft: 0,
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: "#a4a4a4",
    padding: 10,
    marginTop: 8,
    color: "#000",
    fontSize: 15,
    borderRadius: 3,
    fontFamily: "OpenSans_400Regular",
  },
  button: {
    backgroundColor: "#1f1d1d",
    padding: 8,
    marginTop: 8,
    color: "#fff",
    borderRadius: 3,
  },
  btnText: {
    color: "#fff",
    fontSize: 16.5,
    textAlign: "center",
    fontFamily: "OpenSans_400Regular",
  },

  link: {
    color: "#1f1d1d",
    marginTop: 15,
    marginBottom: 25,
    fontSize: 15,
  },

  error: {
    color: "#ff0033",
    fontSize: 11.5,
    marginVertical: 1.5,
    fontFamily: "OpenSans_400Regular",
  },
});

export default Register;
