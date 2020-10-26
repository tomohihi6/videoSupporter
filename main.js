// 数直線の線間隔
let lineWidth;
// canvasのleftの値
const adjCanvasX = 8;
// srt.js記述用要素の幅の初期値 ちょうど4秒分になっている．
const scriptItemInitWidth = 45;
// srt.js記述用要素を編集しているかどうかの真偽値を格納
let isEdit = false;
// 現在編集中のsrt.js記述用要素のDOM情報を格納
let nowEditing;
console.log(lineWidth);

function draw(){
    const videoDuration = player.getDuration(); //動画の再生時間を取得
    const canvas = setCanvas(videoDuration); //canvasを描画
    if (canvas.getContext) {
        drawNumberLine(canvas, videoDuration);
    }
}

function drawNumberLine(canvas, videoDuration) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = 50;
    let x = 10; //数直線のx座標
    let y = height; //数直線のy座標
    // 数直線の時間に関するオブジェクト
    let time = {　
        minutes: 0,
        seconds: -1,
        x: 0,
        y: 10,
    }

    //数直線を引き延ばすかどうかの判定 canvasの長さが動画時間より長い時に
    if(canvas.clientWidth > videoDuration * 15) {
        lineWidth = (canvas.clientWidth) / videoDuration;
        time.x = lineWidth * 10 - 3;
    } else {
        lineWidth = 15;
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
            const displayTime = getDisplayTime(time);
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

function getDisplayTime(time) {
    const displayTime = ("00" + time.minutes).slice(-2) + ":" + ("00" + time.seconds).slice(-2);

    return displayTime;
}

function setCanvas(vD) {
    const canvas = document.getElementById("canvas");
    const ruler = document.getElementById('timeline-header-ruler');
    const w = (ruler.clientWidth > (vD * 15)) ? ruler.clientWidth : vD * 15 + 30;
    const h = ruler.clientHeight;
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    return canvas;
}

// こっちは数直線に描画するようの時間変換用関数
function timeConvert(seconds) {
    const min = (('00') + Math.floor((seconds / 60) % 60)).slice(-2);
    const sec = (('00') + Math.floor(seconds % 60)).slice(-2);
    return min + ":" + sec;
}

function seekVideo(e) {
    let mouse = getMouseOnCanvas(e);
    mouse.x -= adjCanvasX;
    //x=8が0秒 +-2seek判定 次の棒15座標
    const seekTime = (mouse.x) / lineWidth;
    player.seekTo(seekTime);
    moveHandle(mouse.x);
}

function moveHandle(mouseX) {
    const handle = document.getElementById("time-line-handle");
    const time = document.getElementById("handle-time");
    const width = handle.clientWidth;
    const height = handle.clientHeight;
    handle.style.left = mouseX - width / 2 + 7 + "px"
    const displayTime = timeConvert(mouseX / lineWidth);
    time.innerHTML = String(displayTime);
}

// srt.js記述用の要素を生成
function addScriptItem(e) {
    const mouse = getMouseOnCanvas(e);
    // キャンバス上でずれるx座標の調整
    const canvasMouseX = mouse.x - adjCanvasX;
    // srt.js記述する開始時間
    const startTime = timeConvert(canvasMouseX / lineWidth);
    // srt.js記述する終了時間
    const endTime = timeConvert((canvasMouseX + scriptItemInitWidth) / lineWidth);
    // 親要素
    const ruler = document.getElementById('timeline-header-ruler');

    const scriptItem = document.createElement('div');
    scriptItem.setAttribute('class', 'scriptItem ui-selectee');
    scriptItem.innerText =  "00:" +  startTime + ",000 -> 00:" + endTime + ",000";
    scriptItem.style.position = 'absolute';
    scriptItem.style.left = mouse.x + 'px';
    scriptItem.style.top = '50px';
    scriptItem.style.width = scriptItemInitWidth + 'px';
    scriptItem.ondblclick = function() {
        editSrt(scriptItem);
    }
    ruler.appendChild(scriptItem);
    // ドラッグとリサイズできるように
    setDrag();
    setResize();
}

function setDrag() {
    $('.scriptItem').draggable({
        axis: 'x',
        containment: '#timeline-body',
        drag: function(e) {
            // innnertextをいじってdivを更新してしまっているため，リサイズができなくなる
            e.target.innerText = getScriptTime(e);
        },
        stop: function(e) {
            //一度リサイズを削除して，再度セットし直す.
            $(this).resizable('destroy');
            setResize();
        }
    })
}

function setResize() {
    $('.scriptItem').resizable({
        // Handles left right and bottom right corner
        handles: 'e, w, se',
        containment: '#timeline-header-ruler',
        // Remove height style
        resize: function(e) {
            $(this).css("height", '');
            e.target.innerText = getScriptTime(e);
        },
        stop: function(e) {
            // setDrag（）と同様の理由
            $(this).resizable('destroy');
            setResize();
        },
    });
}

// srt.jsファイル用の時間変換関数
function getScriptTime(e) {
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    const rect = e.target.getBoundingClientRect();
    const startTime = timeConvert((rect.left - canvasRect.left - adjCanvasX)/ lineWidth);
    const endTime = timeConvert((rect.right - canvasRect.left - adjCanvasX) / lineWidth);
    player.seekTo((rect.left - canvasRect.left - adjCanvasX)/ lineWidth);
    moveHandle(rect.left - canvasRect.left - adjCanvasX)
    return "00:" +  startTime + ",000 -> 00:" + endTime + ",000";
}


function getMouseOnCanvas(e) {
    const rect = document.getElementById('canvas').getBoundingClientRect();
    console.log(`e.clientX = ${e.clientX}`);
    const mouse = {
        x : e.clientX - Math.floor(rect.left),
        y : e.clientY - Math.floor(rect.top),
    }
    return mouse;
}

function editSrt(e) {
    isEdit = true;
    nowEditing = e;
    const doc = editor2.getDoc();
    const tab2 = document.getElementById("tab2");
    // 記述用タブの切り替え
    tab2.setAttribute('checked', '');
    doc.setValue(e.innerText);
    editor2.focus();
    return ;
}