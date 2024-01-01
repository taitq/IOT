package com.example.websocketiot.model;

import lombok.Data;

@Data
public class Notify {
    private String sensorName;
    private String response;

    public Notify(String sensorName, String response) {
        this.sensorName = sensorName;
        this.response = response;
    }
}
