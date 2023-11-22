let sensorData = {
    "temperature": 25,
    "humidity": 50,
    "pressure": 1013,
    "light": 500,
    "magnetic": 50,
    "moisture": 10,
    "acceleration": 0,
    "soilMoisture": 30,
    "color": 0,
    "co2": 400,
    "ph": 7,
    "pm25": 0,
    "windSpeed": 0,
    "radiation": 0,
    "sound": 0,
    "ultrasonic": 0,
    "humanDetection": 0,
    "touch": 0,
    "heartRate": 60,

    // Initialize other sensors...
};

const valueSuffixes = {
    "temperature": "°C",
    "humidity": "%",
    "pressure": " hPa",
    "light": " lx",
    "magnetic": " μT",
    "moisture": "%",
    "acceleration": " m/s²",
    "soilMoisture": "%",
    "color": "", // 颜色可能不需要单位
    "co2": " ppm",
    "ph": "",
    "pm25": " μg/m³",
    "windSpeed": " km/h",
    "radiation": " μSv/h",
    "sound": " dB",
    "ultrasonic": " cm",
    "humanDetection": "", // 可以是 "未检测" / "已检测"
    "touch": "", // 可以是 "未触摸" / "已触摸"
    "heartRate": " bpm",

    // ... 其他传感器的单位 ...
};

// const url = 'ws://mqtt-dashboard.leicheng42.com:8083/mqtt'
const url = 'wss://mqtt-dashboard.leicheng42.com:8084/mqtt'
const client = mqtt.connect(url, {
    clean: true,
    connectTimeout: 4000,
    clientId: '',
    username: '',
    password: '',
});


// Function to initialize MQTT connection
function initMQTT() {
    // Handle connection and message events
    client.on('connect', function () {
        console.log('Connected')
        // 订阅主题
        client.subscribe('SensorSimulator', function (err) {
            if (!err) {
                // 发布消息
                client.publish('SensorSimulator', 'SensorSimulator Hello mqtt!')
            }
        })
    })

    // 接收消息
    client.on('message', function (topic, message) {
        // message is Buffer
        console.log(message.toString())
    })

}

// Function to send sensor data
function sendSensorData(sensorData) {
    const jsonData = JSON.stringify(sensorData);
    // Publish jsonData to a MQTT topic
    client.publish('SensorSimulator', jsonData)
}

// Function to handle sensor value changes
function handleSensorChange(sensorId, value) {
    let valueDisplay = document.getElementById(sensorId + 'Value');
    let valueSuffix = valueSuffixes[sensorId] || '';
    valueDisplay.textContent = value + valueSuffix;
    sendSensorData({ sensorId, value });
}


document.addEventListener('DOMContentLoaded', function () {
    // 为每个滑块添加事件监听器
    document.querySelectorAll('input[type=range]').forEach(function (slider) {
        slider.addEventListener('input', function () {
            handleSensorChange(slider.id, slider.value);
        });
    });

    // 特别处理颜色选择器
    const colorPicker = document.getElementById('color');
    colorPicker.addEventListener('input', function () {
        let valueDisplay = document.getElementById('colorValue');
        valueDisplay.textContent = colorPicker.value;
        handleSensorChange(colorPicker.id, colorPicker.value);
    });

    // 特别处理复选框
    document.querySelectorAll('input[type=checkbox]').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            let valueDisplay = document.getElementById(checkbox.id + 'Value');
            valueDisplay.textContent = checkbox.checked ? '已检测' : '未检测'; // 或者对于触摸传感器，使用 '已触摸' / '未触摸'
            handleSensorChange(checkbox.id, checkbox.checked);
        });
    });
});


// Initialize MQTT connection
initMQTT();
