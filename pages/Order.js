import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { BASE_URL, USER_ORDER_URL } from "../config/apiEndPoints";
import Line from "../components/Line";

import AppLoading from "expo-app-loading";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";

const Order = ({ navigation }) => {
  const [orders, setOrders] = useState("");

  let options = {
    dateStyle: "long",
    timeStyle: "medium",
  };

  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
  });

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;

      const getUserOrders = async () => {
        try {
          const response = await axios.get(`${USER_ORDER_URL}`);

          if (isMounted) {
            setOrders(response.data.order);
          }
        } catch (error) {
          Toast.show({
            type: "error",
            text1: `${error.response.data.message}`,
          });
        }
      };

      getUserOrders();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const navigateOrderDetails = (id) => {
    navigation.navigate("Order Details", { orderId: `${id}` });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View>
        {orders ? (
          <View style={styles.orderContainer}>
            <Text style={styles.heading}> My Orders ({orders?.length}) </Text>
            <Line margin={10} />

            {orders && orders.length === 0 ? (
              <Text style={{ marginLeft: 5, fontSize: 17, marginTop: 15 }}>
                No Orders Found.
              </Text>
            ) : (
              <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigateOrderDetails(item._id)}
                  >
                    <View style>
                      <Text style={styles.orderId}>Order Id: {item?._id} </Text>
                      {item?.isCancelled ? (
                        <Text style={styles.cancelLabel}>Cancelled</Text>
                      ) : (
                        <Text
                          style={[
                            { position: "absolute", right: 0, top: 4 },
                            item.isPaid ? styles.success : styles.error,
                          ]}
                        >
                          {item.isPaid ? "Paid" : "Not Paid"}
                        </Text>
                      )}

                      <View style={styles.orderItems}>
                        <Text style={styles.placedDate}>
                          Placed on:{" "}
                          {new Date(item?.createdAt).toLocaleString(
                            "en-US",
                            options
                          )}
                        </Text>
                        {!item?.isCancelled && (
                          <Text
                            style={[
                              { position: "absolute", right: 0, top: 6 },
                              item.isDelivered ? styles.success : styles.error,
                            ]}
                          >
                            {item.isDelivered ? "Delivered" : "Not Delivered"}
                          </Text>
                        )}
                      </View>

                      <FlatList
                        data={item.orderItems}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item: elem }) => (
                          <View style={styles.orderItems}>
                            <View>
                              <Image
                                source={{
                                  uri: `${BASE_URL}/${elem.image}`,
                                }}
                                style={styles.image}
                              />
                            </View>
                            <View style={styles.productDetails}>
                              <View>
                                <Text
                                  style={[
                                    styles.orderId,
                                    { marginTop: 0, fontSize: 13.5 },
                                  ]}
                                >
                                  {elem.name}
                                </Text>
                              </View>

                              <View>
                                <Text style={styles.totalPrice}>
                                  Rs. {elem.price}{" "}
                                </Text>
                              </View>
                              <Text
                                style={[styles.placedDate, { marginBottom: 5 }]}
                              >
                                x {elem.quantity}
                              </Text>
                            </View>
                          </View>
                        )}
                      />
                      <View>
                        <Line margin={8.5} />
                        <Text
                          style={[
                            styles.totalPrice,
                            { position: "absolute", bottom: 40, right: 0 },
                          ]}
                        >
                          Total: Rs. {item.totalPrice}{" "}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 17,
              }}
            >
              Loading...
            </Text>
          </View>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  orderContainer: {
    padding: 15,
    marginBottom: 100,
  },
  heading: {
    fontSize: 17,
    margin: 0,
    fontFamily: "OpenSans_500Medium",
  },
  orderId: {
    fontSize: 14,
    fontFamily: "OpenSans_600SemiBold",
  },
  placedDate: {
    fontSize: 13,
    marginLeft: 0,
    fontFamily: "OpenSans_400Regular",
    color: "gray",
    marginTop: 4,
    marginBottom: 10,
  },

  cancelLabel: {
    position: "absolute",
    right: 0,
    fontSize: 11,
    borderWidth: 1,
    paddingHorizontal: 3,
    paddingVertical: 2,
    fontFamily: "OpenSans_400Regular",
  },

  image: {
    height: 70,
    width: 70,
    marginBottom: 5,
  },
  success: {
    color: "green",
    fontSize: 12,
    fontFamily: "OpenSans_400Regular",
  },
  error: {
    color: "red",
    fontSize: 12,
    fontFamily: "OpenSans_400Regular",
  },

  orderItems: {
    flexDirection: "row",
    marginBottom: 5,
  },

  productDetails: {
    paddingLeft: 10,
  },

  totalPrice: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: "OpenSans_400Regular",
    color: "#1f1d1d",
  },
});

export default Order;
