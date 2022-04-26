const Inimigo = {
    name: '',
    __id: document.getElementById(this.name),
    class: '',
    img: '',
    largura: 60,
    altura: 50,
    vida: 100,
    frames: 60,
    velocidade: 1,
    preSet: {
        position: {
            y: 0,
            x: 0,
        },
    },
    position: {
        y: this.getId().style.top,
        x: this.getId().style.left,
    },
    getId() {
        return this.__id
    },
    getClasses() {
        this.class = document.querySelectorAll(this.class)
    },
    moveTop() {
        this.position.y -= this.velocidade
    },
    moveDown() {
        this.position.y += this.velocidade
    },
    moveLeft() {
        this.position.x -= this.velocidade
    },
    moveRight() {
        this.position.x += this.velocidade
    },
    recebeDano( dano ) {
        this.vida -= dano
    },
    infligeDano() {
        //...
    },
    estaMorto() {
        return this.vida <= 0? true : false
    }
}

let ini = Inimigo

console.log(ini().position.y);