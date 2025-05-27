package com.example.leavemanagment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.leavemanagment.service.userService;
import com.example.leavemanagment.users.userdetails;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:4200")
public class usercontroller {

    @Autowired
    private userService serv;

    @PostMapping("/save")
    public ResponseEntity<userdetails> saveUser(@RequestBody userdetails user) {
        try {
            userdetails savedUser = serv.saveUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<userdetails> getUser(@PathVariable Long id) {
        userdetails user = serv.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    public ResponseEntity<List<userdetails>> getAllUsers() {
        return ResponseEntity.ok(serv.getAllUsers());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        serv.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update")
    public ResponseEntity<userdetails> updateUser(@RequestBody userdetails user) {
        try {
            userdetails updatedUser = serv.updateUser(user);
            if (updatedUser == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
