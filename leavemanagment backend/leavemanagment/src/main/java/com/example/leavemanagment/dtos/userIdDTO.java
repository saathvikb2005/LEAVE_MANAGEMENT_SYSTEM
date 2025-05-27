package com.example.leavemanagment.dtos;

public class userIdDTO {
    private Long userId;

    public userIdDTO() {}

    public userIdDTO(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
