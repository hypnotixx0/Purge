// title.js - Updated for /Purge
const words = [
    "/Purge",
    "/清除",
    "UNHIINS PRETTY DOPE",
    "/제거",
    "/გაწმენდა"
];

const randomWord = words[Math.floor(Math.random() * words.length)];
document.getElementById("title").textContent = randomWord;