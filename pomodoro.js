import {
  ConfirmationPopup,
  ConfirmationPopupClose,
  ExitPomodoroConfirmationPopup,
} from "./confirmation.js";
import { OpenPomodoroOptionPhone } from "./PomodoroModal.js";
import { PomodoroPositionStart } from "./three.js";
import $ from "jquery";

var intervalId;
var completedRepetitions = 0;
var isBreak = false;
var currentTimer;

$("#start-button").on("click", function () {
  if ($(".pomodoro-button").css("opacity") == 0) {
    if ($(window).width() > 576) {
      OpenPomodoroOption();
    } else {
      OpenPomodoroOptionPhone();
    }
  } else {
    if ($(window).width() > 576) {
      ClosePomodoroOption();
    }
  }
});

$(".pomodoro-button").on("click", function (event) {
  ClosePomodoroOption();

  $("#dark").fadeIn(); //dark tema

  $(".feature-container").fadeOut(); //Alttaki buronlar
  $(".start").fadeOut(); //Alttaki buronlar
  PomodoroPositionStart();

  $(".pomodoro-counter").css("display", "flex");
  $("#pomodoro-exit").css("display", "flex");

  let p = parseFloat($(event.currentTarget).data("pomodoro")) * 60; // Pomodoro Çalışma Süresi
  let b = parseFloat($(event.currentTarget).data("break")) * 60; // Pomodoro Mola Süresi
  let r = $(event.currentTarget).data("repeat"); // Pomodoro Tekrar Süresi

  currentTimer = p;

  Counter(p, b, r);
});

function updateTimerDisplay() {
  var minutes = Math.floor(currentTimer / 60);
  var seconds = currentTimer % 60;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  $("#pomodoro-time").text(minutes + ":" + seconds);
}

function Counter(p, b, r) {
  window.intervalId = setInterval(function () {
    if (currentTimer > 0) {
      currentTimer--;

      if (currentTimer == 15) {
        ConfirmationPopup();
      }
    } else {
      ConfirmationPopupClose();
      clearInterval(window.intervalId);
      if (isBreak) {
        completedRepetitions++;
        if (completedRepetitions < r) {
          currentTimer = p;
          isBreak = false;
        } else {
          //Bitme İşlemi
        }
      } else {
        currentTimer = b;
        isBreak = true;
        //Mola başlangıcı
      }
      Counter(p, b, r);
    }
    updateTimerDisplay();
  }, 1000);
}

$("#pomodoro-exit").on("click", function () {
  ExitPomodoroConfirmationPopup();
});
function OpenPomodoroOption() {
  $(".pomodoro-s").attr("style", "display:flex !important");
  $(".pomodoro-s").animate({ opacity: 1 }, 100);
}
function ClosePomodoroOption() {
  $(".pomodoro-s").animate({ opacity: 0 }, 100);
  setTimeout(function () {
    $(".pomodoro-s").attr("style", "display:none !important");
  }, 300);
}
