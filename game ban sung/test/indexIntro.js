const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let particleiIntroArray = [];
//handle mouse
const mouse = {
    x: null,
    y: null,
    radiusIntro: 100, // bán kính khi di chuyển sẽ làm những viên xung quanh bị đẩy đi
};

addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
ctx.fillStyle = 'white';
ctx.font = '100px Verdana';
ctx.fillText('A', 0, 40);
const textCoordinates = ctx.getImageData(0, 0, 100, 100); // data của các tọa độ trong chữ
let adjustX = 10
let adjuxtY = 10
class ParticleIntro {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x; // lưu vết X
        this.baseY = this.y; // lưu vết Y
        this.density = Math.random() * 40 + 5; //dencity - tỷ trọng
    }
    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy); //khoảng cách giữa vị trí chuột hiện tại và điểm đang xét
        let forceDirectionX = dx / distance; // hướng lực theo chiều X
        let forceDirectionY = dy / distance; // hướng lực theo chiều Y
        let maxDistance = mouse.radiusIntro; //phạm vi lớn nhất co hiệu lực để đẩy
        let force = (maxDistance - distance) / maxDistance; // độ lớn của độ đẩy
        let directionX = forceDirectionX * force * this.density; //độ lớn của các vector thành phần
        let directionY = forceDirectionY * force * this.density; //

        if (distance < maxDistance) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            //cập nhật lại vị trí ban đầu cho điểm đang xét
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 5;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 5;
            }
        }
    }
}
function init() {
    particleiIntroArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let posX = x;
                let posY = y;
                particleiIntroArray.push(new ParticleIntro(posX * adjustX , posY * adjuxtY ));
            }
        }
    }
}
init();

function animateIntro() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleiIntroArray.length; i++) {
        particleiIntroArray[i].draw();
        particleiIntroArray[i].update();
    }
    connect()
    requestAnimationFrame(animateIntro);
}

function connect() {
    let opacityValue = 1
    for (let a = 0; a < particleiIntroArray.length; a++){
        for (let b = a; b < particleiIntroArray.length; b++){
            let dx = particleiIntroArray[b].x - particleiIntroArray[b].x
            let dy = particleiIntroArray[b].y - particleiIntroArray[b].y
            let distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 50) {
                opacityValue = 1 -(distance / 50)
                ctx.strokeStyle = 'rgba(255, 255, 255, '+opacityValue +')'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.moveTo(particleiIntroArray[a].x, particleiIntroArray[a].y)
                ctx.lineTo(particleiIntroArray[b].x, particleiIntroArray[b].y)
                ctx.stroke()
            }
        }
    }
}

animateIntro();

