0
00:00:01,000 -> 00:00:03,000
doOnce[index] = true;
indexf = 0;
doHighlight("video");
vars.btnAfunc = {};
vars.btnAfunc[2] = function() {
    player.playVideo();
    console.log("押されてます");
}
obniz.buttonA.onchange = (flg) => {
    if(flg) {
        vars.btnAfunc[indexf].call(null);
    }
}
const doc = editor.getDoc();
doc.setValue(
    `const Obniz = require('obniz');\n
    const obniz = new Obniz.M5StickC("9269-2634");\n
    let preAcc;
    let preGyro;
    let preTime = new Date();
    let angleByGyro = 90;
    let angle = 90;\n
    obniz.onconnect = async () => {\n
        //6軸センサの呼び出し
        await obniz.setupIMUWait();
        obniz.imu.setGyroRange("1000dps");\n
        //加速度とジャイロの初期値設定
        preAcc = await obniz.imu.getAccelWait();
        preGyro = await obniz.imu.getGyroWait();\n
        //サーボの初期設定
        const servo = obniz.wired("ServoMotor", {signal:26});\n
        servo.angle(90);\n
        //角度リセット用
        obniz.buttonA.onchange = (flg) => {
            if(flg) {
                angle = 90;
            }
        }\n
        const getAngleByGyro = async () => {
            const gyro = await obniz.imu.getGyroWait();
            const followTime = new Date();
            angleByGyro += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
            //ジャイロの誤差は加速度センサで補う
            preTime = followTime;
            preGyro = gyro;
            return angleByGyro;
        }\n
        const getAngleByAcc = async () => {
            const acc = await obniz.imu.getAccelWait();
            const angleByAcc = (90 * acc.x) + 90;
            preAcc = acc;
            return angleByAcc;
        }\n
        setInterval(async () => {
            const gyro = await obniz.imu.getGyroWait();
            const followTime = new Date();
            const acc = await obniz.imu.getAccelWait();
            angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
            if(gyro.z < 20) {
                if(Math.abs(preAcc.x) - Math.abs(acc.x) > 0.05) {
                    angle = await getAngleByAcc();
                }
            }
            servo.angle(angle);
            preGyro = gyro;
            preAcc = acc;
            preTime = followTime;
        }, 10);
    }`
)
servo = obniz.wired("ServoMotor", {signal:26});
obniz.setupIMUWait().then(
	() => {
    	preAcc = obniz.imu.getAccelWait().then(
        	() => {
            	 servo.angle(90);
    			 angle = 90;	
            }
        );
    }
);

1
00:00:15,000 -> 00:00:24,000
doHighlight(["video", "console-container"]);
accInterval = setInterval(async () => {
        const acc = await obniz.imu.getAccelWait();
        singleLog(`accx: ${acc.x}, accy: ${acc.y}, accz: ${acc.z}`)
        angle = (90 * acc.x) + 90;
        servo.angle(angle);
    }, 100); 

2
00:00:25,000 -> 00:00:26,000
indexf = 2;
doOnce[index] = true;
doHighlight(["video-summary", "console-container"]);
document.getElementById("video-title").innerText = `実際に手元のデバイスを動かして加速度センサの動きを感じてみてください.\n確認が終わったらデバイスのM5という文字が書かれたボタンを押してください`;
player.pauseVideo();

3
00:00:27,000 -> 00:00:32,000
document.getElementById("video-title").innerText = "";
clearInterval(accInterval);
doHighlight("panel_area");
const doc = editor0.getDoc();
doc.setValue(
`obniz.onconnect = async () => {
    //6軸センサの呼び出し
    await obniz.setupIMUWait();
}`
);

4
00:00:33,000 -> 00:00:38,000
doHighlight("panel_area");
const doc = editor0.getDoc();
const value = doc.getValue();
doc.setValue(
    `obniz.onconnect = async () => {
        //6軸センサの呼び出し
        await obniz.setupIMUWait();
        //サーボモータの呼び出し
        const servo = obniz.wired("ServoMotor", {signal:26})\n
    }`
);

5
00:00:39,000 -> 00:00:41,000
doHighlight("video");

6
00:00:47,000 -> 00:00:51,000
doHighlight(["video", "panel_area"]);
const doc = editor0.getDoc();
doc.setValue(
`obniz.display.clear();
obniz.display.font('Avenir',70)
obniz.display.print("🧡😁");`
);
obniz.display.clear();
obniz.display.font('Avenir',70)
obniz.display.print("🧡😁");

7
00:00:52,000 -> 00:00:57,000
const doc = editor0.getDoc();
doc.setValue(
`obniz.display.line(30, 30, 100, 30);
obniz.display.rect(20, 20, 20, 20);
obniz.display.circle(100, 30, 20);
obniz.display.line(60, 50, 100, 30);
obniz.display.rect(50, 40, 20, 20, true);
obniz.display.line(50, 10, 100, 30);
obniz.display.circle(50, 10, 10, true);
obniz.display.setColor('#FF0000');
obniz.display.rect(50, 40, 20, 20, true);
obniz.display.setColor('blue');
obniz.display.circle(100, 30, 20, true);`
);
obniz.display.clear();
obniz.display.line(30, 30, 100, 30);
obniz.display.rect(20, 20, 20, 20);
obniz.display.circle(100, 30, 20);
obniz.display.line(60, 50, 100, 30);
obniz.display.rect(50, 40, 20, 20, true);
obniz.display.line(50, 10, 100, 30);
obniz.display.circle(50, 10, 10, true);
obniz.display.setColor('#FF0000');
obniz.display.rect(50, 40, 20, 20, true);
obniz.display.setColor('blue');
obniz.display.circle(100, 30, 20, true);

8
00:00:57,000 -> 00:00:59,000
doHighlight("video");

9
00:01:04,000 -> 00:01:05,000
obniz.led.on();

10
00:01:06,000 -> 00:01:06,500
obniz.led.off();

11
00:01:07,000 -> 00:01:09,000
obniz.led.blink();