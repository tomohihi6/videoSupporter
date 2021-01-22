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

// youtube plyaerの準備ができたら実行する関数
function draw(){
    const videoDuration = player.getDuration(); //動画の再生時間を取得
    const canvas = setCanvas(videoDuration); //canvasを描画
    if (canvas.getContext) {
        drawNumberLine(canvas, videoDuration);
    }
}

// 数直線をひく
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

    //数直線の背景用の長方形の描画
    ctx.beginPath();
    ctx.rect(x, 0, width, height);
    ctx.fillStyle = "#958A8A";
    ctx.fill();

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
            ctx.fillStyle = "White";
            ctx.fillText(displayTime, time.x, time.y);
            time.x += time_x_width;
        }
        const moveX = x + (i * lineWidth);
        ctx.beginPath();
        ctx.moveTo(moveX, y);          // 始点に移動
        ctx.lineTo(moveX, y - lineHeight);        // 終点
        ctx.strokeStyle = "White";  // 線の色
        ctx.lineWidth = 1;           // 線の太さ
        ctx.stroke();
    }

    //数直線の下線
    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.lineTo(width, y);
    ctx.strokeStyle = "White";  // 線の色
    ctx.lineWidth = 1;           // 線の太さ
    ctx.stroke();
}

function getDisplayTime(time) {
    const displayTime = ("00" + time.minutes).slice(-2) + ":" + ("00" + time.seconds).slice(-2);

    return displayTime;
}

// canvas描画関係
function setCanvas(vD) {
    const canvas = document.getElementById("canvas");
    const ruler = document.getElementById('timeline-header-ruler');
    // 数直線の幅が動画時間の関係によってrulerの幅より短くなりそうなら，引き延ばしていい感じの幅にするように
    const w = (ruler.clientWidth > (vD * 15)) ? ruler.clientWidth : vD * 15 + 30;
    const h = ruler.clientHeight - ruler.clientHeight * 0.1;
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

function moveHandle(handleLeft) {
    const handle = document.getElementById("time-line-handle");
    const time = document.getElementById("handle-time");
    const width = handle.clientWidth;
    const height = handle.clientHeight;
    handle.style.left = handleLeft - width / 2 + 7 + "px"
    const displayTime = timeConvert(handleLeft / lineWidth);
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

    const scriptItemContainer = createScriptItemElement(mouse, startTime, endTime);
    ruler.appendChild(scriptItemContainer);
    // ドラッグとリサイズできるように
    setDrag();
    setResize();
}

function createScriptItemElement(mouse, startTime, endTime) {
    const scriptItemConteiner = document.createElement('div');
    scriptItemConteiner.setAttribute('class', 'scriptItemContainer ui-selectee');
    scriptItemConteiner.style.position = 'absolute';
    scriptItemConteiner.style.left = mouse.x + 'px';
    scriptItemConteiner.style.top = '50px';
    scriptItemConteiner.style.width = scriptItemInitWidth + 'px';

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'scriptItemButton');
    deleteButton.style.width = scriptItemInitWidth - 25 + "px";
    deleteButton.style.height = "20px";
    deleteButton.innerHTML = "×";
    deleteButton.onclick = function() {
        $(this).parent().remove();
    }

    const scriptItem = document.createElement('div');
    scriptItem.setAttribute('class', 'scriptItem');
    scriptItem.textContent =  "00:" +  startTime + ",000 -> 00:" + endTime + ",000";
    scriptItemConteiner.ondblclick = function() {
        editSrt(scriptItem);
        $(this).resizable('destroy');
        setResize();
    }

    scriptItemConteiner.appendChild(deleteButton);
    scriptItemConteiner.appendChild(scriptItem);
    return scriptItemConteiner;
}

function setDrag() {
    let textContents;
    let scriptItem;
    $('.scriptItemContainer').draggable({
        axis: 'x',
        containment: '#canvas',
        start: function(e) {
            scriptItem = e.target.childNodes[1];
            textContents = scriptItem.textContent.split('\n');
        },
        drag: function(e) {
            // innnertextをいじってdivを更新してしまっているため，リサイズができなくなる
            scriptItem.textContent = getScriptTime(e);
        },
        stop: function(e) {
            const currentVideoTime = getScriptTime(e);
            console.log(currentVideoTime)
            let returnText = '';
            textContents.forEach((text, i) => {
                if(i == 0) {
                    returnText += currentVideoTime + '\n';
                } else if(i == textContents.length - 1) {
                    returnText += text;
                } else {
                    returnText += text + '\n';
                }
            })
            scriptItem.textContent = returnText;
            //一度リサイズを削除して，再度セットし直す.
            $(this).resizable('destroy');
            setResize();
        }
    })
}

function setResize() {
    let textContents;
    let scriptItem;
    $('.scriptItemContainer').resizable({
        // Handles left right and bottom right corner
        handles: 'e, w, se',
        containment: '#canvas',
        // Remove height style
        start: function(e) {
            scriptItem =  e.target.childNodes[1];
            textContents = scriptItem.textContent.split('\n');
        },
        resize: function(e) {
            $(this).css("height", '');
            scriptItem.textContent = getScriptTime(e);
        },
        stop: function(e) {
            const currentVideoTime = getScriptTime(e);
            console.log(currentVideoTime)
            let returnText = '';
            textContents.forEach((text, i) => {
                if(i == 0) {
                    returnText += currentVideoTime + '\n';
                } else if(i == textContents.length - 1) {
                    returnText += text;
                } else {
                    returnText += text + '\n';
                }
            })
            scriptItem.textContent = returnText;
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
    // player.seekTo((rect.left - canvasRect.left - adjCanvasX)/ lineWidth);
    // moveHandle(rect.left - canvasRect.left - adjCanvasX)
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
    doc.setValue(e.textContent);
    editor2.focus();
    return ;
}

function saveTextToScriptItem() {
    const value = editor2.getDoc().getValue();
    nowEditing.textContent = value;
}

function uploadFileToFirebaseStorage(fileName) {
    const a = document.createElement('a');
    const saveText = gatherTextsFromScriptItems();
    // a.href = 'data:text/plain,' + encodeURIComponent(saveText);
    // a.download = fileName;

    // a.style.display = 'none';
    // document.body.appendChild(a); // ※ DOM が構築されてからでないとエラーになる
    // a.click();
    // document.body.removeChild(a);
    const storageRef = firebase.storage().ref().child(`srt.js/${fileName}`);
    const metadata = {
        contentType: "text/javascript",
        contentEncoding: "UTF-8",
    };
    const uploadTask = storageRef.putString(saveText,"raw",metadata);
    uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
        }, function(error) {
        // Handle unsuccessful uploads
        }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            openModal();
        });
    });
}

function confirmSaveScript() {
    const fileName = window.prompt("ファイルを保存します．\nファイル名を入力してください", `${videoId}.js`);
    if(!fileName) {
        alert('ファイル名を入力してください．')
        return ;
    } else {
        uploadFileToFirebaseStorage(fileName);
    }
}

function gatherTextsFromScriptItems() {
    // srt.js記述用要素全てを取得
    let scriptItemContainers = document.getElementsByClassName('scriptItemContainer');
    // スクリプト記録用変数
    let texts = ''
    // このままだとHTMLCollectionとなって配列として扱うことができないので，配列に変換
    scriptItemContainers = Array.from( scriptItemContainers ) ;
    // 中身の再生時間が短い順にソート
    scriptItemContainers.sort(function(a, b) {
        //要素のleftを取ってきてソート用に比較 pxの文字が邪魔なので取り除いてから数値に変換
        const rectA = Number(a.style.left.replace('px', ''));
        const rectB = Number(b.style.left.replace('px', ''));
        if(rectA < rectB) return -1;
        else if(rectA > rectB) return 1;
        return 0;
    })
    scriptItemContainers.forEach((e, i) => {
        texts += i + '\n';
        texts += e.childNodes[1].textContent + '\n\n';
    })
    return texts;
}

//ファイル読み込み用関数
function handleFileSelect(evt) {
    console.log(evt)
    const file = evt.target.files[0]; // FileList object

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        const result = reader.result;
        console.log(result);
        const editorDoc = editor.getDoc();
        editorDoc.setValue(result);
    }
    
}

function addHlText(highlightContentsNum) {
    function checkHighlightContent(num) {
        switch(num) {
            case '0':
                return 'doHighlight("video");';
            case '1': 
                return 'doHighlight("panel_area");';
            case '2':
                return 'doHighlight("video-summary");'
            case '3':
                return 'doHighlight(["video", "panel_area", "console-container", "video-summary"]);';
            case '4':
                return 'deleteMe(["video", "panel_area", "console-container", "video-summary"]);';
        }
    }
    const highlightTexts = checkHighlightContent(highlightContentsNum);
    addToEditor(highlightTexts);
}

function addEditorText() {
    const editorTexts = 
    "const doc = editor0.getDoc();\n" +
    "const currentValue = doc.getValue();\n" +
    "doc.setValue(\n" + 
    "   currentValue + `//出力したい文字列`\n" +
    ");";
    addToEditor(editorTexts);
}

function addToEditor(text) {
    const editorDoc = editor2.getDoc();
    const cursor = editorDoc.getCursor();
    const line = editorDoc.getLine(cursor.line);
    const pos = {
        line: cursor.line,
        ch: line.length - 1,
    }
    editorDoc.replaceRange(text, pos);
}

function openModal() {
    if($("#modal-overlay")[0]) return false ;		//新しくモーダルウィンドウを起動しない [下とどちらか選択]
    //if($("#modal-overlay")[0]) $("#modal-overlay").remove() ;		//現在のモーダルウィンドウを削除して新しく起動する [上とどちらか選択]

    //オーバーレイ用のHTMLコードを、[body]内の最後に生成する
    $("body").append('<div id="modal-overlay"></div>');

    //[$modal-overlay]をフェードインさせる
    $("#modal-overlay").fadeIn("slow");

    $("#modal-overlay").click(closeModal);

    //[$modal-content]をフェードインさせる
    $(".modal-content").fadeIn("slow");

    const mainUrl = `https://myresearch.firebaseapp.com/ob.html?v=${videoId}`;

    $("#modal-texts").html(`アップロードが完了しました．\n作成したスクリプトの動作は<a href="${mainUrl}" style="color:#00bbdd">こちら</a>で確認できます．`);
    centeringModalSyncer();
}

function centeringModalSyncer(){

	//画面(ウィンドウ)の幅を取得し、変数[w]に格納
	var w = $(window).width();
    console.log(w);
	//画面(ウィンドウ)の高さを取得し、変数[h]に格納
	var h = $(window).height();

	//コンテンツ(#modal-content)の幅を取得し、変数[cw]に格納
    var cw = $(".modal-content").outerWidth();
    console.log(cw);

	//コンテンツ(#modal-content)の高さを取得し、変数[ch]に格納
	var ch = $(".modal-content").outerHeight();

	//コンテンツ(#modal-content)を真ん中に配置するのに、左端から何ピクセル離せばいいか？を計算して、変数[pxleft]に格納
	var pxleft = ((w - cw)/2);

	//コンテンツ(#modal-content)を真ん中に配置するのに、上部から何ピクセル離せばいいか？を計算して、変数[pxtop]に格納
    var pxtop = ((h - ch)/2);
    console.log(`pxleft is ${pxleft}\n pxtop is ${pxtop}`)

	//[#modal-content]のCSSに[left]の値(pxleft)を設定
	$(".modal-content").css({"left": pxleft + "px"});

	//[#modal-content]のCSSに[top]の値(pxtop)を設定
	$(".modal-content").css({"top": pxtop + "px"});

}

function closeModal() {
    $(".modal-content,#modal-overlay").fadeOut("slow",function(){
        //フェードアウト後、[#modal-overlay]をHTML(DOM)上から削除
        $("#modal-overlay").remove();
    });
}

function accessNewVideo() {
    const searchWindow = document.getElementById("search-window");
    const newVideoId = searchWindow.value;
    location.href = `https://videosupporter.web.app/main.html?v=${newVideoId}`
}

function checkWhatFocus() {
    document.body.onkeypress = (e) => {
        if(document.activeElement == document.body) {
            if(e.code == "Space") {
                ytState == YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
            }
        }  
    }  
}

function loadEditData() {
    const reviveScriptItems = (text, left, width) => {
        const scriptItemConteiner = document.createElement('div');
        scriptItemConteiner.setAttribute('class', 'scriptItemContainer ui-selectee');
        scriptItemConteiner.style.position = 'absolute';
        scriptItemConteiner.style.left =  left;
        scriptItemConteiner.style.top = '50px';
        scriptItemConteiner.style.width = width;

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'scriptItemButton');
        deleteButton.style.width = scriptItemInitWidth - 25 + "px";
        deleteButton.style.height = "20px";
        deleteButton.innerHTML = "×";
        deleteButton.onclick = function() {
            $(this).parent().remove();
        }

        const scriptItem = document.createElement('div');
        scriptItem.setAttribute('class', 'scriptItem');
        scriptItem.textContent =  text;
        scriptItemConteiner.ondblclick = function() {
            editSrt(scriptItem);
            $(this).resizable('destroy');
            setResize();
        }

        scriptItemConteiner.appendChild(deleteButton);
        scriptItemConteiner.appendChild(scriptItem);
        return scriptItemConteiner;
    }

    const texts = localStorage.getItem(`${videoId}_texts`).split("END_OF_ARRAY");
    const lefts = localStorage.getItem(`${videoId}_lefts`).split("END_OF_ARRAY");
    const widths = localStorage.getItem(`${videoId}_widths`).split("END_OF_ARRAY");
    if(texts && lefts && widths) {
        const ruler = document.getElementById('timeline-header-ruler');
        texts.forEach((e, i) => {
            if(i < texts.length - 1) {
                const scriptItem = reviveScriptItems(e, lefts[i], widths[i]);
                ruler.appendChild(scriptItem);
                setDrag();
                setResize();
            }
        })
    } else {
        console.error("データのロードに失敗したか，データが存在しません");
        return null;
    }

}

function saveEditData() {
    let scriptItemContainers = document.getElementsByClassName('scriptItemContainer');
    // スクリプト記録用変数
    let texts = '';
    let lefts = '';
    let widths = '';
    // このままだとHTMLCollectionとなって配列として扱うことができないので，配列に変換
    scriptItemContainers = Array.from( scriptItemContainers ) ;
    // 中身の再生時間が短い順にソート
    scriptItemContainers.sort(function(a, b) {
        //要素のleftを取ってきてソート用に比較 pxの文字が邪魔なので取り除いてから数値に変換
        const rectA = Number(a.style.left.replace('px', ''));
        const rectB = Number(b.style.left.replace('px', ''));
        if(rectA < rectB) return -1;
        else if(rectA > rectB) return 1;
        return 0;
    });
    scriptItemContainers.forEach((e) => {
        texts += e.childNodes[1].textContent + "END_OF_ARRAY";
        lefts += e.style.left + "END_OF_ARRAY";
        widths += e.style.width + "END_OF_ARRAY";
    })
    localStorage.setItem(`${videoId}_texts`, texts)
    localStorage.setItem(`${videoId}_lefts`, lefts);
    localStorage.setItem(`${videoId}_widths`, widths);
    return null;
}

function openHelpModal() {

}

function openSrtTutorial() {

}

function openVSTutorial() {

}