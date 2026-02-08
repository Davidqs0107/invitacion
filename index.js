// Contador Regresivo
function updateCountdown() {
    // Fecha del evento: 26 de Marzo, 2026 a las 14:00
    const eventDate = new Date('March 26, 2026 14:00:00').getTime();
    const now = new Date().getTime();
    const diff = eventDate - now;

    // Si el evento ya pasó
    if (diff < 0) {
        document.getElementById('days').innerText = '0';
        document.getElementById('hours').innerText = '0';
        document.getElementById('minutes').innerText = '0';
        document.getElementById('seconds').innerText = '0';
        return;
    }

    // Cálculos
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Actualizar el HTML
    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

// Actualizar cada segundo
setInterval(updateCountdown, 1000);
updateCountdown(); // Llamada inicial

// Función para cargar la galería de fotos dinámicamente
function loadGallery() {
    const galleryTrack = document.getElementById('galleryTrack');
    if (!galleryTrack) return;

    // Configuración de la galería
    // Para agregar más imágenes: 
    // 1. Sube las fotos a la carpeta assets/images/carusel/
    // 2. Nómbralas con números secuenciales: 14.jpg, 15.jpg, etc.
    // 3. Actualiza el valor de 'totalImages' abajo
    const galleryConfig = {
        folder: 'assets/images/carusel/',
        imagePrefix: '',
        imageExtension: '.jpg',
        totalImages: 14, // Número total de imágenes (00.jpg a 13.jpg)
        startIndex: 0     // Índice de inicio
    };

    // Generar las imágenes dinámicamente
    for (let i = galleryConfig.startIndex; i < galleryConfig.totalImages; i++) {
        // Formatear el número con ceros a la izquierda (00, 01, 02, etc.)
        const imageNumber = i.toString().padStart(2, '0');
        const imagePath = `${galleryConfig.folder}${galleryConfig.imagePrefix}${imageNumber}${galleryConfig.imageExtension}`;

        // Crear el contenedor del item
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        // Crear la imagen
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Foto ${i + 1}`;
        img.loading = 'lazy'; // Carga diferida para mejor rendimiento

        // Agregar clase de loading mientras carga
        galleryItem.classList.add('loading');

        // Cuando la imagen se carga exitosamente
        img.onload = function () {
            galleryItem.classList.remove('loading');
            galleryItem.classList.add('loaded');
        };

        // Manejar error de carga
        img.onerror = function () {
            console.warn(`No se pudo cargar la imagen: ${imagePath}`);
            // Ocultar el item si la imagen no existe
            galleryItem.style.display = 'none';
        };

        // Agregar la imagen al item
        galleryItem.appendChild(img);

        // Agregar el item al track
        galleryTrack.appendChild(galleryItem);
    }
}

// Función para generar el calendario dinámicamente
function generateCalendar() {
    // Fecha del evento
    const eventDate = new Date(2026, 2, 26); // Marzo es mes 2 (0-indexed)
    const year = eventDate.getFullYear();
    const month = eventDate.getMonth();
    const targetDay = eventDate.getDate();

    // Nombres de los meses en español
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Actualizar el título del mes
    const monthHeader = document.getElementById('calendarMonth');
    if (monthHeader) {
        monthHeader.textContent = `${monthNames[month]} ${year}`;
    }

    // Obtener el primer día del mes (0 = Domingo, 1 = Lunes, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    // Ajustar para que Lunes sea 0 (formato europeo)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Obtener el último día del mes
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Obtener el contenedor del calendario
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;

    // Limpiar días existentes (mantener los nombres de los días)
    const dayNames = calendarGrid.querySelectorAll('.day-name');
    calendarGrid.innerHTML = '';
    dayNames.forEach(dayName => calendarGrid.appendChild(dayName));

    // Agregar días vacíos al inicio
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }

    // Agregar los días del mes
    for (let day = 1; day <= lastDay; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        // Marcar el día del evento
        if (day === targetDay) {
            dayElement.classList.add('marked-day');
        }

        calendarGrid.appendChild(dayElement);
    }
}

// Galería de Fotos - Navegación
document.addEventListener('DOMContentLoaded', function () {
    // Cargar galería de fotos
    loadGallery();

    // Leer número de pases desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const numPases = urlParams.get('pases') || '2';
    const pasesElement = document.getElementById('numPases');
    if (pasesElement) {
        pasesElement.textContent = numPases;
    }

    // Generar calendario dinámico
    generateCalendar();

    const galleryTrack = document.querySelector('.gallery-track');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');

    if (prevBtn && nextBtn && galleryTrack) {
        const scrollAmount = 270; // 250px de ancho + 20px de gap

        prevBtn.addEventListener('click', () => {
            galleryTrack.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            galleryTrack.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    // Smooth Scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animación de entrada para elementos cuando son visibles
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animación a secciones
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Modal RSVP
    const modal = document.getElementById('rsvpModal');
    const openModalBtn = document.getElementById('openRsvpModal');
    const closeModalBtn = document.querySelector('.modal-close');
    const rsvpForm = document.getElementById('rsvpForm');
    const formMessage = document.getElementById('formMessage');
    const acompanantesInput = document.getElementById('acompanantes');
    const acompanantesError = document.getElementById('acompanantesError');
    const maxPasesSpan = document.getElementById('maxPases');

    // Configurar el máximo de acompañantes basado en pases asignados
    const pasesAsignados = parseInt(document.getElementById('numPases').textContent);
    if (acompanantesInput && maxPasesSpan) {
        acompanantesInput.max = pasesAsignados;
        maxPasesSpan.textContent = pasesAsignados;

        // Validación en tiempo real
        acompanantesInput.addEventListener('input', function () {
            const valor = parseInt(this.value) || 0;
            if (valor > pasesAsignados) {
                this.style.borderColor = '#c62828';
                acompanantesError.style.display = 'block';
                this.setCustomValidity('El número excede los pases asignados');
            } else {
                this.style.borderColor = '';
                acompanantesError.style.display = 'none';
                this.setCustomValidity('');
            }
        });

        // Validación al perder el foco
        acompanantesInput.addEventListener('blur', function () {
            const valor = parseInt(this.value) || 0;
            if (valor > pasesAsignados) {
                this.value = pasesAsignados;
                this.style.borderColor = '';
                acompanantesError.style.display = 'none';
                this.setCustomValidity('');
            }
        });
    }

    // Abrir modal
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    // Cerrar modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // CONFIGURACIÓN - Elige una de las dos opciones:

    // OPCIÓN 1: Enviar a Google Sheets usando Apps Script
    // Reemplaza esta URL con tu Web App URL de Google Apps Script
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx-UZ6JkZ34YCMcjFL2A98uuXNNeoaNV1gNZzKMQzBsFCLp6bz8hptguQN-plDNbYTY/exec';

    // OPCIÓN 2: Abrir Google Form pre-llenado
    // const GOOGLE_FORM_URL = 'TU_URL_DE_GOOGLE_FORM_AQUI';

    // Enviar formulario
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validación adicional antes de enviar
            const acompanantes = parseInt(document.getElementById('acompanantes').value) || 0;
            const pases = parseInt(document.getElementById('numPases').textContent);

            if (acompanantes > pases) {
                formMessage.className = 'form-message error';
                formMessage.textContent = `El número de acompañantes (${acompanantes}) no puede exceder los pases asignados (${pases})`;
                return;
            }

            const formData = new FormData(rsvpForm);
            const data = {
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                asistencia: formData.get('asistencia'),
                acompanantes: formData.get('acompanantes'),
                mensaje: formData.get('mensaje'),
                pases: document.getElementById('numPases').textContent,
                fecha: new Date().toLocaleString('es-BO')
            };

            // Mostrar mensaje de carga
            formMessage.className = 'form-message loading';
            formMessage.textContent = 'Enviando...';

            try {
                // OPCIÓN 1: Enviar a Google Sheets
                if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI') {
                    const response = await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    formMessage.className = 'form-message success';
                    formMessage.textContent = '¡Confirmación enviada exitosamente!';
                    rsvpForm.reset();

                    setTimeout(() => {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        formMessage.textContent = '';
                    }, 2000);
                } else {
                    // OPCIÓN 2: Abrir Google Form (requiere configurar GOOGLE_FORM_URL)
                    // Descomentar la siguiente línea y configurar la URL del form
                    // window.open(GOOGLE_FORM_URL, '_blank');

                    // Mientras tanto, mostrar los datos (para pruebas)
                    console.log('Datos a enviar:', data);
                    formMessage.className = 'form-message success';
                    formMessage.textContent = '¡Confirmación registrada! (Configura GOOGLE_SCRIPT_URL)';

                    // También puedes enviar por WhatsApp como alternativa:
                    // const phoneNumber = '1234567890';
                    // const message = encodeURIComponent(`¡Hola! Confirmo mi asistencia:\n\nNombre: ${data.nombre}\nAsistencia: ${data.asistencia}\nAcompañantes: ${data.acompanantes}`);
                    // window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                }
            } catch (error) {
                console.error('Error:', error);
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Hubo un error. Por favor inténtalo de nuevo.';
            }
        });
    }

    // Efecto parallax suave en el hero
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});

// Función para actualizar imágenes de la galería
// Puedes llamar esta función con tus propias URLs de imágenes
function updateGalleryImages(imageUrls) {
    const galleryItems = document.querySelectorAll('.gallery-item .placeholder-img');
    imageUrls.forEach((url, index) => {
        if (galleryItems[index]) {
            const item = galleryItems[index];
            item.style.backgroundImage = `url('${url}')`;
            item.style.backgroundSize = 'cover';
            item.style.backgroundPosition = 'center';
            item.innerText = '';
        }
    });
}

// Ejemplo de uso (descomenta y agrega tus URLs):
// updateGalleryImages([
//   'url-de-imagen-1.jpg',
//   'url-de-imagen-2.jpg',
//   'url-de-imagen-3.jpg',
//   'url-de-imagen-4.jpg',
//   'url-de-imagen-5.jpg',
//   'url-de-imagen-6.jpg'
// ]);

// Función para actualizar fotos de perfiles
function updateProfileImages(profiles) {
    const profileImgs = document.querySelectorAll('.profile-img');
    profiles.forEach((profile, index) => {
        if (profileImgs[index] && profile.imageUrl) {
            const img = profileImgs[index];
            img.style.backgroundImage = `url('${profile.imageUrl}')`;
            img.style.backgroundSize = 'cover';
            img.style.backgroundPosition = 'center';
            img.innerText = '';
        }
    });
}

// Ejemplo de uso (descomenta y agrega tus URLs):
// updateProfileImages([
//   { imageUrl: 'url-perfil-1.jpg' },
//   { imageUrl: 'url-perfil-2.jpg' },
//   { imageUrl: 'url-perfil-3.jpg' }
// ]);