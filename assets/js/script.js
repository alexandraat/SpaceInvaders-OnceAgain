document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.querySelector('.play-btn');
    const laserSound = new Audio('assets/sound/shoot.wav');
    playButton.addEventListener('click', startSpaceInvaders);
    let gameInProgress = true;

    const alienGrid = [
        [3],
        [2],
        [1],
        [1]
    ];

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
            speed: 10
        };

        // Variável para controlar o tempo do último disparo
        let lastShootTime = 0;
        // Intervalo mínimo entre os disparos (em milissegundos)
        const shootInterval = 10; // Por exemplo, 500ms (meio segundo)

        // Variável global para o laser
        let laser = null;

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

        // Variável global para armazenar a largura e altura de cada quadro de alien
        const frameWidth = 50;
        const frameHeight = 50;

        // Função para atualizar o laser
        function updateLaser(laser, index) {
            laser.y -= laser.speed; // Move o laser para cima

            // Verifica se o laser saiu da tela
            if (laser.y < 0) {
                // Remove o laser da matriz de lasers
                lasers.splice(index, 1);
            } else {
                // Verifica se o laser atingiu algum alien
                const hitAlien = checkCollision(laser);
                if (hitAlien !== -1) {
                    // Remove o alien atingido da matriz de aliens
                    const [r, c] = hitAlien;
                    alienGrid[r][c] = 0;
                    // Remove o laser da matriz de lasers
                    lasers.splice(index, 1);
                }
            }
        }


        // Função para verificar colisão entre o laser e os aliens
        function checkCollision(laser) {
            for (let r = 0; r < alienGrid.length; r++) {
                for (let c = 0; c < alienGrid[r].length; c++) {
                    if (alienGrid[r][c] !== 0) {
                        const alienX = c * (frameWidth + 10) + 50;
                        const alienY = r * (frameHeight + 10) + 50;
                        if (
                            laser.x < alienX + frameWidth &&
                            laser.x + laser.width > alienX &&
                            laser.y < alienY + frameHeight &&
                            laser.y + laser.height > alienY
                        ) {
                            const alienType = alienGrid[r][c];
                            let scoreToAdd = 0;
                            // Determina o valor a ser adicionado ao score com base no tipo de alien atingido
                            if (alienType === 1) {
                                scoreToAdd = 10; // Tipo Small
                            } else if (alienType === 2) {
                                scoreToAdd = 20; // Tipo Medium
                            } else if (alienType === 3) {
                                scoreToAdd = 40; // Tipo Large
                            }
                            // Adiciona o valor ao resultado
                            const divConteudo = document.querySelector('.results');
                            let conteudo = parseInt(divConteudo.innerHTML); // Converte o conteúdo atual para um número
                            console.log("conteudo:", conteudo); // Isso irá imprimir o conteúdo da div com a classe 'sua-classe'

                            console.log("scoretoadd:", scoreToAdd);
                            conteudo += parseInt(scoreToAdd); // Converte scoreToAdd para um número e adiciona ao conteúdo atual
                            divConteudo.innerHTML = conteudo;

                            // Remove o alien atingido da matriz de aliens
                            alienGrid[r][c] = 0;
                            // Retorna a posição do alien atingido
                            return [r, c];
                        }
                    }
                }
            }
            return -1;
        }


        // Carregar as imagens dos aliens
        const alienImages = [];
        const imagePaths = ["assets/img/small.gif", "assets/img/medium.gif", "assets/img/large.gif"];
        imagePaths.forEach(path => {
            const image = new Image();
            image.src = path;
            alienImages.push(image);
        });

        // Definir as configurações dos aliens
        const alienWidth = 50;
        const alienHeight = 50;
        const alienPadding = 10;
        const alienOffsetTop = 50;
        const alienOffsetLeft = 50;

        // Função para desenhar os aliens com imagens
        function drawAliensWithImages(context) {
            for (let r = 0; r < alienGrid.length; r++) {
                for (let c = 0; c < alienGrid[r].length; c++) {
                    const alienType = alienGrid[r][c];
                    if (alienType !== 0) {
                        const alienX = c * (alienWidth + alienPadding) + alienOffsetLeft;
                        const alienY = r * (alienHeight + alienPadding) + alienOffsetTop;
                        context.drawImage(alienImages[alienType - 1], alienX, alienY, alienWidth, alienHeight);
                    }
                }
            }
        }

        // Definir a matriz para os aliens


        // Função para mover os aliens
        function moveAliens() {
            for (let r = 0; r < alienGrid.length; r++) {
                for (let c = 0; c < alienGrid[r].length; c++) {
                    const alienType = alienGrid[r][c];
                    if (alienType !== 0) {
                        const alienX = c * (alienWidth + alienPadding) + alienOffsetLeft;
                        const alienY = r * (alienHeight + alienPadding) + alienOffsetTop;

                        // Move os aliens para a direita
                        alienX += alienSpeedX;

                        // Verifica se os aliens atingiram o lado direito do canvas
                        if (alienX + alienWidth > canvas.width) {
                            // Move os aliens para baixo
                            alienOffsetTop += alienSpeedY;
                            alienSpeedX *= -1; // Inverte a direção dos aliens
                        }
                        // Verifica se os aliens atingiram o lado esquerdo do canvas
                        if (alienX < 0) {
                            // Move os aliens para baixo
                            alienOffsetTop += alienSpeedY;
                            alienSpeedX *= -1; // Inverte a direção dos aliens
                        }

                        // Atualiza a posição dos aliens na matriz
                        alienGrid[r][c] = 0;
                        alienGrid[r + alienRows][c + alienCols] = alienType;
                    }
                }
            }
        }

        // Definir a variável lasers como uma matriz vazia no escopo global
        const lasers = [];

        // Função principal de desenho
        function draw() {
            if (!gameInProgress) {
                return;
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawPlayer();
            //moveAliens();
            drawAliensWithImages(context);
            updatePlayer();
            checkGameStatus();
            // Verifica se existem lasers na matriz
            if (lasers.length > 0) {
                // Desenha e atualiza todos os lasers
                lasers.forEach((laser, index) => {
                    if (laser.active) {
                        context.fillStyle = laser.color;
                        context.fillRect(laser.x, laser.y, laser.width, laser.height);
                        updateLaser(laser, index);
                    }
                });
            }

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
                shoot(player, context);
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


        // Função para disparar o laser
        function shoot(player, context) {
            if (!gameInProgress) {
                return;
            }
            const currentTime = Date.now();
            if (currentTime - lastShootTime < shootInterval) {
                // Ainda não passou tempo suficiente, então não dispara
                return;
            }
            laserSound.play();
            // Define as propriedades do laser
            const laser = {
                x: player.x + player.width / 2,
                y: player.y - 10,
                width: 2,
                height: 10,
                speed: 20,
                color: "#FF0000", // Cor do laser (vermelho)
                active: true // Define o laser como ativo
            };

            // Adiciona o laser à matriz de lasers
            lasers.push(laser);

            // Atualiza o tempo do último disparo
            lastShootTime = currentTime;
        }
        // Função para verificar o estado do jogo
        function checkGameStatus() {
            let aliensLeft = 0;
            for (let r = 0; r < alienGrid.length; r++) {
                for (let c = 0; c < alienGrid[r].length; c++) {
                    if (alienGrid[r][c] !== 0) {
                        aliensLeft++;
                    }
                }
            }
            console.log("aliens left", aliensLeft);
            // Verifica se não há mais aliens na tela
            if (aliensLeft === 0) {
                console.log("entrou")
                // Exibe a mensagem "YOU WIN" e um botão para recomeçar o jogo
                showMessage("YOU WIN", "Recomeçar", startSpaceInvaders);
            }
        }

        // Função para exibir uma mensagem na tela
        function showMessage(message, buttonText, buttonAction) {
            gameInProgress = false;
            laserSound.pause();
            laserSound.currentTime = 0;
            console.log("ENTROU NO SHOW MESSAGE");

            // Cria uma nova div para a mensagem
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message-container');

            // Cria um parágrafo para o texto da mensagem
            const messagePara = document.createElement('p');
            messagePara.textContent = message;
            messageDiv.appendChild(messagePara);

            // Cria um botão
            const button = document.createElement('button');
            button.textContent = buttonText;
            button.classList.add('message-button');
            button.addEventListener('click', () => {
                // Disparar a ação do botão
                buttonAction();
                // Limpar as serpentinas quando o botão é clicado
                confetti.remove();
            });

            // Adiciona o botão à div
            messageDiv.appendChild(button);

            // Adiciona a div ao corpo do documento
            document.body.appendChild(messageDiv);

            // Disparar as serpentinas
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }


    }
});
