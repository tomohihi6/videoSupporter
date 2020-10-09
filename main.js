function draw(){
    const canvas = document.getElementById("canvas");
    const ruler = document.getElementById('timeline-header-ruler');
    const w = ruler.clientWidth;
    const h = ruler.clientHeight;
    console.log(w)
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        const width = canvas.width;
        const height = canvas.height;

        let x = 10;
        let y = height;

        for(let i = 0; i < 1000; i++) {
            let lineHeight = 10;
            if(i % 4 == 0 && i != 0) {
                lineHeight = 15;
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