let data = [
  "assets/images/memory-game-card-img-1.svg",
  "assets/images/memory-game-card-img-2.svg",
  "assets/images/memory-game-card-img-3.svg",
  "assets/images/memory-game-card-img-4.svg",
  "assets/images/memory-game-card-img-5.svg",
  "assets/images/memory-game-card-img-6.svg",
  "assets/images/memory-game-card-img-7.svg",
  "assets/images/memory-game-card-img-8.svg",
];

data = data.concat(data);
data.sort(() => Math.random() - 0.5);

let firstCard, secondCard;
let disable = false;
let eslesenCiftSayisi = 0;
let sayac = 0;
let saniye = 0;
let zamanAraligi;

const gameCard = document.querySelector(".game-items");
const hamleSayisi = document.querySelector(".hamleTxt");
const zamanlayici = document.querySelector(".zamanlayiciTxt");
const menuBtn = document.querySelector(".menuBtn");
const menuDialog = document.querySelector(".menuDialog");
const resumeBtn = document.querySelector(".resumeBtn");

menuBtn.addEventListener("click", () => {
  menuDialog.showModal();
  zamanlayiciyiDurdur();
});

resumeBtn.addEventListener("click", () => {
  menuDialog.close();
  zamanlayiciyiBaslat();
});

for (const image of data) {
  gameCard.innerHTML += `
    <li class="game-item" data-image="${image} draggable="false"">
      <img src="${image}" alt="Card Image">
    </li>`;
}

document.querySelectorAll(".game-item").forEach(card => {
  card.addEventListener("dragstart", (e) => {
    e.preventDefault();  // Bu, kartın sürüklenmesini engeller
  });
});

const items = document.querySelectorAll(".game-item");

function sayaciArttir() {
  sayac++;
  hamleSayisi.textContent = `Hamle: ${sayac}`;
}

function zamanlayiciyiBaslat() {
  zamanAraligi = setInterval(() => {
    saniye++;
    let dakika = Math.floor(saniye / 60);
    let kalanSaniye = saniye % 60;
    zamanlayici.textContent = `${dakika
      .toString()
      .padStart(2, "0")}:${kalanSaniye.toString().padStart(2, "0")}`;
  }, 1000);
}

function zamanlayiciyiDurdur() {
  clearInterval(zamanAraligi);
}

function flipCard() {
  let clickedCard = this;
  if (clickedCard !== firstCard && !disable) {
    clickedCard.classList.add("game-item-active");

    if (!firstCard) {
      firstCard = clickedCard;
      return;
    }

    secondCard = clickedCard;
    sayaciArttir();
    disable = true;

    let cardOneImage = firstCard.querySelector("img").src;
    let cardTwoImage = secondCard.querySelector("img").src;
    kartlariEslestir(cardOneImage, cardTwoImage);
  }
}

function kartlariEslestir(img1, img2) {
  if (img1 === img2) {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    firstCard.classList.add("game-item-focus");
    secondCard.classList.add("game-item-focus");
    eslesenCiftSayisi++;

    firstCard = secondCard = null;
    disable = false;

    setTimeout(oyunBitisi, 500);
  } else {
    firstCard.classList.add("shake");
    secondCard.classList.add("shake");
    setTimeout(() => {
      firstCard.classList.remove("game-item-active", "shake");
      secondCard.classList.remove("game-item-active", "shake");

      firstCard = secondCard = null;
      disable = false;
    }, 1200);
  }
}

function oyunBitisi() {
  if (eslesenCiftSayisi === data.length / 2) {
    zamanlayiciyiDurdur();

    const overlay = document.querySelector(".overlay");
    const message = document.querySelector(".message");
    message.innerHTML = `<div class="messageText">
    <h3>Başardın!</h3>
    <p>Oyun bitti! Tebrikler!</p>
    </div>
    <div class="scores">
    <div class="gecenSure">Geçen Süre<span>${zamanlayici.textContent}</span></div>
    <div class="hamleSayisi">Hamle Sayısı<span>${sayac} Hamle</span></div>
    <a href="/" class="restartBtnMessage">Restart</a>
    </div>
    `;

    overlay.style.display = "flex";

    overlay.addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }
}

function kartlariGoster() {
  items.forEach((item) => item.classList.add("game-item-active"));
}

function kartlariGizle() {
  setTimeout(() => {
    items.forEach((item) => item.classList.remove("game-item-active"));
    zamanlayiciyiBaslat();
  }, 3000);
}

items.forEach((item) => {
  item.addEventListener("click", flipCard);
});

kartlariGoster();
kartlariGizle();


