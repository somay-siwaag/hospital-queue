from flask import Flask, request
from flask_cors import CORS
from db import get_db_connection

app = Flask(__name__)

CORS(app)


@app.route("/api/health")
def health():
    return {"status": "healthy"}


@app.route("/api/appointments", methods=["POST"])
def create_appointment():

    data = request.get_json()

    patient_name = data.get("patient_name")
    phone = data.get("phone")
    department = data.get("department")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO appointments
        (patient_name, phone, department)
        VALUES (%s, %s, %s)
        RETURNING id
        """,
        (patient_name, phone, department)
    )

    appointment_id = cursor.fetchone()[0]

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Appointment created successfully",
        "appointment_id": appointment_id,
        "patient_name": patient_name,
        "phone": phone,
        "department": department
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
