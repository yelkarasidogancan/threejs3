import $ from "jquery";

export function OpenPomodoroOptionPhone() {
  $(".start-pomodoro-modal").fadeIn();
}
$("#exit-phone").on("click", function () {
  $(".start-pomodoro-modal").fadeOut();
});
