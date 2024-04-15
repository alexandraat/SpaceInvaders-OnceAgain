document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.querySelector('.play-btn');

    playButton.addEventListener('click', startSpaceInvaders);

    function startSpaceInvaders() {
        console.log("começou");
        
        // Remove o menu
        const menu = document.querySelector('.menu');
        menu.style.display = 'none';

        // Create a new canvas element
        const canvas = document.createElement('canvas');
        canvas.className = 'canvas';
        document.getElementById('container').appendChild(canvas);
        const context = canvas.getContext('2d'); //TODO:HUM n ta ser usado acho eu

        // Definindo o tamanho do canvas
        canvas.width = 800;
        canvas.height = 600;

        // Definindo variáveis do jogador
        const player = {
            x: canvas.width / 2,
            y: canvas.height - 30,
            width: 50,
            height: 10,
            speed: 1
        };

        // Desenha o jogador
        function drawPlayer() {
            context.beginPath();
            context.rect(player.x, player.y, player.width, player.height);
            context.fillStyle = "#0095DD";
            context.fill();
            context.closePath();
        }

        // Atualiza a posição do jogador
        function updatePlayer() {
            if (rightPressed && player.x < canvas.width - player.width) {
                player.x += player.speed;
            } else if (leftPressed && player.x > 0) {
                player.x -= player.speed;
            }
        }

        // Função principal de desenho
        function draw() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawPlayer();
            drawBarriers(context,canvas);
            updatePlayer();
            requestAnimationFrame(draw);
        }

        // Controles do jogador
        let rightPressed = false;
        let leftPressed = false;

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        

        function keyDownHandler(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = true;
            } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = true;
            } else if (e.key === "ArrowUp") {
                shoot(player,context);
            }
        }

        function keyUpHandler(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = false;
            } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = false;
            }
        }

        // Inicia o loop do jogo
        draw();
    }
});

// Defina o tamanho e a posição inicial das barreiras
const barrierRowCount = 4;
const barrierColumnCount = 8;
const barrierWidth = 50;
const barrierHeight = 20;
const barrierPadding = 10;
const barrierOffsetTop = 400;
const barrierOffsetLeft = 80;

// Crie a matriz para armazenar o estado das barreiras
const barriers = [];
for (let c = 0; c < barrierColumnCount; c++) {
    barriers[c] = [];
    for (let r = 0; r < barrierRowCount; r++) {
        barriers[c][r] = { x: 0, y: 0, status: 1 };
    }
}


// Função para desenhar a linha de barreiras centralizada horizontalmente
function drawBarriers(context, canvas) {
    const gap = 100; // Espaço entre as barreiras
    const barrierWidth = 100; // Largura de cada barreira
    const totalBarriers = 4; // Total de barreiras na linha
    const totalGapWidth = gap * (totalBarriers - 1); // Largura total dos espaços entre as barreiras
    const totalWidth = barrierWidth * totalBarriers + totalGapWidth; // Largura total do conjunto de barreiras

    // Calcula a posição inicial para centralizar as barreiras
    const initialX = (canvas.width - totalWidth) / 2;

    const barrierHeight = 60; // Altura das barreiras
    const barrierY = canvas.height - 150; // Define a posição vertical das barreiras

    for (let i = 0; i < totalBarriers; i++) {
        const barrierX = initialX + i * (barrierWidth + gap); // Calcula a posição X de cada barreira
        context.beginPath();
        context.rect(barrierX, barrierY, barrierWidth, barrierHeight);
        context.fillStyle = "#Fff000";
        context.fill();
        context.closePath();
    }
}


// Variável para controlar o tempo do último disparo
let lastShootTime = 0;
// Intervalo mínimo entre os disparos (em milissegundos)
const shootInterval = 1000; // Por exemplo, 500ms (meio segundo)

function shoot(player, context) {

    const currentTime = Date.now();
    if (currentTime - lastShootTime < shootInterval) {
        // Ainda não passou tempo suficiente, então não dispara
        return;
    }

    // Define as propriedades do laser
    const laser = {
        x: player.x + player.width / 2,
        y: player.y-10, //menos o height do player
        width: 2,
        height: 10,
        speed: 3,
        color: "#FF0000", // Cor do laser (vermelho)
        active: true // Define o laser como ativo
    };

    // Função para desenhar o laser
    function drawLaser() {
        context.beginPath();
        context.rect(laser.x, laser.y, laser.width, laser.height);
        context.fillStyle = laser.color;
        context.fill();
        context.closePath();
    }

    // Função para atualizar a posição do laser
    function updateLaser() {
        laser.y -= laser.speed; // Move o laser para cima
         // Verifica a colisão com as barreiras
         for (let c = 0; c < barrierColumnCount; c++) {
            console.log("oi");
            for (let r = 0; r < barrierRowCount; r++) {
                console.log("oi2");
                const barrier = barriers[c][r];
                if (barrier.status === 1 && laser.x > barrier.x && laser.x < barrier.x + barrierWidth && laser.y > barrier.y && laser.y < barrier.y + barrierHeight) {
                    // Marca o tiro como inativo
                    laser.active = false;
                    // Remove um pixel da barreira
                    barrier.status = 0;
                    return;
                }
            }
        }
    }

    // Função principal de desenho do laser
    function draw() {
        context.clearRect(laser.x, laser.y, laser.width, laser.height);
        drawLaser();
        updateLaser();
        if (laser.active) {
            requestAnimationFrame(draw);
        }
    }

    // Inicia o desenho do laser
    draw();
    console.log("shoot");
    lastShootTime = currentTime;
}

//teste -------------------------
/**
const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
let currentShooterIndex = 202
const width = 15
const aliensRemoved = []
let invadersId
let isGoingRight = true
let direction = 1
let results = 0

for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div")
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll(".grid div"))


const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader")
        }
    }
}

draw();

squares[currentShooterIndex].classList.add("shooter")

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader")
    }
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter")
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add("shooter")
}

document.addEventListener("keydown", moveShooter)

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            isGoingRight = false
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            isGoingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER"
        clearInterval(invadersId)
    }

    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = "YOU WIN"
        clearInterval(invadersId)
    }
}

invadersId = setInterval(moveInvaders, 600)

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add("laser")

        if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("invader")
            squares[currentLaserIndex].classList.add("boom")

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300)
            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultDisplay.innerHTML = results
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)
 */