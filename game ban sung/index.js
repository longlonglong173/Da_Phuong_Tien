
console.log(gsap)
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreLabel = document.getElementById("scoreLabel").querySelector("span:last-child")
const box = document.getElementById('box');
const scoreBox = document.getElementById('score')
const button = document.getElementById('btn')
var score = 0
var isStart = false;
var isRestart = false;
// player

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    draw() {
        ctx.beginPath;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color
        ctx.fill()
    }

}

//duong dan
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

//quan dich
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const friction = 0.98 //tốc độ làm chậm hiệu ứng nổ
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

const xCenter = canvas.width / 2;
const yCenter = canvas.height / 2;
let player = new Player(xCenter, yCenter, 10, 'white');
let projectiles = []
let enemies = []
let particles = []

function init() {
    player = new Player(xCenter, yCenter, 10, 'white');
    projectiles = []
    enemies = []
    particles = []
}


function spawnEnemy() {
    setInterval(() => {
        const radius = Math.random() * (30 - 5) + 5;
        console.log('go')
        let x
        let y
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const angle = Math.atan2(yCenter - y, xCenter - x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)

}
let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0,0,0,0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    //xét hiệu ứng lúc va chạm sẽ tỏa ra 
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update()
        }
    })
    projectiles.forEach((projectile, index) => {
        projectile.update()
        //loại bỏ những viên đạn đẫ bay ra khỏi  màn hình
        if (projectile.x - projectile.radius < 0
            || projectile.y - projectile.radius < 0
            || projectile.x - projectile.radius > canvas.width
            || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0);
        }
    })



    //xét va chạm của đạn và địch
    enemies.forEach((enemy, index) => {
        //end game
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            box.style.display = 'flex'
            button.innerHTML = 'Restart'
            score = 0;
            scoreBox.innerHTML = score;
            
        }
        enemy.update()
        projectiles.forEach((pro, index2) => {
            //tính khoảng cách giữa  enemy và viên đạn, nếu chúng chạm nhau thì xóa bỏ phần tử đi
            const dist = Math.hypot(pro.x - enemy.x, pro.y - enemy.y)
            if (dist - enemy.radius - pro.radius < 1) {
                //tính điểm
                score += Math.round(enemy.radius)
                console.log("radius: " + enemy.radius)
                scoreLabel.innerHTML = `${score}`
                // hiệu ứng nổ
                for (let i = 0; i < enemy.radius; i++) {
                    particles.push(new Particle(pro.x, pro.y, Math.random() * 3, enemy.color, {
                        x: (Math.random() - 0.5) * (Math.random() * 6),
                        y: (Math.random() - 0.5) * (Math.random() * 6)
                    }))
                }
                if (enemy.radius - 10 >= 10) {
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(index2, 1)
                    }, 9);
                }
                else {
                    //set time out ở đây dùng để cho lúc va chạm nó k bị chớp
                    setTimeout(() => {
                        console.log("va cham")
                        enemies.splice(index, 1)
                        projectiles.splice(index2, 1)
                    }, 0);
                }
            }
        })
    })
}

player.draw()
window.addEventListener('click', function (e) {
    //tính góc của đường đạn so với trục x
    const angle = Math.atan2(e.clientY - yCenter, e.clientX - xCenter)
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
    }
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity))
})

//start gamegame
button.addEventListener('click', () => {
    init()
    box.style.display = 'none'
    animate()
    spawnEnemy()
})

