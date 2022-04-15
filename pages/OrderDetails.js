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
import {
  BASE_URL,
  CANCEL_ORDER_URL,
  USER_SINGLE_ORDER_URL,
} from "../config/apiEndPoints";
import Line from "../components/Line";
import Toast from "react-native-toast-message";

import AppLoading from "expo-app-loading";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";

const OrderDetails = ({ route }) => {
  const [order, setOrder] = useState("");
  const [orderCancel, setOrderCancel] = useState("");

  let totalItems;

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
      const getUserOrder = async () => {
        try {
          const response = await axios.get(
            `${USER_SINGLE_ORDER_URL}/${route.params.orderId}`
          );

          if (isMounted) {
            setOrder(response.data.order);
          }
        } catch (error) {
          Toast.show({
            type: "error",
            text1: `${error.response.data.message}`,
          });
        }
      };

      getUserOrder();

      return () => {
        isMounted = false;
      };
    }, [orderCancel])
  );

  if (order) {
    if (order.orderItems) {
      totalItems = order.orderItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    }
  }

  const cancelOrder = async (id) => {
    try {
      const res = await axios.put(`${CANCEL_ORDER_URL}/${id}`);
      if (res.data) {
        Toast.show({
          type: "success",
          text1: `${res.data.message}`,
        });
        setOrderCancel(!orderCancel);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${error.response.data.message}`,
      });
    }
  };

  const headerComponent = () => {
    return (
      <View>
        <Text style={styles.orderId}> Order Id: {order?._id} </Text>
        <Text style={styles.placedDate}>
          Placed on:{" "}
          {new Date(order?.createdAt).toLocaleString("en-US", options)}
        </Text>
        {order?.isCancelled ? (
          <Text style={styles.cancelLabel}>Cancelled</Text>
        ) : null}

        <Line margin={15} />
      </View>
    );
  };

  const footerComponent = () => {
    return (
      <>
        <View
          style={{
            // width: "60%",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          {!order.isCancelled && (
            <TouchableOpacity
              style={styles.cancelOrder}
              onPress={() => cancelOrder(order._id)}
            >
              <Text style={styles.cancelOrder}>Cancel Order</Text>
            </TouchableOpacity>
          )}
        </View>

        <Line margin={12} style={{ marginBottom: 0 }} />
        <View>
          <Text style={styles.font}>PAYMENT</Text>
          <Text style={[styles.font, styles.subItems]}>
            Method: {order?.paymentMethod}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 12.5 }}>Status: </Text>
            <Text style={order?.isPaid ? styles.success : styles.error}>
              {order?.isPaid
                ? `Paid at ${new Date(
                    order?.paymentResult?.paidAt
                  ).toLocaleString("en-US", options)}`
                : "Not Paid"}
            </Text>
          </View>
          <Line margin={13} style={{ marginBottom: 0 }} />
        </View>
        <Text style={[styles.font, { marginBottom: 8 }]}>ORDER SUMMARY</Text>
        <View>
          <Text style={styles.subTotal}>Subtotal ({totalItems}) items</Text>
          <Text
            style={[
              styles.subTotal,
              {
                position: "absolute",
                right: 0,
                fontSize: 13,
                marginBottom: 0,
              },
            ]}
          >
            Rs. {order.totalPrice - order.shippingPrice}
          </Text>
        </View>
        <View>
          <Text style={styles.subTotal}>Shipping</Text>
          <Text
            style={[
              styles.subTotal,
              { position: "absolute", right: 0, fontSize: 13 },
            ]}
          >
            {order.shippingPrice > 0 ? `Rs. ${order.shippingPrice}` : `Free`}
          </Text>
        </View>
        <Line margin={13} />

        <View>
          <Text>Total</Text>
          <Text style={styles.totalOrderSummary}>Rs. {order.totalPrice}</Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <View>
            <View>
              <Text style={styles.font}>USER</Text>
            </View>
            <Line margin={10} />

            <Text style={styles.user}>
              Name: {order?.user?.firstName} {""}
              {order?.user?.lastName}
            </Text>
            <Text style={[styles.user, { marginBottom: 18 }]}>
              Email: {order?.user?.email}
            </Text>
          </View>
        </View>
        <View>
          <View>
            <View>
              <Text style={styles.font}>SHIPPING</Text>
            </View>
            <Line margin={10} />
            <Text style={[styles.user, { marginBottom: 4 }]}>
              Address: {order?.shippingAddress?.address},{" "}
              {order?.shippingAddress?.city}{" "}
              {order?.shippingAddress?.postalCode},{" "}
              {order?.shippingAddress?.country}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 30,
              }}
            >
              <Text style={styles.user}>Status: </Text>
              <Text style={order?.isDelivered ? styles.success : styles.error}>
                {order.isDelivered
                  ? `Delivered at ${new Date(order.deliveredAt).toLocaleString(
                      "en-US",
                      options
                    )}`
                  : "Not Delivered"}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <>
        {order ? (
          <FlatList
            data={order?.orderItems}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={headerComponent}
            ListFooterComponent={footerComponent}
            style={styles.orderContainer}
            renderItem={({ item: elem }) => (
              <>
                <Text
                  style={[
                    styles.placedDate,
                    {
                      fontSize: 14,
                      position: "absolute",
                      right: 0,
                      top: 10,
                    },
                  ]}
                >
                  x {elem.quantity}
                </Text>

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
                        style={[styles.orderId, { marginTop: 0, fontSize: 14 }]}
                      >
                        {elem.name}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.placedDate, { marginTop: 2 }]}>
                        {elem?.brand}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.totalPrice}>Rs. {elem.price} </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          />
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
      </>
    );
  }
};

const styles = StyleSheet.create({
  orderContainer: {
    padding: 15,
  },
  font: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
  },
  subItems: {
    fontSize: 12.5,
    marginTop: 8,
    marginBottom: 2,
  },
  user: {
    fontSize: 12.5,
    marginBottom: 4,
  },
  subTotal: {
    color: "gray",
    marginBottom: 4,
    fontFamily: "OpenSans_400Regular",
    fontSize: 13,
  },
  orderId: {
    fontSize: 14,
    fontFamily: "OpenSans_600SemiBold",
    marginLeft: 0,
  },
  placedDate: {
    fontSize: 13.5,
    marginLeft: 0,
    fontFamily: "OpenSans_400Regular",
    color: "gray",
    marginTop: 4,
  },
  itemsPrice: {
    fontSize: 13.5,
  },
  cancelLabel: {
    position: "absolute",
    right: 0,
    top: 0,
    fontSize: 11,
    borderWidth: 1,
    paddingHorizontal: 3,
    paddingVertical: 2,
    fontFamily: "OpenSans_400Regular",
  },

  cancelOrder: {
    backgroundColor: "#1f1d1d",
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 3.5,
    paddingVertical: 3,
    textAlign: "center",
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
    marginTop: 1.4,
  },
  error: {
    color: "red",
    fontSize: 12,
    fontFamily: "OpenSans_400Regular",
    marginTop: 1.4,
  },

  orderItems: {
    flexDirection: "row",
    marginBottom: 5,
  },

  productDetails: {
    paddingLeft: 10,
  },

  totalPrice: {
    marginTop: 5,
    fontSize: 13.9,
    fontFamily: "OpenSans_400Regular",
    color: "#1f1d1d",
  },

  totalOrderSummary: {
    fontSize: 13.9,
    fontFamily: "OpenSans_400Regular",
    color: "#1f1d1d",
    position: "absolute",
    right: 0,
  },
});

export default OrderDetails;
