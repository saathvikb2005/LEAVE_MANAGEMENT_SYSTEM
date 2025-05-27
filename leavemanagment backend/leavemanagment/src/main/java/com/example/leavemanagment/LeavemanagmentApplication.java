package com.example.leavemanagment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {
    SecurityAutoConfiguration.class
})
public class LeavemanagmentApplication {

    public static void main(String[] args) {
        SpringApplication.run(LeavemanagmentApplication.class, args);
    }
}
