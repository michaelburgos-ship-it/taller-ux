const productos = [
    {
        id: 1,
        nombre: "Audífonos inalámbricos",
        descripcion: "Escucha tu música favorita sin cables.",
        precio: 59.90
    },
    {
        id: 2,
        nombre: "Mouse inalámbrico",
        descripcion: "Cómodo y práctico para estudiar o trabajar.",
        precio: 35.50
    },
    {
        id: 3,
        nombre: "Teclado compacto",
        descripcion: "Ideal para tu escritorio.",
        precio: 49.90
    },
    {
        id: 4,
        nombre: "Cargador USB",
        descripcion: "Carga tus dispositivos fácilmente.",
        precio: 29.90
    },
    {
        id: 5,
        nombre: "Parlante portátil",
        descripcion: "Lleva tu música a donde quieras.",
        precio: 69.90
    },
    {
        id: 6,
        nombre: "Soporte para celular",
        descripcion: "Mantén tu celular en una posición cómoda.",
        precio: 19.90
    }
];

const listaProductos = document.getElementById("lista-productos");
const listaCarrito = document.getElementById("lista-carrito");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const totalElemento = document.getElementById("total");
const carritoVacio = document.getElementById("carrito-vacio");
const mensaje = document.getElementById("mensaje");
const mensajeCarrito = document.getElementById("mensaje-carrito");
const botonComprar = document.getElementById("btn-comprar");

let carrito = [];

try {
    carrito = JSON.parse(localStorage.getItem("carritoTecnoShop")) || [];
} catch (error) {
    carrito = [];
}

function formatoPrecio(precio) {
    return `S/ ${precio.toFixed(2)}`;
}

function guardarCarrito() {
    localStorage.setItem("carritoTecnoShop", JSON.stringify(carrito));
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = tipo;
}

function mostrarMensajeCarrito(texto, tipo) {
    mensajeCarrito.textContent = texto;
    mensajeCarrito.className = tipo;
}

function mostrarProductos() {
    listaProductos.innerHTML = "";

    productos.forEach((producto) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion;

        const precio = document.createElement("p");
        precio.className = "precio";
        precio.textContent = formatoPrecio(producto.precio);

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Agregar al carrito";

        boton.addEventListener("click", () => {
            agregarAlCarrito(producto.id);
        });

        tarjeta.appendChild(nombre);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(boton);

        listaProductos.appendChild(tarjeta);
    });
}

function agregarAlCarrito(idProducto) {
    const producto = productos.find((item) => item.id === idProducto);

    if (!producto) {
        mostrarMensaje("No se encontró el producto.", "mensaje-error");
        return;
    }

    const productoEnCarrito = carrito.find(
        (item) => item.id === idProducto
    );

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    guardarCarrito();
    mostrarCarrito();

    mostrarMensaje(
        `${producto.nombre} se agregó al carrito.`,
        "mensaje-exito"
    );

    mostrarMensajeCarrito("", "");
}

function calcularTotal() {
    return carrito.reduce((total, producto) => {
        return total + producto.precio * producto.cantidad;
    }, 0);
}

function mostrarCarrito() {
    listaCarrito.innerHTML = "";

    carrito.forEach((producto) => {
        const elemento = document.createElement("li");
        elemento.className = "item-carrito";

        const informacion = document.createElement("div");

        const nombre = document.createElement("p");
        nombre.textContent = producto.nombre;

        const detalle = document.createElement("p");
        detalle.textContent =
            `${producto.cantidad} x ${formatoPrecio(producto.precio)}`;

        informacion.appendChild(nombre);
        informacion.appendChild(detalle);

        const subtotal = document.createElement("p");
        subtotal.textContent = formatoPrecio(
            producto.precio * producto.cantidad
        );

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn-eliminar";

        botonEliminar.addEventListener("click", () => {
            const confirmar = confirm(
                `¿Deseas quitar ${producto.nombre} del carrito?`
            );

            if (confirmar) {
                eliminarDelCarrito(producto.id);
            }
        });

        elemento.appendChild(informacion);
        elemento.appendChild(subtotal);
        elemento.appendChild(botonEliminar);

        listaCarrito.appendChild(elemento);
    });


    const cantidadTotal = carrito.reduce((total, producto) => {
        return total + producto.cantidad;
    }, 0);

    cantidadCarrito.textContent = cantidadTotal;
    totalElemento.textContent = formatoPrecio(calcularTotal());


    carritoVacio.hidden = carrito.length > 0;


    botonComprar.disabled = carrito.length === 0;
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter((producto) => {
        return producto.id !== idProducto;
    });

    guardarCarrito();
    mostrarCarrito();

    mostrarMensajeCarrito(
        "El producto se quitó del carrito.",
        "mensaje-exito"
    );
}

// Simular el proceso de compra
botonComprar.addEventListener("click", () => {
    if (carrito.length === 0) {
        mostrarMensajeCarrito(
            "Agrega algún producto antes de comprar.",
            "mensaje-error"
        );

        return;
    }

    const confirmar = confirm(
        `El total de tu compra es ${formatoPrecio(calcularTotal())}. ¿Deseas continuar?`
    );

    if (confirmar) {
        carrito = [];

        guardarCarrito();
        mostrarCarrito();

        mostrarMensajeCarrito(
            "¡Compra realizada! Gracias por visitar TecnoShop.",
            "mensaje-exito"
        );
    }
});

// Mostrar productos y carrito al abrir la página
mostrarProductos();
mostrarCarrito();