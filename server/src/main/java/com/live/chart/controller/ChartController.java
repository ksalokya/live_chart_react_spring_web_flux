package com.live.chart.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@RestController
@RequestMapping("/sse")
public class ChartController {
    private static final int ARRAY_SIZE = 10;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private String[] generateRandomArray(Random random) {
        LocalDateTime timestamp = LocalDateTime.now();
        String timestampString = timestamp.format(DATE_FORMATTER);

        String[] randomNumber = new String[2];
        randomNumber[0] = String.valueOf(random.nextInt(50));
        randomNumber[1] = timestampString;

        return randomNumber;
    }


    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String[]> getRandomNumbers() {
        Random random = new Random();
        return Flux.interval(Duration.ofSeconds(2))
                .map(sequence -> generateRandomArray(random));
    }
}
