// =======================
// Theme Toggle
// =======================
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const body = document.body;
  let isDark = localStorage.getItem("theme") === "dark";

  const applyTheme = () => {
    body.setAttribute("data-theme", isDark ? "dark" : "light");
    const icon = themeToggle.querySelector("i");
    if (icon) icon.className = isDark ? "fas fa-moon" : "fas fa-sun";
  };

  themeToggle.addEventListener("click", () => {
    isDark = !isDark;
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyTheme();
  });

  applyTheme();
}
initThemeToggle();

// =======================
// Cart Functionality
// =======================
let cartCount = 0;
const cartIcon = document.querySelector(".cart-badge");

document.querySelectorAll(".btn-primary").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (btn.textContent.includes("Shop Now")) {
      e.preventDefault();
      cartCount++;
      cartIcon.style.setProperty("--cart-count", `"${cartCount}"`);

      // Add bounce animation
      cartIcon.style.animation = "bounce 0.6s ease";
      setTimeout(() => (cartIcon.style.animation = ""), 600);
    }
  });
});

// =======================
// Smooth Scroll
// =======================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// =======================
// Page Load Animation
// =======================
window.addEventListener("load", () => {
  document.body.style.opacity = "1";
  document.body.style.transform = "translateY(0)";
});
