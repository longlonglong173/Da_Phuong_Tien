const canvas = document.querySelector('canvas');  //lấy element canvas bên file html
const ctx = canvas.getContext('2d'); //set bối cảnh dạng 2d

canvas.width = window.innerWidth; //set độ rộng của game = độ rộng màng hình 
canvas.height = window.innerHeight; //set độ cao của game = độ cao màng hình 

const scoreLabel = document.getElementById("scoreLabel").querySelector("span:last-child")    //element hiển thị điểm khi chơi
const box = document.getElementById('box');  //element hiển thị bảng khi bắt đầu và kết thúc game
const scoreBox = document.getElementById('score') //element hiển thị điểm trên bảng
const button = document.getElementById('btn')    //nút bắt đầu hoặc kết thúc game
var score = 0   //biến tính điểm
var dmgLocal = 5
var isStart = false
const degree = Math.PI / 180
let spaceshipImg = document.getElementById('playerImg')
let angleM = -90 * (Math.PI / 180)   // góc xoay của đường đạn so với trục x
console.log(angleM)
// let img = new Image()
spaceshipImg.src = 'img/spaceship1.png'
let typeOfSpaceShip = 1
const spaceShip1 = document.getElementById('spaceShip1')
const spaceShip2 = document.getElementById('spaceShip2')
const spaceShip3 = document.getElementById('spaceShip3')
const spaceShipTitle = document.getElementById('spaceShipTitle')
const exitBtn = document.getElementById('exit-btn')


function drawRotated(degrees){
    ctx.save();
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(degrees);
    ctx.drawImage(spaceshipImg,-40,-40, 80, 80);
    ctx.restore();
}
let minSizeEnemy = 7
let maxSizeEnemy = 30

// âm thanh
const SHOOT = new Audio()
SHOOT.src = './sound/shoot.wav'
SHOOT.volume = 0.2

const HIT = new Audio()
HIT.src = './sound/hit.wav'
HIT.volume = 0.2

const BOOM = new Audio()
BOOM.src = './sound/boom.wav'

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = [
    '#00bdff',
    '#4d39ce',
    '#088eff',
]

// khai báo class người chơi
class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    //tạo animation space với trung tâm là người chơi
    animateAround() {
        for (let i = 0; i < 300; i++) {
            const radius = (Math.random() * 2) + 1
            particles2.push(new Particle2(canvas.width / 2, canvas.height / 2, Math.random() * Math.PI * 2, randomColor(colors)))
        }
    }
}



// khai báo class đường đạn
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius  // bán kính
        this.color = color
        this.velocity = velocity  // vạn tốc
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color
        ctx.fill()
    }
    //cập nhật lại đường đạn 
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

//khai báo class quân địch
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

const friction = 0.999 //tốc độ làm chậm hiệu ứng nổ   
//hiệu ứng nổ
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1  // độ mờ
    }
    draw() {
        ctx.save()  //lưu tình trạng của hiệu ứng nổ lên stack  
        ctx.globalAlpha = this.alpha //cập nhật lại độ mở của hiệu ứng nổ
        ctx.beginPath();  // bắt đầu vẽ
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);  // vẽ hình tròn
        ctx.fillStyle = this.color  // đổ màu
        ctx.fill() // vẽ
        ctx.restore()  //hiện trạng thái trên cùng trên stack, khôi phục bối cảnh tới trạng thái đó.
    }
    update() {
        this.draw()
        this.velocity.x *= friction    // cập nhật lại độ dài trục x của vận tốc, làm chậm đi sau mỗi lần quét
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x  //cập nhật lại vị trí mới
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01  // giảm độ rõ của hiệu ứng đi, khi hiệu ứng nổ có alpha = 0 thì sẽ loại bỏ hiệu ứng nổ khỏi mảng lưu bên dưới
    }
}

const xCenter = canvas.width / 2;  //tọa độ của người chơi ở giữa màn hình 
const yCenter = canvas.height / 2; //....
let player = new Player(xCenter, yCenter, 20, 'white');  //khởi tạo người chơi
let projectiles = []   // mảng lưu các viên đạn được bắn ra
let enemies = []        // mảng lưu các quân địch được random trên màng hình
let particles = []  //mảng lưu các viên hiệu ứng nổ

// bắt đầu
function init() {
    player = new Player(xCenter, yCenter, 10, 'white');
    projectiles = []
    enemies = []
    particles = []
    particles2 = []
    isStart = false
}



function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]// random ngẫu nhiên màu trong  mảng colors 
}

//vẽ background
class Particle2 {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.radians = Math.random() * Math.PI * 2;
        this.velocity = 0.001; //tốc độ 
        this.distanceFromCenter = randomIntFromRange(30, canvas.width > canvas.height ? canvas.width / 2 : canvas.height / 2)  // random khoảng cách từ tâm
        this.lastMouse = {
            //lưu vết chuột
            x: x,
            y: y
        }
        this.update = () => {
            const lastPoint = {
                //lưu vết điểm vừa vẽ
                x: this.x,
                y: this.y
            }
            this.radians += this.velocity
            //hiệu ứng di chuột
            this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.001
            this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.001
            //làm cho điểm chạy theo thời gian
            this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
            this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
            this.draw(lastPoint);
        };
        this.draw = lastPoint => {
            ctx.beginPath()
            ctx.strokeStyle = this.color
            ctx.lineWidth = this.radius
            ctx.moveTo(lastPoint.x, lastPoint.y)
            ctx.lineTo(this.x, this.y)
            ctx.stroke()
            ctx.closePath()
        };
    }
}

let particles2 = [] //mảng lưu lại những viên quanh đốip tượng đang xét
let timeToRespawnEnemy = 1000
// hàm khởi tạo quân địch
function spawnEnemy(sizeMin, sizeMax) {
    //setinerval là để gọi hàm sau một khoảng thời gian nhất định
    setInterval(() => {
        const radius = Math.random() * (sizeMax - sizeMin) + sizeMin;  // random đường kính của quân địch
        let x  // tọa độ của quân đch trên màn hình
        let y
        //random tọa độ của quân địch được xuất hiện từ các cạnh của bàn hình
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius  // sử dụg toán tử 3 ngôi
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`  //random màu sắc của quân địch
        const angle = Math.atan2(yCenter - y, xCenter - x)  // tính góc của quân địch được random so với trục x
        // phương của quân địch luôn  hướng về người chơi(giữa màn hình)
        const velocity = {
            x: Math.cos(angle),  //tính độ dài trục x của vận tốc
            y: Math.sin(angle)   //.....
        }
        let abc = new Enemy(x, y, radius, color, velocity)
        enemies.push(abc)  // thêm quân địch vừa tạo bên trên vào mảng đã khai báo
        console.log("respawn: " + timeToRespawnEnemy)

    }, timeToRespawnEnemy)
}

let animationId
function animate() {
    drawRotated(angleM)
    animationId = requestAnimationFrame(animate) // phương thức này làm mới màn hình sau mỗi lần quét 
    ctx.fillStyle = 'rgba(0,0,0,0.1)'  // đổ màu nền và làm hiệu ứng mờ nhờ hệ số alpha (0,1)
    ctx.fillRect(0, 0, canvas.width, canvas.height)  //vẽ màn hình game
    // player.draw()  //vẽ người chơi
    //xét hiệu ứng lúc va chạm sẽ tỏa ra 
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);   //  nếu độ nét của viên hiệu ứng nổ  <= 0 thì sẽ bỏ viên hiệu ứng đó khỏi mảng
        } else {
            particle.update()   // cập nhật lại viên hiệu ứng
        }
    })
    //xét hiệu ứng xung quanh viên đạn
    particles2.forEach(particle => {
        particle.update()
    })
    //xet mảng đạn bắn ra
    projectiles.forEach((projectile, index) => {
        projectile.update()     //cập nhật lại viên đạn
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
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y) // tính khoảng cách của quân địch và người chơi
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)  // dừng frame
            box.style.display = 'flex'   // xét thuộc tính display cho box để hiện lên bảng kết thúc chơi game
            button.innerHTML = 'Restart'   // set text cho nút 
            scoreLabel.innerHTML = 0; // set lại điểm trên góc màn hình
            scoreBox.innerHTML = score;  //set text cho số điểm
            score = 0;   //reset lại số điểm 
            isStart = false
            spaceShip1.style.display = 'none'
            spaceShip2.style.display = 'none'
            spaceShip3.style.display = 'none'
            spaceShipTitle.style.display = 'none'
        }
        enemy.update()
        projectiles.forEach((pro, index2) => {
            //tính khoảng cách giữa  enemy và viên đạn, nếu chúng chạm nhau thì xóa bỏ phần tử đi
            const dist = Math.hypot(pro.x - enemy.x, pro.y - enemy.y)
            if (dist - enemy.radius - pro.radius < 1) {
                //tính điểm
                score += Math.round(enemy.radius) // tính điểm khi bắn trúng địch
                scoreLabel.innerHTML = `${score}`  //cập nhật lại điểm trên góc màn hình
                // hiệu ứng nổ
                HIT.play()
                HIT.currentTime = 0
                for (let i = 0; i < enemy.radius; i++) {
                    particles.push(new Particle(pro.x, pro.y, Math.random() * 3, enemy.color, {
                        //Math.random() * 3 là random bán kính của viên hiệu ứng nổ, màu trùng với màu quân địch bị bắn
                        x: (Math.random() - 0.5) * (Math.random() * 6),  // random độ dài trục x, y của hướng vận tốc để có được những hướng tỏa ra khác nhau
                        y: (Math.random() - 0.5) * (Math.random() * 6)
                    }))
                }
                if (enemy.radius - dmgLocal >= dmgLocal) {
                    //thư viện gsap để làm cho hiệu ứng khi bị bắn quân địch nhỏ lại trông mượt hơn

                    gsap.to(enemy, {
                        radius: enemy.radius - dmgLocal  // giảm bán kính sau mỗi lần bị bắn
                    })
                    //set time out ở đây dùng để cho lúc va chạm nó k bị chớp
                    setTimeout(() => {
                        projectiles.splice(index2, 1)  // loại bỏ viên đạn khi va cham ra khỏi mảng
                    }, 0);
                }
                else {
                    //set time out ở đây dùng để cho lúc va chạm nó k bị chớp
                    setTimeout(() => {
                        BOOM.play()
                        BOOM.currentTime = 0
                        enemies.splice(index, 1)  // loại bỏ đối tượng bị bắn ra khỏi  mảng
                        projectiles.splice(index2, 1) // loại bỏ viên đạn khi va cham ra khỏi mảng
                    }, 0);
                }
            }
        })
    })  
}

player.animateAround()

//lấy tọa độ chuột để quay tàu theo hướng chuột
addEventListener('mousemove', (e) => {
    const angle = Math.atan2(e.clientY - yCenter, e.clientX - xCenter)  // góc giữu đường đạn và trục x
    angleM = angle + Math.PI/2
})
//set event click trên màn hình
window.addEventListener('click', function (e) {
    //tính góc của đường đạn so với trục x
    if (isStart == true) {
        const angle = Math.atan2(e.clientY - yCenter, e.clientX - xCenter)  // góc giữu đường đạn và trục x
        if (typeOfSpaceShip == 1) {
            proOfSpaceship1(angle)
        } else  if(typeOfSpaceShip == 2){
            proOfSpaceship2(angle)
        }
        else if (typeOfSpaceShip == 3) {
            proOfSpaceship3(angle)
        }

    }
    // console.log("projectiles: " + projectiles)
})

function proOfSpaceship2(angle) {
    const projectileRadius = 15
    dmgLocal = projectileRadius
        const velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5,
        }
        //sau mỗi lần 1 viên đạn được tạo thì thêm nó vào mảng prejectiles
        let angleStep = 4 * (Math.PI / 180)
        SHOOT.play()
        SHOOT.currentTime = 0;
        const velocity2l = {
            x: Math.cos(angle - angleStep) * 5,
            y: Math.sin(angle - angleStep) * 5,
        }
        const velocity2r = {
            x: Math.cos(angle + angleStep) * 5,
            y: Math.sin(angle + angleStep) * 5,
        }
        const velocity3l = {
            x: Math.cos(angle - 2*angleStep) * 5,
            y: Math.sin(angle - 2*angleStep) * 5,
        }
        const velocity3r = {
            x: Math.cos(angle + 2*angleStep) * 5,
            y: Math.sin(angle + 2*angleStep) * 5,
        }
        const velocity4l = {
            x: Math.cos(angle - 3*angleStep) * 5,
            y: Math.sin(angle - 3*angleStep) * 5,
        }
        const velocity4r = {
            x: Math.cos(angle + 3*angleStep) * 5,
            y: Math.sin(angle + 3*angleStep) * 5,
    }
    
    if (score < 1000) {
        //1
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        minSizeEnemy = 10
        maxSizeEnemy = 35
    } else if (score >= 1000 && score < 2000) {
        //2
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2r))
        timeToRespawnEnemy = 800
        minSizeEnemy = 15
        maxSizeEnemy = 45
    } else if (score >= 2000 && score < 3000) {
        //3
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2r))
        timeToRespawnEnemy = 600
        minSizeEnemy = 20
        maxSizeEnemy = 55
    } else if (score >= 3000 && score < 4000) {
        //4
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2r))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity3l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity3r))
        timeToRespawnEnemy =400
        minSizeEnemy = 20
        maxSizeEnemy = 60
    } else if (score >= 4000 && score < 5000) {
        //5
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2r))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity3l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity3r))
        timeToRespawnEnemy = 300
        minSizeEnemy = 25
        maxSizeEnemy = 70
    } else if (score >= 5000 && score < 6000) {
        //6
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2r))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity3l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity3r))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity4l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity4r))
        timeToRespawnEnemy = 200
        minSizeEnemy = 25
        maxSizeEnemy = 75
    } else if (score >= 6000) {
        //7
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity2r))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity3l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity3r))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity4l))
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity4r))
        timeToRespawnEnemy = 100
        minSizeEnemy = 20
        maxSizeEnemy = 100
    }
}

function proOfSpaceship1(angle) {
    const projectileRadius = 7
    dmgLocal = projectileRadius
        const velocity = {
            x: Math.cos(angle) * 7,
            y: Math.sin(angle) * 7,
        }
        //sau mỗi lần 1 viên đạn được tạo thì thêm nó vào mảng prejectiles
        SHOOT.play()
    SHOOT.currentTime = 0;
    setTimeout(() => {
        SHOOT.play()
        SHOOT.currentTime = 0;
    }, 100);
            // đường đạn song song
        let wing = 15
    if (score < 1000) {
        //1
        console.log("type: 1" )
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        setTimeout(() => {
            projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        }, 200);
        minSizeEnemy = 10
        maxSizeEnemy = 35
    } else if (score >= 1000 && score < 2000) {
        //2
        console.log("type: 2" )
        projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        setTimeout(() => {
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 200);
        timeToRespawnEnemy = 800
        minSizeEnemy = 15
        maxSizeEnemy = 45
    } else if (score >= 2000 && score < 3000) {
        //3
        console.log("type: 3" )

        wing = 20
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        setTimeout(() => {
            projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 200);
       timeToRespawnEnemy = 600
        minSizeEnemy = 20
        maxSizeEnemy = 55
    } else if (score >= 3000 && score < 4000) {
        //4
        console.log("type: 4" )

        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius, 'white', velocity))
        setTimeout(() => {
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius, 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))    
        }, 150);
        setTimeout(() => {
            wing = 7
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            wing = 22
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 300);
        timeToRespawnEnemy =400
        minSizeEnemy = 20
        maxSizeEnemy = 60
    } else if (score >= 4000 && score < 5000) {
        //5
        console.log("type: 5")
        wing = 67
        projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        setTimeout(() => {
            wing = 52
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 100);
        setTimeout(() => {
            wing = 37
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 200);
        setTimeout(() => {
            wing = 22
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 300);
        setTimeout(() => {
            wing = 7
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 400);
        timeToRespawnEnemy = 300
        minSizeEnemy = 25
        maxSizeEnemy = 70
    } else if (score >= 5000 && score < 6000) {
        //6
        console.log("type: 6")
        setTimeout(() => {
            wing = 82
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 500);
        setTimeout(() => {
            wing = 67
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 400);
        setTimeout(() => {
            wing = 52
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 300);
        setTimeout(() => {
            wing = 37
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 200);
        setTimeout(() => {
            wing = 22
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 100);
        setTimeout(() => {
            wing =7
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 0);
        timeToRespawnEnemy = 200
        minSizeEnemy = 25
        maxSizeEnemy = 75
    } else if (score >= 6000) {
        //7
        console.log("type: 7")
        setTimeout(() => {
            wing = 82
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 500);
        setTimeout(() => {
            wing = 67
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            wing = 7
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 400);
        setTimeout(() => {
            wing = 52
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            wing = 22
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 300);
        setTimeout(() => {
            wing = 37
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 200);
        setTimeout(() => {
            wing = 22
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 100);
        setTimeout(() => {
            wing =7
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 0);
        timeToRespawnEnemy = 100
        minSizeEnemy = 20
        maxSizeEnemy = 100
    }
}

function proOfSpaceship3(angle) {
    const projectileRadius = 7
    dmgLocal = projectileRadius
        const velocity = {
            x: Math.cos(angle) * 7,
            y: Math.sin(angle) * 7,
        }
        //sau mỗi lần 1 viên đạn được tạo thì thêm nó vào mảng prejectiles
        SHOOT.play()
    SHOOT.currentTime = 0;
    setTimeout(() => {
        SHOOT.play()
        SHOOT.currentTime = 0;
    }, 100);
            // đường đạn song song
        let wing
    if (score < 1000) {
        //1
        console.log("type: 1" )
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        setTimeout(() => {
            projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        }, 200);
        minSizeEnemy = 10
        maxSizeEnemy = 35
    } else if (score >= 1000 && score < 2000) {
        //2
        console.log("type: 2" )
        wing = 35
        projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        setTimeout(() => {
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 200);
        timeToRespawnEnemy = 800
        minSizeEnemy = 15
        maxSizeEnemy = 45
    } else if (score >= 2000 && score < 3000) {
        //3
        console.log("type: 3" )

        wing = 35
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        setTimeout(() => {
            projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 200);
       timeToRespawnEnemy = 600
        minSizeEnemy = 20
        maxSizeEnemy = 55
    } else if (score >= 3000 && score < 4000) {
        //4
        console.log("type: 4" )
        wing = 35
        projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
        projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))  
        setTimeout(() => {
            wing = 20
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))    
            wing = 50
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 150);
        setTimeout(() => {
            wing = 35
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 300);
        setTimeout(() => {
            wing = 35
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 450);
        timeToRespawnEnemy =400
        minSizeEnemy = 20
        maxSizeEnemy = 60
    } else if (score >= 4000 && score < 5000) {
        //5
        console.log("type: 5")
        setTimeout(() => {
            projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        }, 0);
        setTimeout(() => {
            wing = 20
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 100);
        setTimeout(() => {
            wing = 40
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 200);
        setTimeout(() => {
            wing = 60
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'red', velocity))
        }, 300);
        setTimeout(() => {
            wing = 40
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 400);
        setTimeout(() => {
            wing = 20
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 500);;
        setTimeout(() => {
            projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        }, 600);
        timeToRespawnEnemy = 300
        minSizeEnemy = 25
        maxSizeEnemy = 70
    } else if (score >= 5000 && score < 6000) {
        //6
        console.log("type: 6")
        setTimeout(() => {
            wing = 60
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 600);
        setTimeout(() => {
            wing = 30
            //right
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            wing = 60
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
           }, 500);
        setTimeout(() => {
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            wing = 30
            //right
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            wing = 60
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            }, 400);
        setTimeout(() => {
            wing = 30
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            //right
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity)) }, 300);

        setTimeout(() => {
            wing = 60
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            wing = 30
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
        }, 200);
        setTimeout(() => {
            wing = 60
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            wing = 30
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
        }, 100);
        setTimeout(() => {
            wing = 60
            //left
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
        }, 0);
        timeToRespawnEnemy = 200
        minSizeEnemy = 25
        maxSizeEnemy = 75
    } else if (score >= 6000) {
        //7
        console.log("type: 7")
        setTimeout(() => {
            wing = 45
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 600);
        setTimeout(() => {
            wing = 30
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            wing = 60
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 500);
        setTimeout(() => {
            wing = 15
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            wing = 75
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 400);
        setTimeout(() => {
            projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, projectileRadius , 'white', velocity))
            wing = 90
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            wing = 45
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'red', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'red', velocity))
           }, 300);
        setTimeout(() => {
            wing = 15
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            wing = 75
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 200);
        setTimeout(() => {
            wing = 30
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
            wing = 60
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 100);
        setTimeout(() => {
            wing = 45
            projectiles.push(new Projectile(canvas.width / 2 + wing * Math.sin(angle), canvas.height / 2 - wing * Math.cos(angle), 5, 'white', velocity))
            projectiles.push(new Projectile(canvas.width / 2 - wing * Math.sin(angle), canvas.height / 2 + wing * Math.cos(angle), 5, 'white', velocity))
        }, 0);
        timeToRespawnEnemy = 100
        minSizeEnemy = 20
        maxSizeEnemy = 100
    }
}

//nút start/ restart lại game
button.addEventListener('click', () => {
    init() // hàm bắt đầu
    box.style.display = 'none'  // ẩn box khi bấm nút
    animate()  // bắt đầu hiệu ứng chính  cúa game
    spawnEnemy(minSizeEnemy, maxSizeEnemy)  // tạo quân địch   
    player.animateAround()
    isStart = true
})

spaceShip1.addEventListener('click', () => {
    spaceshipImg.src = "./img/spaceship1.png"  //gán link ảnh tau 1
    spaceShip1.style.border = 'solid 1px orange'
    spaceShip2.style.border = ''
    spaceShip3.style.border = ''
    typeOfSpaceShip = 1
})

spaceShip2.addEventListener('click', () => {
    spaceshipImg.src = "./img/spaceship2.png"  //gán link ảnh tau 2
    spaceShip2.style.border = 'solid 1px orange'
    spaceShip1.style.border = ''
    spaceShip3.style.border = ''
    typeOfSpaceShip = 2
})

spaceShip3.addEventListener('click', () => {
    spaceshipImg.src = "./img/spaceship3.png"  //gán link ảnh tau 3
    spaceShip3.style.border = 'solid 1px orange'
    spaceShip2.style.border = ''
    spaceShip1.style.border = ''
    typeOfSpaceShip = 3
})

exitBtn.addEventListener('click', () => {
    spaceShipTitle.style.display = 'block'
    spaceShip1.style.display = 'block'
    spaceShip2.style.display = 'block'
    spaceShip3.style.display = 'block'
    isStart = false
})
