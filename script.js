const messages = [
    "Maju IT BCA!",
    "Jangan menyerah!",
    "Saya percaya kalian bisa!",
    "Maju terus pantang mundur!",
    "Semangat Semangat Yey!!!",
    "Bisa!! Kalian Bisa!",
    "Sukses di depan mata",
    "Ciayooo~"
];

let counter = 0;

function getRandomMessage() {
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
}

function updateMessage() {
    const messageDiv = document.getElementById('message');
    const message = getRandomMessage();

    messageDiv.style.opacity = '0'; // Reset opacity for fade-out effect
    messageDiv.innerText = message;
    
    // Ensure the fade-in effect is visible
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 50);

    // Fade out the message after some time
    setTimeout(() => {
        messageDiv.style.opacity = '0';
    }, 2000);
}

function incrementCounter() {
    counter++;
    document.getElementById('counter').innerText = `Encouragements Given: ${counter}`;
}

document.getElementById('encourageButton').addEventListener('click', () => {
    updateMessage();
    incrementCounter();
});
