document.addEventListener("DOMContentLoaded", function () {
    const btnAgregar = document.getElementById('btnAgregar');
    const modalAgregar = document.getElementById('modalAgregar');
    const modalModificar = document.getElementById('modalModificar');
    const modalEliminar = document.getElementById('modalEliminar');
    const btnCancelarAgregar = document.getElementById('btnCancelarAgregar');
    const btnGuardarProducto = document.getElementById('btnGuardarProducto');
    const btnCancelarModificar = document.getElementById('btnCancelarModificar');
    const btnConfirmarModicar = document.getElementById('btnConfirmarModificar');
    const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    const cuerpoTabla = document.getElementById('cuerpoTabla');

    let productos = [];

    cargarProductos();

    btnAgregar.addEventListener('click', abrirModalAgregar);
    btnCancelarAgregar.addEventListener('click', cerrarModalAgregar);   
    btnGuardarProducto.addEventListener('click', guardarProducto);
    btnCancelarModificar.addEventListener('click', cerrarModalModificar);
    btnConfirmarModicar.addEventListener('click', confirmarModicacion);
    btnCancelarEliminar.addEventListener('click', cerrarModalEliminar);
    btnConfirmarEliminar.addEventListener('click', confirmarEliminacion);

    //Funciones

    function cargarProductos() {
        fetch('/api/articulos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.redirected){
                window.location.href = response.url;
                return;
            }

            // Verificar el tipo de contenido
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('El servidor no devolvió JSON');
            }

            if (!response.ok){
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            if (data){
                productos = data;
                actualizarTabla();
            }
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
    }

    function actualizarTabla(){
        cuerpoTabla.innerHTML = '';

        if(productos.length === 0) {
            cuerpoTabla.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">No hay productos registrados</td>
                </tr>`;
            return;
        }

        productos.forEach((producto) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${Number(producto.precio).toFixed(2)}bs.</td>
                <td class="acciones">
                    <button class="btn-editar" data-index="${producto.id}">Editar</button>
                    <button class="btn-eliminar" data-index="${producto.id}">Eliminar</button>
                </td>`;
            cuerpoTabla.appendChild(fila);
        });

        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', abrirModalModificar);
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', abrirModalEliminar);
        });

    }

    function abrirModalAgregar() {
        document.getElementById('nombreProducto').value = '';
        document.getElementById('precioProducto').value = '';
        
        modalAgregar.style.display = 'flex';
    }

    function cerrarModalAgregar() {
        modalAgregar.style.display = 'none';
    }

    function guardarProducto(){
        const nombre = document.getElementById('nombreProducto').value.trim();
        const precio = document.getElementById('precioProducto').value;

        if (!nombre || !precio) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const precioNumerico = parseFloat(precio);

        const datos = {
            nombre: nombre,
            precio: precioNumerico
        };

        console.log('Datos a enviar:', datos);

        fetch('/api/articulos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Error al guardar el producto');
            } else {
                cerrarModalAgregar();
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error al guardar el producto:', error);
        });
    }

    function abrirModalModificar(event){
        const productoId = Number(event.target.dataset.index);
        console.log('ID del producto buscado:', productoId, 'Tipo:', typeof productoId);
        console.log('IDs disponibles:', productos.map(p => ({ id: p.id, tipo: typeof p.id })));
        const producto = productos.find(p => p.id === productoId);
        if (!producto) {
            console.error('Producto no encontrado:', productoId);
            return;
        }

        document.getElementById('nombreModificar').value = producto.nombre || '';
        document.getElementById('precioModificar').value = producto.precio || 0;
        document.getElementById('indiceModificar').value = producto.id;

        modalModificar.style.display = 'flex';
    }

    function cerrarModalModificar() {
        modalModificar.style.display = 'none';
    }

    function confirmarModicacion(){
        const id = document.getElementById('indiceModificar').value;
        const nombre = document.getElementById('nombreModificar').value.trim();
        const precio = document.getElementById('precioModificar').value.trim();

        if(!nombre || !precio) {
            alert('Por favor, complete todos los campos.');
            return;
        }
        const datos = {
            nombre: nombre,
            precio: precio
        };

        fetch(`/api/articulos/edit/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Error al modificar el producto');
            }
            else {
                cerrarModalModificar();
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error al modificar el producto:', error);
        });

    }

    function abrirModalEliminar(event){
        const productoId = Number(event.target.dataset.index);

        document.getElementById('indiceEliminar').value = productoId;

        modalEliminar.style.display = 'flex';
    }

    function cerrarModalEliminar() {
        modalEliminar.style.display = 'none';
    }

    function confirmarEliminacion(){
        const id = document.getElementById('indiceEliminar').value;
            
            fetch(`/api/articulos/delete/${id}`, {
                method: 'POST'
            })
            .then(response => {
                if(!response.ok){
                    throw new Error('Error al eliminar el producto');
                } else {
                    cerrarModalEliminar();
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error al eliminar el producto:', error);
            });
    }
});

