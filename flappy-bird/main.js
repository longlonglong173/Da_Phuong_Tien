const canvas = document.getElementById("canvas");  // get element canvas từ html
const c = canvas.getContext("2d"); // set bối cảnh 
var isStart = false; // biến set xem bắt đầu hay chưa
var listImg = []   // mảng lưu tất cả các ảnh của game
var endTableColor = "#fcef87";  // màu sắc của bảng khi kết thúc game
var endText = "#E37332";  // màu chứ  khi kết thúc game

// start game
const startGameImg = document.querySelector('#start-game img'); // get element ảnh khi bắt đầu game
startGameImg.src = "./image/start-game.png";    // set đường dẫn ảnh cho phần tử
listImg.push(startGameImg)  // thêm ảnh vào mảng 
var startGameBtn = document.querySelectorAll('#start-game button')  // get element nút bắt đầu game

// Background:
const backgroundImg = new Image();
backgroundImg.src = "./image/background.png";
listImg.push(backgroundImg);

const groundImg = new Image();
groundImg.src = "./image/ground.png";
listImg.push(groundImg);

const pipe_bottom = new Image();
pipe_bottom.src = "./image/pipe-bottom.png";
listImg.push(pipe_bottom);

const pipe_top = new Image();
pipe_top.src = "./image/pipe-top.png";
listImg.push(pipe_top);

const game_ready = new Image();
game_ready.src = "./image/ready.png";
listImg.push(game_ready);

const medal_1 = new Image();
medal_1.src = "./image/medal-1.png";
// listImg.push(medal_1);

const medal_2 = new Image();
medal_2.src = "./image/medal-2.png";
// listImg.push(medal_2);

const medal_3 = new Image();
medal_3.src = "./image/medal-3.png";
    // listImg.push(medal_3);

const medal_4 = new Image();
medal_4.src = "./image/medal-4.png";
// listImg.push(medal_4);

// Image Bird: 
const birdImg = new Image();
birdImg.src = "./image/bird.png";
listImg.push(birdImg);

const birdImg_up = new Image();
birdImg_up.src = "./image/bird-up.png";
listImg.push(birdImg_up);

const birdImg_down = new Image();
birdImg_down.src = "./image/bird-down.png";
listImg.push(birdImg_down);

//Sound:
const FLAP = new Audio();   
FLAP.src = "./audio/sfx_flap.wav";

const DIE = new Audio();
DIE.src = "./audio/sfx_die.wav";

const POINT = new Audio();
POINT.src = "./audio/sfx_point.wav";

const HIT = new Audio();
HIT.src = "./audio/sfx_hit.wav";

const START = new Audio();
START.src = "./audio/sfx_swooshing.wav";

let start_game = document.getElementById("start-game");  // phương thức trả về với thuộc tính id được cung cấp sẵn
let play_game = document.getElementById("play-game");   // hoặc  lấy thông tin từ form, hoặc lây phần tử bất kì
let end_game = document.getElementById("end-game");

let btn_start_game = document.getElementById("btn_start-game");
let btn_play_again = document.getElementById("btn_play-again");
let btn_exit = document.getElementById("btn_exit");

// nút bắt đầu game
btn_start_game.onclick = () => {
}
   
btn_start_game.addEventListener("click",  () => {
    isStart = true;
    start_game.style.display = "none"; // ẩn background bắt đầu game
    play_game.style.display = "block";  // hiển thị lên màn chơi game
    animate();
})

// Nút chơi lại game:
btn_play_again.addEventListener("click", function () {
    isStart = true;
    end_game.style.display = "none";
    start_game.style.display = "none";
    play_game.style.display = "block";
    bird.rotation = 0;  //reset lại hướng xoay của chim
    background.arr = []; //reset lại mảng
    background.score = 0; //reset điểm
    bird.speed = 0; // reset lại tốc độ
    background.current = background.ready;  // chuyển về màn hình chuẩn bị
})
//event thoát 
btn_exit.addEventListener("click", function () {
    isStart = false;
    window.location.reload();
})

//khai báo class bird
class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 34;
        this.height = 25;
        this.radius = 12;

        this.gravity = 0.25; // Trọng lực
        this.jump = 4.6;  // bước nhảy 
        this.speed = 0; // tốc độ

        this.frame = 0; // Frame theo chuyển động con chim***
        this.frames = 0; // Frames theo số khung hình  ***
        this.period = 10; //số frame trong 1 giai đoạn
        this.animation = [birdImg_up, birdImg, birdImg_down, birdImg];

        this.degree = Math.PI / 180;  // chuyển từ độ sang radian
        this.rotation = 0;  // độ quay
    }
    draw() {
        let bird_animation = this.animation[this.frame];
        c.save();   // lưu vào stack
        c.translate(this.x, this.y); // chuyển sang vị trí tiếp theo
        c.rotate(this.rotation);  // đổi độ xoay của chim
        c.drawImage(bird_animation, -this.width / 2, -this.height / 2, this.width, this.height); // vẽ 
        c.restore();  //hiện trạng thái trên cùng của stack, khôi phục bối  cảnh tới trạng thái đó
    }
    flap() {
        this.speed = -this.jump; // thay đổi tốc độ khi bay
    }
    update() {
        if (background.current == background.game) {
            this.period = 5;   // thay đổi số frame trong 1 giai đoạn
        }
        // Tăng frame lên 1 theo mỗi giai đoạn
        this.frame += this.frames % this.period == 0 ? 1 : 0;
        // Tăng từ 0 lên 4, sau đó trả về 0
        this.frame = this.frame % this.animation.length;

        if (background.current == background.ready) {
            this.y = canvas.height / 4; //xác định vị trí lúc bắt đầu của chim
        } else {
            this.speed += this.gravity;   // cập nhật lại tốc độ khi bay
            this.y += this.speed; // cập nhật lại vị trí mới

            if (this.y + this.height / 2 >= canvas.height - background.heightGround) {
                this.y = canvas.height - background.heightGround - this.height / 2;
                if (background.current == background.game) {
                    background.current = background.over;
                    DIE.play();  //âm thanh lúc chết
                }
            }
            // Góc xoay của con chim
            if (this.speed > this.jump) {
                this.rotation = 90 * this.degree;
                this.frame = 1;
            } else {
                this.rotation = -25 * this.degree;
            }
        }
    }
}


class Background {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.score = 0;

        this.xGround = 0;
        this.widthGround = 1800;
        this.heightGround = 111;
        this.dx = 2;

        this.arr = [];
        this.widthPipe = 52;
        this.heightPipe = 400;
        this.gap = 105; // Khoảng cách 2 ống
        this.maxYPipe = -160;
        this.dxPipe = 2;

        // Trạng thái game
        this.current = 0; // Trạng thái hiện tại
        this.ready = 0;  // Chuẩn bị
        this.game = 1;   // Chơi game
        this.over = 2;   // Kết thúc game
    }
    draw() {
        c.drawImage(backgroundImg, this.x, this.y, this.width, this.height);
    }
    drawGround() {
        c.drawImage(groundImg, this.xGround, canvas.height - this.heightGround, this.widthGround, this.heightGround);
    }
    update() {
        if (this.current == this.game) {
            this.xGround = (this.xGround - this.dx) % (this.widthGround / 2);//***
        }
        if (this.current != this.game) {
            return;
        }
        // Tạo toạ độ cho ống
        if (bird.frames % 100 == 0) {
            this.arr.push({
                x: canvas.width,
                y: this.maxYPipe * (Math.random() + 1) // Toạ độ Y nằm trong khoảng xấp xỉ -160 đến -320
            });
        }
        //duyệt tất cả các ống
        for (let i = 0; i < this.arr.length; i++) {
            let p = this.arr[i]
            let bottomPipeY = p.y + this.heightPipe + this.gap; // tọa độ y của ống dưới
            // xet lúc va chạm vơi ống
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.widthPipe
                && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.heightPipe) {
                this.current = this.over;
                HIT.play();
            }

            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.widthPipe
                && bird.y + bird.radius > bottomPipeY && bird.y - bird.radius < bottomPipeY + this.heightPipe) {
                this.current = this.over;
                HIT.play();
            }
            p.x -= this.dxPipe; // Di chuyển ống

            // Xoá ống trong mảng khi di chuyển ra khỏi màn hình
            if (p.x + this.widthPipe <= 0) {
                this.arr.shift();
                this.score++; // cộng điểm
                POINT.play();
            }
        }
    }
    //vẽ ống
    drawPipe() {
        for (let i = 0; i < this.arr.length; i++) {
            let p = this.arr[i];

            let botYPipe = p.y + this.heightPipe + this.gap;

            // Top Pipe:
            c.drawImage(pipe_top, p.x, p.y, this.widthPipe, this.heightPipe);

            // Bottom Pipe:
            c.drawImage(pipe_bottom, p.x, botYPipe, this.widthPipe, this.heightPipe);
        }
    }
    //hiển thị điểm
    drawScore() {
        c.beginPath();
        c.fillStyle = "white";
        c.font = "30px sans-serif";
        c.fillText(this.score, canvas.width / 2, 40);
    }
    drawReady() { // Chuẩn bị vào game
        if (this.current == this.ready) {
            c.drawImage(game_ready, canvas.width / 2 - 58, canvas.height / 2 - 100);
        }
    }
    transcript() { // Kết thúc game
        if (this.current == this.over) {
            //border
            c.beginPath();
            c.fillStyle = "#2B190E";
            c.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 150, 300, 150);

            //table content
            c.beginPath();
            c.fillStyle = endTableColor;
            c.fillRect(canvas.width / 2 - 145, canvas.height / 2 - 145, 290, 135);

            //score text
            c.beginPath();
            c.fillStyle = endText;
            c.font = "normal normal 600 25px sans-serif ";
            c.fillText("SCORE", canvas.width / 2 - 110, 155);

            //score
            c.beginPath();
            c.fillStyle = "#260101";
            c.font = "normal normal 700 40px sans-serif";
            c.fillText(this.score, canvas.width / 2 - 80, 210);

            //medal text
            c.beginPath();
            c.fillStyle = endText;
            c.font = "normal normal 600 25px sans-serif ";
            c.fillText("MEDAL", canvas.width / 2 + 20, 155);

            // xét huân chương 
            if (this.score >= 20) {
                c.drawImage(medal_4, canvas.width / 2 + 40, 170);
            } else if (this.score >= 10) {
                c.drawImage(medal_3, canvas.width / 2 + 40, 170);
            } else if (this.score >= 5) {
                c.drawImage(medal_2, canvas.width / 2 + 40, 170);
            } else {
                c.drawImage(medal_1, canvas.width / 2 + 40, 170);
            }
        }
    }
}

let bird = new Bird(50, canvas.height / 4); // khởi tạo đối tượng chim
let box = document.querySelector('.box');  //get elemnet của cả màn game
let background = new Background(0, 0, 900, 500);  //tạo background


//sự kiện click chuột
addEventListener('click', function () {
    switch (background.current) {
        case background.ready:
            background.current = background.game;
            START.play();
            break;
        case background.game:
            bird.flap();
            FLAP.play();
            break;
    }
})

// event bấm phím để chơi
addEventListener('keydown', function () {
    if (isStart) {
        switch (background.current) {
            case background.ready:
                background.current = background.game;
                START.play();
                break;
            case background.game:
                bird.flap();
                FLAP.play();
                break;
        }
    }
})


function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height); // xóa màn hình để chuyển sang khung hình mới
    background.draw();
    background.update();
    background.drawPipe();
    background.drawGround();
    background.drawScore();
    background.drawReady();
    bird.update();
    bird.draw();

    bird.frames++;

    //khi game over thì chuyển sang màn hình end game
    if (background.current == background.over) {
        end_game.style.display = "block";
        background.transcript();
    }
    requestAnimationFrame(animate); //làm mới màn hình sau mỗi lần quét 
}

//xu ly anh
var mode = 0;  // mode hiển thi ảnh gốc hay ảnh đã chỉnh sửa
var changeModeBTN = document.getElementById('changeMode')  // get element nút thay đổi chế độ

function tintImage(imgElement, tintColor) {
    var cv = document.createElement("canvas")
    var imgSrc = imgElement.src;
    var newImg = new Image();
    newImg.src = imgSrc;
    // create hidden canvas (using image dimensions)
    cv.width = newImg.width;
    cv.height = newImg.height;
    var ctx = cv.getContext("2d");  // định dạng
    
    ctx.drawImage(imgElement, 0, 0);      //thêm ảnh tại vị trí  0 0 

    var map = ctx.getImageData(0, 0, newImg.width, newImg.height);  // lấy dữ liệu ảnh sau khi sửa
    var imdata = map.data;  

    // chỉnh ảnh sang xám
    var r, g, b, avg;
    for (var p = 0, len = imdata.length; p < len; p += 4) {
        r = imdata[p];
        g = imdata[p + 1];
        b = imdata[p + 2];

        avg = Math.floor((r + g + b) / 3);
        imdata[p] = imdata[p + 1] = imdata[p + 2] = avg;
    }

    ctx.putImageData(map, 0, 0);

    ctx.globalCompositeOperation = "lighter"; // phủ ảnh với 1 lớp 
    ctx.globalAlpha = 0.5; // độ rõ nét
    ctx.fillStyle = tintColor;  //phủ màu
    ctx.fillRect(0, 0, cv.width, cv.height);  // phủ full ảnh với 

    
    imgElement.src = cv.toDataURL();  // thay thế ảnh với nội dung ảnh của canvas cv bên trên
}

//event cho nút thay đổi chế độ ảnh
changeModeBTN.addEventListener('click', function () {
    if (mode == 0) {
        for (var index = 0; index < listImg.length; index++) {
            tintImage(listImg[index], "rgba(0,0,0,0.5)")
        }
        endTableColor = '#aaaaaa'
        endText = "#18191a"
        btnColor = "#aaaaaa"
        btnBorderColor = "#cccccc"
        for (var index = 0; index < startGameBtn.length; index++){
            startGameBtn[index].style.backgroundColor = "#aaaaaa"
            startGameBtn[index].style.border = "solid 2px #cccccc"
            startGameBtn[index].style.color = "#000000"
        }
        mode = 1;
    }
    //reset lại tất  cả đường dẫn của ảnh
    else if (mode == 1) {
        startGameImg.src = "./image/start-game.png";
        backgroundImg.src = "./image/background.png";
        groundImg.src = "./image/ground.png";
        pipe_bottom.src = "./image/pipe-bottom.png";
        pipe_top.src = "./image/pipe-top.png";
        game_ready.src = "./image/ready.png";
        medal_1.src = "./image/medal-1.png";
        medal_2.src = "./image/medal-2.png";
        medal_3.src = "./image/medal-3.png";
        medal_4.src = "./image/medal-4.png";
        birdImg.src = "./image/bird.png";
        birdImg_up.src = "./image/bird-up.png";
        birdImg_down.src = "./image/bird-down.png";
        endTableColor = "#fcef87";
        endText = "#E37332";
        //reset lại các nút
        for (var index = 0; index < startGameBtn.length; index++){
            startGameBtn[index].style.backgroundColor = "#5C8C2B"
            startGameBtn[index].style.border = "solid 2px #82B8D9"
            startGameBtn[index].style.color = "white"
        }
        mode = 0;
    }
})

