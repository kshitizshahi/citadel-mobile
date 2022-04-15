import { ErrorToast, SuccessToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props) => (
    <SuccessToast
      {...props}
      text1Style={{
        fontSize: 16,
        fontWeight: "400",
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 16,
        fontWeight: "400",
      }}
    />
  ),
};
