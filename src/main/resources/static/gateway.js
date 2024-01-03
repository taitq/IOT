var stompClient = null;

var sensorDataList = {};
var setSensor = new Set();
var listDisconnectSensor = [];
var listConnectSensor=[];
var chart; // Đối tượng đồ thị

// Hàm khởi tạo đồ thị
function initializeChart() {
    chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,
        zoomType: "x",
        panEnabled: true,
        title: {
            text: "Temperature Data from Sensors"
        },
        axisY: {
            title: "Temperature ( °C )",
            maximum: 40, // Giá trị lớn nhất trên trục y
            minimum: 0,  // Giá trị nhỏ nhất trên trục y
            stripLines: [
                {
                    value: 35,
                    label: "Critical Temperature",
                    labelAlign: "near",
                    labelBackgroundColor: "red",
                    labelFontColor: "white",
                    lineColor: "red",
                    showOnTop: true
                }
            ]

        },
        legend: {
            verticalAlign: "top",
            horizontalAlign: "center",
            fontSize: 14,
            fontWeight: "bold",
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        toolTip: {
            shared: true,
          /*  contentFormatter: function (e) {
                var content = "<strong>Time:</strong> " + e.entries[0].dataPoint.x.toLocaleString() + "<br>";
                for (var i = 0; i < e.entries.length; i++) {
                    var sensorName = e.entries[i].dataSeries.name;
                    var lastSensorData = sensorDataList[sensorName][sensorDataList[sensorName].length - 1];
                    content += "<strong>" + sensorName + ":</strong> " + lastSensorData.temp + "°C<br>";
                }
                return content;
            }*/
        },
        data: [{
            type: "spline",
            showInLegend: true,
            name: "Dummy",
            dataPoints: [],
            xValueFormatString: "YYYY-MM-DD HH:mm:ss", // Định dạng thời gian hiển thị trên trục X
        }]
    });
}

// Hàm cập nhật đồ thị
function updateChart() {
    // Duyệt qua mỗi sensor trong danh sách
    for (var sensorName in sensorDataList) {
        if (sensorDataList.hasOwnProperty(sensorName)) {
            // Kiểm tra xem chuỗi dữ liệu của sensor đã được thêm vào đồ thị hay chưa
            var sensorDataExists = false;
            // Nếu chuỗi dữ liệu của sensor chưa tồn tại, thêm vào đồ thị
            if (!sensorDataExists) {
                chart.options.data.push({
                    type: "spline",
                    showInLegend: true,
                    name: sensorName,
                    dataPoints: [],
                    line: {connectNullData: true}
                });
            }
            for (var i = 0; i < chart.options.data.length; i++) {
                if (chart.options.data[i].name === sensorName) {
                    sensorDataExists = true;
                    // Thêm một điểm mới vào line hiện tại
                    var temp = sensorDataList[sensorName].map(function (sensorData) {
                        return sensorData.temp;
                    });
                    var time = sensorDataList[sensorName].map(function (sensorData) {
                        return sensorData.time;
                    });
                    var isHighTemperature = temp[temp.length - 1] > 35;
                    chart.options.data[i].dataPoints.push({
                        x: new Date(time[time.length - 1]),
                        y: temp[temp.length - 1],
                       // markerType: isHighTemperature ? "circle" : "none",  // Use a circle marker if temperature is high
                        markerColor: isHighTemperature ? "red" : null  // Set marker color to red if temperature is high
                    });
                    break;
                }
            }


        }
    }

    // Render đồ thị
    chart.render();
}


function connect() {
    var socket = new SockJS('/sensor');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/temperatures', function (notifications) {
            var body = JSON.parse(notifications.body);
            var sensorName = body.sensorName;
            var temp = body.temp;
            var time = body.time;
            // If a temperature disconnect
            if(temp === 0 && time === "null") {
                var parts = sensorName.split(" ");
                var ssName = parts[0];
                setSensor.delete(ssName);
                listDisconnectSensor.push(sensorName);
                updateSensorList();
            }
            else {
                if(!setSensor.has(sensorName)) {
                    setSensor.add(sensorName);
                    var info = sensorName + " connected at " + time;
                    listConnectSensor.push(info);
                }
                updateSensorList();
                var sensorData = {
                    time: time,
                    temp: temp
                }

                if (sensorName in sensorDataList) {
                    sensorDataList[sensorName].push(sensorData);

                } else {
                    var sensorNameList = [];
                    sensorNameList.push(sensorData);
                    sensorDataList[sensorName] = sensorNameList;
                }

                // Nếu đồ thị chưa được khởi tạo, thì khởi tạo
                if (!chart) {
                    initializeChart();
                }

                // Cập nhật đồ thị sau khi có dữ liệu mới
                updateChart();

                var notification = {
                    sensorName: sensorName,
                    response: "At " + sensorData.time + " temperature: " + sensorData.temp + "> 35°C, " +
                        " Turn on air condition"
                }
                if (Number(body.temp > 35)) {
                    sendNotify(notification)
                }
            }

        });
    });
}


function sendNotify(notify) {
    stompClient.send("/app/sensor.sendNotify", {}, JSON.stringify(notify))
}

connect();


// Hàm xử lý khi click vào chú giải để ẩn/hiện chuỗi dữ liệu
function toggleDataSeries(e) {
    e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible);
    chart.render();
}


// Hàm cập nhật danh sách sensor
function updateSensorList() {

    // Dang Ket noi
    var sensorConnectingListItems = document.getElementById('sensorConnectingListItems');
    sensorConnectingListItems.innerHTML = ''; // Xóa danh sách hiện tại

    // Duyệt qua mỗi sensor trong set và thêm vào danh sách
    setSensor.forEach(function(sensor) {
        var listItem = document.createElement('li');
        listItem.textContent = sensor;
        sensorConnectingListItems.appendChild(listItem);
    });


    // da ket noi
    var sensorConnectedListItems = document.getElementById('sensorConnectedListItems');
    sensorConnectedListItems.innerHTML = ''; // Xóa danh sách hiện tại

    // Duyệt qua mỗi sensor trong set và thêm vào danh sách
    listConnectSensor.forEach(function(sensor) {
        var listItem = document.createElement('li');
        listItem.textContent = sensor;
        sensorConnectedListItems.appendChild(listItem);
    });


    // ngat ket noi
    var sensorDisconnectListItems = document.getElementById('sensorDisconnectListItems');
    sensorDisconnectListItems.innerHTML = ''; // Xóa danh sách hiện tại

    // Duyệt qua mỗi sensor trong set và thêm vào danh sách
    listDisconnectSensor.forEach(function(sensor) {
        var listItem = document.createElement('li');
        listItem.textContent = sensor;
        sensorDisconnectListItems.appendChild(listItem);
    });
}
