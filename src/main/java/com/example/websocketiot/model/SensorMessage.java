package com.example.websocketiot.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SensorMessage {
    private String sensorName;
    private double temp;
    private String time;

    public SensorMessage(String sensorName, double temp, String time) {
        this.sensorName = sensorName;
        this.temp = temp;
        this.time = time;
    }
}

