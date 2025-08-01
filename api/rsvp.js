// qr wedding/api/rsvp.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvp-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.elements["name"].value.trim();
    const attendance = form.elements["attendance"].value;
    const message = form.elements["message"].value.trim();

    try {
      const response = await fetch("/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attendance, message })
      });

      if (response.ok) {
        const result = await response.json();
        window.location.href = result.redirect;
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error!", error.message);
      alert("Something went wrong. Please try again later.");
    }
  });
});
