const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const slideshowContainer = $(".slideshow-container");
const slideshowInner = $(".slideshow-inner");
const controls = $(".controls");
let slideItems = Array.from($$(".slide-item"));
const pagination = document.querySelector(".pagination");

let currentIndex = 1;
let interval;

if (slideItems.length) {
  const firstClone = slideItems[0].cloneNode(true);
  slideshowInner.appendChild(firstClone);
  slideItems.push(firstClone);

  const lastClone = slideItems[slideItems.length - 2].cloneNode(true);
  slideshowInner.prepend(lastClone);
  slideItems.unshift(lastClone);
}

slideshowInner.style.translate = `-100%`;

setTimeout(() => {
  slideshowInner.style.transition = "all ease 0.3s";
}, 10);

function controlSlide() {}

controls.onclick = (e) => {
  const ctrlBtn = e.target.closest(".control-btn");
  const maxIndex = slideItems.length - 1;

  if (ctrlBtn.matches(".prev")) {
    if (currentIndex === 0) {
      currentIndex = maxIndex;
    } else {
      currentIndex = Math.max(0, --currentIndex);
    }
  }

  if (ctrlBtn.matches(".next")) {
    if (currentIndex === maxIndex) {
      currentIndex = 0;
    } else {
      currentIndex = Math.min(++currentIndex, maxIndex);
    }
  }

  const offset = `-${currentIndex * 100}%`;
  slideshowInner.style.translate = offset;
};

slideshowInner.ontransitionend = (e) => {
  if (currentIndex === slideItems.length - 1) {
    slideshowInner.style.transition = "none";
    currentIndex = 1;

    const offset = `-${currentIndex * 100}%`;
    slideshowInner.style.translate = offset;

    setTimeout(() => {
      slideshowInner.style.transition = `all ease 0.3s`;
    }, 50);
  }

  if (currentIndex === 0) {
    slideshowInner.style.transition = "none";
    currentIndex = slideItems.length - 2;

    const offset = `-${currentIndex * 100}%`;
    slideshowInner.style.translate = offset;

    setTimeout(() => {
      slideshowInner.style.transition = `all ease 0.3s`;
    }, 50);
  }

  const oldSlideElement = slideItems[previousIndex];
  const currentSlideElement = slideItems[currentIndex];

  if (e.target === slideshowInner) {
    const changeEvent = new CustomEvent("slideshow:change", {
      detail: {
        old: oldSlideElement,
        current: currentSlideElement,
      },
    });
    document.dispatchEvent(changeEvent);
  }

  updatePagination();
};

for (let i = 0; i < slideItems.length - 2; i++) {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  pagination.appendChild(dot);
}

pagination.addEventListener("click", (e) => {
  const dot = e.target.closest(".pagination span");
  if (!dot) return;

  const dots = [...pagination.querySelectorAll(".pagination span")];
  const dotIndex = dots.indexOf(dot);

  const targetIndex = dotIndex + 1;

  if (targetIndex !== currentIndex) {
    currentIndex = targetIndex;
    const offset = `-${currentIndex * 100}%`;
    slideshowInner.style.translate = offset;
  }
});

function updatePagination() {
  const dots = document.querySelectorAll(".pagination span");
  dots.forEach((dot) => dot.classList.remove("active"));
  dots[(currentIndex - 1 + dots.length) % dots.length].classList.add("active");
}

function autoplayNextSlide() {
  const maxIndex = slideItems.length - 1;
  currentIndex++;

  const offset = `-${currentIndex * 100}%`;
  slideshowInner.style.translate = offset;
}

function startAutoplay() {
  clearInterval(interval);
  interval = setInterval(autoplayNextSlide, 3000);
}

function stopAutoplay() {
  clearInterval(interval);
}

slideshowContainer.addEventListener("mouseenter", stopAutoplay);
slideshowContainer.addEventListener("mouseleave", startAutoplay);

startAutoplay();
