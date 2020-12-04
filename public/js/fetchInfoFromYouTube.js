const script = document.createElement("script");
script.src = "https://www.youtube.com/iframe_api";
firstScript = document.getElementsByTagName( 'script' )[ 0 ];
firstScript.parentNode.insertBefore( script , firstScript );

let isPlaying = false;
let player;
const videoId = getVideoId();

function getVideoId() {
    const para = getUrlVars();
    if (para["v"]) {
        return para["v"];
    } else {
        return "o1jIYNyr0fs";
    }
}

function getUrlVars(){
    var vars = {};
    var param = location.search.substring(1).split('&');
    for(var i = 0; i < param.length; i++) {
        var keySearch = param[i].search(/=/);
        var key = '';
        if(keySearch != -1) key = param[i].slice(0, keySearch);
        var val = param[i].slice(param[i].indexOf('=', 0) + 1);
        if(key != '') vars[key] = decodeURIComponent(val);
    }
    return vars;
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: videoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        },
        rel: 0,
    });
}

function onPlayerReady(e) {
    //canvasの描画
    draw();
}

function onPlayerStateChange(e) {
    if(e.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        
    } else {
        isPlaying = false;
    }
}
