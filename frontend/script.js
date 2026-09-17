
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("appointmentForm");

    const modal = document.getElementById("successModal");

    const summaryName = document.getElementById("summaryName");
    const summaryDepartment = document.getElementById("summaryDepartment");
    const summaryPhone = document.getElementById("summaryPhone");
    const summaryQueue = document.getElementById("summaryQueue");

    const liveQueueNumber = document.getElementById("liveQueueNumber");

    if (!form) {
        console.error("Appointment form not found.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const patientName = document
            .getElementById("name")
            .value.trim();

        const phone = document
            .getElementById("phone")
            .value.trim();

        const department = document
            .getElementById("department")
            .value;

        if (!patientName || !phone || !department) {
            alert("Please fill in all fields.");
            return;
        }

        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
        }

        try {
            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    patient_name: patientName,
                    phone: phone,
                    department: department
                })
            });

            const data = await response.json();

            console.log("Backend response:", data);

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to submit appointment."
                );
            }

            // Get appointment ID from backend
            const queueNumber = data.appointment_id;

            console.log("Queue Number:", queueNumber);

            // Update queue number
            if (summaryQueue) {
                summaryQueue.textContent = queueNumber;
            }

            if (liveQueueNumber) {
                liveQueueNumber.textContent = queueNumber;
            }

            // Update patient details
            if (summaryName) {
                summaryName.textContent =
                    data.patient_name || patientName;
            }

            if (summaryDepartment) {
                summaryDepartment.textContent =
                    data.department || department;
            }

            if (summaryPhone) {
                summaryPhone.textContent =
                    data.phone || phone;
            }

            // Display success modal
            if (modal) {
                modal.style.display = "flex";
                modal.classList.add("active");
            }

            form.reset();

        } catch (error) {
            console.error("Appointment error:", error);
            alert(error.message || "Something went wrong.");

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Confirm appointment →";
            }
        }
    });
});

// Close modal
function closeModal() {
    const modal = document.getElementById("successModal");

    if (modal) {
        modal.style.display = "none";
        modal.classList.remove("active");
    }
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
    const modal = document.getElementById("successModal");

    if (event.target === modal) {
        closeModal();
    }
});
