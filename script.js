let materias = [];
const progresoKey = 'materiasAprobadas';

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch('materias.json');
  materias = await res.json();

  const aprobadas = JSON.parse(localStorage.getItem(progresoKey)) || [];
  renderMaterias(aprobadas);
});

function renderMaterias(aprobadas) {
  const contenedor = document.getElementById('contenedor-malla');
  contenedor.innerHTML = '';

  let total = materias.length;
  let aprobadasCount = aprobadas.length;
  document.getElementById("avance").innerText = `Avance: ${Math.round((aprobadasCount / total) * 100)}%`;

  materias.forEach(m => {
    const cumpleRequisitos = m.requisitos[0] === "TODAS" 
      ? aprobadas.length === (total - 1)
      : m.requisitos.every(req => aprobadas.includes(req));
      
    const esAprobada = aprobadas.includes(m.codigo);

    const btn = document.createElement('button');
    btn.className = 'boton-materia';

    if (esAprobada) {
      btn.classList.add('aprobado');
      btn.textContent = '✅ ' + m.nombre;
    } else if (cumpleRequisitos) {
      btn.classList.add('disponible');
      btn.textContent = m.nombre;
      btn.onclick = () => {
        aprobadas.push(m.codigo);
        localStorage.setItem(progresoKey, JSON.stringify(aprobadas));
        renderMaterias(aprobadas);
      };
    } else {
      btn.classList.add('bloqueado');
      btn.textContent = m.nombre;
      btn.disabled = true;
    }

    contenedor.appendChild(btn);
  });
}
