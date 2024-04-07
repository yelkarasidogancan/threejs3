import $ from "jquery";
import { selectedObject, objectMoved, animateToInitialPosition } from "./three";
import toastr from "toastr";
import { showNotification } from "./toastr.js";

$.extend($.easing, {
  easeOutQuad: function (x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
});
window._editMode = false;
$("#edit-mode").click(function () {
  EditModeToggle();
});

export function EditModeToggle() {
  window._editMode = !window._editMode;
  if (window._editMode) {
    $(".start").fadeOut();
    $("#edit-features").fadeIn();
    $(".arrow-container").fadeIn();

    $(".profile-container").fadeOut();
    $("#edit-mode").css("background-color", "red");
  } else {
    EditModeClose();
  }
}

export function EditModeClose() {
  if (selectedObject) {
    toastr.error("Konumlandırmadığın eşyan var");
    console.log("Konumlandırmadığın eşyan var");
    window._editMode = true;
    return;
  }

  if (objectMoved) {
    toastr.error("Hareket ettirdiğin obje var!");
    console.log("Hareket ettirdiğin obje var!");
    window._editMode = true;
    return;
  }
  window._editMode = false;
  animateToInitialPosition();
  $(".start").fadeIn();
  $("#edit-features").fadeOut();
  $(".arrow-container").fadeOut();
  $(".profile-container").fadeIn();
  $("#edit-mode").css("background-color", "#009AF7");
}
