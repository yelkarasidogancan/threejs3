import $ from "jquery";

$.extend($.easing, {
  easeOutQuad: function (x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
});
window.inventory = true;

$("#inventory-button").click(function () {
  window.inventory = -window.inventory;
  if (window.inventory == -1) {
    $("#inventory-container").animate(
      {
        left: "20px",
      },
      {
        duration: 500,
        easing: "easeOutQuad", // özel easeOutQuad fonksiyonunu kullanma
      }
    );
    $("#inventory-button").css("background-color", "red");
  } else {
    $("#inventory-container").animate(
      {
        left: "-350px",
      },
      {
        duration: 500,
        easing: "easeOutQuad", // özel easeOutQuad fonksiyonunu kullanma
      }
    );
    $("#inventory-button").css("background-color", "#009AF7");
  }
});
$("#inventory-close-button").click(function () {
  window.inventory = -window.inventory;
  $("#inventory-container").animate(
    {
      left: "-350px",
    },
    {
      duration: 500,
      easing: "easeOutQuad", // özel easeOutQuad fonksiyonunu kullanma
    }
  );
  $("#inventory-button").css("background-color", "#009AF7");
});
