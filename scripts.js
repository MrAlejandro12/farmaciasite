document.addEventListener("DOMContentLoaded", function () {
    // Elementos principales
    const clientBtn = document.getElementById("clientBtn");
    const adminBtn = document.getElementById("adminBtn");
    const productSection = document.getElementById("productSection");
    const adminSection = document.getElementById("adminSection");
    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("productList");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const passwordModal = document.getElementById("passwordModal");
    const submitPassword = document.getElementById("submitPassword");
    const closeModal = document.getElementById("closeModal");
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");

    // Variables de estado
    let isAdmin = false;
    const API_URL = "https://farmaciasite.onrender.com"; // URL base de la API

    // Ocultar modal al inicio
    passwordModal.style.display = "none";

    // 🔹 Obtener productos desde la API
    async function fetchProducts() {
        try {
            const response = await fetch(`${API_URL}/products`);
            const data = await response.json();
            console.log("📌 Datos recibidos de la API:", data);
            if (!Array.isArray(data)) throw new Error("❌ Los datos recibidos no son un array");
            renderProducts(data);
            return data;
        } catch (error) {
            console.error("❌ Error obteniendo productos:", error);
        }
    }

    // 🔹 Renderizar productos
    function renderProducts(products, category = null) {
        productList.innerHTML = "";
        products
            .filter(product => !category || product.category === category)
            .forEach((product) => {
                const productItem = document.createElement("div");
                productItem.classList.add("product-item");
                productItem.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <img src="${product.image}" alt="${product.name}" />
                    <p><strong>Categoría:</strong> ${product.category || "Sin categoría"}</p>
                    <p><strong>Precio:</strong> Bs ${product.price ? parseFloat(product.price).toFixed(2) : "0.00"}</p>
                    ${isAdmin ? `<button class="button delete-button" data-id="${product.id}">Eliminar</button>` : ""}
                `;
                productList.appendChild(productItem);
            });

        if (isAdmin) {
            document.querySelectorAll(".delete-button").forEach(button => {
                button.addEventListener("click", async function () {
                    const id = this.getAttribute("data-id");
                    await removeProduct(id);
                    fetchProducts();
                });
            });
        }
    }

    // 🔹 Agregar producto
    async function addProduct(event) {
        event.preventDefault();

        const name = document.getElementById("productName").value;
        const description = document.getElementById("productDesc").value;
        const category = document.getElementById("productCategory").value;
        const price = document.getElementById("productPrice").value;
        const imageFile = document.getElementById("productImage").files[0];

        if (!name || !description || !category || !price || !imageFile) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async function (e) {
            const productData = {
                name,
                description,
                category,
                price,
                image: e.target.result
            };

            try {
                const response = await fetch(`${API_URL}/add-product`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData)
                });

                if (!response.ok) throw new Error("Error al agregar el producto");

                alert("Producto añadido exitosamente");
                fetchProducts();
                productForm.reset();
            } catch (error) {
                console.error("Error al enviar producto:", error);
            }
        };

        reader.readAsDataURL(imageFile);
    }

    // 🔹 Eliminar producto
    async function removeProduct(id) {
        try {
            const response = await fetch(`${API_URL}/delete-product/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar producto");
            alert("Producto eliminado.");
        } catch (error) {
            console.error("Error eliminando producto:", error);
        }
    }

    // 🔹 Modo Cliente
    clientBtn.addEventListener("click", function () {
        isAdmin = false;
        adminSection.style.display = "none";
        productSection.style.display = "block";
        fetchProducts();
    });

    // 🔹 Modo Administrador (Solicita contraseña)
    adminBtn.addEventListener("click", function () {
        passwordModal.style.display = "flex";
    });

    // 🔹 Cerrar Modal
    closeModal.addEventListener("click", function () {
        passwordModal.style.display = "none";
    });

    // 🔹 Validar contraseña
    submitPassword.addEventListener("click", function () {
        const enteredPassword = document.getElementById("adminPassword").value;
        if (enteredPassword === "farmaciafamimedfamiliamedica") {
            isAdmin = true;
            passwordModal.style.display = "none";
            adminSection.style.display = "block";
            fetchProducts();
        } else {
            alert("Contraseña incorrecta");
        }
    });

    // 🔹 Filtrar por categoría
    categoryButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const category = this.getAttribute("data-category");
            const products = await fetchProducts();
            renderProducts(products, category);
        });
    });

    // 🔹 Buscador en tiempo real
    searchBar.addEventListener("input", async function () {
        const query = searchBar.value.toLowerCase();
        searchResults.innerHTML = "";

        if (query.trim() === "") {
            searchResults.style.display = "none";
            return;
        }

        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );

        if (filteredProducts.length === 0) {
            searchResults.innerHTML = `<p class="no-results">No hay resultados.</p>`;
        } else {
            filteredProducts.forEach(product => {
                const resultItem = document.createElement("div");
                resultItem.classList.add("search-result");
                resultItem.innerHTML = `
                    <div class="result-content">
                        <img src="${product.image}" alt="${product.name}" class="result-image">
                        <div class="result-info">
                            <p class="result-name">${product.name}</p>
                            <p class="result-price">Bs${product.price || "0.00"}</p>
                        </div>
                    </div>
                `;
                searchResults.appendChild(resultItem);
            });

            searchResults.style.display = "block";
        }
    });

    productForm.addEventListener("submit", addProduct);
    fetchProducts();
});

// 🔹 Carrusel de imágenes automático y manual
let currentIndex = 0;
const slides = document.querySelectorAll(".carousel img");
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? "block" : "none";
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
}

setInterval(nextSlide, 3000);
showSlide(currentIndex);
