const questions = [
    {
        question: 'Apa kepanjangan dari BCA?',
        answers: [
            { text: 'Bank Central Asia', correct: true },
            { text: 'Bank Centra Asia', correct: false },
            { text: 'Bank Citra Asia', correct: false },
            { text: 'Bank Ceria Asia', correct: false }
        ]
    },
    {
        question: 'Apa warna logo BCA?',
        answers: [
            { text: 'Biru', correct: true },
            { text: 'Merah', correct: false },
            { text: 'Hijau', correct: false },
            { text: 'Kuning', correct: false }
        ]
    },
    {
        question: 'Dimana kantor pusat BCA berada?',
        answers: [
            { text: 'Jakarta', correct: true },
            { text: 'Surabaya', correct: false },
            { text: 'Bandung', correct: false },
            { text: 'Yogyakarta', correct: false }
        ]
    },
    {
        question: 'Produk tabungan apa yang terkenal dari BCA?',
        answers: [
            { text: 'Tahapan BCA', correct: true },
            { text: 'TabunganKu', correct: false },
            { text: 'Simpedes', correct: false },
            { text: 'BritAma', correct: false }
        ]
    },
    {
        question: 'BCA berdiri pada tahun berapa?',
        answers: [
            { text: '1957', correct: true },
            { text: '1960', correct: false },
            { text: '1945', correct: false },
            { text: '1975', correct: false }
        ]
    },
    {
        question: 'Siapa yang dapat menggunakan layanan BCA mobile?',
        answers: [
            { text: 'Nasabah BCA', correct: true },
            { text: 'Semua orang', correct: false },
            { text: 'Pegawai BCA', correct: false },
            { text: 'Pemegang Kartu Kredit', correct: false }
        ]
    },
    {
        question: 'Apa nama layanan internet banking dari BCA?',
        answers: [
            { text: 'KlikBCA', correct: true },
            { text: 'BCA Net', correct: false },
            { text: 'InternetBCA', correct: false },
            { text: 'BCA Online', correct: false }
        ]
    },
    {
        question: 'Apa nama layanan transfer dana cepat antar bank di BCA?',
        answers: [
            { text: 'RTGS', correct: false },
            { text: 'LLG', correct: false },
            { text: 'SKN', correct: false },
            { text: 'BI Fast', correct: true }
        ]
    },
    {
        question: 'Apa keuntungan menggunakan kartu kredit BCA?',
        answers: [
            { text: 'Reward BCA', correct: true },
            { text: 'Tidak ada biaya', correct: false },
            { text: 'Gratis seumur hidup', correct: false },
            { text: 'Tidak ada batas kredit', correct: false }
        ]
    },
    {
        question: 'Produk pinjaman apa yang ditawarkan BCA untuk pembelian rumah?',
        answers: [
            { text: 'KPR BCA', correct: true },
            { text: 'Kredit Mobil', correct: false },
            { text: 'Kredit Tanpa Agunan', correct: false },
            { text: 'Kredit Modal Kerja', correct: false }
        ]
    },
    {
        question: 'Apa layanan BCA yang memudahkan pembayaran tagihan rutin?',
        answers: [
            { text: 'Autopay', correct: true },
            { text: 'Direct Debit', correct: false },
            { text: 'Standing Instruction', correct: false },
            { text: 'Bill Pay', correct: false }
        ]
    },
    {
        question: 'Apa yang bisa dilakukan dengan BCA KlikPay?',
        answers: [
            { text: 'Pembayaran online', correct: true },
            { text: 'Transfer uang', correct: false },
            { text: 'Penarikan tunai', correct: false },
            { text: 'Pembukaan rekening', correct: false }
        ]
    },
    {
        question: 'Apa keuntungan dari Tahapan Berjangka BCA?',
        answers: [
            { text: 'Bunga lebih tinggi', correct: true },
            { text: 'Tidak ada biaya administrasi', correct: false },
            { text: 'Gratis transfer antar bank', correct: false },
            { text: 'Tidak ada setoran minimum', correct: false }
        ]
    },
    {
        question: 'Apa tujuan dari program BCA Life?',
        answers: [
            { text: 'Asuransi jiwa', correct: true },
            { text: 'Tabungan pendidikan', correct: false },
            { text: 'Investasi reksa dana', correct: false },
            { text: 'Pinjaman multiguna', correct: false }
        ]
    },
    {
        question: 'Apa yang bisa didapatkan dari BCA Solitaire?',
        answers: [
            { text: 'Layanan prioritas', correct: true },
            { text: 'Bunga lebih tinggi', correct: false },
            { text: 'Tidak ada biaya administrasi', correct: false },
            { text: 'Asuransi jiwa gratis', correct: false }
        ]
    }
];

const questionContainer = document.getElementById('question-container');
const answerButtons = document.getElementById('answer-buttons');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');

let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions, timeLeft;
let timer;

function startGame() {
    shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 15);
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 120;
    timerElement.innerText = `Time: ${timeLeft}s`;
    scoreElement.innerText = `Score: ${score}`;
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    startTimer();
}

function showQuestion(question) {
    questionContainer.innerHTML = `<h5>${question.question}</h5>`;
    answerButtons.innerHTML = '';
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn', 'btn-outline-primary', 'mb-2');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtons.appendChild(button);
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        score += 100;
    } else {
        score -= 50;
    }
    scoreElement.innerText = `Score: ${score}`;
    Array.from(answerButtons.children).forEach(button => {
        button.classList.add(button.dataset.correct === 'true' ? 'btn-success' : 'btn-danger');
        button.disabled = true;
    });
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuestions.length) {
            showQuestion(shuffledQuestions[currentQuestionIndex]);
        } else {
            showScore();
        }
    }, 1000); // Delay 1 second before showing the next question
}

function showScore() {
    questionContainer.innerHTML = `<h5>Your final score: ${score}</h5>`;
    clearInterval(timer);
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showScore();
        }
    }, 1000);
}

startGame();
