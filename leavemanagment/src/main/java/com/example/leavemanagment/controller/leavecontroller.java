package com.example.leavemanagment.controller;

import com.example.leavemanagment.dtos.userIdDTO;
import com.example.leavemanagment.leavedetails.leave_details;
import com.example.leavemanagment.service.leaveservice;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/leave")
public class leavecontroller {

    private final leaveservice leaveService;

    public leavecontroller(leaveservice leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/apply")
    public leave_details applyForLeave(@RequestBody leave_details leavedetails) {
        return leaveService.applyLeave(leavedetails);
    }

    @GetMapping("/all")
    public List<leave_details> getAllRequests() {
        return leaveService.getAllRequests();
    }

    @PostMapping("/user")
    public List<leave_details> getByUser(@RequestBody userIdDTO userIdDTO) {
        return leaveService.getRequestsByUserId(userIdDTO.getUserId());
    }

    @PutMapping("/status/{id}")
    public leave_details updateStatus(@PathVariable Long id,
                                      @RequestParam leave_details.LeaveStatus status,
                                      @RequestParam(required = false) String comment) {
        return leaveService.updateStatus(id, status, comment);
    }
}
