// JavaScript para funcionalidades interactivas

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll para enlaces
    const links = document.querySelectorAll('header nav ul li a');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Ajusta el desplazamiento por el header fijo
                    behavior: 'smooth'
                });
            }
        });
    });

    // Formulario de contacto: manejo básico
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            alert(`Gracias, ${formData.get('name')}! Hemos recibido tu mensaje.`);
            contactForm.reset();
        });
    }

    // Google Maps API
    const initMap = () => { 
        const mapElement = document.getElementById('map');
        if (mapElement) {
            const map = new google.maps.Map(mapElement, {
                center: { lat: -34.397, lng: 150.644 }, // Cambia estas coordenadas a las deseadas
                zoom: 8
            });
        }
    };

    // Carga el script de Google Maps
    const loadGoogleMapsScript = () => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=TU_CLAVE_API&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    };

    loadGoogleMapsScript();
});
document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Detiene el comportamiento por defecto del formulario

    // Capturar los valores de los campos del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const ciudad = document.getElementById("ciudad").value.trim();
    const lote = document.getElementById("lote").value.trim();
    const celular = document.getElementById("celular").value.trim();

    // Validación para asegurarse de que no haya campos vacíos
    if (!nombre || !ciudad || !lote || !celular) {
        alert("Por favor, completa todos los campos antes de enviar.");
        return;
    }

    // Construir el mensaje que se enviará por WhatsApp
    const mensaje = `Hola, soy ${nombre}. Mi correo es "${lote}" y vivo en ${ciudad}. Mi número de contacto es ${celular}.`;

    // Codificar el mensaje para que sea válido en una URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Reemplaza '591XXXXXXXXX' con el número de WhatsApp al que deseas enviar el mensaje
    const numeroWhatsApp = "59169270000"; // Cambia este número
    const whatsappURL = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

    // Abrir el enlace en una nueva pestaña
    window.open(whatsappURL, "_blank");
    if (isMobile) {
        // Redirigir directamente a la app de WhatsApp en móviles
        const whatsappURL = `whatsapp://send?phone=${numeroWhatsapp}&text=${encodeURIComponent(mensaje)}`;
        window.location.href = whatsappURL;
    } else {
        // Usar el enlace web en caso de que no sea móvil
        const webURL = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
        window.open(webURL, "_blank");
    }
});
function initMap() {
    var terreno = { lat: -17.7833, lng: -63.1821 }; // Reemplaza con las coordenadas de tu terreno
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: terreno
    });
    var marker = new google.maps.Marker({ position: terreno, map: map });
}



