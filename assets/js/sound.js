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
     UI
     ========================================================== */

  function updateSoundUI() {
    if (music.muted || music.paused) {
      soundControl.textContent = "♪ SOUND OFF";
    } else {
      soundControl.textContent = "♪ SOUND ON";
    }
  }

  /* ==========================================================
     INITIAL AUDIO STATE
     ========================================================== */

  music.volume = VOLUME;
  music.muted = soundMuted;

  updateSoundUI();

  /* ==========================================================
     RETURNING VISITOR
     ========================================================== */

  if (hasEntered) {
    // User sudah pernah masuk sebelumnya.
    // Langsung sembunyikan entrance.
    entrance.classList.add("hidden");

    /*
     * Jangan memaksa autoplay.
     *
     * Chrome mobile bisa mengizinkan atau menolak
     * autoplay tergantung browser/session/user interaction.
     */

    if (!soundMuted) {
      music
        .play()
        .then(() => {
          // Autoplay berhasil.
          music.volume = VOLUME;
          updateSoundUI();

          console.log("Cassano Sound: autoplay berhasil.");
        })
        .catch(() => {
          /*
           * Autoplay diblokir browser.
           *
           * Jangan mengubah localStorage menjadi muted,
           * karena user sebenarnya tidak pernah mute.
           */

          console.log(
            "Cassano Sound: autoplay blocked by browser. Waiting for user interaction.",
          );

          updateSoundUI();
        });
    }
  }

  /* ==========================================================
     FIRST VISIT / ENTER SITE
     ========================================================== */

  enterButton.addEventListener("click", async () => {
    try {
      /*
       * Karena ini berasal dari click user,
       * browser biasanya mengizinkan audio.
       */

      music.muted = false;
      music.volume = VOLUME;

      await music.play();

      /*
       * Simpan bahwa user sudah pernah masuk.
       */

      localStorage.setItem("cassanoEntered", "true");

      localStorage.setItem("cassanoSoundMuted", "false");

      updateSoundUI();

      /*
       * Sembunyikan entrance setelah audio berhasil.
       */

      entrance.classList.add("hidden");

      console.log("Cassano Sound: music started from ENTER SITE.");
    } catch (error) {
      console.error("Cassano Sound: failed to play.", error);

      /*
       * Jangan bikin user stuck di entrance.
       *
       * Tetap anggap user sudah masuk.
       */

      localStorage.setItem("cassanoEntered", "true");

      entrance.classList.add("hidden");

      updateSoundUI();
    }
  });

  /* ==========================================================
     SOUND ON / OFF
     ========================================================== */

  soundControl.addEventListener("click", async () => {
    /*
     * ========================================================
     * SOUND OFF → TURN ON
     * ========================================================
     */

    if (music.paused || music.muted) {
      try {
        music.muted = false;
        music.volume = VOLUME;

        await music.play();

        localStorage.setItem("cassanoSoundMuted", "false");

        updateSoundUI();

        console.log("Cassano Sound: sound enabled.");
      } catch (error) {
        /*
         * Ini biasanya hanya terjadi jika browser
         * masih menganggap interaction tidak valid.
         */

        console.error("Cassano Sound: unable to play.", error);

        updateSoundUI();
      }

      return;
    }

    /*
     * ========================================================
     * SOUND ON → TURN OFF
     * ========================================================
     */

    music.pause();

    localStorage.setItem("cassanoSoundMuted", "true");

    updateSoundUI();

    console.log("Cassano Sound: sound disabled.");
  });
});
