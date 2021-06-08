const canvas = document.querySelector('canvas');
// const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.setTextBasline = 'middle';
let letterArrays = ['A', 'B', 'C'];
let hue = 0;
let particles = [];
let numberOfParticles = (canvas.width * canvas.height) / 7000;
// let numberOfParticles = 50;
console.log('number : ' + numberOfParticles);
const mouse = {
    x: canvas.width / 2,
    y:  canvas.height / 2,
    radius: 60,
    autopilotAngle: 0, // góc xoay tự động
};

let posX = canvas.width / 2
let posY = canvas.height / 2

// window.addEventListener('mousemove', (e) => {
//   mouse.x = e.clientX;
//   mouse.y = e.clientY;
//   console.log('X: ', mouse.x, '-Y: ', mouse.y);
// });

class Particle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius; // bán kính
        this.color = 'hsl(' + hue + ', 100%, 50%)'; // màu sắc hệ hsl
        this.text =
            letterArrays[Math.floor(Math.random() * letterArrays.length)];
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 1.5, true);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
    update() {
        // nếu mà trạng thái của chuột là undefined thì xóa bớt bóng
        if (mouse.x === undefined && mouse.y === undefined) {
            let newX =
                ((mouse.radius * canvas.width) / 200) *
                Math.sin(mouse.autopilotAngle * (Math.PI / 60));
            let newY =
                ((mouse.radius * canvas.height) / 200) *
                Math.sin(mouse.autopilotAngle * (Math.PI / 140));
            mouse.X = newX + canvas.width / 2;
            mouse.Y = newY + canvas.height / 2;
            mouse.autopilotAngle += 0.004;
        }
    }
}

let angleRotate = 0;
function autoRotate() {
    mouse.x += 5 * Math.sin(angleRotate);
    mouse.y += 5 * Math.cos(angleRotate);
}

// hàm xử lý những cái viên tạo ra có hình dạng chồng chéo lên nhau
function handleOverlap() {
    let overlapping = false;
    let protection = 30; // giới hạn số lần tạo ra cái mới
    let counter = 0; // đếm xem đã tạo bao nhiêu lần
    while (particles.length < numberOfParticles && counter < protection) {
        let randomAngle = Math.random() * 2 * Math.PI;
        let randomRadius = mouse.radius * Math.sqrt(Math.random());
        let particle = {
            x: mouse.x + randomRadius * Math.cos(randomAngle),
            y: mouse.y + randomRadius * Math.sin(randomAngle),
            radius: Math.floor(Math.random() * 15) + 5,
        };
        overlapping = false;
        for (let i = 0; i < particles.length; i++) {
            let previousParticle = particles[i];
            let dx = particle.x - previousParticle.x;
            let dy = particle.y - previousParticle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < particle.radius + previousParticle.radius) {
                overlapping = true;
                break;
            }
        }
        if (!overlapping) {
            particles.unshift(
                new Particle(particle.x, particle.y, particle.radius)
            );
        }
        counter++;
    }
}
handleOverlap();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
    }
    if (particles.length >= numberOfParticles) {
        for (let i = 0; i < 5; i++) {
            //loại  bỏ 5 quả trong 1 lần
            particles.pop();
        }
    }
    handleOverlap();
    hue += 2;
    //rotate
    // autopilot()
    mouse.x += 5 * Math.sin(angleRotate);
    mouse.y += 5 * Math.cos(angleRotate);
    angleRotate +=0.2
    requestAnimationFrame(animate);
}

animate();

let autopilot = setInterval(() => {
    mouse.x = undefined;
    mouse.y = undefined;
}, 40);

canvas.addEventListener('mouseleave', () => {
    autopilot = setInterval(() => {
        mouse.x = undefined;
        mouse.y = undefined;
    }, 40);
});

canvas.addEventListener('mouseenter', () => {
    clearInterval(autopilot);
    autopilot = undefined;
});
