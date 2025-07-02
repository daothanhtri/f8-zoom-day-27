let players = [
  {
    name: "Xù",
    age: 22,
    bio: "Yêu mèo, thích cà phê và sách.",
    image: "./assets/img/img-tender/img-1.JPG",
  },
  {
    name: "Tuxi",
    age: 22,
    bio: "Yêu mèo, thích cà phê và sách.",
    image: "./assets/img/img-tender/img-2.JPG",
  },
  {
    name: "Txu",
    age: 22,
    bio: "Yêu mèo, thích cà phê và sách.",
    image: "./assets/img/img-tender/img-3.JPG",
  },
  {
    name: "Xưn",
    age: 22,
    bio: "Yêu mèo, thích cà phê và sách.",
    image: "./assets/img/img-tender/img-4.JPG",
  },
  {
    name: "Xuân",
    age: 22,
    bio: "Yêu mèo, thích cà phê và sách.",
    image: "./assets/img/img-tender/img-5.JPG",
  },
  {
    name: "Thanh Xuân",
    age: 22,
    bio: "Yêu mèo, thích cà phê và sách.",
    image: "./assets/img/img-tender/img-6.jpg",
  },
];
const disliked = [];
const liked = [];

const cardStack = document.getElementById("card-stack");
const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");

let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
const swipeThreshold = 60;
const rotationFactor = 0.05;
const stackSize = 3;

function createCardElement(player, index) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
            <img src="${player.image}" alt="${player.name}">
            <div class="card-info">
                <h2>${player.name}, <span>${player.age}</span></h2>
                <p>${player.bio}</p>
            </div>
        `;

  return card;
}

function renderCardStack() {
  if (
    cardStack.children.length > 0 &&
    players.length > 0 &&
    cardStack.children.length >= stackSize
  ) {
    const nextPlayerIndex = stackSize - 1;
    if (
      players[nextPlayerIndex] &&
      cardStack.children.length < players.length + (stackSize - 1)
    ) {
      const nextCard = createCardElement(
        players[nextPlayerIndex],
        nextPlayerIndex
      );
      cardStack.appendChild(nextCard);
    }

    attachTopCardListeners();
    return;
  }

  cardStack.innerHTML = "";
  if (players.length === 0) {
    displayNoMoreUsersMessage();
    disableButtons();
    return;
  }

  const cardsToRender = players.slice(0, stackSize);
  cardsToRender.forEach((player, index) => {
    const cardElement = createCardElement(player, index);
    cardStack.appendChild(cardElement);
  });

  attachTopCardListeners();
  enableButtons();
}

function attachTopCardListeners() {
  const topCard = cardStack.querySelector(".card:first-child");
  if (topCard) {
    topCard.removeEventListener("mousedown", handleStart);
    topCard.removeEventListener("touchstart", handleStart);
    topCard.addEventListener("mousedown", handleStart);
    topCard.addEventListener("touchstart", handleStart);
  }
}

function removeDragListeners() {
  window.removeEventListener("mousemove", handleMove);
  window.removeEventListener("mouseup", handleEnd);
  window.removeEventListener("touchmove", handleMove);
  window.removeEventListener("touchend", handleEnd);
  window.removeEventListener("touchcancel", handleEnd);
}

function handleStart(e) {
  if (e.type === "mousedown" && e.button !== 0) return;

  const topCard = cardStack.querySelector(".card:first-child");
  if (!topCard) return;

  isDragging = true;
  e.preventDefault();

  if (e.type === "touchstart") {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  } else {
    startX = e.clientX;
    startY = e.clientY;
  }

  currentX = 0;
  currentY = 0;

  topCard.classList.add("dragging");

  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleEnd);
  window.addEventListener("touchmove", handleMove, { passive: false });
  window.addEventListener("touchend", handleEnd);
  window.addEventListener("touchcancel", handleEnd);
}

function handleMove(e) {
  if (!isDragging) return;

  const topCard = cardStack.querySelector(".card:first-child");
  if (!topCard) return;

  e.preventDefault();

  let clientX, clientY;
  if (e.type === "touchmove") {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const deltaX = clientX - startX;
  const deltaY = clientY - startY;

  currentX = deltaX;
  currentY = deltaY;

  const rotate = deltaX * rotationFactor;

  topCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;

  if (deltaX > 0) {
    topCard.classList.add("swiping-right");
    topCard.classList.remove("swiping-left");
  } else if (deltaX < 0) {
    topCard.classList.add("swiping-left");
    topCard.classList.remove("swiping-right");
  } else {
    topCard.classList.remove("swiping-left", "swiping-right");
  }
}

function handleEnd(e) {
  if (!isDragging) return;

  const topCard = cardStack.querySelector(".card:first-child");
  if (!topCard) {
    isDragging = false;
    removeDragListeners();
    return;
  }

  isDragging = false;
  removeDragListeners();

  topCard.classList.remove("dragging");

  if (Math.abs(currentX) >= swipeThreshold) {
    const direction = currentX > 0 ? "right" : "left";
    swipeCard(topCard, direction);
  } else {
    resetCard(topCard);
  }

  currentX = 0;
  currentY = 0;
}

function resetCard(card) {
  card.style.transform = "";
  card.style.backgroundColor = `#fff`;
  card.classList.remove(
    "swiping-left",
    "swiping-right",
    "swipe-exit-left",
    "swipe-exit-right"
  );
}

function swipeCard(card, direction) {
  disableButtons();

  if (direction === "left") {
    card.classList.add("swipe-exit-left");
  } else {
    card.classList.add("swipe-exit-right");
  }

  card.addEventListener("transitionend", function handler() {
    card.removeEventListener("transitionend", handler);

    card.remove();

    const swipedPlayer = players.shift();
    if (swipedPlayer) {
      if (direction === "left") {
        disliked.push(swipedPlayer);
        console.log("Disliked:", swipedPlayer.name, disliked);
      } else {
        liked.push(swipedPlayer);
        console.log("Liked:", swipedPlayer.name, liked);
      }
    }

    renderCardStack();

    enableButtons();
  });

  card.classList.remove("swiping-left", "swiping-right");
}

function handleButtonClick(direction) {
  const topCard = cardStack.querySelector(".card:first-child");
  if (topCard && !isDragging) {
    swipeCard(topCard, direction);
  }
}

function displayNoMoreUsersMessage() {
  const message = document.createElement("div");
  message.classList.add("no-more-users");
  message.textContent = "Oops! Hết rồi. Quay lại sau nhé!";
  cardStack.appendChild(message);
}

function disableButtons() {
  likeBtn.disabled = true;
  dislikeBtn.disabled = true;
}

function enableButtons() {
  likeBtn.disabled = false;
  dislikeBtn.disabled = false;
}

likeBtn.addEventListener("click", () => handleButtonClick("right"));
dislikeBtn.addEventListener("click", () => handleButtonClick("left"));

renderCardStack();
