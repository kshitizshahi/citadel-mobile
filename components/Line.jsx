import { View } from "react-native";

const Line = ({ margin }) => {
  return (
    <View
      style={{
        borderBottomColor: "black",
        borderBottomWidth: 0.7,
        marginVertical: margin,
      }}
    />
  );
};

export default Line;
