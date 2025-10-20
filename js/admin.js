// --- Verificar si hay usuario logueado y si es admin ---
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
  alert("Acceso denegado. Solo el administrador puede entrar aquí.");
  window.location.href = "index.html";
}

// --- Cargar lista de usuarios ---
const users = JSON.parse(localStorage.getItem("users")) || [];
const tbody = document.querySelector("#userTable tbody");

// Renderizar tabla
function renderUsers() {
  tbody.innerHTML = "";
  users.forEach((u, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${u.username}</td>
      <td>${u.fullName}</td>
      <td>${u.subject}</td>
      <td>${u.role}</td>
      <td>
        ${u.role !== "admin" ? `<button class="action-btn promote-btn" onclick="promoteUser(${index})">Promover</button>` : ""}
        ${u.username !== "Tetracable" ? `<button class="action-btn delete-btn" onclick="deleteUser(${index})">Eliminar</button>` : ""}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- Función para promover usuario ---
function promoteUser(index) {
  users[index].role = "admin";
  localStorage.setItem("users", JSON.stringify(users));
  alert(`${users[index].username} ahora es administrador.`);
  renderUsers();
}

// --- Función para eliminar usuario ---
function deleteUser(index) {
  if (confirm(`¿Eliminar la cuenta de ${users[index].username}?`)) {
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers();
  }
}

// --- Cerrar sesión ---
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

// Render inicial
renderUsers();
