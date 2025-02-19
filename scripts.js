document.addEventListener("DOMContentLoaded", function () {
    // Botones y secciones
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
    
    // Elementos del buscador
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");

    let isAdmin = false;
    const API_URL = "https://farmaciasite.onrender.com/products"; // URL de la API

    // Ocultar modal al inicio
    passwordModal.style.display = "none";

    // 🔹 Obtener productos desde la API
    async function fetchProducts() {
        try {
            const response = await fetch(API_URL);
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error("Error obteniendo productos:", error);
        }
    }

    // 🔹 Renderizar productos según categoría
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
                    <p><strong>Categoría:</strong> ${product.category}</p>
                    <p><strong>Precio:</strong> Bs ${product.price || "0.00"}</p>
                    ${isAdmin ? `<button class="button delete-button" data-id="${product.id}">Eliminar</button>` : ""}
                `;
                productList.appendChild(productItem);
            });

        if (isAdmin) {
            document.querySelectorAll(".delete-button").forEach(button => {
                button.addEventListener("click", async function () {
                    const id = this.getAttribute("data-id");
                    await removeProduct(id);
                    fetchProducts(); // Recargar productos después de eliminar
                });
            });
        }
    }

    // 🔹 Agregar producto (Enviarlo al servidor)
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
                image: e.target.result,
            };

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData),
                });

                if (response.ok) {
                    alert("Producto añadido correctamente.");
                    fetchProducts(); // Recargar lista de productos
                    productForm.reset();
                } else {
                    alert("Error al agregar producto.");
                }
            } catch (error) {
                console.error("Error enviando producto:", error);
            }
        };

        reader.readAsDataURL(imageFile);
    }

    // 🔹 Eliminar producto
    async function removeProduct(id) {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
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

    // 🔹 Validar contraseña y activar modo admin
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
        button.addEventListener("click", function () {
            const category = this.getAttribute("data-category");
            fetchProducts().then(products => renderProducts(products, category));
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

        const response = await fetch(API_URL);
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

                resultItem.addEventListener("click", function () {
                    searchBar.value = product.name;
                    searchResults.style.display = "none";
                });

                searchResults.appendChild(resultItem);
            });

            searchResults.style.display = "block";
        }
    });

    productForm.addEventListener("submit", addProduct);
    fetchProducts(); // Cargar productos al inicio
});
