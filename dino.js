//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

// Questions
let questions = [
    {
        question: "Apa yang dimaksud dengan P5?",
        options: ["Program Pembelajaran Penalaran, Pemecahan Masalah, dan Penciptaan Solusi", "Pendidikan, Pengajaran, dan Pembelajaran", "Pintar, Pandai, dan Percaya Diri"],
        correctAnswer: 0
    },
    {
        question: "Siapa yang mengembangkan konsep P5?",
        options: ["Kementerian Pendidikan dan Kebudayaan", "Badan Pengembangan Kurikulum", "Tim Kurikulum"],
        correctAnswer: 1
    },
    {
        question: "Apa tujuan utama dari P5?",
        options: ["Mengembangkan keterampilan teknis siswa", "Mengembangkan kompetensi dan karakter siswa", "Meningkatkan penggunaan teknologi dalam pembelajaran"],
        correctAnswer: 1
    },
    {
        question: "Bagaimana P5 mempengaruhi proses pembelajaran?",
        options: ["Mempercepat proses pembelajaran", "Memberikan ruang dan waktu bagi siswa untuk mengembangkan kompetensi dan memperkuat karakter", "Mengurangi intensitas pembelajaran"],
        correctAnswer: 1
    },
    {
        question: "Apa yang menjadi fokus utama dalam P5?",
        options: ["Meningkatkan daya ingat siswa", "Mengembangkan keterampilan sosial siswa", "Mengembangkan kemampuan penalaran, pemecahan masalah, dan penciptaan solusi"],
        correctAnswer: 2
    },
    {
        question: "Bagaimana evaluasi dilakukan dalam P5?",
        options: ["Melalui ujian akhir semester", "Melalui penilaian berkelanjutan dan portofolio siswa", "Tidak ada evaluasi dalam P5"],
        correctAnswer: 1
    }
    // correctAnswer adalah indeks dari jawaban yang benar
];

let currentQuestionIndex = 0;

// Checkpoint
let numQuestions = questions.length; // Jumlah pertanyaan
let numCheckpoints = numQuestions
let checkpoints = []; // Array untuk menyimpan checkpoint
for (let i = 1; i <= numCheckpoints; i++) {
    checkpoints.push(i * 500); // Setiap checkpoint berjarak 500
}

let currentCheckpointIndex = 0;
let questionsShown = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    localStorage.removeItem("previousScore");
    score = 0;

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);
    document.addEventListener("click", moveDino);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestionPopup() {
    if (questionsShown === 0) { // Hanya munculkan pertanyaan jika belum ada yang ditampilkan pada checkpoint ini
        let questionIndex = currentQuestionIndex;
        do {
            // Random pertanyaan baru yang belum pernah ditampilkan
            questionIndex = Math.floor(Math.random() * questions.length);
        } while (questionIndex === currentQuestionIndex); // Pastikan pertanyaan baru tidak sama dengan yang sebelumnya

        let question = questions[questionIndex];
        let answer = prompt(`${question.question}\n\nPilih jawaban:\n1. ${question.options[0]}\n2. ${question.options[1]}\n3. ${question.options[2]}`);

        if (answer !== null) { // Check apakah pengguna mengklik "Cancel"
            let selectedOption = parseInt(answer);
            if (!isNaN(selectedOption) && selectedOption >= 1 && selectedOption <= 3 && answer !== null) {
                // Validasi bahwa input adalah angka antara 1 dan 3
                let previousScore = parseInt(localStorage.getItem("previousScore")) || 0;
                if (selectedOption - 1 === question.correctAnswer) {
                    // Jawaban benar, tambahkan skor sebelumnya dengan 10
                    gameOver = false;
                    localStorage.setItem("previousScore", score);
                    score = previousScore + 10;
                } else {
                    // Jawaban salah, tidak perlu melakukan apa pun pada skor
                    gameOver = true;
                    resetGame();
                }
            } else {
                // Input tidak valid, tampilkan pesan kesalahan
                gameOver = true;
                alert("Masukkan angka antara 1 dan 3 untuk memilih jawaban!");
                resetGame();
            }
        } else {
            // Jika pengguna membatalkan popup, panggil fungsi resetGame()
            gameOver = true;
            resetGame();
        }

        currentQuestionIndex = questionIndex; // Perbarui indeks pertanyaan saat ini
        questionsShown = 1; // Set jumlah pertanyaan yang ditampilkan menjadi 1
    }
}

function resetGame() {
    // Kode untuk mengatur ulang variabel permainan
    if (gameOver) {
        // Reset posisi karakter ke posisi awal
        dino.y = dinoY;

        // Hapus semua kaktus dari array
        cactusArray = [];

        // Set skor menjadi 0 jika game over karena dinosaurus nabrak
        score = 0;
        localStorage.removeItem("previousScore");

        window.location.reload()
    } else {
        // Semua jawaban benar, lanjutkan permainan dengan skor sebelumnya ditambah 100
        let previousScore = parseInt(localStorage.getItem("previousScore")) || 0;
        score = previousScore + 10; // Menambah skor sebelumnya dengan 10
        localStorage.setItem("previousScore", score);
    }

    currentQuestionIndex = 0;
    gameOver = false;
}

// Memodifikasi fungsi update untuk menampilkan pertanyaan saat dinosaurus mencapai checkpoint
// Memodifikasi fungsi update untuk menangani deteksi tabrakan antara dino dan kaktus
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Periksa jika mencapai checkpoint
    if (score >= checkpoints[currentCheckpointIndex]) {
        showQuestionPopup();
        currentCheckpointIndex++; // Pindah ke checkpoint berikutnya
        questionsShown = 0; // Reset jumlah pertanyaan yang ditampilkan
    }

    // Dapatkan skor dari localStorage sebagai skor awal
    let previousScore = parseInt(localStorage.getItem("previousScore")) || 0;

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        // Deteksi tabrakan antara dino dan kaktus
        if (detectCollision(dino, cactus)) {
            // Jika terjadi tabrakan, panggil fungsi resetGame()
            score = 0; // Set score menjadi 0 saat menabrak
            localStorage.setItem('previousScore', score);
            gameOver = true;
            resetGame();
        }
    }

    //score
    context.fillStyle = "black";
    context.font = "20px courier";
    context.fillText(score, 5, 20);

    localStorage.setItem('previousScore', score++);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp" || e.type == "click") && dino.y == dinoY) {
        //jump
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > .90) { //10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision(a, b) {
    let collision = a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner

    return collision;
}
