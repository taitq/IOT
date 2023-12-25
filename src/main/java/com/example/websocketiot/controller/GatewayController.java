package com.example.websocketiot.controller;

import com.example.websocketiot.model.Temperature;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

public class GatewayController {

    @MessageMapping("/sensor")
    @SendTo("/topic/temperatures")
    public Temperature handleSensorData(Temperature sensorData) {
        // Process incoming sensor data
        System.out.println("Received sensor data: " + sensorData);

        // Example logic: If temperature is greater than 35, send a notification
        if (sensorData.getTemp() > 35) {
            sendNotification("Turn on air conditioning");
        }
        return sensorData;
    }

    private void sendNotification(String message) {
        System.out.println("Sending notification: " + message);
    }
}
