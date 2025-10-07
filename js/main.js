// Toggle mobile menu
const toggleBtn = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggleBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// Contact form validation
const form = document.getElementById("contactForm");
const status = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    status.textContent = "All fields are required.";
    status.style.color = "red";
    return;
  }

  status.textContent = "Message sent successfully!";
  status.style.color = "green";
  form.reset();
});
