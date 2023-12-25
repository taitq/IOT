package com.example.websocketiot.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Temperature {
    Double temp;
    LocalDateTime time;
    public Temperature() {
        temp = generateRandomTemperature();
        time = LocalDateTime.now();
    }
    private static double generateRandomTemperature() {
        // Logic to generate a random temperature between 30 and 40
        return 30 + Math.random() * 10;
    }
}

