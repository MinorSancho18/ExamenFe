/**
 * Helper AJAX centralizado para manejo de solicitudes
 * Maneja respuestas, errores y mensajes de forma consistente
 */
const AjaxHelper = {
    /**
     * Realizar una solicitud AJAX
     * @param {Object} options - Opciones de configuración
     */
    request: function (options) {
        const defaults = {
            url: '',
            type: 'GET',
            data: null,
            contentType: 'application/json',
            dataType: 'json',
            showLoading: true,
            successMessage: null,
            errorMessage: null,
            showSuccess: true
        };

        const settings = Object.assign({}, defaults, options);

        if (settings.showLoading) {
            this.showLoading();
        }

        return $.ajax({
            url: settings.url,
            type: settings.type,
            data: settings.data ? JSON.stringify(settings.data) : null,
            contentType: settings.contentType,
            dataType: settings.dataType,
            success: function (response) {
                if (settings.showLoading) {
                    AjaxHelper.hideLoading();
                }
                if (settings.showSuccess !== false) {
                    AjaxHelper.handleSuccess(response, settings);
                }
                if (settings.success) {
                    settings.success(response);
                }
            },
            error: function (xhr, status, error) {
                if (settings.showLoading) {
                    AjaxHelper.hideLoading();
                }
                AjaxHelper.handleError(xhr, settings);
                if (settings.error) {
                    settings.error(xhr, status, error);
                }
            }
        });
    },

    /**
     * Procesar respuesta exitosa
     */
    handleSuccess: function (response, settings) {
        // Si la respuesta tiene propiedad 'success' explícita
        if (response.hasOwnProperty('success')) {
            if (response.success === false) {
                this.showError(response.message || settings.errorMessage || 'Ocurrió un error');
                return;
            }
        }

        const message = settings.successMessage || response.message || 'Operación completada exitosamente';
        this.showSuccess(message);
    },

    /**
     * Procesar error HTTP
     */
    handleError: function (xhr, settings) {
        let errorMessage = settings.errorMessage || 'Error en la solicitud';
        let errors = [];

        try {
            if (xhr.responseJSON) {
                const response = xhr.responseJSON;
                errorMessage = response.message || response.error || errorMessage;
                
                if (response.errors) {
                    if (Array.isArray(response.errors)) {
                        errors = response.errors;
                    } else if (typeof response.errors === 'object') {
                        errors = Object.values(response.errors).flat();
                    }
                }
            }
        } catch (e) {
            // Ignorar errores al parsear
        }

        const fullMessage = errors.length > 0 
            ? errorMessage + ': ' + errors.join(', ')
            : errorMessage;

        this.showError(fullMessage);
    },

    /**
     * Mostrar alerta de éxito
     */
    showSuccess: function (message) {
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: message,
            confirmButtonText: 'OK',
            confirmButtonColor: '#28a745'
        });
    },

    /**
     * Mostrar alerta de error
     */
    showError: function (message) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        });
    },

    /**
     * Mostrar alerta de confirmación
     */
    confirm: function (message, callback) {
        Swal.fire({
            icon: 'warning',
            title: 'Confirmación',
            text: message,
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed && callback) {
                callback();
            }
        });
    },

    /**
     * Mostrar indicador de carga
     */
    showLoading: function () {
        // Puedes implementar un spinner aquí si lo deseas
        console.log('Cargando...');
    },

    /**
     * Ocultar indicador de carga
     */
    hideLoading: function () {
        console.log('Carga completada');
    },

    /**
     * Validar formulario y obtener errores
     */
    getFormErrors: function (formId) {
        const form = document.getElementById(formId);
        const errors = {};

        if (form) {
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    errors[input.name] = input.validationMessage;
                }
            });
        }

        return errors;
    },

    /**
     * Mostrar errores en formulario
     */
    showFormErrors: function (formId, errors) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Limpiar errores previos
        form.querySelectorAll('.invalid-feedback').forEach(el => {
            el.textContent = '';
        });

        // Mostrar nuevos errores
        Object.keys(errors).forEach(fieldName => {
            const errorElement = document.getElementById(fieldName + 'Error');
            if (errorElement) {
                errorElement.textContent = errors[fieldName];
            }
        });
    }
};
