 // Simulación de base de datos con localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
        let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
        let currentUser   = null;
        let editingAnnouncementId = null; // Para editar anuncios

// Crear usuario admin si no existe
const adminExists = users.some(u => u.username === "Tetracable" && u.role === "admin");
if (!adminExists) {
  users.push({
    username: "Tetracable",
    fullName: "Administrador del Sistema",
    subject: "General",
    password: "p0liN3t",
    role: "admin"
  });
  localStorage.setItem("users", JSON.stringify(users));
}
       // 🔹 Banner carrusel
const bannerImages = document.querySelectorAll('.banner-images img');
let currentIndex = 0;

function showImage(index) {
  bannerImages.forEach((img, i) => {
    img.classList.toggle('active', i === index);
  });
}

// Botones de navegación
document.getElementById('prevBtn').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + bannerImages.length) % bannerImages.length;
  showImage(currentIndex);
});

document.getElementById('nextBtn').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % bannerImages.length;
  showImage(currentIndex);
});

// 🔁 Rotación automática cada 5 segundos
setInterval(() => {
  currentIndex = (currentIndex + 1) % bannerImages.length;
  showImage(currentIndex);
}, 5000);



        // Función para guardar datos
        function saveData() {
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('assignments', JSON.stringify(assignments));
            localStorage.setItem('announcements', JSON.stringify(announcements));
        }

        // Inicializar IDs para anuncios existentes (por compatibilidad)
        function initializeAnnouncementIds() {
            announcements.forEach((ann, index) => {
                if (!ann.id) {
                    ann.id = Date.now() + index;
                }
            });
            saveData();
        }

        // Mostrar/Ocultar pantallas
        function showScreen(screenId) {
            document.getElementById('loginScreen').classList.add('hidden');
            document.getElementById('registerScreen').classList.add('hidden');
            document.getElementById('dashboard').classList.add('hidden');
            document.getElementById(screenId).classList.remove('hidden');
        }

        // Registro
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const fullName = document.getElementById('regFullName').value;
            const subject = document.getElementById('regSubject').value;
            const password = document.getElementById('regPassword').value;

        const newUser = {
            username,
            fullName,
            subject,
            password,
            role: "user"  // por defecto, todos son usuarios normales
            };

        users.push(newUser); 
                saveData();
                alert("Registro exitoso. Ahora puedes iniciar sesión.");
                document.getElementById('registerScreen').classList.add('hidden');
                document.getElementById('loginScreen').classList.remove('hidden');
            });
       
        document.getElementById('showRegister').addEventListener('click', () => showScreen('registerScreen'));
        document.getElementById('backToLogin').addEventListener('click', () => showScreen('loginScreen'));

        // Login
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                currentUser   = user;
                localStorage.setItem("currentUser", JSON.stringify(user));
                document.getElementById('welcomeUser').textContent = user.fullName;
                initializeAnnouncementIds(); // Asegurar IDs
                loadAssignments();
                loadAnnouncements();
                showScreen('dashboard');
        // 🔹 Mostrar el botón del panel solo si el usuario es admin
        const adminBtn = document.getElementById('adminPanelBtn');
        if (user.role === "admin") {
            adminBtn.style.display = "inline-block";
        } else {
             adminBtn.style.display = "none";
            }

                // 🔹 Mostrar u ocultar funciones de administrador
         const annForm = document.getElementById('announcementForm');
            if (user.role !== "admin") {
                annForm.style.display = "none";
                document.querySelectorAll('.edit-btn, .delete-btn').forEach(btn => {
                btn.style.display = "none";
                });
            } else {
                annForm.style.display = "block";
            }
            } else {
                alert('Credenciales inválidas');
            }
        });

        // Asignar salón (permite múltiples asignaciones ahora, sin reemplazar)
        document.getElementById('assignForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const classroom = document.getElementById('classroom').value;
            // No filtrar más, permitir múltiples salones por profesor
            assignments.push({ 
                id: Date.now(), // ID único para eliminar
                username: currentUser  .username, 
                fullName: currentUser  .fullName, 
                subject: currentUser  .subject, 
                classroom 
            });
            saveData();
            loadAssignments();
            document.getElementById('classroom').value = '';
            alert('Salón asignado exitosamente');
        });

        // Cargar tabla de asignaciones
        function loadAssignments() {
            const tbody = document.querySelector('#assignmentTable tbody');
            tbody.innerHTML = '';
            const userAssignments = assignments.filter(a => a.username === currentUser  .username);
            userAssignments.forEach(assignment => {
                const row = tbody.insertRow();
                const actionCell = row.insertCell(0);
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.onclick = () => deleteAssignment(assignment.id);
                actionCell.appendChild(deleteBtn);

                row.insertCell(1).textContent = assignment.fullName;
                row.insertCell(2).textContent = assignment.subject;
                row.insertCell(3).textContent = assignment.classroom;
            });
        }

        // Eliminar asignación
        function deleteAssignment(id) {
            if (confirm('¿Estás seguro de eliminar esta asignación?')) {
                assignments = assignments.filter(a => a.id !== id);
                saveData();
                loadAssignments();
            }
        }

        // Cargar tabla de anuncios
        function loadAnnouncements() {
            const tbody = document.querySelector('#announcementsTable tbody');
            tbody.innerHTML = '';
            announcements.forEach(ann => {
                const row = tbody.insertRow();
                row.insertCell(0).textContent = ann.title;
                row.insertCell(1).textContent = ann.description;
                row.insertCell(2).textContent = ann.date;

                const actionCell = row.insertCell(3);
                // Botón Editar
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Editar';
                editBtn.classList.add('edit-btn');
                editBtn.onclick = () => editAnnouncement(ann.id);
                actionCell.appendChild(editBtn);

                // Botón Eliminar
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.onclick = () => deleteAnnouncement(ann.id);
                actionCell.appendChild(deleteBtn);
            });
        }

        // Editar anuncio
        function editAnnouncement(id) {
            const ann = announcements.find(a => a.id === id);
            if (ann) {
                editingAnnouncementId = id;
                document.getElementById('annTitle').value = ann.title;
                document.getElementById('annDescription').value = ann.description;
                document.getElementById('formTitle').textContent = 'Editar Anuncio';
                document.getElementById('annSubmitBtn').textContent = 'Actualizar Anuncio';
                document.getElementById('cancelEdit').classList.remove('hidden'); // Mostrar botón cancelar si lo ocultas
            }
        }

        // Eliminar anuncio
        function deleteAnnouncement(id) {
            if (confirm('¿Estás seguro de eliminar este anuncio?')) {
                announcements = announcements.filter(a => a.id !== id);
                saveData();
                loadAnnouncements();
                resetAnnouncementForm();
            }
        }

        // Resetear formulario de anuncio
        function resetAnnouncementForm() {
            editingAnnouncementId = null;
            document.getElementById('annTitle').value = '';
            document.getElementById('annDescription').value = '';
            document.getElementById('formTitle').textContent = 'Agregar Nuevo Anuncio';
            document.getElementById('annSubmitBtn').textContent = 'Agregar Anuncio';
            // Ocultar botón cancelar si lo tienes hidden inicialmente
        }

        // Agregar/Actualizar anuncio
        document.getElementById('announcementForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('annTitle').value;
            const description = document.getElementById('annDescription').value;
            const date = new Date().toISOString().split('T')[0]; // Fecha actual

            if (editingAnnouncementId) {
                // Actualizar anuncio existente
                const annIndex = announcements.findIndex(a => a.id === editingAnnouncementId);
                if (annIndex !== -1) {
                    announcements[annIndex] = { ...announcements[annIndex], title, description, date };
                    alert('Anuncio actualizado exitosamente');
                }
            } else {
                // Agregar nuevo anuncio
                announcements.push({ id: Date.now(), title, description, date });
                alert('Anuncio agregado exitosamente');
            }

            saveData();
            loadAnnouncements();
            resetAnnouncementForm();
        });

        // Cancelar edición
        document.getElementById('cancelEdit').addEventListener('click', function() {
            resetAnnouncementForm();
        });

        // Logout
        document.getElementById('logout').addEventListener('click', () => {
            currentUser   = null;
            showScreen('loginScreen');
        });

        // Link de ¿Quiénes somos? (puedes expandir con una modal o página separada)
        document.getElementById('aboutLink').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Somos un equipo dedicado a la gestión educativa. ¡Gracias por usar nuestro sistema!');
        });

