function draw(){
    const time_x_variable = 63; //時間をどのくらい移動させたらいい感じの場所になるか
    const canvas = setCanvas();
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        const width = canvas.width;
        const height = canvas.height;

        let x = 10; //数直線のx座標
        let y = height; //数直線のy座標
        let time_x = 60;
        let time_y = 30;
        
        let time = {
            minutes: 0,
            seconds: 0,
        }

        for(let i = 0; i < 1000; i++) {
            let lineHeight = 10;
            if(i % 9 == 0 && i != 0) {
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
    let timeString = {
        minutes:"0",
        seconds:"",
    };
    time.seconds += 1;
    if(time.seconds == 60) {
        time.minutes += 1;
        time.seconds = 0;
    }
    if(time.seconds < 10) {
        timeString.seconds = "0" + String(time.seconds);
    } else {
        timeString.seconds = String(time.seconds);
    }

    if(time.minutes < 10) {
        timeString.minutes = "0" + String(time.minutes);
    } else {
        timeString.minutes = String(time.minutes)
    }

    const displayTime = timeString.minutes + ":" + timeString.seconds;

    return displayTime;
}

function setCanvas() {
    const canvas = document.getElementById("canvas");
    const ruler = document.getElementById('timeline-header-ruler');
    const w = ruler.clientWidth;
    const h = ruler.clientHeight;
    console.log(w)
    canvas.setAttribute("width", w*10);
    canvas.setAttribute("height", h);
    return canvas;
}