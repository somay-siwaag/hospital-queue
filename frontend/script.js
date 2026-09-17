
const form = document.getElementById("appointmentForm");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const patientName = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;

    const submitButton = form.querySelector(".submit-button");

    if (!patientName || !phone || !department) {
        alert("Please fill in all fields.");
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = "Submitting...";

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

        if (!response.ok) {
            throw new Error("Server returned an error.");
        }

        const data = await response.json();

        // Get the real appointment ID from the backend
        const queueNumber = data.appointment_id;

        // Display queue number in the success modal
        document.getElementById("summaryQueue").textContent =
            queueNumber || "—";

        // Display queue number in the hero preview
        document.getElementById("liveQueueNumber").textContent =
            queueNumber || "—";

        // Display patient details
        document.getElementById("summaryName").textContent =
            data.patient_name || patientName;

        document.getElementById("summaryPhone").textContent =
            data.phone || phone;

        document.getElementById("summaryDepartment").textContent =
            data.department || department;

        // Show success modal
        document.getElementById("successModal")
            .classList.add("show");

        // Reset form
        form.reset();

    } catch (error) {
        console.error("Backend connection error:", error);

        alert(
            "The appointment could not be submitted. " +
            "Please try again."
        );

    } finally {
        submitButton.disabled = false;

        submitButton.innerHTML =
            'Confirm appointment <span>→</span>';
    }
});


function closeModal() {
    document.getElementById("successModal")
        .classList.remove("show");
}


function scrollToAppointment() {
    document.getElementById("appointment")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// Close modal when clicking outside the popup
window.addEventListener("click", function (event) {
    const modal = document.getElementById("successModal");

    if (event.target === modal) {
        closeModal();
    }
});
