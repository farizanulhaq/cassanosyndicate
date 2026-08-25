(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function openMobileNav() {
    document.body.classList.add("mobile-nav-active");
    mobileNavToggleBtn.classList.remove("bi-list");
    mobileNavToggleBtn.classList.add("bi-x");
  }

  function closeMobileNav() {
    document.body.classList.remove("mobile-nav-active");
    mobileNavToggleBtn.classList.remove("bi-x");
    mobileNavToggleBtn.classList.add("bi-list");
  }

  function mobileNavToggle() {
    if (document.body.classList.contains("mobile-nav-active")) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToggle);
  }
  /**
   * Premium Active Navbar
   */
  const navLinks = document.querySelectorAll("#navmenu a");

  function setActiveNavLink(link) {
    if (!link) return;

    navLinks.forEach((navLink) => {
      navLink.classList.remove("active");
    });

    link.classList.add("active");
  }

  /**
   * Handle navbar clicks
   */
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveNavLink(link);

      if (window.innerWidth < 1200) {
        closeMobileNav();
      }
    });
  });

  /**
   * Smooth scroll for homepage sections
   */
  document.querySelectorAll("a[data-scroll]").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));

      if (!target) return;

      setActiveNavLink(this);

      closeMobileNav();

      setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    });
  });

  /**
   * Active navbar based on current section
   */
  function updateActiveSection() {
    const sections = document.querySelectorAll("main section[id]");

    if (!sections.length) return;

    const scrollPosition = window.scrollY + 180;

    let currentSection = "hero";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;

      if (scrollPosition >= sectionTop) {
        currentSection = section.id;
      }
    });

    const activeLink = document.querySelector(
      `#navmenu a[href="#${currentSection}"]`,
    );

    if (activeLink) {
      setActiveNavLink(activeLink);
    }
  }

  /**
   * Initialize active section
   */
  window.addEventListener("load", () => {
    updateActiveSection();
  });

  /**
   * Update active section while scrolling
   */
  window.addEventListener("scroll", () => {
    updateActiveSection();
  });
  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("loaded");
      }, 1000);
      setTimeout(() => {
        preloader.remove();
      }, 2000);
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim(),
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);
})();
