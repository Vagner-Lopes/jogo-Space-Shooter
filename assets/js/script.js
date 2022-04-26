const player = '#player'
const area = '#main'
const laser = '.laser'
const explosao = '.explosao'
const aliens = ['.alien1', '.alien2', '.alien3']
let [alien1, alien2, alien3] = [false, false, false]
let pontos = 0
let vidas = 3
let game_over = false

let jogo = {}
let TECLAS = { w: 87, s: 83, a: 65, d: 68, n: 78, m: 77, }
let aliensImg = [
    './assets/image/monster-1.png', './assets/image/monster-2.png', './assets/image/monster-3.png']

// Mapeia teclas pressionadas
jogo.tecla = [];
$(document).keydown(function (e) { jogo.tecla[e.which] = true })
$(document).keyup(function (e) { jogo.tecla[e.which] = false })

// Loop do jogo

function start() {
    $('#painel').hide()
    criarPlayer()
    criaAlien()
    let tempo = window.setInterval(loop, 25)
    function loop() {
        movePlayer(TECLAS.w, -15, 50)
        movePlayer(TECLAS.s, 15, 490)
        criaLaser()
        moveAlien()
        moveFundo()
        explodir()
        if( vidas <= 0 ) {
            gameOver()
            window.clearInterval( tempo )
            tempo = null
        }
    }
}
function gameOver() {
    $(player).hide()
    $('.alien1').hide()
    $('.alien2').hide()
    $('.alien3').hide()
    $('#painel').show()

}

// Funcao para movimentar player
function criarPlayer() {
    $(area).append(`<img id="player" src="./assets/image/hero.png" alt="player"></img>`);  
}
function movePlayer(tecla, deslocamento, limite) {
    if (jogo.tecla[tecla]) {
        let position = parseInt($(player).css("top"))

        if (deslocamento < 0 && position < limite) {
            $(player).css("top", limite - 50)
        } else if (deslocamento > 0 && position > limite) {
            $(player).css("top", limite + 50)
        } else {
            $(player).css("top", position + deslocamento)
        }
    }
}

// Funcao atirar
let podeAtirar = true
function criaLaser() {
    let positionY = parseInt($(player).css("top"))
    let positionX = parseInt($(player).css("left"))

    if (jogo.tecla[TECLAS.n] && podeAtirar) {
        $(area).append("<div class='laser'></div>");
        $(laser).css("top", positionY + 8)
        $(laser).css("left", positionX + 32)
        podeAtirar = false
    }
    moveLaser()
}

function moveLaser() {
    let positionX = parseInt($(laser).css("left"))
    $(laser).css("left", positionX + 25)
    if (positionX > 544) {
        $(laser).remove()
        podeAtirar = true
    }
}

// Funcao para criar inimigos
function inimigo(n, y) {
    $(area).append(`<img class='alien${n}
    cont' style="top: ${y}px" src="./assets/image/monster-${n}.png" alt="alien">`);
    $(`.alien${n}`).css("left", 920)
}

function criaAlien() {
    let tempo = window.setInterval(criar, 800)
    function criar() {
        let y = Math.floor(Math.random() * (540 - 20) + 0)
        if (!game_over) {
            if (alien1 == 0) {
                inimigo(1, y)
                alien1 = true
            } else if (alien2 == 0) {
                inimigo(2, y)
                alien2 = true
            } else if (alien3 == 0) {
                inimigo(3, y)
                alien3 = true
            }
        }
        if (game_over) {
            window.clearInterval(tempo)
            tempo = null
        }
    }
}


function moveAlien() {
    for (let alien in aliens) {
        let X = parseInt($(aliens[alien]).css("left"))
        let vel = X > 600 ? 20 : 2.5
        $(aliens[alien]).css("left", X - (vel))
    }
}

function explodir() {
    for (let alien in aliens) {
        let X = parseInt($(aliens[alien]).css("left"))
        criaExplosao(aliens[alien], alien, X)
    }
}

function colidiu(a, b) {
    let aux = ($(a).collision($(b)))
    if (aux.length > 0) {
        return true
    } else {
        return false
    }
}

function criaExplosao(alien, n, x) {
    let explosaoX = parseInt($(`.explosao${n}`).css("left"))
    $(`.explosao${n}`).css("left", explosaoX - 2.5)
    if (colidiu(alien, laser) || x < 5) {
        $(laser).remove()
        alien1 = n == 0 ? 0 : 1
        alien2 = n == 1 ? 0 : 1
        alien3 = n == 2 ? 0 : 1
        podeAtirar = true
        pontos++
        if(x < 5) {
            $('.placar').remove()
            vidas--
            placar()
        }
        if (colidiu(alien, laser)) {
            pontos++
        }
        let alienY = parseInt($(alien).css("top"))
        let alienX = parseInt($(alien).css("left"))
        $(area).append(`<div class='explosao${n}'></div>`);
        $(`.explosao${n}`).css("top", alienY)
        $(`.explosao${n}`).css("left", alienX + 35)
        $(alien).remove()
        setTimeout((() => {
            $(`.explosao${n}`).remove()
        }), 800)
    }
}

function moveFundo() {

    let esquerda = parseInt($(area).css("background-position"))
    $(area).css("background-position", esquerda - 1)
}

function placar() {
    $(area).append(`<div class='placar'>
    <img class='vidas' src="./assets/image/${vidas}vidas.png" alt="vidas">
    <h3 class='pontos'>score:  000</h3>
    </div>`);
    $('.pontos').innerHtml = pontos
}
placar()