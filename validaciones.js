// validaciones.js - Validaciones para el formulario de registro

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.registration-form');
    const textarea = document.getElementById('referencia');
    const charCounter = document.querySelector('.char-counter');
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar span');
    const strengthText = document.querySelector('.password-strength span');

    // Contador de caracteres para textarea
    if (textarea && charCounter) {
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            charCounter.textContent = `${length} / 200`;
        });
    }

    // Barra de fortaleza de contraseña en tiempo real
    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }

    // Validación en submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            alert('Formulario válido. Registro exitoso!');
            // Aquí iría el envío real del formulario
        }
    });

    // Función principal de validación
    function validateForm() {
        let isValid = true;

        // Limpiar errores previos
        clearErrors();

        // Validaciones por sección
        isValid &= validatePersonalData();
        isValid &= validateContactData();
        isValid &= validateAddressData();
        isValid &= validatePreferencesData();

        return isValid;
    }

    // Validaciones Datos Personales
    function validatePersonalData() {
        let isValid = true;

        // Nombre completo
        const nombre = document.getElementById('nombre');
        const nombreRegex = /^[a-zA-Z\s]+$/;
        if (!nombre.value.trim() || nombre.value.length < 3 || nombre.value.length > 60 || !nombreRegex.test(nombre.value)) {
            showError(nombre, 'Nombre debe contener solo letras y espacios, entre 3 y 60 caracteres.');
            isValid = false;
        }

        // Fecha de nacimiento
        const nacimiento = document.getElementById('nacimiento');
        if (nacimiento.value) {
            const birthDate = new Date(nacimiento.value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                showError(nacimiento, 'Debes ser mayor de 18 años.');
                isValid = false;
            }
        } else {
            showError(nacimiento, 'Fecha de nacimiento es requerida.');
            isValid = false;
        }

        // RUT chileno
        const documento = document.getElementById('documento');
        if (!documento.value.trim() || !validateRut(documento.value)) {
            showError(documento, 'RUT inválido. Debe ser un RUT chileno válido.');
            isValid = false;
        }

        // Género
        const genero = document.getElementById('genero');
        if (!genero.value) {
            showError(genero, 'Debes seleccionar un género.');
            isValid = false;
        }

        // Nacionalidad
        const nacionalidad = document.getElementById('nacionalidad');
        if (!nacionalidad.value) {
            showError(nacionalidad, 'Debes seleccionar una nacionalidad.');
            isValid = false;
        }

        return isValid;
    }

    // Validaciones Contacto y Acceso
    function validateContactData() {
        let isValid = true;

        // Email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, 'Email debe tener un formato válido.');
            isValid = false;
        }

        // Confirmar email
        const emailConfirm = document.getElementById('email-confirm');
        if (email.value !== emailConfirm.value) {
            showError(emailConfirm, 'Los emails no coinciden.');
            isValid = false;
        }

        // Contraseña
        const password = document.getElementById('password');
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(password.value)) {
            showError(password, 'Contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.');
            isValid = false;
        }

        // Confirmar contraseña
        const passwordConfirm = document.getElementById('password-confirm');
        if (password.value !== passwordConfirm.value) {
            showError(passwordConfirm, 'Las contraseñas no coinciden.');
            isValid = false;
        }

        // Teléfono
        const telefono = document.getElementById('telefono');
        const telefonoRegex = /^[\d\s\-\+]+$/;
        const digitsOnly = telefono.value.replace(/\D/g, '');
        if (!telefonoRegex.test(telefono.value) || digitsOnly.length < 8) {
            showError(telefono, 'Teléfono debe contener al menos 8 dígitos numéricos.');
            isValid = false;
        }

        return isValid;
    }

    // Validaciones Dirección
    function validateAddressData() {
        let isValid = true;

        // País
        const pais = document.getElementById('pais');
        if (!pais.value) {
            showError(pais, 'País es requerido.');
            isValid = false;
        }

        // Provincia
        const provincia = document.getElementById('provincia');
        if (!provincia.value.trim()) {
            showError(provincia, 'Provincia/Estado es requerido.');
            isValid = false;
        }

        // Ciudad
        const ciudad = document.getElementById('ciudad');
        const ciudadRegex = /^[a-zA-Z\s]+$/;
        if (!ciudad.value.trim() || ciudad.value.length < 2 || !ciudadRegex.test(ciudad.value)) {
            showError(ciudad, 'Ciudad debe contener solo letras y espacios, mínimo 2 caracteres.');
            isValid = false;
        }

        // Calle y número
        const calle = document.getElementById('calle');
        if (!calle.value.trim() || calle.value.length < 5) {
            showError(calle, 'Calle y número es requerido, mínimo 5 caracteres.');
            isValid = false;
        }

        // Código postal
        const codigoPostal = document.getElementById('codigo-postal');
        const codigoRegex = /^[a-zA-Z0-9]+$/;
        if (!codigoPostal.value.trim() || codigoPostal.value.length < 4 || codigoPostal.value.length > 10 || !codigoRegex.test(codigoPostal.value)) {
            showError(codigoPostal, 'Código postal debe ser alfanumérico, entre 4 y 10 caracteres.');
            isValid = false;
        }

        return isValid;
    }

    // Validaciones Preferencias y Términos
    function validatePreferencesData() {
        let isValid = true;

        // Al menos una categoría de interés
        const intereses = document.querySelectorAll('input[name="interes"]:checked');
        if (intereses.length === 0) {
            const interesesGroup = document.querySelector('.check-group');
            showError(interesesGroup, 'Debes seleccionar al menos una categoría de interés.');
            isValid = false;
        }

        // Tipo de cliente
        const tipoCliente = document.querySelector('input[name="tipo-cliente"]:checked');
        if (!tipoCliente) {
            const tipoClienteGroup = document.querySelectorAll('.check-group')[1];
            showError(tipoClienteGroup, 'Debes seleccionar un tipo de cliente.');
            isValid = false;
        }

        // Términos y condiciones
        const terminos = document.getElementById('terminos');
        if (!terminos.checked) {
            showError(terminos.parentElement, 'Debes aceptar los Términos y Condiciones.');
            isValid = false;
        }

        // Política de privacidad
        const privacidad = document.getElementById('privacidad');
        if (!privacidad.checked) {
            showError(privacidad.parentElement, 'Debes aceptar la Política de Privacidad.');
            isValid = false;
        }

        return isValid;
    }

    // Función para validar RUT chileno
    function validateRut(rut) {
        // Limpiar el RUT
        rut = rut.replace(/[^0-9kK]/g, '');

        if (rut.length < 7 || rut.length > 8) return false;

        const body = rut.slice(0, -1);
        const dv = rut.slice(-1).toUpperCase();

        // Calcular dígito verificador
        let sum = 0;
        let multiplier = 2;

        for (let i = body.length - 1; i >= 0; i--) {
            sum += parseInt(body[i]) * multiplier;
            multiplier = multiplier === 7 ? 2 : multiplier + 1;
        }

        const expectedDv = 11 - (sum % 11);
        let calculatedDv;

        if (expectedDv === 11) calculatedDv = '0';
        else if (expectedDv === 10) calculatedDv = 'K';
        else calculatedDv = expectedDv.toString();

        return calculatedDv === dv;
    }

    // Función para mostrar errores
    function showError(element, message) {
        element.classList.add('input-error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        element.appendChild(errorElement);
    }

    // Función para limpiar errores
    function clearErrors() {
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }

    // Función para actualizar la fortaleza de la contraseña
    function updatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        // Verificar longitud
        if (password.length >= 8) {
            score++;
        } else {
            feedback.push('Al menos 8 caracteres');
        }

        // Verificar mayúscula
        if (/[A-Z]/.test(password)) {
            score++;
        } else {
            feedback.push('Una mayúscula');
        }

        // Verificar número
        if (/\d/.test(password)) {
            score++;
        } else {
            feedback.push('Un número');
        }

        // Verificar carácter especial
        if (/[!@#$%^&*]/.test(password)) {
            score++;
        } else {
            feedback.push('Un carácter especial');
        }

        // Actualizar barra y texto según el score
        const strengthBar = document.querySelector('.strength-bar span');
        const strengthText = document.querySelector('.password-strength span');

        if (password.length === 0) {
            strengthBar.style.width = '0%';
            strengthBar.style.background = '#e5ecff';
            strengthText.textContent = 'Fuerza de contraseña';
            strengthText.style.color = 'var(--color-muted)';
        } else if (score <= 1) {
            strengthBar.style.width = '25%';
            strengthBar.style.background = '#dc3545'; // Rojo
            strengthText.textContent = 'Débil: ' + feedback.join(', ');
            strengthText.style.color = '#dc3545';
        } else if (score === 2) {
            strengthBar.style.width = '50%';
            strengthBar.style.background = '#ffc107'; // Amarillo
            strengthText.textContent = 'Media: ' + feedback.join(', ');
            strengthText.style.color = '#ffc107';
        } else {
            strengthBar.style.width = '100%';
            strengthBar.style.background = '#28a745'; // Verde
            strengthText.textContent = 'Fuerte';
            strengthText.style.color = '#28a745';
        }
    }
});