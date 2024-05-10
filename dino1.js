
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
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let questions = [
    {
        question: "Siapakah penemu JavaScript?",
        options: ["Brendan Eich", "Tim Berners-Lee", "Larry Page"],
        correctAnswer: 0
    },
    {
        question: "Apa yang menjadi kepanjangan dari HTML?",
        options: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"],
        correctAnswer: 0
    },
    {
        question: "Apa yang menjadi kepanjangan dari SMECONE?",
        options: ["SMAN 1 Purwokerto", "SMKN 1 Purwokerto", "Home Tool Markup Language"],
        correctAnswer: 1
    },
    // Tambahkan pertanyaan lain di sini sesuai kebutuhan
];

let currentQuestionIndex = 0;

function showQuestionPopup() {
    let question = questions[currentQuestionIndex];
    let answer = prompt(`${question.question}\n\nPilih jawaban:\n1. ${question.options[0]}\n2. ${question.options[1]}\n3. ${question.options[2]}`);

    if (answer !== null) { // Check apakah pengguna mengklik "Cancel"
        let selectedOption = parseInt(answer);
        if (!isNaN(selectedOption) && selectedOption >= 1 && selectedOption <= 3) {
            // Validasi bahwa input adalah angka antara 1 dan 3
            if (selectedOption - 1 === question.correctAnswer) {
                // Jawaban benar
                if (currentQuestionIndex < questions.length - 1) {
                    currentQuestionIndex++; // Pindah ke pertanyaan berikutnya
                    showQuestionPopup(); // Tampilkan pertanyaan berikutnya
                } else {
                    // Semua jawaban benar, lanjutkan permainan dengan skor sebelumnya ditambah 100
                    let previousScore = parseInt(localStorage.getItem("previousScore")) || 0;
                    score = previousScore + 100;
                    localStorage.setItem("previousScore", score);
                    gameOver = false;
                    resetGame()
                }
            } else {
                // Jawaban salah, kembali ke awal
                gameOver = true;
                resetGame();
            }
        } else {
            // Input tidak valid, tampilkan pesan kesalahan
            alert("Masukkan angka antara 1 dan 3 untuk memilih jawaban!");
        }
    }
}

function resetGame() {
    // Kode untuk mengatur ulang variabel permainan
    if (gameOver) {
        localStorage.removeItem("previousScore");
        score = 0; // Mulai skor dari 0 jika game over karena jawaban salah
    } else {
        // Semua jawaban benar, lanjutkan permainan dengan skor sebelumnya ditambah 100
        let previousScore = parseInt(localStorage.getItem("previousScore")) || 0;
        score = previousScore + 100;
        localStorage.setItem("previousScore", score);
    }

    currentQuestionIndex = 0;
    dino.y = dinoY; // Reset posisi karakter ke posisi awal

    // Hapus semua kaktus dari array
    cactusArray = [];

    gameOver = false;
}



// Memodifikasi fungsi update untuk menampilkan pertanyaan saat dinosaurus menabrak kaktus
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            // Tampilkan popup pertanyaan
            showQuestionPopup();
        }
    }

    //score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
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

    if (collision) {
        // Jika terjadi tabrakan, acak urutan pertanyaan
        shuffleArray(questions);
    }

    return collision;
}