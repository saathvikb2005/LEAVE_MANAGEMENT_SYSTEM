package com.example.leavemanagment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.leavemanagment.repositories.userRepo;
import com.example.leavemanagment.users.userdetails;

@Service
@Transactional
public class userService {

    @Autowired
    private userRepo repo;

    // Save a new user with optional manager ID
    public userdetails saveUser(userdetails user) {
        // Handle manager assignment
        if (user.getManager() != null && user.getManager().getUserId() != null) {
            userdetails manager = repo.findById(user.getManager().getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("Manager not found with ID: " + user.getManager().getUserId()));
            user.setManager(manager);
        } else {
            user.setManager(null); // In case it's explicitly null
        }

        return repo.save(user);
    }

    public userdetails getUserById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public List<userdetails> getAllUsers() {
        return repo.findAll();
    }

    public void deleteUser(Long id) {
        repo.deleteById(id);
    }

    public userdetails updateUser(userdetails user) {
        userdetails existingUser = getUserById(user.getUserId());
        if (existingUser == null) {
            return null;
        }

        existingUser.setUsername(user.getUsername());
        existingUser.setPassword(user.getPassword());
        existingUser.setRole(user.getRole());
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());
        existingUser.setDepartment(user.getDepartment());

        // Handle manager update
        if (user.getManager() != null && user.getManager().getUserId() != null) {
            userdetails manager = getUserById(user.getManager().getUserId());
            if (manager != null) {
                existingUser.setManager(manager);
            } else {
                throw new IllegalArgumentException("Manager with ID " + user.getManager().getUserId() + " not found");
            }
        } else {
            existingUser.setManager(null);
        }

        return repo.save(existingUser);
    }
}
