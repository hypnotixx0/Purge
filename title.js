// title.js - Updated for /Purge
const words = [
    "/Purge",
    "/清除",
    "larga vida /Purge!",
    "/제거",
    "Long Live Cloaking"
];

const randomWord = words[Math.floor(Math.random() * words.length)];
document.getElementById("title").textContent = randomWord;