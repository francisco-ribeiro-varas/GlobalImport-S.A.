// validaciones.js - Validaciones para el formulario de registro con retroalimentación visual

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.registration-form');
    const successMessage = document.getElementById('success-message');
    const successText = document.getElementById('success-text');

    // Elementos del formulario
    const textarea = document.getElementById('referencia');
    const charCounter = document.querySelector('.char-counter');
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar span');
    const strengthText = document.querySelector('.password-strength span');

    // Contador de caracteres para textarea (tiempo real)
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

    // Validación en tiempo real - blur events para cada campo
    setupRealTimeValidation();

    // Validación principal en submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            showSuccessMessage();
        }
    });

    // Función para configurar validación en tiempo real
    function setupRealTimeValidation() {
        // Campos de datos personales
        document.getElementById('nombre').addEventListener('blur', () => validateField('nombre', validateName));
        document.getElementById('nacimiento').addEventListener('blur', () => validateField('nacimiento', validateBirthDate));
        document.getElementById('documento').addEventListener('blur', () => validateField('documento', validateRut));
        document.getElementById('genero').addEventListener('blur', () => validateField('genero', validateRequired));
        document.getElementById('nacionalidad').addEventListener('blur', () => validateField('nacionalidad', validateRequired));

        // Campos de contacto
        document.getElementById('email').addEventListener('blur', () => validateField('email', validateEmail));
        document.getElementById('email-confirm').addEventListener('blur', () => validateField('email-confirm', validateEmailConfirm));
        document.getElementById('password').addEventListener('blur', () => validateField('password', validatePassword));
        document.getElementById('password-confirm').addEventListener('blur', () => validateField('password-confirm', validatePasswordConfirm));
        document.getElementById('telefono').addEventListener('blur', () => validateField('telefono', validatePhone));

        // Campos de dirección
        document.getElementById('pais').addEventListener('blur', () => validateField('pais', validateRequired));
        document.getElementById('provincia').addEventListener('blur', () => validateField('provincia', validateRequired));
        document.getElementById('ciudad').addEventListener('blur', () => validateField('ciudad', validateCity));
        document.getElementById('calle').addEventListener('blur', () => validateField('calle', validateAddress));
        document.getElementById('codigo-postal').addEventListener('blur', () => validateField('codigo-postal', validatePostalCode));

        // Limpiar errores al escribir (input events)
        setupInputClearing();
    }

    // Función para configurar limpieza de errores al escribir
    function setupInputClearing() {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                clearFieldError(this.id);
            });
            input.addEventListener('change', function() {
                clearFieldError(this.id);
            });
        });
    }

    // Función para validar un campo individual
    function validateField(fieldId, validationFunction) {
        const field = document.getElementById(fieldId);
        const error = validationFunction(field.value, fieldId);

        if (error) {
            showFieldError(fieldId, error);
        } else {
            showFieldSuccess(fieldId);
        }
    }

    // Función principal de validación (para submit)
    function validateForm() {
        let isValid = true;
        clearAllErrors();

        // Validaciones por sección
        isValid &= validatePersonalData();
        isValid &= validateContactData();
        isValid &= validateAddressData();
        isValid &= validatePreferencesData();

        return isValid;
    }

    // FUNCIONES DE VALIDACIÓN INDIVIDUALES
    function validateName(value) {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!value.trim()) return 'El nombre es requerido';
        if (value.length < 3 || value.length > 60) return 'El nombre debe tener entre 3 y 60 caracteres';
        if (!nameRegex.test(value)) return 'El nombre solo puede contener letras y espacios';
        return null;
    }

    function validateBirthDate(value) {
        if (!value) return 'La fecha de nacimiento es requerida';
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) return 'Debes ser mayor de 18 años';
        return null;
    }

    function validateRut(value) {
        if (!value.trim()) return 'El RUT es requerido';
        if (!validateRutFormat(value)) return 'El RUT no tiene un formato válido';
        return null;
    }

    function validateRequired(value) {
        if (!value.trim()) return 'Este campo es requerido';
        return null;
    }

    function validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'El email es requerido';
        if (!emailRegex.test(value)) return 'El email no tiene un formato válido';
        return null;
    }

    function validateEmailConfirm(value) {
        const email = document.getElementById('email').value;
        if (!value.trim()) return 'La confirmación del email es requerida';
        if (value !== email) return 'Los emails no coinciden';
        return null;
    }

    function validatePassword(value) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!value) return 'La contraseña es requerida';
        if (!passwordRegex.test(value)) return 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial';
        return null;
    }

    function validatePasswordConfirm(value) {
        const password = document.getElementById('password').value;
        if (!value) return 'La confirmación de contraseña es requerida';
        if (value !== password) return 'Las contraseñas no coinciden';
        return null;
    }

    function validatePhone(value) {
        const phoneRegex = /^[\d\s\-\+]+$/;
        const digitsOnly = value.replace(/\D/g, '');
        if (!value.trim()) return 'El teléfono es requerido';
        if (!phoneRegex.test(value)) return 'El teléfono contiene caracteres inválidos';
        if (digitsOnly.length < 8) return 'El teléfono debe tener al menos 8 dígitos';
        return null;
    }

    function validateCity(value) {
        const cityRegex = /^[a-zA-Z\s]+$/;
        if (!value.trim()) return 'La ciudad es requerida';
        if (value.length < 2) return 'La ciudad debe tener al menos 2 caracteres';
        if (!cityRegex.test(value)) return 'La ciudad solo puede contener letras y espacios';
        return null;
    }

    function validateAddress(value) {
        if (!value.trim()) return 'La dirección es requerida';
        if (value.length < 5) return 'La dirección debe tener al menos 5 caracteres';
        return null;
    }

    function validatePostalCode(value) {
        const postalRegex = /^[a-zA-Z0-9]+$/;
        if (!value.trim()) return 'El código postal es requerido';
        if (value.length < 4 || value.length > 10) return 'El código postal debe tener entre 4 y 10 caracteres';
        if (!postalRegex.test(value)) return 'El código postal solo puede contener letras y números';
        return null;
    }

    // FUNCIONES DE VALIDACIÓN POR SECCIONES (para submit)
    function validatePersonalData() {
        let isValid = true;

        const fields = [
            { id: 'nombre', validator: validateName },
            { id: 'nacimiento', validator: validateBirthDate },
            { id: 'documento', validator: validateRut },
            { id: 'genero', validator: validateRequired },
            { id: 'nacionalidad', validator: validateRequired }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            const error = field.validator(element.value);
            if (error) {
                showFieldError(field.id, error);
                isValid = false;
            } else {
                showFieldSuccess(field.id);
            }
        });

        return isValid;
    }

    function validateContactData() {
        let isValid = true;

        const fields = [
            { id: 'email', validator: validateEmail },
            { id: 'email-confirm', validator: validateEmailConfirm },
            { id: 'password', validator: validatePassword },
            { id: 'password-confirm', validator: validatePasswordConfirm },
            { id: 'telefono', validator: validatePhone }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            const error = field.validator(element.value);
            if (error) {
                showFieldError(field.id, error);
                isValid = false;
            } else {
                showFieldSuccess(field.id);
            }
        });

        return isValid;
    }

    function validateAddressData() {
        let isValid = true;

        const fields = [
            { id: 'pais', validator: validateRequired },
            { id: 'provincia', validator: validateRequired },
            { id: 'ciudad', validator: validateCity },
            { id: 'calle', validator: validateAddress },
            { id: 'codigo-postal', validator: validatePostalCode }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            const error = field.validator(element.value);
            if (error) {
                showFieldError(field.id, error);
                isValid = false;
            } else {
                showFieldSuccess(field.id);
            }
        });

        return isValid;
    }

    function validatePreferencesData() {
        let isValid = true;

        // Categorías de interés
        const intereses = document.querySelectorAll('input[name="interes"]:checked');
        if (intereses.length === 0) {
            showFieldError('intereses-group', 'Debes seleccionar al menos una categoría de interés.');
            isValid = false;
        } else {
            clearFieldError('intereses-group');
        }

        // Tipo de cliente
        const tipoCliente = document.querySelector('input[name="tipo-cliente"]:checked');
        if (!tipoCliente) {
            showFieldError('tipo-cliente-group', 'Debes seleccionar un tipo de cliente.');
            isValid = false;
        } else {
            clearFieldError('tipo-cliente-group');
        }

        // Términos y condiciones
        const terminos = document.getElementById('terminos');
        if (!terminos.checked) {
            showFieldError('terminos', 'Debes aceptar los Términos y Condiciones.');
            isValid = false;
        } else {
            clearFieldError('terminos');
        }

        // Política de privacidad
        const privacidad = document.getElementById('privacidad');
        if (!privacidad.checked) {
            showFieldError('privacidad', 'Debes aceptar la Política de Privacidad.');
            isValid = false;
        } else {
            clearFieldError('privacidad');
        }

        return isValid;
    }

    // FUNCIONES DE MANEJO DE ERRORES Y RETROALIMENTACIÓN VISUAL
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Agregar clase de error
        field.classList.remove('campo-ok');
        field.classList.add('campo-error');

        // Remover mensaje de error existente
        clearFieldError(fieldId);

        // Crear y mostrar nuevo mensaje de error
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        // Insertar después del campo
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    function showFieldSuccess(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Agregar clase de éxito
        field.classList.remove('campo-error');
        field.classList.add('campo-ok');

        // Remover mensaje de error
        clearFieldError(fieldId);
    }

    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Remover clases
        field.classList.remove('campo-error', 'campo-ok');

        // Remover mensaje de error existente
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    function clearAllErrors() {
        // Limpiar todas las clases de error
        document.querySelectorAll('.campo-error, .campo-ok').forEach(el => {
            el.classList.remove('campo-error', 'campo-ok');
        });

        // Remover todos los mensajes de error
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }

    // Función para validar RUT chileno
    function validateRutFormat(rut) {
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

    // Función para mostrar mensaje de éxito
    function showSuccessMessage() {
        const nombre = document.getElementById('nombre').value;
        const form = document.querySelector('.registration-form');
        const successMessage = document.getElementById('success-message');
        const successText = document.getElementById('success-text');

        // Personalizar mensaje con el nombre
        successText.textContent = `¡Bienvenido ${nombre}! Hemos registrado tu cuenta correctamente en GlobalImport S.A.`;

        // Ocultar formulario y mostrar mensaje de éxito
        form.style.display = 'none';
        successMessage.classList.add('show');
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