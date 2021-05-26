const canvas = document.querySelector('canvas');  //lấy element canvas bên file html
const ctx = canvas.getContext('2d'); //set bối cảnh dạng 2d
canvas.height = innerHeight
canvas.width = innerWidth

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = [
    '#00bdff',
    '#4d39ce',
    '#088eff',
]

addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', (e) => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    init();
})
//random khoảng cách từ tâm
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//random màu có ở trong mảng
function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]// random ngẫu nhiên màu trong  mảng colors 
}

class Particle2 {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.radians = Math.random() * Math.PI * 2;
        this.velocity = 0.05; //tốc độ 
        this.distanceFromCenter = randomIntFromRange(50, 200)  // random khoảng cách từ tâm
        this.lastMouse = {
            //lưu vế chuột
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
            this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05
            this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05
            //làm cho điểm chạy theo thời gian
            this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
            this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
            this.draw(lastPoint );
        };
        this.draw = lastPoint => {
            ctx.beginPath()
            // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            // ctx.fillStyle = this.color
            // ctx.fill()
            ctx.strokeStyle = this.color
            ctx.lineWidth = this.radius
            ctx.moveTo(lastPoint.x, lastPoint.y)
            ctx.lineTo(this.x, this.y)
            ctx.stroke()
            ctx.closePath()
        };
    }
}
let particles2 = []

function init() {
    particles2 = []
    for (let i = 0; i < 100; i++) {
        const radius = (Math.random() * 2 ) +1
        particles2.push(new Particle2(canvas.width / 2, canvas.height / 2, radius, randomColor(colors)))
    }
    // console.log(particles2)
}
function animate() {
    // console.log('go')
    requestAnimationFrame(animate)

    ctx.fillStyle = 'rgba(255,255,255,0.05)'  // đổ màu nền và làm hiệu ứng mờ nhờ hệ số alpha (0,1)
    ctx.fillRect(0, 0, canvas.width, canvas.height)  //vẽ màn hình game

    particles2.forEach(particle => {
        particle.update()
    })
}

init()
animate()