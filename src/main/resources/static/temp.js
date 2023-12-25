var stompClient = null;

$(document).ready(function() {
    connect();
});


function connect() {
    var socket = new SockJS('/sensor');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        // Start sending random temperatures every 10 seconds
        setInterval(sendRandomTemperature, 10000);
    });
}

function sendRandomTemperature() {
    if (stompClient != null && stompClient.connected) {
        var minTemperature = 30;
        var maxTemperature = 40;

        // Generate a random temperature between 30 and 40
        var randomTemperature = Math.random() * (maxTemperature - minTemperature) + minTemperature;

        // Round the temperature to two decimal places
        randomTemperature = Math.round(randomTemperature * 100) / 100;
        var currentDate = new Date();
        var sensorData = {
            time: currentDate.getTime(),
            temp: randomTemperature
        };

        stompClient.send('/app/sensor', {}, JSON.stringify(sensorData));
        console.log('Sent sensor data: ' + JSON.stringify(sensorData));

        displaySensorData(sensorData);
    }
}

function displaySensorData(sensorData) {
    // Tạo một chuỗi HTML để hiển thị thông tin cảm biến
    var htmlString = '<p>Time: ' + new Date(sensorData.time) + '</p>';
    htmlString += '<p>Temperature: ' + sensorData.temp + ' °C</p>';

    // Lấy phần tử HTML để hiển thị và cập nhật nó
    var sensorDataDisplay = $('#sensorDataDisplay');
    sensorDataDisplay.html(htmlString);
}

$(function () {
    connect();
});
