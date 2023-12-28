var sensorData = {
    id: null,
    time: null,
    temp: null,
}

var stompClient = null;

function updateSensorData(id, temp) {
    sensorData.id = id;
    sensorData.time = Date.now();
    sensorData.temp = temp;
}

function populateTemp(temp) {
    var x = document.getElementById("fetched-temp");
    x.innerHTML = "Fetched temperature is: " + temp;
}

function fetchTemp(sensorID) {
    var minTemperature = 36;
    var maxTemperature = 40;

    // Generate a random temperature between 30 and 40
    var randomTemperature = Math.random() * (maxTemperature - minTemperature) + minTemperature;

    // Round the temperature to two decimal places
    randomTemperature = Math.round(randomTemperature * 100) / 100;
    populateTemp(randomTemperature);
    updateSensorData(sensorID, randomTemperature);
}

function sendData(){
    var socket = new SockJS('/sensor');
    stompClient = Stomp.over(socket);
    console.log("Socket connected!");
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
         stompClient.send('/app/sensor', {}, JSON.stringify(sensorData));
         console.log('Sent sensor data: ' + JSON.stringify(sensorData));

         stompClient.subscribe('/topic/messages', function(message) {
         // TODO: Get message from gateway
            console.log("MESS: ", message, message.body);
         });
    });
}
