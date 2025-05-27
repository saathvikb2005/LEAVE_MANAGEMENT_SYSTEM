package com.example.leavemanagment.service;

import com.example.leavemanagment.leavedetails.leave_details;
import com.example.leavemanagment.repositories.leaveRepo;
import com.example.leavemanagment.repositories.userRepo;
import com.example.leavemanagment.users.userdetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class leaveservice {

    private final leaveRepo leaveRepo;
    private final userRepo userRepo;

    public leaveservice(leaveRepo leaveRepo, userRepo userRepo) {
        this.leaveRepo = leaveRepo;
        this.userRepo = userRepo;
    }

    public leave_details applyLeave(leave_details leavedetails) {
        Long userId = leavedetails.getUser().getUserId();

        // Fetch attached user
        userdetails attachedUser = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Set attached user before saving
        leavedetails.setUser(attachedUser);

        return leaveRepo.save(leavedetails);
    }

    public List<leave_details> getAllRequests() {
        return leaveRepo.findAll();
    }

    public List<leave_details> getRequestsByUser(userdetails user) {
        return leaveRepo.findByUser(user);
    }

    // New method to fetch leave requests by userId directly
    public List<leave_details> getRequestsByUserId(Long userId) {
        // Fetch userdetails object for given userId
        userdetails user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return leaveRepo.findByUser(user);
    }

    public leave_details updateStatus(Long id, leave_details.LeaveStatus status, String managerComment) {
        leave_details request = leaveRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));
        request.setStatus(status);
        request.setManagerComment(managerComment);
        return leaveRepo.save(request);
    }
}
