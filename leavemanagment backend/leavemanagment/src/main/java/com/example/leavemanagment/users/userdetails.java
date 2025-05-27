package com.example.leavemanagment.users;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class userdetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String username;
    private String password;
    private String role;
    private String name;
    private String email;
    private String phone;
    private String department;

    // Self-referencing relationship (many users can have one manager)
    @ManyToOne
    @JoinColumn(name = "managerId", referencedColumnName = "userId", nullable = true)
    @JsonIgnoreProperties({"manager"}) // Avoid infinite recursion during JSON serialization
    private userdetails manager;

    @Version
    private Integer version; // Used for optimistic locking

    public userdetails() {
    }

    public userdetails(String username, String password, String role, String name,
                       String email, String phone, String department, userdetails manager) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.manager = manager;
    }

    // Getters and Setters

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public userdetails getManager() {
        return manager;
    }

    public void setManager( userdetails manager) {
        this.manager = manager;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }
}
