const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const currentDuration = $(".current-duration");
const totalDuration = $(".total-duration");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  songs: [
    {
      name: "Tip Toe",
      singer: "HYBS",
      path: "./assets/music/tiptoe-hybs.mp3",
      image: "./assets/img/tiptoe.jpg",
    },
    {
      name: "Ride",
      singer: "HYBS",
      path: "./assets/music/ride-hybs.mp3",
      image: "./assets/img/ride.jpg",
    },
    {
      name: "Mơ Làm Ma",
      singer: "Ngọt",
      path: "./assets/music/molamma-ngot.mp3",
      image: "./assets/img/molamma.jpg",
    },
    {
      name: "Nứt",
      singer: "Ngọt",
      path: "./assets/music/nut-ngot.mp3",
      image: "./assets/img/nut.jpg",
    },
    {
      name: "Lần Cuối",
      singer: "Ngọt",
      path: "./assets/music/lancuoi-ngot.mp3",
      image: "./assets/img/lancuoi.jpg",
    },
    {
      name: "Falling Slowly",
      singer: "DAESUNG",
      path: "./assets/music/fallingslowly-daesung.mp3",
      image: "./assets/img/fallingslowly.jpg",
    },
    {
      name: "DOOM DADA",
      singer: "T.O.P",
      path: "./assets/music/doomdada-TOP.mp3",
      image: "./assets/img/doomdada.jpg",
    },
    {
      name: "Untitled,2014",
      singer: "G-DRAGON ",
      path: "./assets/music/untitled,2014-gd.mp3",
      image: "./assets/img/untitled2014.jpg",
    },
    {
      name: "Seed",
      singer: "TAEYANG",
      path: "./assets/music/seed-taeyang.mp3",
      image: "./assets/img/seed.jpg",
    },
    {
      name: "Still Life",
      singer: "BIGBANG",
      path: "./assets/music/StillLife-BigBang.mp3",
      image: "./assets/img/stilllife.jpg",
    },
    {
      name: "Last Dance",
      singer: "BIGBANG",
      path: "./assets/music/LastDance-BigBang.mp3",
      image: "./assets/img/lastdance.jpg",
    },
  ],

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
            <div
              class="thumb"
              style="background-image: url('${song.image}');">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10s
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Xử lý khi scroll
    const cdWidth = cd.offsetWidth;

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // Khi play song
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // Khi pause song
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Xử lý thay đổi tiến độ play
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }

      currentDuration.textContent = app.formatTime(audio.currentTime);
      totalDuration.textContent = app.formatTime(audio.duration || 0);
    };

    // Xử lý khi tua bài hát
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Xử lý khi next song
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };

    // Xử lý khi prev song
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };

    // Xử lý khi bật / tắt random
    randomBtn.onclick = function (e) {
      app.isRandom = !app.isRandom;
      app.setConfig("isRandom", app.isRandom);
      randomBtn.classList.toggle("active", app.isRandom);
    };

    // Xử lý khi bật / tắt repeat
    repeatBtn.onclick = function (e) {
      app.isRepeat = !app.isRepeat;
      app.setConfig("isRepeat", app.isRepeat);
      repeatBtn.classList.toggle("active", app.isRepeat);
    };

    // Xử lý khi audio ended
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi khi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      const optionNode = e.target.closest(".option");
      if (songNode || optionNode) {
        // Xử lý khi click vào song trên playlist
        if (songNode) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          audio.play();
          app.render();
          app.scrollToActiveSong();
        }
      }
    };
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  formatTime: function (seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds =
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
  },

  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();
    //Định nghĩa thuộc tính cho object
    this.defineProperties();
    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();
    // Render playlist
    this.render();

    // Hiển thị tráng thái ban đầu khi reload page của button random, repeat
    randomBtn.classList.toggle("active", app.isRandom);
    repeatBtn.classList.toggle("active", app.isRepeat);
  },
};

app.start();
