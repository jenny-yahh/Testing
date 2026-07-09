/* =======================
   GLOBAL Z-INDEX LAYERING
======================= */
let currentZIndex = 10;
function bringToFront(el) {
  currentZIndex++;
  el.style.zIndex = currentZIndex;
}

/* =======================
preloading page
======================= */
window.addEventListener("load", () => {
  const loader = document.getElementById("preloader");
  const preloaderMobileView = window.matchMedia("(min-width: 300px) and (max-width: 890px)");
  let preloaderTimer;

  const fadeOutPreloader = () => {
    loader.classList.add("fade-out");
  };

  const showTimedPreloader = () => {
    clearTimeout(preloaderTimer);
    loader.style.transition = "none";
    loader.classList.remove("fade-out");
    loader.offsetHeight;
    loader.style.transition = "";
    preloaderTimer = setTimeout(fadeOutPreloader, 2500);
  };

  // small delay makes it feel smoother
  preloaderTimer = setTimeout(fadeOutPreloader, preloaderMobileView.matches ? 2500 : 2000);

  preloaderMobileView.addEventListener("change", (e) => {
    if (e.matches) showTimedPreloader();
  });
});

window.addEventListener("load", () => {
  document.body.style.overflow = "auto";
});

/* =======================
   DRAGGABLE IMAGES (.image)  — from file #1
   (works for multiple .image elements)
======================= */
(function initDraggableImages() {
  const images = document.querySelectorAll(".image");
  const homeImage = document.querySelector(".home-image");
  const infoBlock = document.querySelector(".info");
  const menuBox = document.querySelector(".menu-box");
  const infoBox = document.querySelector(".info-box");
  const happeningsBox = document.querySelector(".happenings-box");
  const galleryArrows = document.querySelectorAll(".gallery-arrow");
  const phoneGalleryView = window.matchMedia("(min-width: 300px) and (max-width: 890px)");
  const layeredImageView = window.matchMedia("(min-width: 300px) and (max-width: 890px)");
  if (!images.length) return;
  let layeredImageIndex = 0;

  const infoGap = 60;
  const positionImageStage = () => {
    if (!homeImage) return;
    if (phoneGalleryView.matches) {
      homeImage.style.removeProperty("--home-image-top");
      return;
    }

    if (infoBlock) {
      const infoTop = infoBlock.getBoundingClientRect().top;
      const stageHeight = homeImage.getBoundingClientRect().height;
      const stageCenterY = infoTop - infoGap - stageHeight / 2;
      const minCenterY = stageHeight / 2;
      homeImage.style.setProperty("--home-image-top", `${Math.max(stageCenterY, minCenterY)}px`);
    }
  };

  const getStagePoint = (e) => {
    if (!homeImage) return { x: e.clientX, y: e.clientY };

    const rect = homeImage.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const showNextLayeredImage = () => {
    if (!layeredImageView.matches) return;
    if (menuBox && menuBox.classList.contains("active")) return;
    if (infoBox && infoBox.classList.contains("active")) return;
    if (happeningsBox && happeningsBox.classList.contains("active")) return;

    if (layeredImageIndex >= images.length) {
      images.forEach((image) => {
        image.classList.remove("is-layered-visible");
      });
      layeredImageIndex = 0;
      return;
    }

    const image = images[layeredImageIndex];
    image.classList.add("is-layered-visible");
    bringToFront(image);
    layeredImageIndex++;
  };

  const resetLayeredImages = () => {
    if (layeredImageView.matches) return;

    layeredImageIndex = 0;
    images.forEach((image) => {
      image.classList.remove("is-layered-visible");
    });
  };

  positionImageStage();
  window.addEventListener("load", positionImageStage);
  window.addEventListener("resize", positionImageStage);

  if (infoBlock && "ResizeObserver" in window) {
    new ResizeObserver(positionImageStage).observe(infoBlock);
  }

  document.querySelectorAll('.image').forEach((img) => {
  currentZIndex++;
  img.style.zIndex = currentZIndex;
});

  images.forEach((img) => {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    img.addEventListener("mousedown", (e) => {
      if (phoneGalleryView.matches) return;
      if (menuBox && menuBox.classList.contains("active")) return;

      isDragging = true;
      bringToFront(img);

      if (!img.style.position) img.style.position = "absolute";

      const point = getStagePoint(e);
      offsetX = point.x - img.offsetLeft;
      offsetY = point.y - img.offsetTop;

      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      if (menuBox && menuBox.classList.contains("active")) return;

      const point = getStagePoint(e);
      const stageRect = homeImage.getBoundingClientRect();
      const nextLeft = point.x - offsetX;
      const nextTop = point.y - offsetY;

      img.style.left = `${(nextLeft / stageRect.width) * 100}%`;
      img.style.top = `${(nextTop / stageRect.height) * 100}%`;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  });

  document.addEventListener("click", (e) => {
    if (!layeredImageView.matches) return;
    if (e.target.closest(".deco-page")) return;

    showNextLayeredImage();
  }, true);

  galleryArrows.forEach((arrow) => {
    arrow.addEventListener("click", (e) => {
      if (!phoneGalleryView.matches) return;

      e.preventDefault();
      e.stopPropagation();
    });
  });

  layeredImageView.addEventListener("change", resetLayeredImages);

})();

/* =======================
MENU OPEN / CLOSE
======================= */
const menuTrigger = document.querySelector('.menu-trigger');
const menuBox = document.querySelector('.menu-box');
const menuBack = document.querySelector('.menu-back');
const phoneMenuView = window.matchMedia('(min-width: 300px) and (max-width: 500px)');

const closeMenu = () => {
  menuBox.classList.remove('active');
  menuTrigger.classList.remove('active');
};

menuTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  if (phoneMenuView.matches && menuBox.classList.contains('active')) return;
  menuBox.classList.toggle('active');
  menuTrigger.classList.toggle('active');
});

menuBack.addEventListener('click', (e) => {
  e.stopPropagation();
  closeMenu();
});

menuBox.addEventListener('click', (e) => {
  e.stopPropagation();
});

document.addEventListener('click', (e) => {
  if (phoneMenuView.matches) return;

  if (!menuBox.contains(e.target) && !menuTrigger.contains(e.target)) {
    closeMenu();
  }
});

/* close menu when user starts dragging/clicking outside */
document.addEventListener('mousedown', (e) => {
  if (!menuBox.classList.contains('active')) return;
  if (phoneMenuView.matches) return;

  if (!menuBox.contains(e.target) && !menuTrigger.contains(e.target)) {
    closeMenu();
  }
});

/* =======================
FOOD / DRINK TOGGLE
======================= */
const tabs = document.querySelectorAll(".menu-tab");
let panelZ = 10;

/* slider per tab group */
function moveSlider(tab) {
  const option = tab.closest(".option");
  const slider = option.querySelector(".menu-slider");
  if (!slider) return;

  slider.style.left = `${tab.offsetLeft}px`;
  slider.style.width = `${tab.offsetWidth}px`;
}

/* sync all duplicated tab bars */
function syncTabs(target) {
  tabs.forEach((t) => {
    t.classList.toggle("active", t.dataset.target === target);
  });

  document.querySelectorAll(".option").forEach((option) => {
    const activeTab = option.querySelector(`.menu-tab[data-target="${target}"]`);
    if (activeTab) moveSlider(activeTab);
  });
}

/* make one panel slide in from the right every click */
function slideInPanel(panel) {
  panelZ++;
  panel.style.zIndex = panelZ;

  panel.classList.remove("active");
  panel.style.transition = "none";
  panel.style.transform = "translateX(100%)";

  panel.offsetHeight; // force reflow

  panel.style.transition = "transform 0.7s ease";

  requestAnimationFrame(() => {
    panel.classList.add("active");
    panel.style.transform = "";
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.target;
    const panel = document.getElementById(target);
    if (!panel) return;

    slideInPanel(panel);
    syncTabs(target);
  });
});

window.addEventListener("load", () => {
  const foodPanel = document.getElementById("food");
  if (foodPanel) {
    foodPanel.classList.add("active");
    foodPanel.style.zIndex = panelZ;
  }
  syncTabs("food");
});

/* =======================
DEFAULT STATE
======================= */
/* position underline on page load */
window.addEventListener("load", () => {
  const activeTab = document.querySelector(".menu-tab.active");
  if (activeTab) moveSlider(activeTab);
});

/* keep underline correct on resize */
window.addEventListener("resize", () => {
  const activeTab = document.querySelector(".menu-tab.active");
  if (activeTab) moveSlider(activeTab);
});

/* =======================
MAP OPEN / CLOSE
======================= */
const mapTrigger = document.querySelector('.map-trigger');
const mapBox = document.querySelector('.info-box');

mapTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  mapBox.classList.toggle('active');
  mapTrigger.classList.toggle('active');
});

mapBox.addEventListener('click', (e) => {
  e.stopPropagation();
});

document.addEventListener('click', (e) => {
  if (!mapBox.contains(e.target) && !mapTrigger.contains(e.target)) {
    mapBox.classList.remove('active');
    mapTrigger.classList.remove('active');
  }
});

/* close menu when user starts dragging/clicking outside */
document.addEventListener('mousedown', (e) => {
  if (!mapBox.classList.contains('active')) return;

  if (!mapBox.contains(e.target) && !mapTrigger.contains(e.target)) {
    mapBox.classList.remove('active');
    mapTrigger.classList.remove('active');
  }
});

/* =======================
HAPPENINGS OPEN / CLOSE
======================= */
const happeningsTrigger = document.querySelector('.happenings-trigger');
const happeningsBox = document.querySelector('.happenings-box');

happeningsTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  happeningsBox.classList.toggle('active');
  happeningsTrigger.classList.toggle('active');
});

happeningsBox.addEventListener('click', (e) => {
  e.stopPropagation();
});

document.addEventListener('click', (e) => {
  if (!happeningsBox.contains(e.target) && !happeningsTrigger.contains(e.target)) {
    happeningsBox.classList.remove('active');
    happeningsTrigger.classList.remove('active');
  }
});

/* close menu when user starts dragging/clicking outside */
document.addEventListener('mousedown', (e) => {
  if (!happeningsBox.classList.contains('active')) return;

  if (!happeningsBox.contains(e.target) && !happeningsTrigger.contains(e.target)) {
    happeningsBox.classList.remove('active');
    happeningsTrigger.classList.remove('active');
  }
});
