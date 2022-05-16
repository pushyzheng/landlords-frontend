import Vue from "vue";

export default {
  warning: message => {
    Vue.$toast.open({
      position: "top",
      type: "warning",
      message: message
    });
  },
  success: message => {
    Vue.$toast.open({
      position: "top",
      type: "success",
      message: message
    });
  },
  error: message => {
    Vue.$toast.open({
      position: "top",
      type: "error",
      message: message
    });
  },
  info: message => {
    Vue.$toast.open({
      position: "top",
      type: "error",
      message: message
    });
  },
  default: message => {
    Vue.$toast.open({
      position: "top",
      type: "error",
      message: message
    });
  }
}
