let sequence = [];
let currentIndex = 0;
let timer; // variabel untuk menyimpan timer
let timeLeft = 15; // variabel untuk menyimpan waktu yang tersisa
let score = 0; // variabel untuk menyimpan skor

function generateSequence(length) {
    sequence = [];
    while (sequence.length < length) {
        let randomNumber = Math.floor(Math.random() * 10); // Generate random number between 0 to 9
        if (!sequence.includes(randomNumber)) {
            sequence.push(randomNumber);
        }
    }
}


function displaySequence() {
    const numberSequenceElement = document.getElementById('number-sequence');
    numberSequenceElement.textContent = sequence.join(' ');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createButtons() {
    const buttonContainer = document.getElementById('button-container');
    buttonContainer.innerHTML = '';
    const shuffledSequence = shuffleArray([...sequence]);
    shuffledSequence.forEach(number => {
        const button = document.createElement('button');
        button.textContent = number;
        button.className = 'number-button';
        button.addEventListener('click', () => checkNumber(button, parseInt(button.textContent))); // Perlu mengirimkan objek tombol dan angka yang diwakilinya
        buttonContainer.appendChild(button);
    });
}

function startGame() {
    if (document.getElementById('start-button').disabled) {
        // Tombol "Mulai Game" diklik setelah permainan selesai, reset skor
        score = 0;
        document.getElementById('score').textContent = 'Score: ' + score;
    }

    document.getElementById('start-button').style.display = 'none'; // Sembunyikan tombol "Mulai Game"
    generateSequence(5); // Ganti 5 dengan jumlah angka yang diinginkan
    displaySequence();
    createButtons();
    currentIndex = 0;
    document.getElementById('message').textContent = '';
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('guide').textContent = '';

    // Memulai timer hanya jika belum dimulai sebelumnya
    if (!timer) {
        timeLeft = 15;
        document.getElementById('timer-countdown').textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById('timer-countdown').textContent = timeLeft; // Update tampilan timer
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }
}

// function checkNumber(button, number) {
//     if (button.classList.contains('clicked')) {
//         return; // Jika tombol sudah diklik, keluar dari fungsi
//     }

//     if (number === sequence[currentIndex]) {
//         currentIndex++;
//         button.classList.add('clicked'); // Tambahkan kelas clicked pada tombol yang sudah diklik

//         if (currentIndex === sequence.length) {
//             score += 100; // Tambah skor jika urutan benar
//             document.getElementById('score').textContent = 'Score: ' + score; // Update tampilan skor
//             document.getElementById('message').textContent = 'Selamat! Anda telah menyelesaikan urutan!';
//             document.getElementById('start-button').disabled = false;
//             setTimeout(() => {
//                 startGame(); // Memulai permainan baru setelah sejumlah waktu tertentu
//             }, 1000);
//         }
//     } else {
//         document.getElementById('message').textContent = 'Maaf, urutan salah. Silakan coba lagi.';
//         currentIndex = 0;

//         // Menghapus kelas clicked dari semua tombol
//         document.querySelectorAll('.number-button').forEach(button => {
//             button.classList.remove('clicked');
//         });
//     }
// }

// function checkNumber(button, number) {
//     if (button.classList.contains('clicked')) {
//         return; // Jika tombol sudah diklik, keluar dari fungsi
//     }

//     if (number === sequence[currentIndex]) {
//         currentIndex++;
//         button.classList.add('clicked'); // Tambahkan kelas clicked pada tombol yang sudah diklik

//         if (currentIndex === sequence.length) {
//             score += 100; // Tambah skor jika urutan benar
//             document.getElementById('score').textContent = 'Score: ' + score; // Update tampilan skor
//             // document.getElementById('message').textContent = 'Selamat! Anda telah menyelesaikan urutan!';
//             document.getElementById('start-button').disabled = false;
//             setTimeout(() => {
//                 startGame(); // Memulai permainan baru setelah sejumlah waktu tertentu
//             }, 100);
//         }
//     } else {
//         document.getElementById('message').textContent = 'Maaf, urutan salah. Silakan coba lagi.';
//         currentIndex = 0;

//         // Menghapus kelas clicked dari semua tombol
//         document.querySelectorAll('.number-button').forEach(button => {
//             button.classList.remove('clicked');
//             button.disabled = true; // Menonaktifkan tombol angka saat urutan salah
//         });

//         // Set timer ke 0
//         timeLeft = 0;
//         document.getElementById('timer-countdown').textContent = timeLeft;

//         // Munculkan tombol "Restart Game"
//         document.getElementById('restart-button').style.display = 'block';
//         document.getElementById('restart-button').classList.add('centered'); // Posisikan tombol "Restart Game" ke tengah
//     }
// }
function checkNumber(button, number) {
    if (button.classList.contains('clicked')) {
        return; // Jika tombol sudah diklik, keluar dari fungsi
    }

    if (number === sequence[currentIndex]) {
        currentIndex++;
        button.classList.add('clicked'); // Tambahkan kelas clicked pada tombol yang sudah diklik

        if (currentIndex === sequence.length) {
            score += 100; // Tambah skor jika urutan benar
            document.getElementById('score').textContent = 'Score: ' + score; // Update tampilan skor
            if (score % 500 === 0) { // Periksa apakah skor adalah kelipatan dari 500
                timeLeft += 15; // Tambahkan 20 detik ke timer
                document.getElementById('timer-countdown').textContent = timeLeft; // Update tampilan timer
            }
            document.getElementById('start-button').disabled = false;
            setTimeout(() => {
                startGame(); // Memulai permainan baru setelah sejumlah waktu tertentu
            }, 100);
        }
    } else {
        document.getElementById('message').textContent = 'Maaf, urutan salah. Silakan coba lagi.';
        currentIndex = 0;

        // Menghapus kelas clicked dari semua tombol
        document.querySelectorAll('.number-button').forEach(button => {
            button.classList.remove('clicked');
            button.disabled = true; // Menonaktifkan tombol angka saat urutan salah
        });

        // Set timer ke 0
        timeLeft = 0;
        document.getElementById('timer-countdown').textContent = timeLeft;

        // Munculkan tombol "Restart Game"
        document.getElementById('restart-button').style.display = 'block';
        document.getElementById('restart-button').classList.add('centered'); // Posisikan tombol "Restart Game" ke tengah
    }
}



function endGame() {
    clearInterval(timer); // Hentikan timer
    timer = null; // Set timer kembali ke null
    // setTimeout(() => {
    //     document.getElementById('message').textContent = 'Game Over!';
    // }, 1000); // Waktu tunggu sebelum menampilkan pesan (dalam milidetik)
    document.getElementById('restart-button').style.display = 'block'; // Tampilkan kembali tombol "Restart Game"
    document.getElementById('restart-button').classList.add('centered'); // Posisikan tombol ke tengah
    // Menghapus atribut disabled dari tombol "Mulai Game"
    document.getElementById('restart-button').disabled = false;
    // Menonaktifkan semua tombol
    document.querySelectorAll('.number-button').forEach(button => {
        button.disabled = true;
    });
}

function restartGame() {
    score = 0; // Reset skor ketika tombol "Mulai Game" diklik
    document.getElementById('score').textContent = 'Score: ' + score; // Update tampilan skor
    document.getElementById('restart-button').style.display = 'none'; // Sembunyikan tombol "Restart Game"
    document.getElementById('start-button').style.display = 'block'; // Tampilkan kembali tombol "Mulai Game"
    document.getElementById('start-button').classList.add('centered'); // Posisikan tombol "Mulai Game" ke tengah
    startGame(); // Memulai permainan baru
}
