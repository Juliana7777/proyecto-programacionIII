// Esperar a que cargue el DOM
document.addEventListener('DOMContentLoaded', function() {

    loadEstudiantes();

    document.getElementById('createForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const nuevoEstudiante = {
            nombres: document.getElementById('nombres').value,
            apellidos: document.getElementById('apellidos').value,
            edad: parseInt(document.getElementById('edad').value),
            estrato: parseInt(document.getElementById('estrato').value),
            carrera: document.getElementById('carrera').value,
        };

        const estudiantes = loadEstudiantesFromStorage();
        estudiantes.push(nuevoEstudiante);

        const saved = saveEstudiantesToStorage(estudiantes);

        if (saved) {
            showMessage('createSuccess', 'Perfil de estudiante guardado');
            document.getElementById('createForm').reset();
        } else {
            showMessage('createError', 'Error al guardar el perfil de estudiante');
        }
    });

    document.getElementById('deleteForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const id = parseInt(document.getElementById('idEstudiante').value);
        const estudiantes = loadEstudiantesFromStorage();

        if (id < 0 || id >= estudiantes.length) {
            showMessage('deleteError', 'ID de estudiante no válido');
            return;
        }

        estudiantes.splice(id, 1);
        saveEstudiantesToStorage(estudiantes);

        showMessage('deleteSuccess', `Estudiante con ID ${id} eliminado`);
        document.getElementById('deleteForm').reset();
    });
});

// Cambiar pestañas
function cambiarPestana(nombre) {
    const botones = document.querySelectorAll('.pestana');
    const contenidos = document.querySelectorAll('.pestana-contenido');

    botones.forEach(btn => btn.classList.remove('activa'));
    contenidos.forEach(sec => sec.classList.remove('activa'));

    document.querySelector(`[onclick="cambiarPestana('${nombre}')"]`).classList.add('activa');
    document.getElementById(nombre).classList.add('activa');

    if (nombre === 'listar') loadEstudiantes();
}

// LocalStorage
function loadEstudiantesFromStorage() {
    const data = localStorage.getItem('estudiantes');
    return data ? JSON.parse(data) : [];
}

function saveEstudiantesToStorage(estudiantes) {
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
    return true;
}

// Mostrar lista
function loadEstudiantes() {
    const estudiantes = loadEstudiantesFromStorage();
    const tableContainer = document.getElementById('listTable');

    if (estudiantes.length === 0) {
        tableContainer.innerHTML = '<div class="empty-state"> Aún no hay estudiantes registrados</div>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Edad</th>
                    <th>Carrera</th>
                    <th>Estrato</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
    `;

    estudiantes.forEach((s, i) => {
        html += `
            <tr>
                <td>${i}</td>
                <td>${s.nombres}</td>
                <td>${s.apellidos}</td>
                <td>${s.edad}</td>
                <td>${s.carrera}</td>
                <td>${s.estrato}</td>
                <td>
                <button class="delete-btn" onclick="deleteStudent(${i})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    tableContainer.innerHTML = html;
}

function deleteStudent(i) {
    const estudiantes = loadEstudiantesFromStorage();
    estudiantes.splice(i, 1);
    saveEstudiantesToStorage(estudiantes);
    loadEstudiantes();
}

// Mensajes
function showMessage(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';

    setTimeout(() => el.style.display = 'none', 3000);
}
