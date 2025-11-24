// URL de MockAPI
const CARRERAS_API = "https://69235fac3ad095fb84705fcb.mockapi.io/api/v1/Carreras"; // En la simulación de API se guardan lasa carreras//

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrerasAPI();
    loadEstudiantes();

    // Crear perfil del estudiante
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
            showMessage('deleteError', 'ID de estudiante no válido'); //Si no encuentra el ID que se solicita//
            return;
        }

        lista.splice(id, 1); // Elimina el estudiante de la lista //
        saveEstudiantesToStorage(lista);

        showMessage('deleteSuccess', `Estudiante con ID ${id} eliminado`);
        e.target.reset(); // Reinicia el formulario //
    });
});

// ------------------ API ------------------

async function cargarCarrerasAPI() { // Carga las carreras desde la simulación  API //

    const select = document.getElementById('carrera'); // Selecciona el elemento select del formulario //
    select.innerHTML = '<option value="">Cargando opciones...</option>';

    try {
        const res = await fetch(CARRERAS_API); // Realiza la solicitud a la API //
        const data = await res.json();

        select.innerHTML = '<option value="">-- Seleccione opción --</option>';

        data.forEach(c => { // Recorre las carreras obtenidas de la API //

            const op = document.createElement('option'); 
            op.value = c.nombre; 
            op.textContent = c.nombre; // Agrega la carrera como opción en el select //
            select.appendChild(op); // Agrega la opción al select //
        });

    } catch { // Manejo de errores en caso de fallo en la solicitud //
        select.innerHTML = '<option value="">Error al cargar carreras</option>';
    }
}



// ------------------ Pestañas ------------------
function cambiarPestana(nombre) {
    document.querySelectorAll('.pestana').forEach(b => b.classList.remove('activa'));  // Activa: la pestaña seleccionada //
    document.querySelectorAll('.pestana-contenido').forEach(c => c.classList.remove('activa'));

    document.querySelector(`[onclick="cambiarPestana('${nombre}')"]`).classList.add('activa');
    document.getElementById(nombre).classList.add('activa');

    if (nombre === 'listar') loadEstudiantes();
}



// ------------------ LocalStorage ------------------

const loadEstudiantesFromStorage = () => // Carga la lista de estudiantes desde localStorage //
    JSON.parse(localStorage.getItem('estudiantes') || "[]"); // Si no hay datos, devuelve un array vacío //

const saveEstudiantesToStorage = estudiantes => // Guarda la lista de estudiantes en localStorage //
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes)); // Convierte el array a cadena JSON //



// ------------------ Tabla de estudiantes registrados  ------------------

function loadEstudiantes() {
    const lista = loadEstudiantesFromStorage();  // Carga la lista de estudiantes //
    const cont = document.getElementById('listTable');

    if (lista.length === 0) { // Si no hay estudiantes registrados //
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

 // Genera las filas de la tabla con los datos de los estudiantes //
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
    const lista = loadEstudiantesFromStorage(); // Carga la lista de estudiantes //
    lista.splice(i, 1);  // Elimina el estudiante de la lista //
    saveEstudiantesToStorage(lista);
    loadEstudiantes();
}

// ------------------ Mensajes ------------------

function showMessage(id, msg) { // Muestra un mensaje temporal en el elemento con el ID especificado //
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
}
