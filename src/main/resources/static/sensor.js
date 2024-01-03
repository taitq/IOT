var sensorData = {
    sensorName: null,
    temp: null,
    time: null,
}
var stompClient = null;

function updateSensorData(sensorName, temp) {
    sensorData.sensorName = sensorName;
    sensorData.time = new Date().toLocaleString();
    sensorData.temp = temp;
}


function fetchTemp() {
    const sensorName = document.getElementById("sensorName").value;
    displaySensorName(sensorName);
    var minTemperature = 20;
    var maxTemperature = 40;
    var randomTemperature = Math.random() * (maxTemperature - minTemperature) + minTemperature;
    randomTemperature = Math.round(randomTemperature * 100) / 100;
    updateSensorData(sensorName, randomTemperature);
    displayTemp(sensorData);
}


function connect() {
    var socket = new SockJS('/sensor');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        updateAndSendData();
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/notify', function (notification) {
            var body = JSON.parse(notification.body);
            if(body.sensorName === sensorData.sensorName) {
                displayNotification(body.sensorName + " :  "+ body.response);
            }
        });
    });
    setInterval(updateAndSendData, 10000);

}

function sendData() {
    stompClient.send('/app/sensor.sendData', {}, JSON.stringify(sensorData));
}

function updateAndSendData() {
    fetchTemp();
    sendData();
}

function displayNotification(message) {
    var notificationsDiv = document.getElementById("notifications");

    // Tạo một phần tử p mới để hiển thị thông báo
    var newNotification = document.createElement("p");
    newNotification.textContent = message;

    // Thêm phần tử p vào phần tử div chứa thông báo
    notificationsDiv.appendChild(newNotification);
}

function displayTemp(sensorData) {
    var tempDiv = document.getElementById("temp");
    var newTemp = document.createElement('p');

    newTemp.textContent = sensorData.time + " :   " + sensorData.temp + '°C' ;
    tempDiv.appendChild(newTemp);
}

function displaySensorName(sensorName) {
    var sensorNameDiv = document.getElementById("sensorNameDisplay");
    sensorNameDiv.textContent =  sensorName;
}


