document.addEventListener("DOMContentLoaded", () => {
  const entrance = document.getElementById("sound-entrance");
  const enterButton = document.getElementById("enter-site");
  const music = document.getElementById("background-music");
  const soundControl = document.getElementById("sound-control");

  if (!entrance || !enterButton || !music || !soundControl) {
    console.error("Cassano Sound System: element tidak ditemukan.");
    return;
  }

  /* ==========================================================
     SETTINGS
     ========================================================== */

  const VOLUME = 0.5;

  music.volume = VOLUME;

  /* ==========================================================
     STORAGE
     ========================================================== */

  const hasEntered = localStorage.getItem("cassanoEntered") === "true";

  const soundMuted = localStorage.getItem("cassanoSoundMuted") === "true";

  /* ==========================================================
     INITIAL STATE
     ========================================================== */

  if (soundMuted) {
    music.muted = true;
    soundControl.textContent = "♪ SOUND OFF";
  } else {
    music.muted = false;
    soundControl.textContent = "♪ SOUND ON";
  }

  /*
   * Kalau user sudah pernah ENTER,
   * jangan tampilkan entrance lagi.
   */

  if (hasEntered) {
    entrance.classList.add("hidden");

    /*
     * Browser mungkin mengizinkan autoplay,
     * tapi mobile bisa saja tetap menolaknya.
     */

    if (!soundMuted) {
      music.play().catch(() => {
        console.log("Cassano Sound: autoplay blocked by browser.");
      });
    }
  }

  /* ==========================================================
     ENTER SITE
     ========================================================== */

  enterButton.addEventListener("click", async () => {
    try {
      music.muted = false;
      music.volume = VOLUME;

      await music.play();

      localStorage.setItem("cassanoEntered", "true");

      localStorage.setItem("cassanoSoundMuted", "false");

      soundControl.textContent = "♪ SOUND ON";

      entrance.classList.add("hidden");
    } catch (error) {
      console.error("Cassano Sound: failed to play.", error);

      /*
       * Jangan bikin user stuck di entrance
       * kalau audio gagal.
       */

      localStorage.setItem("cassanoEntered", "true");

      entrance.classList.add("hidden");
    }
  });

  /* ==========================================================
     SOUND ON / OFF
     ========================================================== */

  soundControl.addEventListener("click", async () => {
    /*
     * Jika sedang OFF
     */

    if (music.paused || music.muted) {
      try {
        music.muted = false;

        await music.play();

        localStorage.setItem("cassanoSoundMuted", "false");

        soundControl.textContent = "♪ SOUND ON";
      } catch (error) {
        console.error("Cassano Sound: unable to play.", error);
      }

      return;
    }

    /*
     * Jika sedang ON
     */

    music.pause();

    localStorage.setItem("cassanoSoundMuted", "true");

    soundControl.textContent = "♪ SOUND OFF";
  });
});
