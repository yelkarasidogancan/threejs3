import $ from "jquery";

$(".close").on("click", function () {
  $("#modal").fadeOut();
});

$.extend($.easing, {
  easeOutQuad: function (x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
});
let music = true;

$("#music-disc").on("click", function () {
  music = -music;
  if (music == -1) {
    $(".music-container").animate(
      {
        right: "0px",
      },
      {
        duration: 500,
        easing: "easeOutQuad", // özel easeOutQuad fonksiyonunu kullanma
      }
    );
  } else {
    $(".music-container").animate(
      {
        right: "-240px",
      },
      {
        duration: 500,
        easing: "easeOutQuad", // özel easeOutQuad fonksiyonunu kullanma
      }
    );
  }
});
$("#music-play").on("click", function () {});

var isPlaying = false;
var audio = new Audio();
var progressBar = $("#progress-bar");
var currentIndex = 0;
var musicList = [
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    source:
      "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/3.mp3",
  },
  {
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    source:
      "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/1.mp3",
  },
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    source:
      "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3",
  },
  // Diğer şarkıları buraya ekleyebilirsiniz
];
var savedTime = 0; // Kaydedilen zaman

function playMusic(index) {
  $("#music-disc").addClass("active");

  var song = musicList[index];
  audio.src = song.source;
  audio.currentTime = savedTime; // Kaldığı yerden devam etmek için
  audio.play();
  $("#song-title").text(song.title);
  $("#artist").text(song.artist);
  isPlaying = true;
}

function pauseMusic() {
  $("#music-disc").removeClass("active");
  audio.pause();
  isPlaying = false;
  savedTime = audio.currentTime;
}

$("#music-play").on("click", function () {
  if (isPlaying) {
    pauseMusic();
    $("#music-play").removeClass("fa-circle-stop").addClass("fa-play");
  } else {
    playMusic(currentIndex);
    $("#music-play").removeClass("fa-play").addClass("fa-circle-stop");
  }
});

$("#pause").on("click", function () {
  pauseMusic();
});

$("#music-next").on("click", function () {
  $("#music-play").removeClass("fa-play").addClass("fa-circle-stop");
  savedTime = 0;
  currentIndex = (currentIndex + 1) % musicList.length;
  playMusic(currentIndex);
});

$("#music-prev").on("click", function () {
  $("#music-play").removeClass("fa-play").addClass("fa-circle-stop");
  savedTime = 0;
  currentIndex = (currentIndex - 1 + musicList.length) % musicList.length;
  playMusic(currentIndex);
});
