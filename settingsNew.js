import $ from "jquery";
import { SettingsOpenModal, SettingsCloseModal } from "./SettingsModals";

$("#settings-new").on("click", function () {
  $(".settings-new-modal").fadeIn();
});

function openCity(cityName, elmnt) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(cityName).style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  const tablinks = document.querySelectorAll(".tablink");
  tablinks.forEach((button) => {
    button.addEventListener("click", function () {
      const cityName = this.getAttribute("data-tab");

      openCity(cityName, this);
    });
  });

  // Varsayılan olarak ilk tab'ı aç
  document.getElementById("defaultOpen").click();
});
