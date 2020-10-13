async function draw(){
    const videoDuration = await player.getDuration(); //動画の再生時間を取得
    const canvas = setCanvas(videoDuration); //canvasを描画
    if (canvas.getContext) {
        drawNumberLine(canvas, videoDuration);
    }
}

function drawNumberLine(canvas, videoDuration) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    let x = 10; //数直線のx座標
    let y = height; //数直線のy座標
    // 数直線の時間に関するオブジェクト
    let time = {　
        minutes: 0,
        seconds: -1,
        x: 0,
        y: 10,
    }

    let lineWidth; //線の間隔
    //数直線を引き延ばすかどうかの判定 canvasの長さが動画時間より長い時に
    if(canvas.clientWidth > videoDuration * 7) {
        lineWidth = (canvas.clientWidth - 30) / videoDuration;
        time.x = lineWidth * 10 - 3;
    } else {
        lineWidth = 7;
        time.x = lineWidth * 10 - 3;
    }
    const time_x_width = lineWidth * 10; //数直線の時間の間隔

    for(let i = 0; i < videoDuration; i++) {
        let lineHeight = 10;
        time.seconds ++;
        if(time.seconds > 59) {
            time.minutes ++;
            time.seconds = 0;
        }
        if(i % 10 == 0 && i != 0) {
            const displayTime = createDisplayTime(time);
            lineHeight = 15;
            ctx.fillText(displayTime, time.x, time.y);
            time.x += time_x_width;
        }
        const moveX = x + (i * lineWidth);
        ctx.beginPath();
        ctx.moveTo(moveX, y);          // 始点に移動
        ctx.lineTo(moveX, y - lineHeight);        // 終点
        ctx.strokeStyle = "Black";  // 線の色
        ctx.lineWidth = 1;           // 線の太さ
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.lineTo(width, y);
    ctx.strokeStyle = "Black";  // 線の色
    ctx.lineWidth = 1;           // 線の太さ
    ctx.stroke();
}

function createDisplayTime(time) {
    const displayTime = ("00" + time.minutes).slice(-2) + ":" + ("00" + time.seconds).slice(-2);

    return displayTime;
}

function setCanvas(vD) {
    const canvas = document.getElementById("canvas");
    const ruler = document.getElementById('timeline-header-ruler');
    const w = (ruler.clientWidth > (vD * 7)) ? ruler.clientWidth : vD * 7 + 30;
    const h = ruler.clientHeight;
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    return canvas;
}

function timeConvert(seconds) {
    const min = (('00') + Math.floor((seconds / 60) % 60)).slice(-2);
    const sec = (('00') + Math.floor(seconds % 60)).slice(-2);
    return min + ":" + sec;
}

function seekVideo(e) {
    const rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - Math.floor(rect.left) - 8;
    mouseY = e.clientY - Math.floor(rect.top) - 2;
    console.log(`mouseX is ${mouseX}`)
    console.log(`mouseY is ${mouseY}`)
    //x=8が0秒 +-2seek判定 次の棒7座標
    if(mouseX % 7 >= -3 && mouseX % 7 <= 4) {
        const seekTime = mouseX / 7;
        player.seekTo(seekTime);
    }
    
}

function moveHandle(e) {
    const handle = document.getElementById("time-line-handle");
    console.log(handle.style.left)
    const width = handle.clientWidth;
    const height = handle.clientHeight;
    const rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - Math.floor(rect.left) - 2;
    mouseY = e.clientY - Math.floor(rect.top) - 2;
    console.log(`mouseX is ${mouseX}`)
    console.log(`mouseY is ${mouseY}`)
    //x=8が0秒 +-2seek判定 次の棒7座標
    handle.style.left = mouseX - width / 2 + "px"
}