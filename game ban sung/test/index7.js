const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesIntroShapeArray;

// get mouse position
let mouse = {
    x: null,
    y: null,
    radius: 100
}

window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// create particle
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
        if (this.x > canvas.width || this.x < 0 ) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        //check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size){
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

// create particle array
function init() {
    particlesIntroShapeArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#8C5523';

        particlesIntroShapeArray.push(new ParticleIntroShape(x, y, directionX, directionY, size, color));
    }
}

// check if particles are close enough to draw line between them
function connectShape(){
    let opacityValue = 1;
    for (let a = 0; a < particlesIntroShapeArray.length; a++) {
        for (let b = a; b < particlesIntroShapeArray.length; b++) {
            let distance = (( particlesIntroShapeArray[a].x - particlesIntroShapeArray[b].x) * (particlesIntroShapeArray[a].x - particlesIntroShapeArray[b].x))
            + ((particlesIntroShapeArray[a].y - particlesIntroShapeArray[b].y) * (particlesIntroShapeArray[a].y - particlesIntroShapeArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                let dx = mouse.x - particlesIntroShapeArray[a].x;
                let dy = mouse.y - particlesIntroShapeArray[a].y;
                let mouseDistance = Math.sqrt(dx*dx+dy*dy);
                if (mouseDistance < 180) {
                  ctx.strokeStyle='rgba(255,0,0,' + opacityValue + ')';
                } else {
                ctx.strokeStyle='rgba(0,0,255,' + opacityValue + ')';
                }
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesIntroShapeArray[a].x, particlesIntroShapeArray[a].y);
                ctx.lineTo(particlesIntroShapeArray[b].x, particlesIntroShapeArray[b].y);
                ctx.stroke();
              
                ctx.lineWidth = 1;
              ctx.strokeStyle = 'rgba(255,255,0,0.03)';
                 ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(particlesIntroShapeArray[b].x, particlesIntroShapeArray[b].y);
                ctx.stroke();
            }
        }
    
    }
}
// animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);
    for (let i = 0; i < particlesIntroShapeArray.length; i++) {
        particlesIntroShapeArray[i].update();
    }
    connectShape();
}


// mouse out event
window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.x = undefined;
    }
)

init();
animate();
