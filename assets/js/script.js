document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.querySelector('.play-btn');
    const laserSound = new Audio('assets/sound/shoot.wav');
    playButton.addEventListener('click', startSpaceInvaders);
    let gameInProgress = true;
    //moveAliens();

    const alienGrid = [
        [3, 3, 3, 3, 3],
        [2, 2, 2, 2, 2],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1]
    ];

    function startSpaceInvaders() {
        console.log("começou");

        // Remove o menu
        const menu = document.querySelector('.menu');
        menu.style.display = 'none';

        //Coloca os pontos visiveis
        const divConteudo = document.querySelector('.results');
        divConteudo.style.visibility = 'visible';

        // Create a new canvas element
        const canvas = document.createElement('canvas');
        canvas.className = 'canvas';
        document.getElementById('container').appendChild(canvas);
        const context = canvas.getContext('2d');

        // Definindo o tamanho do canvas
        canvas.width = 1000;
        canvas.height = 600;

        //*****************************************************\- Player -/***************************************************** */

        // Definindo variáveis do jogador
        const player = {
            x: canvas.width / 2,
            y: canvas.height - 30,
            width: 50,
            height: 10,
            speed: 10
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

        //*****************************************************\- Laser -/***************************************************** */

        // Variável para controlar o tempo do último disparo
        let lastShootTime = 0;
        // Intervalo mínimo entre os disparos (em milissegundos)
        const shootInterval = 10; // Por exemplo, 500ms (meio segundo)
        // Definir a variável lasers como uma matriz vazia no escopo global
        const lasers = [];

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

        //*****************************************************\- Aliens -/***************************************************** */

        // Definir as configurações dos aliens
        const alienWidth = 50;
        const alienHeight = 50;
        const alienPadding = 10;
        let alienDirection = 1; // Direção do movimento dos aliens: 1 para direita, -1 para esquerda
        let alienDistance = 30; // Distância que os aliens se movem a cada passo (em pixels)
        let isAlienMoving = true; // Estado do movimento dos aliens: true para movimento, false para pausa
        let alienSpeed = 0.2; // Velocidade de movimento dos aliens
        let alienOffsetLeft = 0; // Posição inicial dos aliens à esquerda
        let alienOffsetTop = 20; // Posição inicial dos aliens no topo



        // Carregar as imagens dos aliens
        const alienImages = [];
        const imagePaths = ["assets/img/small1.png", "assets/img/medium2.png", "assets/img/large2.png"];
        imagePaths.forEach(path => {
            const image = new Image();
            image.src = path;
            alienImages.push(image);
        });

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

        function moveAliens() {
            // Verifica se os aliens devem se mover
            if (isAlienMoving) {
                // Move os aliens na direção atual com a distância definida
                alienOffsetLeft += alienDirection * alienDistance;

                // Verifica se os aliens atingiram o limite direito ou esquerdo
                const maxX = canvas.width - (alienGrid[0].length * (alienWidth + alienPadding) - alienPadding);
                const minX = 20; // Limite esquerdo inicial

                if (alienDirection === 1 && alienOffsetLeft > maxX) {
                    // Se os aliens atingirem o limite direito, mova-os para baixo e inverta a direção
                    alienOffsetLeft = maxX; // Define a posição para o limite direito
                    alienOffsetTop += 20; // Move os aliens para baixo
                    alienDirection = -1; // Inverte a direção para a esquerda
                } else if (alienDirection === -1 && alienOffsetLeft < minX) {
                    // Se os aliens atingirem o limite esquerdo, mova-os para baixo e inverta a direção
                    alienOffsetLeft = minX; // Define a posição para o limite esquerdo
                    alienOffsetTop += 20; // Move os aliens para baixo
                    alienDirection = 1; // Inverte a direção para a direita
                }

                // Redesenha os aliens com base na nova posição
                drawAliensWithImages(context);

                // Define um tempo de pausa após o movimento dos aliens
                isAlienMoving = false; // Os aliens param de se mover

                // Aguarda um período de pausa antes de retomar o movimento
                setTimeout(() => {
                    isAlienMoving = true; // Após o tempo de pausa, os aliens retomam o movimento
                    moveAliens(); // Chama recursivamente a função moveAliens() para continuar o movimento
                }, 1000); // Tempo de pausa em milissegundos (1 segundo)
            }
        }



        //*****************************************************\- Check -/***************************************************** */

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
                showMessage("YOU WIN", "Return", recomecar);
                estrelas();

            }
        }

        // Função para verificar colisão entre o laser e os aliens
        function checkCollision(laser) {
            for (let r = 0; r < alienGrid.length; r++) {
                for (let c = 0; c < alienGrid[r].length; c++) {
                    if (alienGrid[r][c] !== 0) {
                        const alienX = c * (alienWidth + 10) + 50;
                        const alienY = r * (alienHeight + 10) + 50;
                        if (
                            laser.x < alienX + alienWidth &&
                            laser.x + laser.width > alienX &&
                            laser.y < alienY + alienHeight &&
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

        //*****************************************************\- Animações -/***************************************************** */
        function estrelas() {
            const defaults = {
                spread: 360,
                ticks: 300,
                gravity: 0.5,
                decay: 0.94,
                startVelocity: 20,
                shapes: ["star"],
                colors: ["008D9B", "D8E2E2", "04b8ca", "A8DEE9"],
            };

            confetti({
                ...defaults,
                particleCount: 50,
                scalar: 0.5,
            });

            confetti({
                ...defaults,
                particleCount: 25,
                scalar: 1,
            });

            confetti({
                ...defaults,
                particleCount: 10,
                scalar: 1.5,
            });
        }

        //*****************************************************\- Função principal de desenho -/***************************************************** */
        function draw() {
            if (!gameInProgress) {
                return;
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawPlayer();
            moveAliens();
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

        //*****************************************************\- Função principal de desenho -/***************************************************** */

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
            });

            // Adiciona o botão à div
            messageDiv.appendChild(button);



            // Adiciona a div ao corpo do documento
            document.body.appendChild(messageDiv);


        }

        function recomecar() {
            // Add o menu
            const menu = document.querySelector('.menu');
            menu.style.display = 'initial';

            //remover o canvas de trás
            document.getElementById('container').removeChild(canvas);

            //remover o showMessage
            const msg = document.querySelector('.message-container');
            document.body.removeChild(msg);

            //tirar os pontos
            divConteudo.style.visibility = 'hidden';
            divConteudo.innerHTML = 0;
            //TODO: VER como recomeçar o jogo

        }


        // Inicia o loop do jogo
        draw();
    }
});
