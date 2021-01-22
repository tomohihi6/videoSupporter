0
00:00:01,000 -> 00:00:20,000
doOnce[index] = true;
indexf = 0;
doHighlight("video");
vars.btnAfunc = {};
vars.btnAfunc[2] = function() {
    player.playVideo();
    console.log("押されてます");
}
vars.btnAfunc[12] = function() {
    player.playVideo();
    console.log("押されてます");
}
vars.btnAfunc[22] = function() {
    angle = 90;
}
vars.btnAfunc[23] = function() {
    angle = 90;
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
00:00:21,000 -> 00:00:30,000
doHighlight(["video", "console-container"]);
accInterval = setInterval(async () => {
        const acc = await obniz.imu.getAccelWait();
        singleLog(`accx: ${acc.x}, accy: ${acc.y}, accz: ${acc.z}`)
        angle = (90 * acc.x) + 90;
        servo.angle(angle);
    }, 100); 

2
00:00:31,000 -> 00:00:32,500
indexf = 2;
doOnce[index] = true;
doHighlight(["video-summary", "console-container"]);
document.getElementById("video-title").innerText = `実際に手元のデバイスを動かして加速度センサの動きを感じてみてください.\n確認が終わったらデバイスのM5という文字が書かれたボタンを押してください`;
player.pauseVideo();

3
00:00:34,000 -> 00:00:39,000
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
 00:00:40,000 -> 00:00:49,000
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
00:00:50,000 -> 00:00:57,000
doHighlight("panel_area");
const doc = editor0.getDoc();
const value = doc.getValue();
doc.setValue(
    `obniz.onconnect = async () => {
        //6軸センサの呼び出し
        await obniz.setupIMUWait();
        //サーボモータの呼び出し
        const servo = obniz.wired("ServoMotor", {signal:26})\n
        //加速度の取得
        const acc = await obniz.imu.getAccelWait();
    }`
);

6
00:00:59,000 -> 00:01:02,000
doHighlight("video");

7
00:01:07,000 -> 00:01:27,000
aInterval = setInterval(async () => {
        const acc = await obniz.imu.getAccelWait();
        singleLog(`accx: ${acc.x}, accy: ${acc.y}, accz: ${acc.z}`)
    }, 100);
doHighlight(["video", "console-container", "video-summary"]);
document.getElementById("video-title").innerText = `実際に手元のデバイスを触って，加速度xの値を確かめてみてください`;

8
00:01:30,000 -> 00:01:33,000
clearInterval(aInterval);
document.getElementById("video-title").innerText = '';
doHighlight("panel_area");
const doc = editor0.getDoc();
const value = doc.getValue();
doc.setValue(
    `obniz.onconnect = async () => {
        //6軸センサの呼び出し
        await obniz.setupIMUWait();
        //サーボモータの呼び出し
        const servo = obniz.wired("ServoMotor", {signal:26})\n
        //加速度の取得
        const acc = await obniz.imu.getAccelWait();
        //角度の計算
        angle = (90 * acc.x) + 90;
    }`
);

9
00:02:06,000 -> 00:02:09,000
doHighlight("panel_area");
const doc = editor0.getDoc();
const value = doc.getValue();
doc.setValue(
    `obniz.onconnect = async () => {
        //6軸センサの呼び出し
        await obniz.setupIMUWait();
        //サーボモータの呼び出し
        const servo = obniz.wired("ServoMotor", {signal:26})\n
        //加速度の取得
        const acc = await obniz.imu.getAccelWait();
        //角度の計算
        angle = (90 * acc.x) + 90;
        servo.angle(angle);
    }`
);

10
00:02:13,000 -> 00:02:16,000
doHighlight("panel_area");
const doc = editor0.getDoc();
const value = doc.getValue();
doc.setValue(
  `obniz.onconnect = async () => {
    await obniz.setupIMUWait();
    const servo = obniz.wired("ServoMotor", {signal:26})\n
    setInterval(async () => {
        const acc = await obniz.imu.getAccelWait();
        angle = (90 * acc.x) + 90;
        servo.angle(angle);
    }, 100);
}`
);

11
00:02:30,000 -> 00:02:33,000
accInterval = setInterval(async () => {
    const acc = await obniz.imu.getAccelWait();
    singleLog(`x: ${acc.x}, y: ${acc.y}, z: ${acc.z}`)
    angle = (90 * acc.x) + 90;
    servo.angle(angle);
}, 100); 
deleteMe(["video", "panel_area", "console-container", "video-summary"]);

12
00:02:38,000 -> 00:02:38,500
indexf = 12;
doOnce[index] = true;
doHighlight(["video-summary", "console-container"]);
document.getElementById("video-title").innerText = `実際に手元のデバイスを動かして加速度センサの動きを感じてみてください.\n確認が終わったらデバイスのM5という文字が書かれたボタンを押してください`;
player.pauseVideo();

13
00:02:40,000 -> 00:02:43,000
clearInterval(accInterval);
document.getElementById("video-title").innerText = ``;
doHighlight("video");

14
00:04:00,000 -> 00:04:03,000
doHighlight("panel_area");

15
00:04:04,000 -> 00:04:07,000
doHighlight("panel_area");
const doc = editor0.getDoc();
doc.setValue(
  `// ジャイロセンサから角度を計算する関数
const getAngleByGyro = async () => {
    //角速度の取得
    const gyro = await obniz.imu.getGyroWait();
}\n
//10msごとに実行用
setInterval(async () => {
   	await getAngleByGyro();
    servo.angle(angle);
}, 10);`
);

16
00:04:08,000 -> 00:04:11,000
doHighlight("panel_area");
const doc = editor0.getDoc();
doc.setValue(
    `// ジャイロセンサから角度を計算する関数
const getAngleByGyro = async () => {
    //角速度の取得
    const gyro = await obniz.imu.getGyroWait();
    //現在の時刻を取得
    const followTime = new Date();
}\n
//10msごとに実行用
setInterval(async () => {
    await getAngleByGyro();
    servo.angle(angle);
}, 10);`
);

17
00:04:17,000 -> 00:04:20,000
doHighlight("panel_area");
const doc = editor0.getDoc();
doc.setValue(
    `// ジャイロセンサから角度を計算する関数
const getAngleByGyro = async () => {
    //角速度の取得
    const gyro = await obniz.imu.getGyroWait();
    //現在の時刻を取得
    const followTime = new Date();
    //角度計算
    angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
}\n
//10msごとに実行用
setInterval(async () => {
    await getAngleByGyro();
    servo.angle(angle);
}, 10);`
);

18
00:04:49,000 -> 00:04:52,000
doHighlight("panel_area");
const doc = editor0.getDoc();
doc.setValue(
    `// ジャイロセンサから角度を計算する関数
const getAngleByGyro = async () => {
    //角速度の取得
    const gyro = await obniz.imu.getGyroWait();
    //現在の時刻を取得
    const followTime = new Date();
    //角度計算
    angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
    //値の更新
    preTime = followTime;
    preGyro = gyro;
}\n
//10msごとに実行用
setInterval(async () => {
    await getAngleByGyro();
    servo.angle(angle);
}, 10);`
);

19
00:05:04,000 -> 00:05:47,000
doHighlight(["video"]);
// preTime = new Date();
// preGyro = obniz.imu.getGyroWait().then(() => {
//     angle = 90;
//     servo.angle(angle);
//     vars.btnAfunc[index] = () => {
//         angle = 90;
//     }
//     gyroInterval = setInterval(async () => {
//         const gyro = await obniz.imu.getGyroWait();
//         const followTime = new Date();
//         singleLog(`gyrox: ${gyro.x}\ngyroy: ${gyro.y}\ngyroz: ${gyro.z}`);
//         angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
//         servo.angle(angle);
//         preTime = followTime;
//         preGyro = gyro;
//     }, 100);
// });

20
00:05:48,000 -> 00:05:48,500
// clearInterval(gyroInterval);
doHighlight("panel_area");

21
00:05:49,000 -> 00:05:49,000
const doc = editor0.getDoc();
doc.setValue(
    `// ジャイロセンサから角度を計算する関数
const getAngleByGyro = async () => {
    //角速度の取得
    const gyro = await obniz.imu.getGyroWait();
    //現在の時刻を取得
    const followTime = new Date();
    //誤差判定
    if(Math.abs(gyro.z) > 10) {
        //角度計算
        angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
    }
    //値の更新
    preTime = followTime;
    preGyro = gyro;
}\n
//10msごとに実行用
setInterval(async () => {
    await getAngleByGyro();
    servo.angle(angle);
}, 10);`
);

22
00:06:00,000 -> 00:06:12,000
indexf=22;
doHighlight(["video", "console-container"]);
preTime = new Date();
obniz.imu.getGyroWait().then((g) => {
    preGyro = g;
    angle = 90;
    vars.btnAfunc[index] = () => {
        angle = 90;
    }
    gyroInterval = setInterval(async () => {
        const gyro = await obniz.imu.getGyroWait();
        const followTime = new Date();
        singleLog(`gyrox: ${gyro.x}\ngyroy: ${gyro.y}\ngyroz: ${gyro.z}`)
        if(Math.abs(gyro.z) > 10) {
            angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
        }
        servo.angle(angle);
        preTime = followTime;
        preGyro = gyro;
    }, 100);
});

23
00:06:13,000
indexf=23;
doHighlight(["video-summary", "console-container"]);
document.getElementById("video-title").innerText = `実際に手元のデバイスを触って，動作を確かめてみてください\nサーボが真ん中に戻らなくなった場合，デバイスのM5ボタンを押してください.`;
preTime = new Date();
obniz.imu.getGyroWait().then((g) => {
    preGyro = g;
    angle = 90;
    vars.btnAfunc[index] = () => {
        angle = 90;
    }
    gyroInterval = setInterval(async () => {
        const gyro = await obniz.imu.getGyroWait();
        const followTime = new Date();
        singleLog(`gyrox: ${gyro.x}\ngyroy: ${gyro.y}\ngyroz: ${gyro.z}`)
        if(Math.abs(gyro.z) > 10) {
            angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
        }
        servo.angle(angle);
        preTime = followTime;
        preGyro = gyro;
    }, 100);
});