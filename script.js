// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE LA VENTANA EMERGENTE (MODAL) ---
    const modal = document.getElementById('pedidoModal');
    const btnGrabarPedido = document.getElementById('grabarPedido');
    const spanClose = document.getElementsByClassName('close')[0];

    // Abrir la ventana emergente al hacer clic en "Grabar Pedido"
    btnGrabarPedido.onclick = (e) => {
        e.preventDefault(); // Evitar que el enlace recargue la página
        modal.style.display = 'block';
    }

    // Cerrar la ventana emergente al hacer clic en la "x"
    spanClose.onclick = () => {
        modal.style.display = 'none';
    }

    // Cerrar la ventana emergente si se hace clic fuera de ella
    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    }


    // --- LÓGICA DEL FORMULARIO DE PEDIDO ---
    const clienteIdInput = document.getElementById('clienteId');
    const clienteNombreInput = document.getElementById('clienteNombre');
    const articuloCantInput = document.getElementById('articuloCant');
    const articuloClaveInput = document.getElementById('articuloClave');
    const articuloDescInput = document.getElementById('articuloDesc');
    const articuloImagen = document.getElementById('articuloImagen');
    const btnAgregar = document.getElementById('btnAgregar');
    const detalleTabla = document.querySelector('.detalle-tabla tbody');
    const btnGrabar = document.getElementById('btnGrabar');

    // DATOS DE EJEMPLO (Simulación de Base de Datos)
    const clientesDB = {
        '1358': 'RUBEN TORRES HERNANDES',
        '2000': 'MARIA LOPEZ GARCIA',
        '3000': 'PEDRO MARTINEZ SANCHEZ'
    };

    const productosDB = {
        'QUIN247': {
            desc: 'QUEMADOR ECTRAGRANDE HIERRO 3/4',
            img: 'https://electrodomesticosolvera.com/cdn/shop/files/700a.png?v=1710526710&width=600'
        },
        'QUIN091': {
            desc: 'QUEMADOR CHICO HIERRO FUNDIDO B31-XS',
            img: 'https://static.wixstatic.com/media/893bd5_b786f0c4068c4a03a7499709b5523d4d~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,usm_0.66_1.00_0.01/893bd5_b786f0c4068c4a03a7499709b5523d4d~mv2.jpg'
        },
        'ESTOFA01': {
            desc: 'ESTUFA DE MESA 4 QUEMADORES NEGRA',
            img: 'https://electrodomesticosolvera.com/cdn/shop/files/800f.png?v=1710526710&width=600'
        }
    };


    // Búsqueda automática de Cliente
    clienteIdInput.addEventListener('input', () => {
        const id = clienteIdInput.value;
        if (clientesDB[id]) {
            clienteNombreInput.value = clientesDB[id];
            clienteNombreInput.classList.remove('input-deshabilitado');
        } else {
            clienteNombreInput.value = '';
            clienteNombreInput.placeholder = 'RUBEN TORRES HERNANDES';
            clienteNombreInput.classList.add('input-deshabilitado');
        }
    });

    // Búsqueda automática de Artículo (Descripción e Imagen)
    articuloClaveInput.addEventListener('input', () => {
        const clave = articuloClaveInput.value.toUpperCase(); // Convertir a mayúsculas
        if (productosDB[clave]) {
            const producto = productosDB[clave];
            articuloDescInput.value = producto.desc;
            articuloDescInput.classList.remove('input-deshabilitado');
            articuloImagen.src = producto.img;
        } else {
            articuloDescInput.value = '';
            articuloDescInput.placeholder = 'QUEMADOR ECTRAGRANDE HIERRO 3/4';
            articuloDescInput.classList.add('input-deshabilitado');
            articuloImagen.src = 'https://i.ibb.co/XFh2K7f/image-placeholder.png'; // Imagen por defecto si no se encuentra
        }
    });


    // Botón Agregar Artículo a la Tabla
    btnAgregar.addEventListener('click', () => {
        const cant = articuloCantInput.value;
        const clave = articuloClaveInput.value.toUpperCase();
        const desc = articuloDescInput.value;

        if (cant > 0 && clave !== '' && desc !== '') {
            // Crear una nueva fila
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cant}</td>
                <td>${clave}</td>
                <td>${desc}</td>
            `;
            // Añadir la fila a la tabla
            detalleTabla.appendChild(row);

            // Limpiar los campos de entrada
            articuloCantInput.value = '';
            articuloClaveInput.value = '';
            articuloDescInput.value = '';
            articuloDescInput.classList.add('input-deshabilitado');
            articuloImagen.src = 'https://i.ibb.co/XFh2K7f/image-placeholder.png';
        } else {
            alert('Por favor, rellene Cantidad, Clave y asegúrese de que la Descripción sea válida.');
        }
    });


    // --- LÓGICA DE EXPORTACIÓN A EXCEL (Botón Grabar) ---
    btnGrabar.addEventListener('click', () => {
        // Obtener los datos de la tabla de detalles
        const rows = detalleTabla.querySelectorAll('tr');
        if (rows.length === 0) {
            alert('No hay artículos en el pedido.');
            return;
        }

        const data = [
            ['Cant.', 'Clave', 'Descripción'] // Cabeceras
        ];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = [];
            cells.forEach(cell => {
                rowData.push(cell.innerText);
            });
            data.push(rowData);
        });

        // Obtener datos del encabezado del pedido
        const folio = document.getElementById('folioSelect').value;
        const clienteId = clienteIdInput.value;
        const clienteNombre = clienteNombreInput.value;
        const vendedorId = document.getElementById('vendedorId').value;
        const observaciones = document.querySelector('.textarea-gris').value;

        // Añadir datos de encabezado al principio del archivo Excel (opcional)
        const headerData = [
            ['Pedido:', 'EC533'], // Folio fijo para el ejemplo
            ['Folio:', folio],
            ['Cliente ID:', clienteId],
            ['Nombre:', clienteNombre],
            ['Vendedor:', vendedorId],
            [], // Fila en blanco
            ['Observaciones:', observaciones],
            [], // Fila en blanco
        ];

        // Combinar datos del encabezado y la tabla
        const finalData = [...headerData, ...data];

        // Crear un nuevo libro de trabajo y una hoja
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(finalData);

        // Añadir la hoja al libro de trabajo
        XLSX.utils.book_append_sheet(wb, ws, 'Pedido');

        // Generar el archivo Excel y descargarlo
        XLSX.writeFile(wb, 'Pedido_Electrodomésticos_Olvera.xlsx');
    });

});