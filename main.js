
      // ---- Theme Toggle ----
      (function () {
        const toggle = document.getElementById("theme-toggle");
        const html = document.documentElement;
        const stored = localStorage.getItem("rhyto-theme");

        if (stored) {
          html.setAttribute("data-theme", stored);
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          html.setAttribute("data-theme", "light");
        }

        toggle.addEventListener("click", () => {
          const current = html.getAttribute("data-theme");
          const next = current === "dark" ? "light" : "dark";
          html.setAttribute("data-theme", next);
          localStorage.setItem("rhyto-theme", next);
        });
      })();

      // ---- Nav Scroll Effect ----
      (function () {
        const nav = document.getElementById("main-nav");
        let ticking = false;

        window.addEventListener("scroll", () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              nav.classList.toggle("scrolled", window.scrollY > 40);
              ticking = false;
            });
            ticking = true;
          }
        });
      })();

      // ---- Mobile Nav ----
      (function () {
        const hamburger = document.getElementById("nav-hamburger");
        const links = document.getElementById("nav-links");
        const overlay = document.getElementById("nav-overlay");

        function closeMenu() {
          links.classList.remove("open");
          overlay.classList.remove("active");
          hamburger.setAttribute("aria-expanded", "false");
        }

        hamburger.addEventListener("click", () => {
          const isOpen = links.classList.toggle("open");
          overlay.classList.toggle("active", isOpen);
          hamburger.setAttribute("aria-expanded", isOpen);
        });

        overlay.addEventListener("click", closeMenu);
        links
          .querySelectorAll("a")
          .forEach((a) => a.addEventListener("click", closeMenu));
      })();

      // ---- Scroll Reveal ----
      (function () {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
        );

        document
          .querySelectorAll(".reveal")
          .forEach((el) => observer.observe(el));
      })();

      // ---- Leaf Particles ----
      (function () {
        const container = document.getElementById("leaf-particles");
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (prefersReduced) return;

        for (let i = 0; i < 12; i++) {
          const leaf = document.createElement("div");
          leaf.classList.add("leaf-particle");
          leaf.style.left = Math.random() * 100 + "%";
          leaf.style.animationDuration = 12 + Math.random() * 18 + "s";
          leaf.style.animationDelay = Math.random() * 15 + "s";
          leaf.style.width = 4 + Math.random() * 5 + "px";
          leaf.style.height = 4 + Math.random() * 5 + "px";
          container.appendChild(leaf);
        }
      })();

      // ---- Smooth scroll for anchor links ----
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    