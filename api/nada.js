document.getElementById("adminForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`/admin/csv?password=${encodeURIComponent(password)}`);
    if (!response.ok) {
      document.getElementById("csvOutput").hidden = false;
      document.getElementById("csvOutput").textContent = "❌ Incorrect password or error fetching CSV.";
      return;
    }
    const data = await response.text();
    document.getElementById("csvOutput").hidden = false;
    document.getElementById("csvOutput").textContent = data;
  } catch (error) {
    document.getElementById("csvOutput").hidden = false;
    document.getElementById("csvOutput").textContent = "❌ An error occurred.";
  }
});
