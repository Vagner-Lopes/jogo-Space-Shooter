const player = '#player'
const area = '#main'
const laser = '.laser'
const explosao = '.explosao'
const aliens = ['.alien1', '.alien2', '.alien3']
let pontos = 0
let recorde = 0
let vidas = 3
let game_over = false
const background = document.getElementById('main')
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
    pontos = 0
    vidas = 3
    $('.placar').remove()
    placar()
    let tempo = window.setInterval(loop, 25)
    function loop() {
        movePlayer(TECLAS.w, -10, 50)
        movePlayer(TECLAS.s, 10, 490)
        criaLaser()
        moveFundo()
        moveAlien()

        checaColisao()
        if (vidas <= 0) {
            gameOver()
            window.clearInterval(tempo)
            tempo = null
        }
    }
    let tempo2 = window.setInterval(loop2, 500)
    function loop2() {
        criaAlien()

        if (vidas <= 0) {
            gameOver()
            window.clearInterval(tempo2)
            tempo2 = null
        }
    }
}
placar()

function gameOver() {
    $(player).remove()
    $('.alien1').remove()
    $('.alien2').remove()
    $('.alien3').remove()
    $('#painel').show()
    placar()
}

//------------------------------------------------------ Player
function criarPlayer() {
    $(area).append(`<img id="player" src="./assets/image/hero.png" alt="player"></img>`);
}
function movePlayer(tecla, deslocamento, limite) {
    if (jogo.tecla[tecla]) {
        let position = parseInt($(player).css("top"))
        //let backTop = parseInt($(area).css("background-position-y"))

        if (deslocamento < 0 && position < limite) {
            $(player).css("top", limite - 50)

        } else if (deslocamento > 0 && position > limite) {
            $(player).css("top", limite + 50)
        } else {
            $(player).css("top", position + deslocamento)
            let y = $(area).css("background-position-y")
            //
            //var banner = $('.main').css('background-position-y')
            let x = $(area).css('background-position-x')
            $(area).css("background-position-y", y - 2)
            console.log( x, y );
        }
    }
}

//------------------------------------------------------ Atirar
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

//------------------------------------------------------ Inimigo

function inimigo(n, y) {
    $(area).append(`<img class='alien${n}
    cont' style="top: ${y}px" src="./assets/image/monster-${n}.png" alt="alien">`);
    $(`.alien${n}`).css("left", 920)
}
function criaAlien() {
    if (!game_over) {
        let y = Math.floor(Math.random() * (540 - 20) + 0)
        if (!game_over) {
            if ($(aliens[0]).length < 1) {
                inimigo(1, y)
            } else if ($(aliens[1]).length < 1) {
                inimigo(2, y)
            } else if ($(aliens[2]).length < 1) {
                inimigo(3, y)
            }
        }
    }
}
function moveAlien() {
    for (let alien in aliens) {
        let X = parseInt($(aliens[alien]).css("left"))
        let vel = X > 600 ? 40 : 5
        $(aliens[alien]).css("left", X - (vel))
        if (X < 10) {
            $(aliens[alien]).remove()
            $('.placar').remove()
            placar()
            vidas--
        }
    }
}
//------------------------------------------------------ Explosao, Colisao
function criaExplosao(alien, n) {
    let alienY = parseInt($(alien).css("top"))
    let alienX = parseInt($(alien).css("left"))
    $(area).append(`<div class='explosao${n}'></div>`);
    $(`.explosao${n}`).css("top", alienY)
    $(`.explosao${n}`).css("left", alienX + 35)
    let explosaoX = parseInt($(`.explosao${n}`).css("left"))
    $(`.explosao${n}`).css("left", explosaoX - 2.5)
    $(laser).remove()
    podeAtirar = true
    $(alien).remove()
    setTimeout((() => {
        $(`.explosao${n}`).remove()
    }), 800)
}

function colidiu(a, b) {
    let aux = ($(a).collision($(b)))
    if (aux.length > 0) {
        return true
    } else {
        return false
    }
}
function checaColisao() {
    for (let n in aliens) {
        if (colidiu(aliens[n], laser)) {
            $('.placar').remove()
            pontos++
            placar()
            criaExplosao(aliens[n], n)
        }
        if (colidiu(aliens[n], player)) {
            $('.placar').remove()
            vidas--
            placar()
            criaExplosao(aliens[n], n)
        }
    }
}
//------------------------------------------------------ Fundo, Placar
function moveFundo() {
    let x = parseInt($(area).css("background-position"))
    $(area).css("background-position", x - 2)
}

function placar() {
    $(area).append(`<div class='placar'>
    <img class='vidas' src="./assets/image/${vidas}vidas.png" alt="vidas">
    <h3 class='pontos'>score:  ${pontos * 100}</h3>
    </div>`);
}