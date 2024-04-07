import $ from "jquery";
import { SettingsOpenModal, SettingsCloseModal } from "./SettingsModals";
$("#settings-button").on("click", function () {
  $.ajax({
    url: "./Modals/SettingsModal.html",
    success: function (data) {
      $(".settings-modal-content").html(data);
      $("#settings-modal").fadeIn();

      var firstTabId = $(".tab").first().attr("href");
      window.location.hash = firstTabId;

      $(".quit-modal").on("click", function () {
        SettingsCloseModal();
      });
    },
  });
});
