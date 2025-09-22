// =======================
// Theme Toggle
// =======================
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;
  const body = document.body;
  let isDark = localStorage.getItem("theme") === "dark";

  function applyTheme() {
    body.setAttribute("data-theme", isDark ? "dark" : "light");
    const icon = themeToggle.querySelector("i");
    if (icon) {
      icon.className = isDark ? "fas fa-moon" : "fas fa-sun";
    }
  }

  themeToggle.addEventListener("click", () => {
    isDark = !isDark;
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyTheme();
  });

  applyTheme();
}

// =======================
// Cart Functionality
// =======================
function initCart() {
  let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
  const cartIcon = document.querySelector(".cart-badge");
  if (!cartIcon) return;

  function updateCartCount(count) {
    cartCount = count;
    localStorage.setItem("cartCount", cartCount);
    cartIcon.style.setProperty("--cart-count", `'${cartCount}'`);

    // Bounce effect
    cartIcon.style.animation = "bounce 0.5s";
    cartIcon.addEventListener("animationend", () => {
      cartIcon.style.animation = "";
    });
  }

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => updateCartCount(cartCount + 1));
  });

  updateCartCount(cartCount);
}

// =======================
// Contact Form (Unified)
// =======================
  const submitBtn = document.getElementById("submit");
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const formData = {
      firstName: document.getElementById("firstName")?.value || "",
      lastName: document.getElementById("lastName")?.value || "",
      email: document.getElementById("email")?.value || "",
      phoneNumber: document.getElementById("phone")?.value || "",
      subject: document.getElementById("subject")?.value || "",
      message: document.getElementById("message")?.value || "",
    };
    //console.log("Form Data:", formData); // Debugging line

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      const response = await fetch("http://localhost:5000/messages/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully, we will contact you soon!");
        contactForm.reset();
      } else {
        alert("Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error sending your message. Please try again later.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

// =======================
// FAQ Accordion
// =======================
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    question.setAttribute("aria-expanded", "false");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faq) => {
        faq.classList.remove("active");
        faq
          .querySelector(".faq-question")
          .setAttribute("aria-expanded", "false");
      });

      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// =======================
// Smooth Scroll
// =======================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// =======================
// Page Load Animation
// =======================
function initPageLoadAnimation() {
  document.body.style.opacity = "0";
  document.body.style.transform = "translateY(20px)";

  setTimeout(() => {
    document.body.style.transition = "all 0.8s ease";
    document.body.style.opacity = "1";
    document.body.style.transform = "translateY(0)";
  }, 100);
}

// =======================
// Inject Cart Bounce CSS
// =======================
function injectCartStyles() {
  const style = document.createElement("style");
  style.textContent = `
        @keyframes bounce {
            0%, 20%, 60%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            80% { transform: translateY(-5px); }
        }
        .cart-badge::after {
            content: var(--cart-count, '0');
            background: red;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 12px;
            margin-left: 4px;
        }
    `;
  document.head.appendChild(style);
}

// =======================
// Init All
// =======================
window.addEventListener("load", () => {
  initThemeToggle();
  initCart();
  initFAQ();
  initSmoothScroll();
  initPageLoadAnimation();
  injectCartStyles();
});
