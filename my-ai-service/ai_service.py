from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import holidays

app = Flask(__name__)
CORS(app)

# Use Indian holidays
indian_holidays = holidays.India()

def is_holiday(date_str):
    date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
    return date_obj in indian_holidays

def generate_recommendation(total_employees, employees_on_leave, applied_leave):
    start_date = applied_leave.get('startDate')
    end_date = applied_leave.get('endDate')
    reason = applied_leave.get('reason', '')

    leave_start = datetime.strptime(start_date, "%Y-%m-%d").date()
    leave_end = datetime.strptime(end_date, "%Y-%m-%d").date()

    days_requested = (leave_end - leave_start).days + 1

    # Business rules
    if is_holiday(start_date) or is_holiday(end_date):
        return "The requested leave overlaps with a public holiday."

    if employees_on_leave / total_employees > 0.3:
        return "High number of employees already on leave. Consider rejecting."

    if days_requested > 5:
        return "Long leave requested. Review carefully before approving."

    if "sick" in reason.lower():
        return "Leave due to illness. Consider approving with a doctor's note."

    if "vacation" in reason.lower() or "personal" in reason.lower():
        return "Leave appears personal. Check project impact before approval."

    return "No red flags. Leave request seems reasonable."

@app.route('/api/ai/user-recommend', methods=['POST'])
def user_recommendation():
    data = request.json
    total_employees = data.get("total_employees", 0)
    employees_on_leave = data.get("employees_on_leave", 0)
    applied_leave = data.get("applied_leave", {})

    recommendation = generate_recommendation(
        total_employees,
        employees_on_leave,
        applied_leave
    )

    return jsonify({"recommendation": recommendation})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
