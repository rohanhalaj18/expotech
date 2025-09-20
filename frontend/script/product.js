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

// Image slider functionality
function initImageSliders() {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const slider = card.querySelector(".image-slider");
    const dots = card.querySelectorAll(".image-dot");
    const prevBtn = card.querySelector(".prev-arrow");
    const nextBtn = card.querySelector(".next-arrow");

    let currentIndex = 0;
    const totalImages = dots.length;

    function updateSlider() {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % totalImages;
      updateSlider();
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      updateSlider();
    }

    nextBtn.addEventListener("click", nextImage);
    prevBtn.addEventListener("click", prevImage);

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlider();
      });
    });

    // Auto-advance slides every 4 seconds
    let autoSlide = setInterval(nextImage, 4000);

    // Pause auto-advance on hover
    card.addEventListener("mouseenter", () => clearInterval(autoSlide));
    card.addEventListener("mouseleave", () => {
      autoSlide = setInterval(nextImage, 4000);
    });
  });
}

// Add to cart functionality
function initCartFunctionality() {
  const addToCartBtns = document.querySelectorAll(".add-to-cart");

  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const product = btn.getAttribute("data-product");
      const price = btn.getAttribute("data-price");

      // Add to cart animation
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
      btn.disabled = true;

      setTimeout(() => {
        // Success animation
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        btn.style.background = "#27ae60";

        setTimeout(() => {
          // Redirect to checkout page with product data
          window.location.href = `../pages/order.html?product=${encodeURIComponent(
            product
          )}&price=${price}`;
        }, 1000);
      }, 1000);
    });
  });
}

// Wishlist functionality
function initWishlistFunctionality() {
  const wishlistBtns = document.querySelectorAll(".wishlist-btn");

  wishlistBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      const icon = btn.querySelector("i");

      if (btn.classList.contains("active")) {
        icon.style.animation = "heartBeat 0.6s ease";
      } else {
        icon.style.animation = "";
      }

      setTimeout(() => {
        icon.style.animation = "";
      }, 600);
    });
  });
}

// Filter functionality
function initFilterFunctionality() {
  const categoryFilter = document.getElementById("category");
  const priceFilter = document.getElementById("price-range");
  const brandFilter = document.getElementById("brand");
  const searchInput = document.getElementById("searchInput");
  const productCards = document.querySelectorAll(".product-card");

  function filterProducts() {
    const category = categoryFilter.value;
    const priceRange = priceFilter.value;
    const brand = brandFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    productCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      const cardPrice = parseFloat(card.getAttribute("data-price"));
      const cardBrand = card.getAttribute("data-brand");
      const cardTitle = card
        .querySelector(".product-title")
        .textContent.toLowerCase();

      let showCard = true;

      // Category filter
      if (category && cardCategory !== category) {
        showCard = false;
      }

      // Price filter
      if (priceRange) {
        const [min, max] = priceRange
          .split("-")
          .map((p) => parseFloat(p.replace("+", "")));
        if (priceRange.includes("+")) {
          if (cardPrice < min) showCard = false;
        } else {
          if (cardPrice < min || cardPrice > max) showCard = false;
        }
      }

      // Brand filter
      if (brand && cardBrand !== brand) {
        showCard = false;
      }

      // Search filter
      if (searchTerm && !cardTitle.includes(searchTerm)) {
        showCard = false;
      }

      // Show/hide card with animation
      if (showCard) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 10);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  }

  categoryFilter.addEventListener("change", filterProducts);
  priceFilter.addEventListener("change", filterProducts);
  brandFilter.addEventListener("change", filterProducts);
  searchInput.addEventListener("input", filterProducts);
}

// Load more functionality
function initLoadMore() {
  const loadMoreBtn = document.getElementById("loadMore");

  loadMoreBtn.addEventListener("click", () => {
    const originalText = loadMoreBtn.innerHTML;
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;

    setTimeout(() => {
      // Simulate loading more products
      loadMoreBtn.innerHTML = originalText;
      loadMoreBtn.disabled = false;

      // Show message that no more products available
      loadMoreBtn.innerHTML =
        '<i class="fas fa-check"></i> All products loaded';
      loadMoreBtn.style.background = "#95a5a6";
      setTimeout(() => {
        loadMoreBtn.style.display = "none";
      }, 2000);
    }, 2000);
  });
}

// Initialize all functionality
document.addEventListener("DOMContentLoaded", () => {
  initImageSliders();
  initCartFunctionality();
  initWishlistFunctionality();
  initFilterFunctionality();
  initLoadMore();
});

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                80% { transform: translateY(-5px); }
            }
            
            @keyframes heartBeat {
                0% { transform: scale(1); }
                14% { transform: scale(1.3); }
                28% { transform: scale(1); }
                42% { transform: scale(1.3); }
                70% { transform: scale(1); }
            }
            
            .cart-badge::after {
                content: var(--cart-count, '0');
            }
            
            .product-card {
                opacity: 1;
                transform: translateY(0);
                transition: all 0.3s ease;
            }
        `;
document.head.appendChild(style);

// Loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transform = "translateY(20px)";

  setTimeout(() => {
    document.body.style.transition = "all 0.8s ease";
    document.body.style.opacity = "1";
    document.body.style.transform = "translateY(0)";
  }, 100);
});
