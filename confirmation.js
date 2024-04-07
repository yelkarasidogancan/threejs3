import $ from "jquery";
import { PomodoroPositionEnd } from "./three.js";
export function ConfirmationPopup() {
  $("#modal").fadeIn();
  $("#confirmation-button").on("click", function () {
    $("#modal").fadeOut();
    window.gold += 100;
    $("#gold").html(window.gold);
  });
}
export function ConfirmationPopupClose() {
  $("#modal").fadeOut();
}

export function ExitPomodoroConfirmationPopup() {
  $("#cancel-pomodoro-modal").fadeIn();
  $("#cancel-pomodoro-button").on("click", function () {
    $("#cancel-pomodoro-modal").fadeOut();

    $(".pomodoro-counter").fadeOut();
    $("#dark").fadeOut();
    clearInterval(window.intervalId);
    $(".feature-container").fadeIn();
    $(".start").fadeIn();
    PomodoroPositionEnd();
  });
}
