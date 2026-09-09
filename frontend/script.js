const form = document.getElementById("appointmentForm");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const patientName = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;

    if (!patientName || !phone || !department) {
        alert("Please fill in all fields.");
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/appointments",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    patient_name: patientName,
                    phone: phone,
                    department: department
                })
            }
        );

        if (!response.ok) {
            throw new Error("Server returned an error.");
        }

        const data = await response.json();

        console.log("Backend response:", data);

        /*
         * Put the returned information into
         * our success popup.
         */

        document.getElementById("summaryName").textContent =
            data.patient_name;

        document.getElementById("summaryPhone").textContent =
            data.phone;

        document.getElementById("summaryDepartment").textContent =
            data.department;

        /*
         * Show popup
         */

        document.getElementById("successModal")
            .classList.add("show");

        /*
         * Clear form
         */

        form.reset();

    }

    catch (error) {

        console.error("Backend connection error:", error);

        alert(
            "The appointment could not be submitted. " +
            "Please make sure the Flask backend is running."
        );
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