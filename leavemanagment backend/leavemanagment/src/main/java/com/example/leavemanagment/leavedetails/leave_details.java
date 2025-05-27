package com.example.leavemanagment.leavedetails;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;
import com.example.leavemanagment.users.userdetails;

@Entity
public class leave_details {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leaveId;
    private Date AppliedDate = new Date();

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private com.example.leavemanagment.users.userdetails user;

    @Column(length = 50, nullable = false)
    private String leaveType;

    private LocalDate startDate;
    private LocalDate endDate;

    @Lob
    private String reason;

    @Enumerated(EnumType.STRING)
    private LeaveStatus status = LeaveStatus.PENDING;


    @Lob
    private String managerComment;

    public enum LeaveStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    public leave_details() {}

    public  leave_details(userdetails user, String leaveType, LocalDate startDate, LocalDate endDate,
                        String reason, LeaveStatus status, String managerComment) {
        this.user = user;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
        this.status = status;
        this.managerComment = managerComment;
        
    }

	public Long getLeaveId() {
		return leaveId;
	}

	public void setLeaveId(Long leaveId) {
		this.leaveId = leaveId;
	}

	public Date getAppliedDate() {
		return AppliedDate;
	}

	public void setAppliedDate(Date appliedDate) {
		AppliedDate = appliedDate;
	}

	public com.example.leavemanagment.users.userdetails getUser() {
		return user;
	}

	public void setUser(com.example.leavemanagment.users.userdetails user) {
		this.user = user;
	}

	public String getLeaveType() {
		return leaveType;
	}

	public void setLeaveType(String leaveType) {
		this.leaveType = leaveType;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public LeaveStatus getStatus() {
		return status;
	}

	public void setStatus(LeaveStatus status) {
		this.status = status;
	}

	public String getManagerComment() {
		return managerComment;
	}

	public void setManagerComment(String managerComment) {
		this.managerComment = managerComment;
	}
}
