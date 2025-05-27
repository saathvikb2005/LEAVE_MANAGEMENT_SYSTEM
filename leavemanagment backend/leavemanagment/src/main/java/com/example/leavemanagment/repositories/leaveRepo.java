package com.example.leavemanagment.repositories;

import com.example.leavemanagment.leavedetails.leave_details;
import com.example.leavemanagment.users.userdetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface leaveRepo extends JpaRepository<leave_details, Long> {
    List<leave_details> findByUser(userdetails user);
}
