package com.example.leavemanagment.repositories;

import com.example.leavemanagment.users.userdetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface userRepo extends JpaRepository<userdetails, Long> {
    // Add custom query methods if needed
}


