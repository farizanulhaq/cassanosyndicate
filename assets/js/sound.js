document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================
     CASSANO SOUND SYSTEM
     ========================================================== */

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
  music.muted = false;

  /* ==========================================================
     STORAGE
     ========================================================== */

  const hasEntered = localStorage.getItem("cassanoEntered") === "true";

  const savedMuted = localStorage.getItem("cassanoSoundMuted") === "true";

  /* ==========================================================
     STATE
     ========================================================== */

  let soundOn = false;
  let processing = false;

  /* ==========================================================
     UI
     ========================================================== */

  function setSoundUI(state) {
    soundOn = state;

    soundControl.textContent = state ? "♪ SOUND ON" : "♪ SOUND OFF";
  }

  /* ==========================================================
     PLAY
     ========================================================== */

  async function turnSoundOn() {
    if (processing) {
      return;
    }

    processing = true;

    try {
      music.muted = false;
      music.volume = VOLUME;

      await music.play();

      setSoundUI(true);

      localStorage.setItem("cassanoSoundMuted", "false");

      console.log("Cassano Sound: music playing.");
    } catch (error) {
      setSoundUI(false);

      console.error("Cassano Sound: playback failed.", error);
    } finally {
      processing = false;
    }
  }

  /* ==========================================================
     STOP
     ========================================================== */

  function turnSoundOff() {
    if (processing) {
      return;
    }

    processing = true;

    music.pause();

    /*
     * Tunggu satu frame supaya browser selesai
     * memproses pause sebelum UI diubah.
     */

    requestAnimationFrame(() => {
      setSoundUI(false);

      localStorage.setItem("cassanoSoundMuted", "true");

      processing = false;

      console.log("Cassano Sound: music stopped.");
    });
  }

  /* ==========================================================
     INITIAL UI
     ========================================================== */

  setSoundUI(false);

  /* ==========================================================
     RETURNING VISITOR
     ========================================================== */

  if (hasEntered) {
    entrance.classList.add("hidden");

    if (!savedMuted) {
      turnSoundOn();
    }
  } else {
    entrance.classList.remove("hidden");
  }

  /* ==========================================================
     ENTER SITE
     ========================================================== */

  enterButton.addEventListener("click", async () => {
    if (processing) {
      return;
    }

    console.log("Cassano Sound: ENTER SITE clicked.");

    localStorage.setItem("cassanoEntered", "true");

    entrance.classList.add("hidden");

    await turnSoundOn();
  });

  /* ==========================================================
     SOUND CONTROL
     ========================================================== */

  soundControl.addEventListener("click", () => {
    console.log("Cassano Sound: control clicked.", {
      soundOn,
      paused: music.paused,
      muted: music.muted,
    });

    if (processing) {
      return;
    }

    if (soundOn) {
      turnSoundOff();
    } else {
      turnSoundOn();
    }
  });
});
