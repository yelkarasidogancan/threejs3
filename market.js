import $ from "jquery";
import { EditModeClose } from "./edit";

$.extend($.easing, {
  easeOutQuad: function (x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
});
window.market = true;

$("#market-button").click(function () {
  window.market = -window.market;
  if (window.market == -1) {
    $("#market-container").animate(
      {
        bottom: "20px",
      },
      {
        duration: 500,
        easing: "easeOutQuad", // özel easeOutQuad fonksiyonunu kullanma
      }
    );
    $("#market-button").css("background-color", "red");
  } else {
    $("#market-container").animate(
      {
        bottom: "-150px",
      },
      {
        duration: 500,
        easing: "easeOutQuad", // özel easeOutQuad fonksiyonunu kullanma
      }
    );
    $("#market-button").css("background-color", "#009AF7");
    EditModeClose();
  }
});
$("#market-close-button").click(function () {
  window.market = -window.market;
  $("#market-container").animate(
    {
      bottom: "-150px",
    },
    {
      duration: 500,
      easing: "easeOutQuad", // özel easeOutQuad fonksiyonunu kullanma
    }
  );
});

$("#market-content").on("mousewheel DOMMouseScroll", function (event) {
  var delta = Math.max(
    -1,
    Math.min(1, event.originalEvent.wheelDelta || -event.originalEvent.detail)
  );

  var scrollLeft = $(this).scrollLeft();
  var targetScroll = scrollLeft - delta * 80;

  $(this).stop().animate(
    {
      scrollLeft: targetScroll,
    },
    {
      easing: "easeOutQuad", // özel easeOutQuad fonksiyonunu kullanma
    }
  );
  event.preventDefault();
});
