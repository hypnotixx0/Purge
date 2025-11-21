// description.js - Updated for /Purge
const descriptionWords = [
    "Unblocked games and tools",
    "Thanks for the help testers", 
    "Peep the discord",
    "Make sure to get a key",
];

document.addEventListener("DOMContentLoaded", function() {
    const randomWord = descriptionWords[Math.floor(Math.random() * descriptionWords.length)];
    document.querySelector(".subtitle").textContent = randomWord;
});