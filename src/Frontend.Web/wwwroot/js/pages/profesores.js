$(document).ready(function () {
    let table;
    let profesorIdParaEliminar = null;

    // Inicializar DataTable
    function initTable() {
        table = $('#tableProfesores').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: '/Profesores/GetProfesores',
                type: 'GET',
                data: function (d) {
                    return {
                        page: (d.start / d.length) + 1,
                        pageSize: d.length
                    };
                },
                dataSrc: function (json) {
                    if (!json.success) {
                        AjaxHelper.showError(json.message || 'Error al cargar los profesores');
                        return [];
                    }
                    return json.data || [];
                },
                error: function (xhr) {
                    AjaxHelper.showError('Error al cargar los profesores');
                }
            },
            columns: [
                { data: 'id' },
                { data: 'nombre' },
                { data: 'correo' },
                { data: 'edad' },
                {
                    data: 'salario',
                    render: function (data) {
                        return '$' + parseFloat(data).toLocaleString('es-ES', { minimumFractionDigits: 2 });
                    }
                },
                {
                    data: 'id',
                    render: function (data) {
                        return `
                            <button class="btn btn-sm btn-info btnVer" data-id="${data}" title="Ver">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning btnEditar" data-id="${data}" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btnEliminar" data-id="${data}" data-nombre="${data}" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        `;
                    },
                    orderable: false,
                    searchable: false
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json'
            },
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]]
        });
    }

    // ============== VALIDACIONES POR CAMPO ==============

    // Validar Nombre
    $('#nombre').on('blur input', function () {
        const valor = $(this).val().trim();
        const grupo = $(this).closest('.mb-3');
        const feedback = grupo.find('.invalid-feedback');

        if (valor === '') {
            grupo.addClass('was-validated');
            $(this).addClass('is-invalid');
            feedback.text('Nombre es requerido.');
        } else if (valor.length > 200) {
            grupo.addClass('was-validated');
            $(this).addClass('is-invalid');
            feedback.text('Nombre no debe exceder 200 caracteres.');
        } else {
            grupo.removeClass('was-validated');
            $(this).removeClass('is-invalid');
            feedback.text('');
        }
    });

    // Validar Correo
    $('#correo').on('blur input', function () {
        const valor = $(this).val().trim();
        const grupo = $(this).closest('.mb-3');
        const feedback = grupo.find('.invalid-feedback');
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (valor === '') {
            grupo.addClass('was-validated');
            $(this).addClass('is-invalid');
            feedback.text('Correo es requerido.');
        } else if (!regexEmail.test(valor)) {
            grupo.addClass('was-validated');
            $(this).addClass('is-invalid');
            feedback.text('Correo inválido.');
        } else if (valor.length > 255) {
            grupo.addClass('was-validated');
            $(this).addClass('is-invalid');
            feedback.text('Correo no debe exceder 255 caracteres.');
        } else {
            grupo.removeClass('was-validated');
            $(this).removeClass('is-invalid');
            feedback.text('');
        }
    });

    // Validar Edad
    $('#edad').on('blur input change', function () {
        const valor = $(this).val();
        const grupo = $(this).closest('.mb-3');
        const feedback = grupo.find('.invalid-feedback');

        if (valor === '') {
            grupo.addClass('was-validated');
            $(this).addClass('is-invalid');
            feedback.text('Edad es requerida.');
        } else {
            const edad = parseInt(valor);
            if (isNaN(edad) || edad < 18 || edad > 65) {
                grupo.addClass('was-validated');
                $(this).addClass('is-invalid');
                feedback.text('Edad debe estar entre 18 y 65 años.');
            } else {
                grupo.removeClass('was-validated');
                $(this).removeClass('is-invalid');
                feedback.text('');
            }
        }
    });

    // Validar Salario
    $('#salario').on('keydown', function (e) {

        if (isNaN(e.key) && e.keyCode != 8 && e.key != '.') {
            return false;
        }

        if (e.keyCode == 8) {
            return true;
        }


        let value = $(this).val()
        if (e.key == '.' && value.includes(".")) {
            e.preventDefault();
        }
        if (value.includes(".")) {

            let partes = value.split(".");
            if (partes[1].length == 2) {

                e.preventDefault();
            }
        }

        return true;

    });





    $('#salario').on('blur change', function () {
        const valor = $(this).val();
        const grupo = $(this).closest('.mb-3');
        const feedback = grupo.find('.invalid-feedback');

        if (valor === '') {
            grupo.addClass('was-validated');
            $(this).addClass('is-invalid');
            feedback.text('Salario es requerido.');
        } else {
            const salario = parseFloat(valor);

            // Validar decimales
            const decimales = valor.includes('.') ? valor.split('.')[1].length : 0;
            if (decimales > 2) {
                grupo.addClass('was-validated');
                $(this).addClass('is-invalid');
                feedback.text('Salario debe tener máximo 2 decimales.');
            } else if (isNaN(salario) || salario <= 0) {
                grupo.addClass('was-validated');
                $(this).addClass('is-invalid');
                feedback.text('Salario debe ser mayor a 0.');
            } else if (salario >= 10000) {
                grupo.addClass('was-validated');
                $(this).addClass('is-invalid');
                feedback.text('Salario debe ser menor a 10000.');
            } else {
                grupo.removeClass('was-validated');
                $(this).removeClass('is-invalid');
                feedback.text('');
            }
        }
    });

    // Función para validar todo el formulario
    function validarFormulario() {
        let esValido = true;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validar Nombre
        const nombre = $('#nombre').val().trim();
        if (nombre === '' || nombre.length > 200) {
            $('#nombre').closest('.mb-3').addClass('was-validated');
            $('#nombre').addClass('is-invalid');
            esValido = false;
        }

        // Validar Correo
        const correo = $('#correo').val().trim();
        if (correo === '' || !regexEmail.test(correo) || correo.length > 255) {
            $('#correo').closest('.mb-3').addClass('was-validated');
            $('#correo').addClass('is-invalid');
            esValido = false;
        }

        // Validar Edad
        const edad = parseInt($('#edad').val());
        if (isNaN(edad) || edad < 18 || edad > 65) {
            $('#edad').closest('.mb-3').addClass('was-validated');
            $('#edad').addClass('is-invalid');
            esValido = false;
        }

        // Validar Salario
        const salarioValor = $('#salario').val();
        const salario = parseFloat(salarioValor);
        const decimales = salarioValor.includes('.') ? salarioValor.split('.')[1].length : 0;

        if (isNaN(salario) || salario <= 0 || salario >= 10000 || decimales > 2) {
            $('#salario').closest('.mb-3').addClass('was-validated');
            $('#salario').addClass('is-invalid');
            esValido = false;
        }

        return esValido;
    }

    // ============== FIN VALIDACIONES ==============
    $('#btnNuevoProfesor').click(function () {
        $('#profesorId').val('');
        $('#modalProfesorLabel').text('Nuevo Profesor');
        $('#formProfesor')[0].reset();
        // Limpiar validaciones
        $('#formProfesor').find('.was-validated').removeClass('was-validated');
        $('#formProfesor').find('.is-invalid').removeClass('is-invalid');
        $('#formProfesor').find('.invalid-feedback').text('');
        $('#alertaError').addClass('d-none');
        $('#modalProfesor').modal('show');
    });

    // Guardar profesor
    $('#btnGuardarProfesor').click(function () {
        // Validar formulario antes de enviar
        if (!validarFormulario()) {
            AjaxHelper.showError('Por favor corrija los errores del formulario.');
            return;
        }

        const profesorId = $('#profesorId').val();
        const formData = {
            nombre: $('#nombre').val(),
            correo: $('#correo').val(),
            edad: parseInt($('#edad').val()),
            salario: parseFloat($('#salario').val())
        };

        if (profesorId) {
            formData.id = parseInt(profesorId);
        }

        const isNew = !profesorId;
        const url = isNew ? '/Profesores/Create' : '/Profesores/Update';
        const type = isNew ? 'POST' : 'PUT';

        AjaxHelper.request({
            url: url,
            type: type,
            data: formData,
            success: function (response) {
                if (response.success) {
                    $('#modalProfesor').modal('hide');
                    table.ajax.reload();
                }
            },
            error: function (xhr) {
                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    AjaxHelper.showFormErrors('formProfesor', xhr.responseJSON.errors);
                }
            }
        });
    });

    // Ver detalle
    $(document).on('click', '.btnVer', function () {
        const id = $(this).data('id');

        AjaxHelper.request({
            url: '/Profesores/GetById?id=' + id,
            type: 'GET',
            showLoading: true,
            showSuccess: false,
            success: function (response) {
                if (response.data) {
                    const profesor = response.data;
                    const detalle = `
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>ID:</strong></div>
                            <div class="col-md-8">${profesor.id}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>Nombre:</strong></div>
                            <div class="col-md-8">${profesor.nombre}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>Correo:</strong></div>
                            <div class="col-md-8">${profesor.correo}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>Edad:</strong></div>
                            <div class="col-md-8">${profesor.edad}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>Salario:</strong></div>
                            <div class="col-md-8">$${parseFloat(profesor.salario).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
                        </div>
                    `;
                    $('#detalleProfesorContent').html(detalle);
                    $('#modalDetalleProfesor').modal('show');
                }
            }
        });
    });

    // Editar
    $(document).on('click', '.btnEditar', function () {
        const id = $(this).data('id');

        AjaxHelper.request({
            url: '/Profesores/GetById?id=' + id,
            type: 'GET',
            showLoading: true,
            showSuccess: false,
            success: function (response) {
                if (response.data) {
                    const profesor = response.data;
                    $('#profesorId').val(profesor.id);
                    $('#nombre').val(profesor.nombre);
                    $('#correo').val(profesor.correo);
                    $('#edad').val(profesor.edad);
                    $('#salario').val(profesor.salario);
                    $('#modalProfesorLabel').text('Editar Profesor');
                    $('#alertaError').addClass('d-none');
                    // Limpiar validaciones
                    $('#formProfesor').find('.was-validated').removeClass('was-validated');
                    $('#formProfesor').find('.is-invalid').removeClass('is-invalid');
                    $('#formProfesor').find('.invalid-feedback').text('');
                    $('#modalProfesor').modal('show');
                }
            }
        });
    });

    // Eliminar
    $(document).on('click', '.btnEliminar', function () {
        profesorIdParaEliminar = $(this).data('id');
        AjaxHelper.request({
            url: '/Profesores/GetById?id=' + profesorIdParaEliminar,
            type: 'GET',
            showLoading: false,
            showSuccess: false,
            success: function (response) {
                if (response.data) {
                    $('#nombreProfesorEliminar').text(response.data.nombre);
                }
            }
        });
        $('#modalConfirmarEliminar').modal('show');
    });

    // Confirmar eliminación
    $('#btnConfirmarEliminar').click(function () {
        if (profesorIdParaEliminar) {
            AjaxHelper.request({
                url: '/Profesores/Delete?id=' + profesorIdParaEliminar,
                type: 'DELETE',
                success: function (response) {
                    if (response.success) {
                        $('#modalConfirmarEliminar').modal('hide');
                        table.ajax.reload();
                    }
                }
            });
        }
    });

    // Inicializar
    initTable();
});
