// qr wedding/api/messages.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("messages-container");

  fetch("/messages")
    .then((res) => res.json())
    .then((data) => {
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No messages yet. Be the first to leave one!</p>";
        return;
      }

      data.forEach((entry, index) => {
        const box = document.createElement("div");
        box.className = "message-box";

        const label = document.createElement("p");
        label.className = "anon-label";
        label.textContent = `Guest ${index + 1} says:`;

        const msg = document.createElement("blockquote");
        msg.textContent = entry.message;

        box.appendChild(label);
        box.appendChild(msg);
        container.appendChild(box);
      });
    })
    .catch((err) => {
      container.innerHTML = "<p style='color:red;'>Failed to load messages.</p>";
      console.error(err);
    });
});
