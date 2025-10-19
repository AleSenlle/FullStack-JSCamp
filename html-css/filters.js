/*
const filterLocation = document.querySelector('#filter-location') // Este busca en el html por el id que está en <select name="technology" id="filter-technology">
const filterTechnology = document.querySelector('#filter-technology')
const filterExperience = document.querySelector('#experience-level')
const searchInput = document.getElementById('empleos-search-input')
const mensaje = document.querySelector('#filter-selected-value')


// FILTRO "POR UBICACION" EN EL LISTADO
filterLocation.addEventListener('change', function () {
  const jobs = document.querySelectorAll('.job-listing-card')
  const selectedValue = filterLocation.value

  if (selectedValue) {
    mensaje.textContent = `Ubicación: ${selectedValue}`
  } else {
    mensaje.textContent = ''
  }

  jobs.forEach(job => {
    const modalidad = job.getAttribute('data-modalidad')
    const isShown = selectedValue === '' || selectedValue === modalidad
    job.classList.toggle('is-hidden', !isShown)
  })
})

// FILTRO EN EL SEARCH PARA LA BÚSQUEDA CON INPUT DEL USUARIO
searchInput.addEventListener('input', function () {
  const jobs = document.querySelectorAll('.job-listing-card')
  const searchTerm = searchInput.value.toLowerCase().trim()

  jobs.forEach(job => {
    const titulo = job.querySelector('h3').textContent.toLowerCase()
    const isShown = searchTerm === '' || titulo.includes(searchTerm)
    job.classList.toggle('is-hidden', !isShown)
  })
})

// FILTRO "TECNOLOGIAS" DEL LISTADO
filterTechnology.addEventListener('change', function () {
  const jobs = document.querySelectorAll('.job-listing-card')
  const selectedTechnology = filterTechnology.value

  if (selectedTechnology) {
    mensaje.textContent = `Tecnología: ${selectedTechnology}`
  } else {
    mensaje.textContent = ''
  }

  jobs.forEach(job => {
    const tecnologias = job.getAttribute('data-technology')
    const isShown = selectedTechnology === '' || tecnologias.includes(selectedTechnology)
    job.classList.toggle('is-hidden', !isShown)
  })
})

// FILTRO "NIVEL DE EXPERIENCIA"
filterExperience.addEventListener('change', function () {
  const jobs = document.querySelectorAll('.job-listing-card')
  const selectedExperience = filterExperience.value

  if (selectedExperience) {
    mensaje.textContent = `Experiencia: ${selectedExperience}`
  } else {
    mensaje.textContent = ''
  }

  jobs.forEach(job => {
    const experiencia = job.getAttribute('data-nivel')
    const isShown = selectedExperience === '' || selectedExperience === experiencia
    job.classList.toggle('is-hidden', !isShown)
  })
})*/

// HOOKS
const filterLocation = document.querySelector('#filter-location')
const filterTechnology = document.querySelector('#filter-technology')
const filterExperience = document.querySelector('#experience-level')
const searchInput = document.getElementById('empleos-search-input')
const mensaje = document.querySelector('#filter-selected-value')

// 1. Objeto para guardar los filtros activos
let filtrosActivos = {
  ubicacion: '',
  tecnologia: '',
  experiencia: '',
  busqueda: ''
};

// 2. Función debounce para el search (evita ejecuciones múltiples)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 3. Función para actualizar cualquier filtro
function actualizarFiltro(tipo, valor) {
  filtrosActivos[tipo] = valor;
  aplicarFiltrosCombinados();
  actualizarMensaje();
}

// 4. Función principal que aplica TODOS los filtros
function aplicarFiltrosCombinados() {
  const jobs = document.querySelectorAll('.job-listing-card');
  
  jobs.forEach(job => {
    const modalidad = job.getAttribute('data-modalidad');
    const tecnologias = job.getAttribute('data-technology');
    const nivel = job.getAttribute('data-nivel');
    const titulo = job.querySelector('h3').textContent.toLowerCase();

    // Verificar CADA filtro activo
    const mostrar = 
      (!filtrosActivos.ubicacion || modalidad === filtrosActivos.ubicacion) &&
      (!filtrosActivos.tecnologia || tecnologias.includes(filtrosActivos.tecnologia)) &&
      (!filtrosActivos.experiencia || nivel === filtrosActivos.experiencia) &&
      (!filtrosActivos.busqueda || titulo.includes(filtrosActivos.busqueda));

    job.classList.toggle('is-hidden', !mostrar);
  });
}

// 5. Actualizar el mensaje con TODOS los filtros activos
function actualizarMensaje() {
  const filtros = [];
  
  if (filtrosActivos.busqueda) filtros.push(`"${filtrosActivos.busqueda}"`);
  if (filtrosActivos.ubicacion) filtros.push(filtrosActivos.ubicacion);
  if (filtrosActivos.tecnologia) filtros.push(filtrosActivos.tecnologia);
  if (filtrosActivos.experiencia) filtros.push(filtrosActivos.experiencia);
  
  mensaje.textContent = filtros.length > 0 
    ? `Filtros activos: ${filtros.join(', ')}` 
    : '';
}

// 6. Event listeners para TODOS los filtros
filterLocation.addEventListener('change', function() {
  actualizarFiltro('ubicacion', this.value);
});

filterTechnology.addEventListener('change', function() {
  actualizarFiltro('tecnologia', this.value);
});

filterExperience.addEventListener('change', function() {
  actualizarFiltro('experiencia', this.value);
});

// Search con debounce de 300ms (espera que dejes de escribir)
searchInput.addEventListener('input', 
  debounce(function(e) {
    actualizarFiltro('busqueda', e.target.value.toLowerCase().trim());
  }, 300)
);

// 7. Aplicar filtros iniciales (mostrar todos)
aplicarFiltrosCombinados();