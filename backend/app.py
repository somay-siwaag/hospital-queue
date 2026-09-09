from flask import Flask, request
from flask_cors import CORS

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

    return {
        "message": "Appointment received",
        "patient_name": patient_name,
        "phone": phone,
        "department": department
    }


if __name__ == "__main__":
    app.run(debug=True)