document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("appointmentForm");

    const modal = document.getElementById("confirmationModal");
    const closeModal = document.getElementById("closeModal");
    const doneButton = document.getElementById("doneButton");

    const summaryPatient = document.getElementById("summaryPatient");
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

        const patientName =
            document.getElementById("patientName")?.value.trim() ||
            document.querySelector('[name="patient_name"]')?.value.trim();

        const phone =
            document.getElementById("phone")?.value.trim() ||
            document.querySelector('[name="phone"]')?.value.trim();

        const department =
            document.getElementById("department")?.value ||
            document.querySelector('[name="department"]')?.value;

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

            // Support different backend response field names
            const queueNumber =
                data.appointment_id ||
                data.queue_number ||
                data.id ||
                "—";

            // Update confirmation details
            if (summaryPatient) {
                summaryPatient.textContent =
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

            if (summaryQueue) {
                summaryQueue.textContent = queueNumber;
            }

            if (liveQueueNumber) {
                liveQueueNumber.textContent = queueNumber;
            }

            // Display confirmation modal
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
                submitButton.textContent = "Book Appointment";
            }
        }
    });

    // Close modal using close icon
    if (closeModal) {
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
            modal.classList.remove("active");
        });
    }

    // Close modal using Done button
    if (doneButton) {
        doneButton.addEventListener("click", () => {
            modal.style.display = "none";
            modal.classList.remove("active");
        });
    }

    // Close modal by clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            modal.classList.remove("active");
        }
    });
});
