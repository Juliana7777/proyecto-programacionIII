// URL de MockAPI
const CARRERAS_API = "https://69235fac3ad095fb84705fcb.mockapi.io/api/v1/Carreras";

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrerasAPI();
    loadEstudiantes();

    // Crear estudiante
    document.getElementById('createForm').addEventListener('submit', e => {
        e.preventDefault();

        const estudiante = {
            nombres: document.getElementById('nombres').value,
            apellidos: document.getElementById('apellidos').value,
            edad: Number(document.getElementById('edad').value),
            estrato: Number(document.getElementById('estrato').value),
            carrera: document.getElementById('carrera').value
        };

        const lista = loadEstudiantesFromStorage();
        lista.push(estudiante);

        saveEstudiantesToStorage(lista);
        showMessage('createSuccess', 'Perfil de estudiante guardado');
        e.target.reset();
    });

    // Eliminar estudiante por ID
    document.getElementById('deleteForm').addEventListener('submit', e => {
        e.preventDefault();

        const id = Number(document.getElementById('idEstudiante').value);
        const lista = loadEstudiantesFromStorage();

        if (id < 0 || id >= lista.length) {
            showMessage('deleteError', 'ID de estudiante no válido');
            return;
        }

        lista.splice(id, 1);
        saveEstudiantesToStorage(lista);

        showMessage('deleteSuccess', `Estudiante con ID ${id} eliminado`);
        e.target.reset();
    });
});

// ------------------ API ------------------

async function cargarCarrerasAPI() {
    const select = document.getElementById('carrera');
    select.innerHTML = '<option value="">Cargando opciones...</option>';

    try {
        const res = await fetch(CARRERAS_API);
        const data = await res.json();

        select.innerHTML = '<option value="">-- Seleccione opción --</option>';

        data.forEach(c => {
            const op = document.createElement('option');
            op.value = c.nombre;
            op.textContent = c.nombre;
            select.appendChild(op);
        });

    } catch {
        select.innerHTML = '<option value="">Error al cargar carreras</option>';
    }
}

// ------------------ Navegación ------------------

function cambiarPestana(nombre) {
    document.querySelectorAll('.pestana').forEach(b => b.classList.remove('activa'));
    document.querySelectorAll('.pestana-contenido').forEach(c => c.classList.remove('activa'));

    document.querySelector(`[onclick="cambiarPestana('${nombre}')"]`).classList.add('activa');
    document.getElementById(nombre).classList.add('activa');

    if (nombre === 'listar') loadEstudiantes();
}

// ------------------ LocalStorage ------------------

const loadEstudiantesFromStorage = () =>
    JSON.parse(localStorage.getItem('estudiantes') || "[]");

const saveEstudiantesToStorage = estudiantes =>
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));

// ------------------ Tabla ------------------

function loadEstudiantes() {
    const lista = loadEstudiantesFromStorage();
    const cont = document.getElementById('listTable');

    if (lista.length === 0) {
        cont.innerHTML = '<div class="empty-state">Aún no hay estudiantes registrados</div>';
        return;
    }

    const filas = lista.map(
        (s, i) => `
        <tr>
            <td>${i}</td>
            <td>${s.nombres}</td>
            <td>${s.apellidos}</td>
            <td>${s.edad}</td>
            <td>${s.carrera}</td>
            <td>${s.estrato}</td>
            <td><button class="delete-btn" onclick="deleteStudent(${i})">Eliminar</button></td>
        </tr>`
    ).join('');

    cont.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th><th>Nombres</th><th>Apellidos</th>
                    <th>Edad</th><th>Carrera</th><th>Estrato</th><th></th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>`;
}

function deleteStudent(i) {
    const lista = loadEstudiantesFromStorage();
    lista.splice(i, 1);
    saveEstudiantesToStorage(lista);
    loadEstudiantes();
}

// ------------------ Mensajes ------------------

function showMessage(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
}
