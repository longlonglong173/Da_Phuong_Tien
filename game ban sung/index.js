const canvas = document.querySelector('canvas'); //lấy element canvas bên file html
const ctx = canvas.getContext('2d'); //set bối cảnh dạng 2d
const currentHealthBar = document.getElementById('currentHealthBar');
const maxHealthBar = document.getElementById('maxHealthBar');
const navBox = document.getElementById('nav');
const textBox = document.getElementById('textBox');
canvas.width = window.innerWidth; //set độ rộng của game = độ rộng màng hình
canvas.height = window.innerHeight; //set độ cao của game = độ cao màng hình
ctx.setTextBasline = 'middle';
let hue = 0;
let particlesLU = []; //particles of level up
let numberOfParticlesLU = (canvas.width * canvas.height) / 7000; //số lượng quả bóng khi level up bị giới hạn
const scoreLabelX = document.getElementById('scoreLabel');
const scoreLabel = document
    .getElementById('scoreLabel')
    .querySelector('span:last-child'); //element hiển thị điểm khi chơi
const box = document.getElementById('box'); //element hiển thị bảng khi bắt đầu và kết thúc game
const scoreBox = document.getElementById('score'); //element hiển thị điểm trên bảng
const button = document.getElementById('btn'); //nút bắt đầu hoặc kết thúc game
const buttonRestart = document.getElementById('btn-restart');
var score = 0; //biến tính điểm
var dmgLocal = 5;
var isStart = false;
var isDead = true;
const degree = Math.PI / 180;
let spaceshipImg = document.getElementById('playerImg');
var isUppingLevel = false;
let angleM = -90 * (Math.PI / 180); // góc xoay của đường đạn so với trục x
let health = 1000;
const maxHealthWidth = maxHealthBar.offsetWidth; //lấy chiều dài lớn nhất của thanh máu
console.log('health: ' + maxHealthWidth);
let timeToRespawnEnemy = 500;
let intervalEnemy;

spaceshipImg.src = 'img/spaceship1.png';
let typeOfSpaceShip = 1;
const spaceShip1 = document.getElementById('spaceShip1');
const spaceShip2 = document.getElementById('spaceShip2');
const spaceShip3 = document.getElementById('spaceShip3');
const exitBtn = document.getElementById('exit-btn');
let particleIntroArray = [];
let adjustX = 12;
let adjustY = 12;
let animateIntroID;
let firstClick = false;
let clickCount = 0;
let boxPosY = 100; // %vị trí xuất hiện của bảng chọn bắt đầu
let healthBarPosY = -30; // vị trí xuất hiện của thanh máu, điểm, nút thoát
let canvasPosY = -100;
let particlesIntroShapeArray;
let gameOverOpacity = 0;
let isPlayIntroSound = false;
const bgSound = document.getElementById('bgSound');
let timeToRespawnLV1 = 450;
let timeToRespawnLV2 = 400;
let timeToRespawnLV3 = 350;
let timeToRespawnLV4 = 300;
let timeToRespawnLV5 = 200;
let timeToRespawnLV6 = 100;

let minSizeEnemyLV1 = 9;
let minSizeEnemyLV2 = 11;
let minSizeEnemyLV3 = 13;
let minSizeEnemyLV4 = 15;
let minSizeEnemyLV5 = 17;
let minSizeEnemyLV6 = 20;

let maxSizeEnemyLV1 = 35;
let maxSizeEnemyLV2 = 40;
let maxSizeEnemyLV3 = 45;
let maxSizeEnemyLV4 = 50;
let maxSizeEnemyLV5= 55;
let maxSizeEnemyLV6 = 60;

ctx.font = 'bold 17px Verdana'; //định dạng font chữ
ctx.fillText('WELCOME', 0, 40); // viết nội dung
const data = ctx.getImageData(0, 0, canvas.width, canvas.height); // láy nội dung của chữ để xử lý

function drawRotated(degrees) {
    ctx.save();
    ctx.translate(navigate.x, navigate.y);
    ctx.rotate(degrees);
    ctx.drawImage(spaceshipImg, -30, -30, 60, 60);
    ctx.restore();
}
let minSizeEnemy = 7;
let maxSizeEnemy = 30;

// âm thanh
const SHOOT = new Audio();
SHOOT.src = './sound/shoot.wav';
SHOOT.volume = 0.2;

const HIT = new Audio();
HIT.src = './sound/hit.wav';
HIT.volume = 0.2;

const BOOM = new Audio();
BOOM.src = './sound/boom.wav';
BOOM.volume = 0.6;

const LEVELUP = new Audio();
LEVELUP.src = './sound/levelup.wav';
LEVELUP.volume = 0.5;

const BACKGROUNDSOUND = new Audio();
BACKGROUNDSOUND.src = './sound/backgroundSound.wav';
BACKGROUNDSOUND.volume = 0.5;
bgSound.volume = 0.5;

const INTRO = new Audio();
INTRO.src = './sound/intro.wav';
INTRO.volume = 0.7;

const GAMEOVER = new Audio();
GAMEOVER.src = './sound/gameOver.wav';
GAMEOVER.volume = 0.7;

const PLAYERHIT = new Audio();
PLAYERHIT.src = './sound/playerHit.wav';

const HOVERBTN = new Audio();
HOVERBTN.src = './sound/hoverBtn.wav';
HOVERBTN.volume = 0.5;

const INTROCLICK = new Audio();
INTROCLICK.src = './sound/introClick.wav';

let mouse = {
    x: null,
    y: null,
    radius: 100,
};
const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 60,
    autopilotAngle: 0, // góc xoay tự động
};

const navigate = {
    x: canvas.width / 2,
    y: canvas.height / 2,
};
let posX = canvas.width / 2;
let posY = canvas.height / 2;

const colors = ['#00bdff', '#4d39ce', '#088eff'];

// khai báo class người chơi
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    update() {
        this.x = navigate.x;
        this.y = navigate.y;
    }

    //tạo animation space với trung tâm là người chơi
}
function animateAround() {
    for (let i = 0; i < 300; i++) {
        const radius = Math.random() * 2 + 1;
        particles2.push(
            new Particle2(
                canvas.width / 2,
                canvas.height / 2,
                Math.random() * Math.PI * 2,
                randomColor(colors)
            )
        );
    }
}

// khai báo class đường đạn
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius; // bán kính
        this.color = color;
        this.velocity = velocity; // hướnghướng
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    //cập nhật lại đường đạn
    update() {
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.draw();
    }
}

//khai báo class quân địch
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.oldPosX = navigate.x;
        this.oldPosY = navigate.y;
        this.point = this.radius;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const friction = 0.999; //tốc độ làm chậm hiệu ứng nổ
//hiệu ứng nổ
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1; // độ rõ nét
    }
    draw() {
        ctx.save(); //lưu tình trạng của hiệu ứng nổ lên stack
        ctx.globalAlpha = this.alpha; //cập nhật lại độ mở của hiệu ứng nổ
        ctx.beginPath(); // bắt đầu vẽ
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // vẽ hình tròn
        ctx.fillStyle = this.color; // đổ màu
        ctx.fill(); // vẽ
        ctx.restore(); //hiện trạng thái trên cùng trên stack, khôi phục bối cảnh tới trạng thái đó.
    }
    update() {
        this.draw();
        this.velocity.x *= friction; // cập nhật lại độ dài trục x của vận tốc, làm chậm đi sau mỗi lần quét
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x; //cập nhật lại vị trí mới
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01; // giảm độ rõ của hiệu ứng đi, khi hiệu ứng nổ có alpha = 0 thì sẽ loại bỏ hiệu ứng nổ khỏi mảng lưu bên dưới
    }
}

//vẽ background
class Particle2 {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.radians = Math.random() * Math.PI * 2; // random góc xuất hiện
        this.velocity = 0.001; //tốc độ góc
        this.distanceFromCenter = randomIntFromRange(
            30,
            canvas.width > canvas.height ? canvas.width / 2 : canvas.height / 2
        ); // random khoảng cách từ tâm
        this.base = {
            //lưu vết chuột
            x: x,
            y: y,
        };
        this.update = () => {
            const lastPoint = {
                //lưu vết điểm vừa vẽ
                x: this.x,
                y: this.y,
            };
            this.radians += this.velocity;
            //hiệu ứng di chuột
            this.base.x += (center.x - this.base.x) * 0.001;
            this.base.y += (center.y - this.base.y) * 0.001;
            //làm cho điểm chạy theo thời gian
            this.x =
                this.base.x + Math.cos(this.radians) * this.distanceFromCenter;
            this.y =
                this.base.y + Math.sin(this.radians) * this.distanceFromCenter;
            this.draw(lastPoint);
        };
        this.draw = (lastPoint) => {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.radius;
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
            ctx.closePath();
        };
    }
}

class LevelUpParticle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius; // bán kính
        this.color = 'hsl(' + hue + ', 100%, 50%)'; // màu sắc hệ hsl
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
        //cập nhật lại vị trị mới của như kiểu hiệu ứng vũ trụ
        if (center.x === undefined && center.y === undefined) {
            let newX =
                ((center.radius * canvas.width) / 200) *
                Math.sin(center.autopilotAngle * (Math.PI / 60));
            let newY =
                ((center.radius * canvas.height) / 200) *
                Math.sin(center.autopilotAngle * (Math.PI / 140));
            center.X = newX + canvas.width / 2;
            center.Y = newY + canvas.height / 2;
            center.autopilotAngle += 0.004;
        }
    }
}

class ParticleIntroText {
    constructor(x, y) {
        (this.x = x + 180),
            (this.y = y - 140),
            (this.size = 3),
            (this.baseX = this.x),
            (this.baseY = this.y),
            (this.density = Math.random() * 30 + 1);
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
        let distance = Math.sqrt(dx * dx + dy * dy); //khoảng cách giữa con trỏ và viên đag xét
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        var maxDistance = mouse.radius;
        var force = (maxDistance - distance) / maxDistance;
        if (force < 0) force = 0;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        if (distance < mouse.radius + this.size) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // cập nhật di chuyển về vị trí mặc định
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

class ParticleIntroShape {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#8C5523';
        ctx.fill();
    }
    // check particle position, check mouse position, move the particle, draw the particle
    update() {
        //check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        //check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }
        // move particle
        this.x += this.directionX;
        this.y += this.directionY;
        // draw particle
        this.draw();
    }
}

const xCenter = canvas.width / 2; //tọa độ của người chơi ở giữa màn hình
const yCenter = canvas.height / 2; //....
let player = new Player(xCenter, yCenter, 30, 'white'); //khởi tạo người chơi
let projectiles = []; // mảng lưu các viên đạn được bắn ra
let enemies = []; // mảng lưu các quân địch được random trên màng hình
let particles = []; //mảng lưu các viên hiệu ứng nổ

// bắt đầu
function init() {
    player = new Player(xCenter, yCenter, 10, 'white');
    projectiles = [];
    enemies = [];
    particles = [];
    particles2 = [];
    currentHealthBar.style.width = maxHealthWidth;
    isStart = false;
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]; // random ngẫu nhiên màu trong  mảng colors
}

let particles2 = []; //mảng lưu lại những viên ở background
// hàm khởi tạo quân địch
function spawnEnemy(sizeMin, sizeMax) {
    //setinerval là để gọi hàm sau một khoảng thời gian nhất định
    intervalEnemy = setInterval(() => {
        const radius = Math.random() * (sizeMax - sizeMin) + sizeMin; // random kính thước của quân địch
        let x; // tọa độ của quân đch trên màn hình
        let y;
        //random tọa độ của quân địch được xuất hiện từ các cạnh của bàn hình
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius; // sử dụg toán tử 3 ngôi
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`; //random màu sắc của quân địch
        const angle = Math.atan2(navigate.y - y, navigate.x - x); // tính góc của quân địch được random so với trục x
        // phương của quân địch luôn  hướng về người chơi(giữa màn hình)
        const velocity = {
            x: Math.cos(angle), //tính độ dài trục x của vận tốc
            y: Math.sin(angle), //.....
        };
        let abc = new Enemy(x, y, radius, color, velocity);
        enemies.push(abc); // thêm quân địch vừa tạo bên trên vào mảng đã khai báo
    }, timeToRespawnEnemy);
}

let angleRotate = 0;
let radiusRatate = 0;

// hàm xử lý những cái viên tạo ra có hình dạng chồng chéo lên nhau
function handleOverlap() {
    let overlapping = false;
    let protection = 30; // giới hạn số lần tạo ra cái mới
    let counter = 0; // đếm xem đã tạo bao nhiêu lần
    while (particlesLU.length < numberOfParticlesLU && counter < protection) {
        let randomAngle = Math.random() * 2 * Math.PI;
        let randomRadius = center.radius * Math.sqrt(Math.random()); //random bán kính
        let particle = {
            x: center.x + randomRadius * Math.cos(randomAngle), //tạo ra rạo độ của quả bóng lân cận
            y: center.y + randomRadius * Math.sin(randomAngle),
            radius: Math.floor(Math.random() * 15) + 5, // tạo bán kính của quả bóng lân cận
        };
        overlapping = false;
        for (let i = 0; i < particlesLU.length; i++) {
            let previousParticle = particlesLU[i];
            let dx = particle.x - previousParticle.x;
            let dy = particle.y - previousParticle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < particle.radius + previousParticle.radius) {
                overlapping = true;
                break;
            }
        }
        if (!overlapping) {
            particlesLU.unshift(
                new LevelUpParticle(particle.x, particle.y, particle.radius)
            );
        }
        counter++;
    }
}

function initIntro() {
    console.log('initintro');
    // box.style.display = 'none'
    navBox.style.backgroundColor = 'rgba(0,0,0,0)';
    navBox.style.border = 'none';
    // box.style.backgroundImage = 'url("../img/"gameOve.jpg")'
    // box.style.backgroundColor = 'red'
    box.style.color = 'white';
    scoreBox.style.display = 'none';
    textBox.style.display = 'none';
    particleIntroArray = [];
    for (var y = 0, y2 = data.height; y < y2; y++) {
        for (var x = 0, x2 = data.width; x < x2; x++) {
            if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
                let positionX = x - 10;
                let positionY = y;
                particleIntroArray.push(
                    new ParticleIntroText(
                        positionX * adjustX,
                        positionY * adjustY
                    )
                );
            }
        }
    }
    //shape
    particlesIntroShapeArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 5 + 1;
        let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
        let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
        let directionX = Math.random() * 5 - 2.5;
        let directionY = Math.random() * 5 - 2.5;
        let color = '#8C5523';

        particlesIntroShapeArray.push(
            new ParticleIntroShape(x, y, directionX, directionY, size, color)
        );
    }
}

initIntro();
animateIntro();

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particleIntroArray.length; a++) {
        for (let b = a; b < particleIntroArray.length; b++) {
            let distance =
                (particleIntroArray[a].x - particleIntroArray[b].x) *
                    (particleIntroArray[a].x - particleIntroArray[b].x) +
                (particleIntroArray[a].y - particleIntroArray[b].y) *
                    (particleIntroArray[a].y - particleIntroArray[b].y);

            if (distance < 2600) {
                opacityValue = 1 - distance / 2600;
                let dx = mouse.x - particleIntroArray[a].x;
                let dy = mouse.y - particleIntroArray[a].y;
                let mouseDistance = Math.sqrt(dx * dx + dy * dy);
                if (mouseDistance < mouse.radius / 2) {
                    ctx.strokeStyle = 'rgba(255,255,0,' + opacityValue + ')';
                } else if (mouseDistance < mouse.radius - 50) {
                    ctx.strokeStyle = 'rgba(255,255,140,' + opacityValue + ')';
                } else if (mouseDistance < mouse.radius + 20) {
                    ctx.strokeStyle = 'rgba(255,255,210,' + opacityValue + ')';
                } else {
                    ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                }
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particleIntroArray[a].x, particleIntroArray[a].y);
                ctx.lineTo(particleIntroArray[b].x, particleIntroArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function connectShape() {
    let opacityValue = 1;
    for (let a = 0; a < particlesIntroShapeArray.length; a++) {
        for (let b = a; b < particlesIntroShapeArray.length; b++) {
            let distance =
                (particlesIntroShapeArray[a].x -
                    particlesIntroShapeArray[b].x) *
                    (particlesIntroShapeArray[a].x -
                        particlesIntroShapeArray[b].x) +
                (particlesIntroShapeArray[a].y -
                    particlesIntroShapeArray[b].y) *
                    (particlesIntroShapeArray[a].y -
                        particlesIntroShapeArray[b].y);
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - distance / 20000;
                let dx = mouse.x - particlesIntroShapeArray[a].x;
                let dy = mouse.y - particlesIntroShapeArray[a].y;
                let mouseDistance = Math.sqrt(dx * dx + dy * dy);
                if (mouseDistance < 180) {
                    ctx.strokeStyle = 'rgba(255,0,0,' + opacityValue + ')';
                } else {
                    ctx.strokeStyle = 'rgba(0,0,255,' + opacityValue + ')';
                }
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(
                    particlesIntroShapeArray[a].x,
                    particlesIntroShapeArray[a].y
                );
                ctx.lineTo(
                    particlesIntroShapeArray[b].x,
                    particlesIntroShapeArray[b].y
                );
                ctx.stroke();

                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(255,255,0,0.03)';
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(
                    particlesIntroShapeArray[b].x,
                    particlesIntroShapeArray[b].y
                );
                ctx.stroke();
            }
        }
    }
}

let animationId, animationId1;
let levelScore = 1000; //mốc điểm cần đạt
function animate1() {
    // hiệu ứng lúc chết
    if (isDead) {
        bgSound.pause();
        bgSound.currentTime = 0;
        enemies = [];
        projectiles = [];
        navigate.x = canvas.width / 2;
        navigate.y = canvas.height / 2;
        if (gameOverOpacity <= 1) {
            gameOverOpacity += 0.005;
            box.style.opacity = gameOverOpacity;
        }
        cancelAnimationFrame(animationId); // dừng frame
    }
    //hiển thị thanh máu
    if (healthBarPosY <= 20 && health >= 0) {
        let tmp = healthBarPosY + 'px';
        maxHealthBar.style.top = tmp;
        scoreLabelX.style.top = tmp;
        exitBtn.style.top = tmp;
        healthBarPosY++;
    } else if (healthBarPosY > -30 && health < 0) {
        let tmp = healthBarPosY + 'px';
        maxHealthBar.style.top = tmp;
        scoreLabelX.style.top = tmp;
        exitBtn.style.top = tmp;
        healthBarPosY--;
    }

    //cập nhật lại tọa độ người chơi
    if (isUP && navigate.y >= 0) {
        navigate.y -= 2;
    } else if (isUP && navigate.y < 0) {
        navigate.y = 0;
    }
    if (isDOWN && navigate.y <= canvas.height) {
        navigate.y += 2;
    } else if (isDOWN && navigate.y > canvas.height) {
        navigate.y = canvas.height;
    }
    if (isRIGHT && navigate.x <= canvas.width) {
        navigate.x += 2;
    } else if (isRIGHT && navigate.x > canvas.width) {
        navigate.x = canvas.width;
    }
    if (isLEFT && navigate.x >= 0) {
        navigate.x -= 2;
    } else if (isLEFT && navigate.x < 0) {
        navigate.x = 0;
    }
    player.update();
    //xét hiệu ứng lúc va chạm sẽ tỏa ra
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1); //  nếu độ nét của viên hiệu ứng nổ  <= 0 thì sẽ bỏ viên hiệu ứng đó khỏi mảng
        } else {
            particle.update(); // cập nhật lại viên hiệu ứng
        }
    });
    //xét hiệu ứng xung quanh viên đạn
    particles2.forEach((particle) => {
        particle.update();
    });
    //xet mảng đạn bắn ra
    projectiles.forEach((projectile, index) => {
        projectile.update(); //cập nhật lại viên đạn
        //loại bỏ những viên đạn đẫ bay ra khỏi  màn hình
        if (
            projectile.x - projectile.radius < 0 ||
            projectile.y - projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });
    //xét va chạm của đạn và địch
    enemies.forEach((enemy, index) => {
        //end game
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y); // tính khoảng cách của quân địch và người chơi
        if (dist - enemy.radius - player.radius < 1) {
            if (health <= 0 && isStart == true) {
                box.style.display = 'flex'; // xét thuộc tính display cho box để hiện lên bảng kết thúc chơi game
                button.style.display = 'none';
                buttonRestart.style.display = 'flex';
                scoreLabel.innerHTML = 0; // set lại điểm trên góc màn hình
                scoreBox.innerHTML = score; //set text cho số điểm
                score = 0; //reset lại số điểm
                isStart = false;
                spaceShip1.style.display = 'none';
                spaceShip2.style.display = 'none';
                spaceShip3.style.display = 'none';
                textBox.style.display = 'block';
                scoreBox.style.display = 'block';
                navBox.style.backgroundColor = 'rgba(255,255,255, 0.5)';
                navBox.style.color = 'black';
                navBox.style.border = '#333 solid 2px';
                box.style.top = '0';
                isDead = true;
                box.style.opacity = 0;
                box.style.backgroundSize =
                    canvas.width + 'px ' + canvas.height + 'px';
                box.style.backgroundImage = "url('./img/gameOver.jpg')";
                GAMEOVER.play();
            } else {
                // va chạm vơi người chơi
                PLAYERHIT.play();
                PLAYERHIT.currentTime = 0;
                health -= Math.round(enemy.radius * 5);
                currentHealthBar.style.width = maxHealthWidth * (health / 1000);
                enemies.splice(index, 1);
            }
        }
        enemy.update();
        projectiles.forEach((pro, index2) => {
            //tính khoảng cách giữa  enemy và viên đạn, nếu chúng chạm nhau thì xóa bỏ phần tử đi
            const dist = Math.hypot(pro.x - enemy.x, pro.y - enemy.y);
            if (dist - enemy.radius - pro.radius < 1) {
                // hiệu ứng nổ
                HIT.play();
                HIT.currentTime = 0;
                for (let i = 0; i < enemy.radius; i++) {
                    particles.push(
                        new Particle(
                            pro.x,
                            pro.y,
                            Math.random() * 3,
                            enemy.color,
                            {
                                //Math.random() * 3 là random bán kính của viên hiệu ứng nổ, màu trùng với màu quân địch bị bắn
                                x: (Math.random() - 0.5) * (Math.random() * 6), // random độ dài trục x, y của hướng vận tốc để có được những hướng tỏa ra khác nhau
                                y: (Math.random() - 0.5) * (Math.random() * 6),
                            }
                        )
                    );
                }
                if (enemy.radius - dmgLocal >= 7) {
                    //thư viện gsap để làm cho hiệu ứng khi bị bắn quân địch nhỏ lại trông mượt hơn
                    gsap.to(enemy, {
                        radius: enemy.radius - dmgLocal, // giảm bán kính sau mỗi lần bị bắn
                    });
                    //set time out ở đây dùng để cho lúc va chạm nó k bị chớp
                    setTimeout(() => {
                        projectiles.splice(index2, 1); // loại bỏ viên đạn khi va cham ra khỏi mảng
                    }, 0);
                } else {
                    //set time out ở đây dùng để cho lúc va chạm nó k bị chớp
                    setTimeout(() => {
                        BOOM.play();
                        BOOM.currentTime = 0;
                        enemies.splice(index, 1); // loại bỏ đối tượng bị bắn ra khỏi  mảng
                        //tính điểm
                        score += Math.round(enemy.point); // tính điểm khi bắn trúng địch
                        scoreLabel.innerHTML = `${score}`; //cập nhật lại điểm trên góc màn hình
                        projectiles.splice(index2, 1); // loại bỏ viên đạn khi va cham ra khỏi mảng
                    }, 0);
                }
            }
        });
    });
    if (score >= levelScore && levelScore <= 6000) {
        console.log('level UP');
        isUppingLevel = true;
        // cancelAnimationFrame(animationId1)
        levelScore += 1000;
    }
}

function animate2() {
    //thực hiện hiệu ứng chuyển level
    // animationId2 = requestAnimationFrame(animate2);
    console.log('run level up');
    LEVELUP.play();
    projectiles = [];
    enemies = [];
    particles = [];
    if (
        (canvas.width > canvas.height && posX < canvas.width) ||
        (canvas.width < canvas.height && posY < canvas.height)
    ) {
        for (let i = 0; i < particlesLU.length; i++) {
            particlesLU[i].draw();
            particlesLU[i].update();
        }
        if (particlesLU.length >= numberOfParticlesLU) {
            for (let i = 0; i < 5; i++) {
                //loại  bỏ 5 quả trong 1 lần
                particlesLU.pop();
            }
        }
        handleOverlap();
        hue += 2;
        //rotate
        posX += radiusRatate * Math.sin(angleRotate);
        posY += radiusRatate * Math.cos(angleRotate);
        center.x = posX;
        center.y = posY;
        angleRotate += 0.2;
        radiusRatate += 1;
    }
    if (
        (canvas.width > canvas.height && posX >= canvas.width) ||
        (canvas.width < canvas.height && posY >= canvas.height)
    ) {
        // cancelAnimationFrame(animationId2)
        isUppingLevel = false;
        posX = canvas.width / 2;
        posY = canvas.height / 2;
        center.x = canvas.width / 2;
        center.y = canvas.height / 2;
        angleRotate = 0;
        radiusRatate = 0;
    }
}
function animate() {
    drawRotated(angleM);
    bgSound.play();
    // animationId1 = requestAnimationFrame(animate1) // phương thức này làm mới màn hình sau mỗi lần quét
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; // đổ màu nền và làm hiệu ứng mờ nhờ hệ số alpha (0,1)
    ctx.fillRect(0, 0, canvas.width, canvas.height); //vẽ màn hình game
    if (isUppingLevel == false) {
        bgSound.play();
        animate1();
    } else if (isUppingLevel == true) {
        bgSound.pause();
        animate2();
        clearInterval(intervalEnemy);
        spawnEnemy(minSizeEnemy, maxSizeEnemy);
    }
    animationId = requestAnimationFrame(animate);
}

function animateIntro() {
    if (!isPlayIntroSound) {
        INTRO.play();
        isPlayIntroSound = true;
    }
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    connect();
    for (let i = 0; i < particleIntroArray.length; i++) {
        particleIntroArray[i].update();
        particleIntroArray[i].draw();
    }
    //trong lần click đầu tiên thì sẽ di chuyển các phím chức năng lên
    if (boxPosY >= 30 && clickCount > 0) {
        let tmp = boxPosY + '%';
        box.style.top = tmp;
        boxPosY--;
    }
    if (canvasPosY < 0) {
        canvasPosY += 0.5;
        let tmp = canvasPosY + '%';
        canvas.style.top = tmp;
    }
    for (let i = 0; i < particlesIntroShapeArray.length; i++) {
        particlesIntroShapeArray[i].update();
    }
    connectShape();

    animateIntroID = requestAnimationFrame(animateIntro);
}

function proOfSpaceship1(angle) {
    const projectileRadius = 7;
    dmgLocal = projectileRadius;
    const velocity = {
        x: Math.cos(angle) * 7,
        y: Math.sin(angle) * 7,
    };
    //sau mỗi lần 1 viên đạn được tạo thì thêm nó vào mảng prejectiles
    SHOOT.play();
    SHOOT.currentTime = 0;
    setTimeout(() => {
        SHOOT.play();
        SHOOT.currentTime = 0;
    }, 100);
    // đường đạn song song
    let wing = 15;
    if (score < 1000) {
        //1
        console.log('type: 1');
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity
            )
        );
        setTimeout(() => {
            projectiles.push(
                new Projectile(
                    navigate.x,
                    navigate.y,
                    projectileRadius,
                    'white',
                    velocity
                )
            );
        }, 200);
        minSizeEnemy = 7;
        maxSizeEnemy = 30;
    } else if (score >= 1000 && score < 2000) {
        //2
        console.log('type: 2');
        projectiles.push(
            new Projectile(
                navigate.x + wing * Math.sin(angle),
                navigate.y - wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x - wing * Math.sin(angle),
                navigate.y + wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        setTimeout(() => {
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 200);
        timeToRespawnEnemy = timeToRespawnLV1;
        minSizeEnemy = minSizeEnemyLV1;
        maxSizeEnemy = maxSizeEnemyLV1;
    } else if (score >= 2000 && score < 3000) {
        //3
        console.log('type: 3');

        wing = 20;
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x + wing * Math.sin(angle),
                navigate.y - wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x - wing * Math.sin(angle),
                navigate.y + wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        setTimeout(() => {
            projectiles.push(
                new Projectile(
                    navigate.x,
                    navigate.y,
                    projectileRadius,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 200);
        timeToRespawnEnemy = timeToRespawnLV2;
        minSizeEnemy = minSizeEnemyLV2;
        maxSizeEnemy = maxSizeEnemyLV2;
    } else if (score >= 3000 && score < 4000) {
        //4
        console.log('type: 4');

        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity
            )
        );
        setTimeout(() => {
            projectiles.push(
                new Projectile(
                    navigate.x,
                    navigate.y,
                    projectileRadius,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 150);
        setTimeout(() => {
            wing = 7;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 22;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 300);
        timeToRespawnEnemy = timeToRespawnLV3;
        minSizeEnemy = minSizeEnemyLV3;
        maxSizeEnemy = maxSizeEnemyLV3;
    } else if (score >= 4000 && score < 5000) {
        //5
        console.log('type: 5');
        wing = 67;
        projectiles.push(
            new Projectile(
                navigate.x + wing * Math.sin(angle),
                navigate.y - wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x - wing * Math.sin(angle),
                navigate.y + wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        setTimeout(() => {
            wing = 52;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 100);
        setTimeout(() => {
            wing = 37;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 200);
        setTimeout(() => {
            wing = 22;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 300);
        setTimeout(() => {
            wing = 7;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 400);
        timeToRespawnEnemy = timeToRespawnLV4;
        minSizeEnemy = minSizeEnemyLV4;
        maxSizeEnemy = maxSizeEnemyLV4;
    } else if (score >= 5000 && score < 6000) {
        //6
        console.log('type: 6');
        setTimeout(() => {
            wing = 82;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 500);
        setTimeout(() => {
            wing = 67;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 400);
        setTimeout(() => {
            wing = 52;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 300);
        setTimeout(() => {
            wing = 37;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 200);
        setTimeout(() => {
            wing = 22;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 100);
        setTimeout(() => {
            wing = 7;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 0);
        timeToRespawnEnemy = timeToRespawnLV5;
        minSizeEnemy = minSizeEnemyLV5;
        maxSizeEnemy = maxSizeEnemyLV5;
    } else if (score >= 6000) {
        //7
        console.log('type: 7');
        setTimeout(() => {
            wing = 82;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 500);
        setTimeout(() => {
            wing = 67;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 7;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 400);
        setTimeout(() => {
            wing = 52;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 22;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 300);
        setTimeout(() => {
            wing = 37;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 200);
        setTimeout(() => {
            wing = 22;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 100);
        setTimeout(() => {
            wing = 7;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 0);
        timeToRespawnEnemy = timeToRespawnLV6;
        minSizeEnemy = minSizeEnemyLV6;
        maxSizeEnemy = maxSizeEnemyLV6;
    }
}

function proOfSpaceship2(angle) {
    const projectileRadius = 12;
    dmgLocal = projectileRadius;
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
    };
    //sau mỗi lần 1 viên đạn được tạo thì thêm nó vào mảng prejectiles
    let angleStep = 4 * (Math.PI / 180);
    SHOOT.play();
    SHOOT.currentTime = 0;
    const velocity2l = {
        x: Math.cos(angle - angleStep) * 5,
        y: Math.sin(angle - angleStep) * 5,
    };
    const velocity2r = {
        x: Math.cos(angle + angleStep) * 5,
        y: Math.sin(angle + angleStep) * 5,
    };
    const velocity3l = {
        x: Math.cos(angle - 2 * angleStep) * 5,
        y: Math.sin(angle - 2 * angleStep) * 5,
    };
    const velocity3r = {
        x: Math.cos(angle + 2 * angleStep) * 5,
        y: Math.sin(angle + 2 * angleStep) * 5,
    };
    const velocity4l = {
        x: Math.cos(angle - 3 * angleStep) * 5,
        y: Math.sin(angle - 3 * angleStep) * 5,
    };
    const velocity4r = {
        x: Math.cos(angle + 3 * angleStep) * 5,
        y: Math.sin(angle + 3 * angleStep) * 5,
    };

    if (score < 1000) {
        //1
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity
            )
        );
        minSizeEnemy = 7;
        maxSizeEnemy = 30;
    } else if (score >= 1000 && score < 2000) {
        //2
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2r
            )
        );
        timeToRespawnEnemy = timeToRespawnLV1;
        minSizeEnemy = minSizeEnemyLV1;
        maxSizeEnemy = maxSizeEnemyLV1;
    } else if (score >= 2000 && score < 3000) {
        //3
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2r
            )
        );
        timeToRespawnEnemy = timeToRespawnLV2;
        minSizeEnemy = minSizeEnemyLV2;
        maxSizeEnemy = maxSizeEnemyLV2;
    } else if (score >= 3000 && score < 4000) {
        //4
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2r
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity3l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity3r
            )
        );
        timeToRespawnEnemy = timeToRespawnLV3;
        minSizeEnemy = minSizeEnemyLV3;
        maxSizeEnemy = maxSizeEnemyLV3;
    } else if (score >= 4000 && score < 5000) {
        //5
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2r
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity3l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity3r
            )
        );
        timeToRespawnEnemy = timeToRespawnLV4;
        minSizeEnemy = minSizeEnemyLV4;
        maxSizeEnemy = maxSizeEnemyLV4;
    } else if (score >= 5000 && score < 6000) {
        //6
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2r
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity3l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity3r
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity4l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity4r
            )
        );
        timeToRespawnEnemy = timeToRespawnLV5;
        minSizeEnemy = minSizeEnemyLV5;
        maxSizeEnemy = maxSizeEnemyLV5;
    } else if (score >= 6000) {
        //7
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity2r
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity3l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity3r
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity4l
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity4r
            )
        );
        timeToRespawnEnemy = timeToRespawnLV6;
        minSizeEnemy = minSizeEnemyLV6;
        maxSizeEnemy = maxSizeEnemyLV6;
    }
}

function proOfSpaceship3(angle) {
    const projectileRadius = 7;
    dmgLocal = projectileRadius;
    const velocity = {
        x: Math.cos(angle) * 7,
        y: Math.sin(angle) * 7,
    };
    //sau mỗi lần 1 viên đạn được tạo thì thêm nó vào mảng prejectiles
    SHOOT.play();
    SHOOT.currentTime = 0;
    setTimeout(() => {
        SHOOT.play();
        SHOOT.currentTime = 0;
    }, 100);
    // đường đạn song song
    let wing;
    if (score < 1000) {
        //1
        console.log('type: 1');
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity
            )
        );
        setTimeout(() => {
            projectiles.push(
                new Projectile(
                    navigate.x,
                    navigate.y,
                    projectileRadius,
                    'white',
                    velocity
                )
            );
        }, 200);
        minSizeEnemy = 7;
        maxSizeEnemy = 30;
    } else if (score >= 1000 && score < 2000) {
        //2
        console.log('type: 2');
        wing = 35;
        projectiles.push(
            new Projectile(
                navigate.x + wing * Math.sin(angle),
                navigate.y - wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x - wing * Math.sin(angle),
                navigate.y + wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        setTimeout(() => {
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 200);
        timeToRespawnEnemy = timeToRespawnLV1;
        minSizeEnemy = minSizeEnemyLV1;
        maxSizeEnemy = maxSizeEnemyLV1;
    } else if (score >= 2000 && score < 3000) {
        //3
        console.log('type: 3');

        wing = 35;
        projectiles.push(
            new Projectile(
                navigate.x,
                navigate.y,
                projectileRadius,
                'white',
                velocity
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x + wing * Math.sin(angle),
                navigate.y - wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x - wing * Math.sin(angle),
                navigate.y + wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        setTimeout(() => {
            projectiles.push(
                new Projectile(
                    navigate.x,
                    navigate.y,
                    projectileRadius,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 200);
        timeToRespawnEnemy = timeToRespawnLV2;
        minSizeEnemy = minSizeEnemyLV2;
        maxSizeEnemy = maxSizeEnemyLV2;
    } else if (score >= 3000 && score < 4000) {
        //4
        console.log('type: 4');
        wing = 35;
        projectiles.push(
            new Projectile(
                navigate.x + wing * Math.sin(angle),
                navigate.y - wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        projectiles.push(
            new Projectile(
                navigate.x - wing * Math.sin(angle),
                navigate.y + wing * Math.cos(angle),
                5,
                'white',
                velocity
            )
        );
        setTimeout(() => {
            wing = 20;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 50;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 150);
        setTimeout(() => {
            wing = 35;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 300);
        setTimeout(() => {
            wing = 35;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 450);
        timeToRespawnEnemy = timeToRespawnLV3;
        minSizeEnemy = minSizeEnemyLV3;
        maxSizeEnemy = maxSizeEnemyLV3;
    } else if (score >= 4000 && score < 5000) {
        //5
        console.log('type: 5');
        setTimeout(() => {
            projectiles.push(
                new Projectile(
                    navigate.x,
                    navigate.y,
                    projectileRadius,
                    'white',
                    velocity
                )
            );
        }, 0);
        setTimeout(() => {
            wing = 20;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 100);
        setTimeout(() => {
            wing = 40;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 200);
        setTimeout(() => {
            wing = 60;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x,
                    navigate.y,
                    projectileRadius,
                    'red',
                    velocity
                )
            );
        }, 300);
        setTimeout(() => {
            wing = 40;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 400);
        setTimeout(() => {
            wing = 20;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 500);
        setTimeout(() => {
            projectiles.push(
                new Projectile(
                    navigate.x,
                    navigate.y,
                    projectileRadius,
                    'white',
                    velocity
                )
            );
        }, 600);
        timeToRespawnEnemy = timeToRespawnLV4;
        minSizeEnemy = minSizeEnemyLV4;
        maxSizeEnemy = maxSizeEnemyLV4;
    } else if (score >= 5000 && score < 6000) {
        //6
        console.log('type: 6');
        setTimeout(() => {
            wing = 60;
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 600);
        setTimeout(() => {
            wing = 30;
            //right
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 60;
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 500);
        setTimeout(() => {
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 30;
            //right
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 60;
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 400);
        setTimeout(() => {
            wing = 30;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            //right
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x,
                    navigate.y,
                    projectileRadius,
                    'white',
                    velocity
                )
            );
        }, 300);

        setTimeout(() => {
            wing = 60;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 30;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x,
                    navigate.y,
                    projectileRadius,
                    'white',
                    velocity
                )
            );
        }, 200);
        setTimeout(() => {
            wing = 60;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 30;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 100);
        setTimeout(() => {
            wing = 60;
            //left
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 0);
        timeToRespawnEnemy = timeToRespawnLV5;
        minSizeEnemy = minSizeEnemyLV5;
        maxSizeEnemy = maxSizeEnemyLV5;
    } else if (score >= 6000) {
        //7
        console.log('type: 7');
        setTimeout(() => {
            wing = 45;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 600);
        setTimeout(() => {
            wing = 30;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 60;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 500);
        setTimeout(() => {
            wing = 15;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 75;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 400);
        setTimeout(() => {
            projectiles.push(
                new Projectile(
                    navigate.x,
                    navigate.y,
                    projectileRadius,
                    'white',
                    velocity
                )
            );
            wing = 90;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 45;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'red',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'red',
                    velocity
                )
            );
        }, 300);
        setTimeout(() => {
            wing = 15;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 75;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 200);
        setTimeout(() => {
            wing = 30;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            wing = 60;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 100);
        setTimeout(() => {
            wing = 45;
            projectiles.push(
                new Projectile(
                    navigate.x + wing * Math.sin(angle),
                    navigate.y - wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
            projectiles.push(
                new Projectile(
                    navigate.x - wing * Math.sin(angle),
                    navigate.y + wing * Math.cos(angle),
                    5,
                    'white',
                    velocity
                )
            );
        }, 0);
        timeToRespawnEnemy = timeToRespawnLV6;
        minSizeEnemy = minSizeEnemyLV6;
        maxSizeEnemy = maxSizeEnemyLV6;
    }
}

//lấy tọa độ chuột để quay tàu theo hướng chuột
addEventListener('mousemove', (e) => {
    const angle = Math.atan2(e.clientY - navigate.y, e.clientX - navigate.x); // góc giữu đường đạn và trục x
    angleM = angle + Math.PI / 2;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.x = undefined;
    isUP = false;
    isDOWN = false;
    isRIGHT = false;
    isLEFT = false;
});

// event bắn đạn
window.addEventListener('click', function (e) {
    //tính góc của đường đạn so với trục x
    clickCount++;
    if (clickCount == 1) {
        firstClick = true;
    } else {
        firstClick = false;
    }
    if (isStart == true) {
        const angle = Math.atan2(
            e.clientY - navigate.y,
            e.clientX - navigate.x
        ); // góc giữu đường đạn và trục x
        if (typeOfSpaceShip == 1) {
            proOfSpaceship1(angle);
        } else if (typeOfSpaceShip == 2) {
            proOfSpaceship2(angle);
        } else if (typeOfSpaceShip == 3) {
            proOfSpaceship3(angle);
        }
    } else {
        INTROCLICK.play();
        INTROCLICK.currentTime = 0;
    }
});

//nút start
button.addEventListener('click', () => {
    init(); // hàm bắt đầu
    box.style.display = 'none'; // ẩn box khi bấm nút
    animate(); // bắt đầu hiệu ứng chính  cúa game\
    spawnEnemy(minSizeEnemy, maxSizeEnemy); // tạo quân địch
    animateAround();
    isStart = true;
    isDead = false;
    gameOverOpacity = 0;
    particleIntroArray = [];
    cancelAnimationFrame(animateIntroID);
});
//nút restart
buttonRestart.addEventListener('click', () => {
    init();
    box.style.display = 'none'; // ẩn box khi bấm nút
    projectiles = [];
    enemies = [];
    particles = [];
    // particles2 = []
    currentHealthBar.style.width = maxHealthWidth;
    isStart = true;
    animateAround();
    health = 1000;
    navigate.x = center.x;
    navigate.y = center.y;
    isDead = false;
    gameOverOpacity = 0;
    // animate()

    // animationId.start()
});

spaceShip1.addEventListener('click', () => {
    spaceshipImg.src = './img/spaceship1.png'; //gán link ảnh tau 1
    spaceShip1.style.border = 'solid 1px orange';
    spaceShip2.style.border = '';
    spaceShip3.style.border = '';
    typeOfSpaceShip = 1;
    HOVERBTN.play();
    HOVERBTN.currentTime = 0;
});

// spaceShip1.addEventListener('mouseover', () => {
// HOVERBTN.play()
// HOVERBTN.currentTime = 0
// })

spaceShip2.addEventListener('click', () => {
    spaceshipImg.src = './img/spaceship2.png'; //gán link ảnh tau 2
    spaceShip2.style.border = 'solid 1px orange';
    spaceShip1.style.border = '';
    spaceShip3.style.border = '';
    typeOfSpaceShip = 2;
    HOVERBTN.play();
    HOVERBTN.currentTime = 0;
});

// spaceShip2.addEventListener('mouseover', () => {
//     HOVERBTN.play()
//     HOVERBTN.currentTime = 0
// })

spaceShip3.addEventListener('click', () => {
    spaceshipImg.src = './img/spaceship3.png'; //gán link ảnh tau 3
    spaceShip3.style.border = 'solid 1px orange';
    spaceShip2.style.border = '';
    spaceShip1.style.border = '';
    typeOfSpaceShip = 3;
    HOVERBTN.play();
    HOVERBTN.currentTime = 0;
});

// spaceShip3.addEventListener('mouseover', () => {
//     HOVERBTN.play()
//     HOVERBTN.currentTime = 0
// })

exitBtn.addEventListener('click', () => {
    // spaceShip1.style.display = 'block'
    // spaceShip2.style.display = 'block'
    // spaceShip3.style.display = 'block'
    // isStart = false
    window.location.reload();
});

let isUP = false;
let isDOWN = false;
let isRIGHT = false;
let isLEFT = false;

document.addEventListener('keydown', (e) => {
    console.log(e.code);
    setTimeout(() => {
        e.timeStamp = 0;
        switch (e.keyCode) {
            case 38: {
                isUP = true;
                break;
            }
            case 87: {
                isUP = true;
                break;
            }
            case 40: {
                isDOWN = true;
                break;
            }
            case 83: {
                isDOWN = true;
                break;
            }
            case 39: {
                isRIGHT = true;
                break;
            }
            case 68: {
                isRIGHT = true;
                break;
            }
            case 37: {
                isLEFT = true;
                break;
            }
            case 65: {
                isLEFT = true;
                break;
            }
        }
    }, 0);
});
document.addEventListener('keyup', (e) => {
    setTimeout(() => {
        e.timeStamp = 0;
        switch (e.keyCode) {
            case 38: {
                isUP = false;
                break;
            }
            case 87: {
                isUP = false;
                break;
            }
            case 40: {
                isDOWN = false;
                break;
            }
            case 83: {
                isDOWN = false;
                break;
            }
            case 39: {
                isRIGHT = false;
                break;
            }
            case 68: {
                isRIGHT = false;
                break;
            }
            case 37: {
                isLEFT = false;
                break;
            }
            case 65: {
                isLEFT = false;
                break;
            }
        }
    }, 0);
});
