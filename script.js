// Variables de estado
let remanente = 4.0;
let historial = [];

// Elementos del DOM
const remanenteEl = document.getElementById('remanente');
const dosisInput = document.getElementById('dosis-input');
const btnAplicar = document.getElementById('btn-aplicar');
const errorMsg = document.getElementById('error-msg');
const historialLista = document.getElementById('historial-lista');
const capacidadInput = document.getElementById('capacidad-input');
const btnReiniciar = document.getElementById('btn-reiniciar');

// Función para cargar datos guardados en el navegador
function cargarDatos() {
    const datosGuardados = localStorage.getItem('lapizMedicamento');
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        remanente = datos.remanente;
        historial = datos.historial || [];
    }
    actualizarUI();
}

// Función para guardar datos en el navegador
function guardarDatos() {
    localStorage.setItem('lapizMedicamento', JSON.stringify({
        remanente: remanente,
        historial: historial
    }));
}

// Actualizar la interfaz visual
function actualizarUI() {
    // Actualizar el número grande (forzando 2 decimales)
    remanenteEl.textContent = remanente.toFixed(2);
    
    // Limpiar y actualizar la lista del historial
    historialLista.innerHTML = '';
    historial.forEach((dosis, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>Dosis #${index + 1}</span> <strong>${dosis.toFixed(2)} ml</strong>`;
        historialLista.appendChild(li);
    });
}

// Evento para aplicar una dosis
btnAplicar.addEventListener('click', () => {
    const dosis = parseFloat(dosisInput.value);
    errorMsg.textContent = ''; // Limpiar errores

    // Validaciones
    if (isNaN(dosis) || dosis <= 0) {
        errorMsg.textContent = 'Por favor, ingresa una cantidad válida.';
        return;
    }
    if (dosis > remanente) {
        errorMsg.textContent = 'Error: La dosis supera el líquido restante.';
        return;
    }

    // Lógica matemática
    remanente -= dosis;
    historial.push(dosis);
    dosisInput.value = ''; // Limpiar el input
    
    // Guardar y refrescar pantalla
    guardarDatos();
    actualizarUI();
});

// Evento para reiniciar (agregar) un nuevo lápiz
btnReiniciar.addEventListener('click', () => {
    const nuevaCapacidad = parseFloat(capacidadInput.value);
    
    if (isNaN(nuevaCapacidad) || nuevaCapacidad <= 0) {
        alert('Ingresa una capacidad válida para el nuevo lápiz.');
        return;
    }

    // Confirmación de seguridad actualizada
    if (confirm(`¿Agregar un lápiz de ${nuevaCapacidad} ml? Se sumará a tu remanente actual de ${remanente.toFixed(2)} ml.`)) {
        
        // EL CAMBIO ESTÁ AQUÍ: Sumamos la nueva capacidad al remanente que ya existía
        remanente += nuevaCapacidad; 
        
        // Vaciamos el historial de aplicaciones para empezar limpios con la nueva carga
        historial = []; 
        
        guardarDatos();
        actualizarUI();
        
        alert(`¡Listo! Ahora tienes un total de ${remanente.toFixed(2)} ml disponibles.`);
    }
});

// Inicializar la app al cargar la página
cargarDatos();
