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
                    if (json.data && json.data.items) {
                        return json.data.items;
                    }
                    return [];
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

    // Nuevo profesor
    $('#btnNuevoProfesor').click(function () {
        $('#profesorId').val('');
        $('#modalProfesorLabel').text('Nuevo Profesor');
        $('#formProfesor')[0].reset();
        $('#alertaError').addClass('d-none');
        $('#modalProfesor').modal('show');
    });

    // Guardar profesor
    $('#btnGuardarProfesor').click(function () {
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
            success: function (response) {
                if (response.data) {
                    const profesor = response.data;
                    const detalle = `
                        <dl class="row">
                            <dt class="col-sm-4">ID:</dt>
                            <dd class="col-sm-8">${profesor.id}</dd>
                            
                            <dt class="col-sm-4">Nombre:</dt>
                            <dd class="col-sm-8">${profesor.nombre}</dd>
                            
                            <dt class="col-sm-4">Correo:</dt>
                            <dd class="col-sm-8">${profesor.correo}</dd>
                            
                            <dt class="col-sm-4">Edad:</dt>
                            <dd class="col-sm-8">${profesor.edad}</dd>
                            
                            <dt class="col-sm-4">Salario:</dt>
                            <dd class="col-sm-8">$${parseFloat(profesor.salario).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</dd>
                        </dl>
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
