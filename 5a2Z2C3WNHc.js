0
00:00:01,000 -> 00:00:03,000
doHighlight("video");
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
vars.btnAfunc = {};
obniz.buttonA.onchange = (flg) => {
    if(flg) {
        let fn = indexedFunction(vars.btnAfunc);
        if (fn != null) {
            fn.call(null);
        }
    }
}

1
00:00:21,000 -> 00:00:30,000
doHighlight(["video", "console-container"]);
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
accInterval = setInterval(async () => {
        const acc = await obniz.imu.getAccelWait();
        singleLog(`x: ${acc.x}, y: ${acc.y}, z: ${acc.z}`)
        angle = (90 * acc.x) + 90;
        servo.angle(angle);
    }, 100); 

2
00:00:31,000 -> 00:00:33,000
player.pauseVideo();
doHighlight(["video-summary", "console-container"]);
document.getElementById("video-title").innerText = `実際に手元のデバイスを動かして加速度センサの動きを感じてみてください.\n確認が終わったらデバイスのM5という文字が書かれたボタンを押してください`;
vars.btnAfunc[index] = () => {
	player.playVideo();
}

3
00:00:34,000 -> 00:00:39,000
clearInterval(accInterval);
doHighlight("panel_area");
const doc = editor0.getDoc();
doc.setValue(
`obniz.onconnect = async () => {
    await obniz.setupIMUWait();
}`
);

4
 00:00:40,000 -> 00:00:49,000
doHighlight("panel_area");
const doc = editor0.getDoc();
const value = doc.getValue();
doc.setValue(
  value + '\n' +  `const servo = obniz.wired("ServoMotor", {signal:26});`
);

5
00:00:50,000 -> 00:00:57,000
const doc = editor0.getDoc();
const value = doc.getValue();
doc.setValue(
  value + '\n' +  ` const acc = await obniz.imu.getAccelWait();`
);

6
00:00:59,000 -> 00:01:02,000
doHighlight("video");

7
00:01:07,000 -> 00:01:27,000
aInterval = setInterval(async () => {
        const acc = await obniz.imu.getAccelWait();
        singleLog(`x: ${acc.x}, y: ${acc.y}, z: ${acc.z}`)
    }, 100);
doHighlight(["video", "console-container"]);

8
00:01:30,000 -> 00:01:33,000
clearInterval(aInterval);
doHighlight("panel_area");
const doc = editor0.getDoc();
const value = doc.getValue();
doc.setValue(
  value + '\n' +  ` angle = (90 * acc.x) + 90;`
);

9
00:02:06,000 -> 00:02:09,000
const doc = editor0.getDoc();
const value = doc.getValue();
doc.setValue(
  value + '\n' +  ` servo.angle(angle);`
);

10
00:02:13,000 -> 00:02:16,000
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
00:02:40,000 -> 00:02:43,000
clearInterval(accInterval);
doHighlight("video");

13
00:04:00,000 -> 00:04:03,000
doHighlight("panel_area");

14
00:04:04,000 -> 00:04:07,000
const doc = editor0.getDoc();
doc.setValue(
  `const getAngleByGyro = async () => {
        const gyro = await obniz.imu.getGyroWait();
    }\n
    setInterval(async () => {
       	await getAngleByGyro();
        servo.angle(angle);
    }, 10);
}`
);

15
00:04:08,000 -> 00:04:11,000
const doc = editor0.getDoc();
doc.setValue(
  `const getAngleByGyro = async () => {
        const gyro = await obniz.imu.getGyroWait();
		const followTime = new Date();
    }\n
    setInterval(async () => {
       	await getAngleByGyro();
        servo.angle(angle);
    }, 10);
}`
);

16
00:04:17,000 -> 00:04:20,000
const doc = editor0.getDoc();
doc.setValue(
  `const getAngleByGyro = async () => {
        const gyro = await obniz.imu.getGyroWait();
		const followTime = new Date();
		angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
    }\n
    setInterval(async () => {
       	await getAngleByGyro();
        servo.angle(angle);
    }, 10);
}`
);

17
00:04:49,000 -> 00:04:52,000
const doc = editor0.getDoc();
doc.setValue(
  `const getAngleByGyro = async () => {
        const gyro = await obniz.imu.getGyroWait();
		const followTime = new Date();
		angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
	preTime = followTime;
	preGyro = gyro;
    }\n
    setInterval(async () => {
       	await getAngleByGyro();
        servo.angle(angle);
    }, 10);
}`
);

18
00:05:04,000 -> 00:05:47,000
doHighlight("video");
preTime = new Date();
preGyro = obniz.imu.getGyroWait().then(() => {
    angle = 90;
    vars.btnAfunc[index] = () => {
        angle = 90;
    }
    gyroInterval = setInterval(async () => {
        const gyro = await obniz.imu.getGyroWait();
        const followTime = new Date();
        angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
        servo.angle(angle);
        preTime = followTime;
        preGyro = gyro;
    }, 10);
});

19
00:05:48,000 -> 00:05:48,500
clearInterval(gyroInterval);
doHighlight("panel_area");

20
00:05:49,000 -> 00:05:49,000
const doc = editor0.getDoc();
doc.setValue(
  `const getAngleByGyro = async () => {
        const gyro = await obniz.imu.getGyroWait();
        const followTime = new Date();
        if(Math.abs(gyro.z) > 10) {
            angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
        }
	preTime = followTime;
	preGyro = gyro;
    }\n
    setInterval(async () => {
       	await getAngleByGyro();
        servo.angle(angle);
    }, 10);
}`
);

21
00:06:00,000
doHighlight("video");
preTime = new Date();
preGyro = obniz.imu.getGyroWait().then(() => {
    angle = 90;
    vars.btnAfunc[index] = () => {
        angle = 90;
    }
    gyroInterval = setInterval(async () => {
        const gyro = await obniz.imu.getGyroWait();
        const followTime = new Date();
        if(Math.abs(gyro.z) > 10) {
            angle += ((preGyro.z + gyro.z) * ((followTime.getTime() - preTime.getTime()) / 1000)) / 2;
        }
        servo.angle(angle);
        preTime = followTime;
        preGyro = gyro;
    }, 10);
});