package com.example.websocketiot.controller;

import com.example.websocketiot.model.Notify;
import com.example.websocketiot.model.SensorMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GatewayController {
    @MessageMapping("/sensor.sendData")
    @SendTo("/topic/temperatures")
    public SensorMessage send(@Payload SensorMessage sensorMessage ) {
        return sensorMessage;
    }

    @MessageMapping("/sensor.sendNotify")
    @SendTo("/topic/notify")
    public Notify send(@Payload Notify notify) {
        return notify;
    }

}
