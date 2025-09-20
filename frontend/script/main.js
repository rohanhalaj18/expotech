const themeToggle = document.getElementById("themeToggle");
const body = document.body;
let isDark = false;

themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  body.setAttribute("data-theme", isDark ? "dark" : "light");

  const icon = themeToggle.querySelector("i");
  icon.className = isDark ? "fas fa-moon" : "fas fa-sun";

  // Store preference
  const theme = isDark ? "dark" : "light";
  document.cookie = `theme=${theme}; path=/; max-age=31536000`;
});

// Load saved theme
window.addEventListener("load", () => {
  const cookies = document.cookie.split(";");
  const themeCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("theme=")
  );

  if (themeCookie) {
    const theme = themeCookie.split("=")[1];
    if (theme === "dark") {
      isDark = true;
      body.setAttribute("data-theme", "dark");
      themeToggle.querySelector("i").className = "fas fa-moon";
    }
  }
});

// Cart functionality
let cartCount = 0;
const cartIcon = document.querySelector(".cart-badge");

// Simulate adding items to cart
document.querySelectorAll(".btn-primary").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (btn.textContent.includes("Shop Now")) {
      e.preventDefault();
      cartCount++;
      cartIcon.style.setProperty("--cart-count", `"${cartCount}"`);

      // Add animation
      cartIcon.style.animation = "bounce 0.6s ease";
      setTimeout(() => {
        cartIcon.style.animation = "";
      }, 600);
    }
  });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add some interactive effects
document.querySelectorAll(".device").forEach((device) => {
  device.addEventListener("mouseenter", () => {
    device.style.transform = "translateY(-5px) scale(1.05)";
  });

  device.addEventListener("mouseleave", () => {
    device.style.transform = "translateY(0) scale(1)";
  });
});

// Add bounce animation for cart
const style = document.createElement("style");
style.textContent = `
            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                80% { transform: translateY(-5px); }
            }
            
            .cart-badge::after {
                content: var(--cart-count, '0');
            }
        `;
document.head.appendChild(style);

// Add loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transform = "translateY(20px)";

  setTimeout(() => {
    document.body.style.transition = "all 0.8s ease";
    document.body.style.opacity = "1";
    document.body.style.transform = "translateY(0)";
  }, 100);
});
