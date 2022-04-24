const player = '#player'
const area = '#main'
const laser = '.laser'
const alien = '.alien'
const explosao = '.explosao'

let jogo = {}
let TECLAS = { w: 87, s: 83, a: 65, d: 68, n: 78, m: 77, }
let aliensImg = [
    './assets/image/monster-1.png', './assets/image/monster-2.png', './assets/image/monster-3.png']

// Mapeia teclas pressionadas
jogo.tecla = [];
$(document).keydown(function (e) { jogo.tecla[e.which] = true })
$(document).keyup(function (e) { jogo.tecla[e.which] = false })

// Loop do jogo
let tempo = window.setInterval(loop, 80)
function loop() {

    movePlayer(TECLAS.w, -25, 50)
    movePlayer(TECLAS.s, 25, 490)
    criaLaser()
    moveLaser()
    
    moveAlien()
    criaExplosao()
}

// Funcao para movimentar player
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
        $(laser).css("top", positionY - 120)
        $(laser).css("left", positionX + 20)
        podeAtirar = false
    }
}

function moveLaser() {
    let positionX = parseInt($(laser).css("left"))
    $(laser).css("left", positionX + 50)
    if (positionX > 544) {
        $(laser).remove()
        podeAtirar = true
    }
}

// Funcao para criar inimigos
let alienMorto = true
function criaAlien() {
    let tempo = window.setInterval(criar, 800)
    function criar() {
        let y = Math.floor(Math.random() * (540 - 50) + 0)
        let a = Math.floor(Math.random() * 3)
        if (alienMorto) {
            $(area).append(`<div class="alien" style="top: ${y}px">
        <img src="${aliensImg[a]}" alt="alien"></div>`);
            $(alien).css("left", 543)
            alienMorto
        }
        if (document.querySelectorAll('.alien').length > 2) {
            console.log('maior que 2');
            window.clearInterval(tempo)
            tempo = null
        }
    }

}
criaAlien()

function moveAlien() {
    let aliensGrupo = document.querySelectorAll('.alien')
    aliensGrupo.forEach(alien => {
        let X = parseInt(alien.css("left"))
        alien.css("left", X - 10)
        if (X < 10) {
            alien.remove()
            alienMorto = true
        }
    });

    
}

function colidiu(a, b) {
    let aux = ($(a).collision($(b)))
    if (aux.length > 0) {
        return true
    } else {
        return false
    }
}

function criaExplosao() {
    if (colidiu(alien, laser)) {
        $(laser).remove()
        podeAtirar = true
        let alienY = parseInt($(alien).css("top"))
        let alienX = parseInt($(alien).css("left"))

        $(area).append("<div class='explosao'></div>");
        $(explosao).css("top", alienY + 50)
        $(explosao).css("left", alienX - 12)
        $(alien).remove()
        alienMorto = true
        setTimeout((() => {
            $(explosao).remove()
        }), 800)
    }
}