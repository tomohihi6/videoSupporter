const script = document.createElement("script");
script.src = "https://www.youtube.com/iframe_api";
firstScript = document.getElementsByTagName( 'script' )[ 0 ];
firstScript.parentNode.insertBefore( script , firstScript );

let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: 'M7lc1UVf-VE',
        events: {
            'onReady': onPlayerReady,
            // 'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    draw();
}



