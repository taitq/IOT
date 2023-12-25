package com.example.websocketiot;

import com.example.websocketiot.model.Temperature;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandler;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class IoTNode {

    private static final String SERVER_URL = "ws://localhost:8080/temp";
    private static final String SENSOR_DESTINATION = "/app/sensor";

    private static StompSession stompSession;

    public static void main(String[] args) {
        setupWebSocketClient();

        ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();
        executorService.scheduleAtFixedRate(IoTNode::sendRandomTemperature, 0, 10, TimeUnit.SECONDS);
    }

    private static void setupWebSocketClient() {
        WebSocketStompClient stompClient = new WebSocketStompClient(new StandardWebSocketClient());
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        StompSessionHandler sessionHandler = new StompSessionHandlerAdapter() {
            @Override
            public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
                System.out.println("Connected to the server");
                stompSession = session;
            }
        };

        stompClient.connect(SERVER_URL, sessionHandler);
    }

    private static void sendRandomTemperature() {
        if (stompSession != null && stompSession.isConnected()) {
            Temperature sensorData = new Temperature();
            stompSession.send(SENSOR_DESTINATION, sensorData);
            System.out.println("Sent sensor data: " + sensorData);
        }
    }

}

