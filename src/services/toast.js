import toast from "react-hot-toast";

const newToast = (message, bgColor) => {
  toast(message, {
    style: {
      border: "1px solid gray",
      backgroundColor: bgColor,
      color: "white",
    },
  });
};

export default newToast;
