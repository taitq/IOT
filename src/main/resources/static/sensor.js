var sensorData = {
    sensorName: null,
    temp: null,
    time: null,
}
var stompClients = [];
var testName

function updateSensorData(sensorName, temp) {
    sensorData.sensorName = sensorName;
    sensorData.time = new Date().toLocaleString();
    sensorData.temp = temp;
}


function fetchTemp(id) {
    testName = document.getElementById("sensorName").value;
    const sensorName = testName + id;
    displaySensorName(testName);
    var minTemperature = 20;
    var maxTemperature = 40;
    var randomTemperature = Math.random() * (maxTemperature - minTemperature) + minTemperature;
    randomTemperature = Math.round(randomTemperature * 100) / 100;
    updateSensorData(sensorName, randomTemperature);
    displayTemp(sensorData);
}

function connectMultipleTimes() {
    const quantity = parseInt(document.getElementById("quantity").value, 10);
    for (let i = 0; i < quantity; i++) {
        setTimeout(function () {
            // Đoạn mã kết nối WebSocket
            var socket = new SockJS('/sensor');
            var stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                updateAndSendData(stompClient, i);
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/notify', function (notification) {
                    var body = JSON.parse(notification.body);
                    if (body.sensorName === sensorData.sensorName) {
                        displayNotification(body.sensorName + " :  " + body.response);
                    }
                });
            });
            stompClients.push(stompClient);
        }, i * 100); // Tạo một khoảng thời gian 100ms giữa mỗi kết nối
        
        setInterval(hanldeSendData, 10000);
    }
}

function hanldeSendData() {
    for (let i = 0; i < stompClients.length; i++){
        updateAndSendData(stompClients[i], i)
    }
}


function connect() {
    var socket = new SockJS('/sensor');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        updateAndSendData(stompClient, 0);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/notify', function (notification) {
            var body = JSON.parse(notification.body);
            if(body.sensorName === sensorData.sensorName) {
                displayNotification(body.sensorName + " :  "+ body.response);
            }
        });
    });
    setInterval(updateAndSendData(stompClient, 0), 10000);

}

function sendData(stompClient) {
    stompClient.send('/app/sensor.sendData', {}, JSON.stringify(sensorData));
}

function updateAndSendData(stompClient, id) {
    fetchTemp(id);
    sendData(stompClient);
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


