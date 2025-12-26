$(document).ready(function () {
    let table;
    let cursoIdParaEliminar = null;

    // Inicializar DataTable
    function initTable() {
        table = $('#tableCursos').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: '/Cursos/GetCursos',
                type: 'GET',
                data: function (d) {
                    return {
                        page: (d.start / d.length) + 1,
                        pageSize: d.length
                    };
                },
                dataSrc: function (json) {
                    if (!json.success) {
                        AjaxHelper.showError(json.message || 'Error al cargar los cursos');
                        return [];
                    }
                    return json.data || [];
                },
                error: function (xhr) {
                    AjaxHelper.showError('Error al cargar los cursos');
                }
            },
            columns: [
                { data: 'id' },
                { data: 'nombre' },
                { data: 'codigo' },
                {
                    data: 'fechaInicio',
                    render: function (data) {
                        return new Date(data).toLocaleDateString('es-ES');
                    }
                },
                {
                    data: 'fechaFin',
                    render: function (data) {
                        return new Date(data).toLocaleDateString('es-ES');
                    }
                },
                { data: 'idProfesor' },
                {
                    data: 'activo',
                    render: function (data) {
                        return data ? '<span class="badge bg-success">Activo</span>' : '<span class="badge bg-danger">Inactivo</span>';
                    }
                },
                {
                    data: 'id',
                    render: function (data, type, row) {
                        return `
                            <button class="btn btn-sm btn-info btnVer" data-id="${data}" title="Ver">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning btnEditar" data-id="${data}" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btnEliminar" data-id="${data}" data-nombre="${row.nombre}" title="Eliminar">
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

    // Cargar profesores en el select
    function loadProfesores() {
        AjaxHelper.request({
            url: '/Profesores/GetProfesores',
            type: 'GET',
            data: { page: 1, pageSize: 1000 },
            showLoading: false,
            success: function (response) {
                const select = $('#idProfesor');
                select.empty();
                select.append('<option value="">Seleccionar profesor...</option>');
                
                if (response.data && Array.isArray(response.data)) {
                    response.data.forEach(profesor => {
                        select.append(`<option value="${profesor.id}">${profesor.nombre}</option>`);
                    });
                }
            }
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
            feedback.text('Nombre debe tener máximo 200 caracteres.');
        } else {
            grupo.removeClass('was-validated');
            $(this).removeClass('is-invalid');
            feedback.text('');
        }
    });

    // Validar Código
    $('#codigo').on('blur input', function () {
        const valor = $(this).val().trim();
        const grupo = $(this).closest('.mb-3');
        const feedback = grupo.find('.invalid-feedback');

        if (valor === '') {
            grupo.addClass('was-validated');
            $(this).addClass('is-invalid');
            feedback.text('Código es requerido.');
        } else if (valor.length !== 4) {
            grupo.addClass('was-validated');
            $(this).addClass('is-invalid');
            feedback.text('Código debe tener exactamente 4 caracteres.');
        } else if (!/^[a-zA-Z0-9]{4}$/.test(valor)) {
            grupo.addClass('was-validated');
            $(this).addClass('is-invalid');
            feedback.text('Código debe contener solo letras y números.');
        } else {
            grupo.removeClass('was-validated');
            $(this).removeClass('is-invalid');
            feedback.text('');
        }
    });

    // Validar Fechas
    $('#fechaInicio, #fechaFin').on('blur change', function () {
        validarFechas();
    });

    function validarFechas() {
        const fechaInicio = $('#fechaInicio').val();
        const fechaFin = $('#fechaFin').val();

        const grupoInicio = $('#fechaInicio').closest('.mb-3');
        const feedbackInicio = grupoInicio.find('.invalid-feedback');
        const grupoFin = $('#fechaFin').closest('.mb-3');
        const feedbackFin = grupoFin.find('.invalid-feedback');

        // Validar Fecha Inicio
        if (fechaInicio === '') {
            grupoInicio.addClass('was-validated');
            $('#fechaInicio').addClass('is-invalid');
            feedbackInicio.text('Fecha de inicio es requerida.');
        } else {
            const date = new Date(fechaInicio);
            if (isNaN(date.getTime())) {
                grupoInicio.addClass('was-validated');
                $('#fechaInicio').addClass('is-invalid');
                feedbackInicio.text('Fecha de inicio debe ser una fecha válida.');
            } else {
                grupoInicio.removeClass('was-validated');
                $('#fechaInicio').removeClass('is-invalid');
                feedbackInicio.text('');
            }
        }

        // Validar Fecha Fin
        if (fechaFin === '') {
            grupoFin.addClass('was-validated');
            $('#fechaFin').addClass('is-invalid');
            feedbackFin.text('Fecha de fin es requerida.');
        } else {
            const date = new Date(fechaFin);
            if (isNaN(date.getTime())) {
                grupoFin.addClass('was-validated');
                $('#fechaFin').addClass('is-invalid');
                feedbackFin.text('Fecha de fin debe ser una fecha válida.');
            } else if (fechaInicio !== '') {
                const dateInicio = new Date(fechaInicio);
                const dateFin = new Date(fechaFin);
                if (dateFin <= dateInicio) {
                    grupoFin.addClass('was-validated');
                    $('#fechaFin').addClass('is-invalid');
                    feedbackFin.text('Fecha de fin debe ser mayor a la fecha de inicio.');
                } else {
                    grupoFin.removeClass('was-validated');
                    $('#fechaFin').removeClass('is-invalid');
                    feedbackFin.text('');
                }
            } else {
                grupoFin.removeClass('was-validated');
                $('#fechaFin').removeClass('is-invalid');
                feedbackFin.text('');
            }
        }
    }

    // Validar IdProfesor
    $('#idProfesor').on('blur change', function () {
        const valor = $(this).val();
        const grupo = $(this).closest('.mb-3');
        const feedback = grupo.find('.invalid-feedback');

        if (!valor || valor === '') {
            grupo.addClass('was-validated');
            $(this).addClass('is-invalid');
            feedback.text('Debe seleccionar un profesor.');
        } else {
            const id = parseInt(valor);
            if (isNaN(id) || id <= 0) {
                grupo.addClass('was-validated');
                $(this).addClass('is-invalid');
                feedback.text('IdProfesor debe ser mayor a 0.');
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

        // Validar Nombre
        const nombre = $('#nombre').val().trim();
        if (nombre === '' || nombre.length > 200) {
            $('#nombre').closest('.mb-3').addClass('was-validated');
            $('#nombre').addClass('is-invalid');
            esValido = false;
        }

        // Validar Código
        const codigo = $('#codigo').val().trim();
        if (codigo === '' || codigo.length !== 4 || !/^[a-zA-Z0-9]{4}$/.test(codigo)) {
            $('#codigo').closest('.mb-3').addClass('was-validated');
            $('#codigo').addClass('is-invalid');
            esValido = false;
        }

        // Validar Fechas
        const fechaInicio = $('#fechaInicio').val();
        const fechaFin = $('#fechaFin').val();
        
        if (!fechaInicio || isNaN(new Date(fechaInicio).getTime())) {
            $('#fechaInicio').closest('.mb-3').addClass('was-validated');
            $('#fechaInicio').addClass('is-invalid');
            esValido = false;
        }
        
        if (!fechaFin || isNaN(new Date(fechaFin).getTime())) {
            $('#fechaFin').closest('.mb-3').addClass('was-validated');
            $('#fechaFin').addClass('is-invalid');
            esValido = false;
        } else if (fechaInicio && new Date(fechaFin) <= new Date(fechaInicio)) {
            $('#fechaFin').closest('.mb-3').addClass('was-validated');
            $('#fechaFin').addClass('is-invalid');
            esValido = false;
        }

        // Validar Profesor
        const idProfesor = $('#idProfesor').val();
        if (!idProfesor || parseInt(idProfesor) <= 0) {
            $('#idProfesor').closest('.mb-3').addClass('was-validated');
            $('#idProfesor').addClass('is-invalid');
            esValido = false;
        }

        return esValido;
    }

    // ============== FIN VALIDACIONES ==============

    // Nuevo curso
    $('#btnNuevoCurso').click(function () {
        $('#cursoId').val('');
        $('#modalCursoLabel').text('Nuevo Curso');
        $('#formCurso')[0].reset();
        // Limpiar validaciones
        $('#formCurso').find('.was-validated').removeClass('was-validated');
        $('#formCurso').find('.is-invalid').removeClass('is-invalid');
        $('#formCurso').find('.invalid-feedback').text('');
        $('#alertaError').addClass('d-none');
        $('#modalCurso').modal('show');
    });

    // Guardar curso
    $('#btnGuardarCurso').click(function () {
        // Validar formulario antes de enviar
        if (!validarFormulario()) {
            AjaxHelper.showError('Por favor corrija los errores del formulario.');
            return;
        }

        const cursoId = $('#cursoId').val();
        const formData = {
            nombre: $('#nombre').val(),
            codigo: $('#codigo').val(),
            fechaInicio: new Date($('#fechaInicio').val()).toISOString(),
            fechaFin: new Date($('#fechaFin').val()).toISOString(),
            idProfesor: parseInt($('#idProfesor').val())
        };

        if (cursoId) {
            formData.id = parseInt(cursoId);
        }

        const isNew = !cursoId;
        const url = isNew ? '/Cursos/Create' : '/Cursos/Update';
        const type = isNew ? 'POST' : 'PUT';

        AjaxHelper.request({
            url: url,
            type: type,
            data: formData,
            success: function (response) {
                if (response.success) {
                    $('#modalCurso').modal('hide');
                    table.ajax.reload();
                }
            },
            error: function (xhr) {
                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    AjaxHelper.showFormErrors('formCurso', xhr.responseJSON.errors);
                }
            }
        });
    });

    // Ver detalle
    $(document).on('click', '.btnVer', function () {
        const id = $(this).data('id');
        
        AjaxHelper.request({
            url: '/Cursos/GetById?id=' + id,
            type: 'GET',
            showLoading: true,
            showSuccess: false,
            success: function (response) {
                if (response.data) {
                    const curso = response.data;
                    const detalle = `
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>ID:</strong></div>
                            <div class="col-md-8">${curso.id}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>Nombre:</strong></div>
                            <div class="col-md-8">${curso.nombre}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>Código:</strong></div>
                            <div class="col-md-8">${curso.codigo}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>Fecha Inicio:</strong></div>
                            <div class="col-md-8">${new Date(curso.fechaInicio).toLocaleDateString('es-ES')}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>Fecha Fin:</strong></div>
                            <div class="col-md-8">${new Date(curso.fechaFin).toLocaleDateString('es-ES')}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>Profesor ID:</strong></div>
                            <div class="col-md-8">${curso.idProfesor}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-4"><strong>Estado:</strong></div>
                            <div class="col-md-8">
                                <span class="badge ${curso.activo ? 'bg-success' : 'bg-danger'}">
                                    ${curso.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                    `;
                    $('#detalleCursoContent').html(detalle);
                    $('#modalDetalleCurso').modal('show');
                }
            }
        });
    });

    // Editar
    $(document).on('click', '.btnEditar', function () {
        const id = $(this).data('id');
        
        AjaxHelper.request({
            url: '/Cursos/GetById?id=' + id,
            type: 'GET',
            showLoading: true,
            showSuccess: false,
            success: function (response) {
                if (response.data) {
                    const curso = response.data;
                    $('#cursoId').val(curso.id);
                    $('#nombre').val(curso.nombre);
                    $('#codigo').val(curso.codigo);
                    $('#fechaInicio').val(new Date(curso.fechaInicio).toISOString().slice(0, 16));
                    $('#fechaFin').val(new Date(curso.fechaFin).toISOString().slice(0, 16));
                    $('#idProfesor').val(curso.idProfesor);
                    $('#modalCursoLabel').text('Editar Curso');
                    $('#alertaError').addClass('d-none');
                    // Limpiar validaciones
                    $('#formCurso').find('.was-validated').removeClass('was-validated');
                    $('#formCurso').find('.is-invalid').removeClass('is-invalid');
                    $('#formCurso').find('.invalid-feedback').text('');
                    $('#modalCurso').modal('show');
                }
            }
        });
    });

    // Eliminar
    $(document).on('click', '.btnEliminar', function () {
        cursoIdParaEliminar = $(this).data('id');
        const nombre = $(this).data('nombre');
        $('#nombreCursoEliminar').text(nombre);
        $('#modalConfirmarEliminar').modal('show');
    });

    // Confirmar eliminación
    $('#btnConfirmarEliminar').click(function () {
        if (cursoIdParaEliminar) {
            AjaxHelper.request({
                url: '/Cursos/Delete?id=' + cursoIdParaEliminar,
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
    loadProfesores();
});
