import toastr from "toastr";
import "toastr/build/toastr.css";

toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

// Toastr'ı kullanarak bir bildirim gösteren fonksiyon
export function showNotification(message, type) {
  toastr[type](message, type.charAt(0).toUpperCase() + type.slice(1));
}
