async function draw(){
    const time_x_variable = 70; //時間をどのくらい移動させたらいい感じの場所になるか
    const videoDuration = await player.getDuration();
    const canvas = setCanvas(videoDuration);
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        const width = canvas.width;
        const height = canvas.height;

        let x = 10; //数直線のx座標
        let y = height; //数直線のy座標
        let time_x = 67;
        let time_y = 30;
        
        let time = {
            minutes: 0,
            seconds: -1,
        }

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
                ctx.fillText(displayTime, time_x, time_y);
                time_x += time_x_variable;
            }
            const moveX = x + (i * 7);
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
}

function createDisplayTime(time) {
    const displayTime = ("00" + time.minutes).slice(-2) + ":" + ("00" + time.seconds).slice(-2);

    return displayTime;
}

function setCanvas(vD) {
    console.log(`vd = ${vD}`)
    const canvas = document.getElementById("canvas");
    const ruler = document.getElementById('timeline-header-ruler');
    const w = vD * 7 + 7;
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