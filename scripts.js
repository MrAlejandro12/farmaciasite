document.addEventListener("DOMContentLoaded", function () {
    // Botones y secciones
    const clientBtn = document.getElementById("clientBtn");
    const adminBtn = document.getElementById("adminBtn");
    const productSection = document.getElementById("productSection");
    const adminSection = document.getElementById("adminSection");
    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("productList");
    const clearStorageBtn = document.getElementById("clearStorage");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const passwordModal = document.getElementById("passwordModal");
    const submitPassword = document.getElementById("submitPassword");
    const closeModal = document.getElementById("closeModal");
    
    // Elementos del buscador
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");

    let products = JSON.parse(localStorage.getItem("products")) || [];
    let isAdmin = false; 

    // Ocultar modal al inicio
    passwordModal.style.display = "none";

    // 🔹 Renderizar productos según categoría
    function renderProducts(category = null) {
        productList.innerHTML = "";
        products
            .filter(product => !category || product.category === category)
            .forEach((product, index) => {
                const productItem = document.createElement("div");
                productItem.classList.add("product-item");
                productItem.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <img src="${product.image}" alt="${product.name}" />
                    <p><strong>Categoría:</strong> ${product.category}</p>
                    <p><strong>Precio:</strong> Bs 
                        ${isAdmin 
                            ? `<input type="number" class="edit-price" data-index="${index}" value="${product.price || '0.00'}" step="0.01">`
                            : product.price || "0.00"}
                    </p>
                    ${isAdmin ? `<button class="button delete-button" data-index="${index}">Eliminar</button>` : ""}
                `;
                productList.appendChild(productItem);
            });

        if (isAdmin) {
            document.querySelectorAll(".delete-button").forEach(button => {
                button.addEventListener("click", function () {
                    const index = parseInt(this.getAttribute("data-index"));
                    removeProduct(index);
                });
            });

            // Agregar event listener para cambiar precios
            document.querySelectorAll(".edit-price").forEach(input => {
                input.addEventListener("change", function () {
                    const index = parseInt(this.getAttribute("data-index"));
                    const newPrice = parseFloat(this.value).toFixed(2);
                    products[index].price = newPrice;
                    localStorage.setItem("products", JSON.stringify(products));
                    renderProducts(); // Para actualizar la vista
                });
            });
        }
    }

    // 🔹 Agregar producto
    function addProduct(event) {
        event.preventDefault();

        console.log("Obteniendo valores del formulario...");

        const name = document.getElementById("productName");
        const description = document.getElementById("productDesc");
        const category = document.getElementById("productCategory");
        const price = document.getElementById("productPrice");
        const imageFile = document.getElementById("productImage");

        console.log("name:", name);
        console.log("description:", description);
        console.log("category:", category);
        console.log("price:", price);
        console.log("imageFile:", imageFile);

        if (!name || !description || !category || !price || !imageFile) {
            console.error("Uno o más elementos no fueron encontrados.");
            return;
        }

        if (!imageFile.files[0]) {
            alert("Debes seleccionar una imagen.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            products.push({
                name: name.value,
                description: description.value,
                category: category.value,
                price: price.value,
                image: e.target.result
            });

            localStorage.setItem("products", JSON.stringify(products));
            renderProducts();
            productForm.reset();
        };

        reader.readAsDataURL(imageFile.files[0]);
    }

    // 🔹 Eliminar producto
    function removeProduct(index) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
    }

    // 🔹 Limpiar almacenamiento de productos
    function clearStorage() {
        localStorage.removeItem("products");
        products = [];
        renderProducts();
    }

    // 🔹 Modo Cliente
    clientBtn.addEventListener("click", function () {
        isAdmin = false;
        adminSection.style.display = "none";
        productSection.style.display = "block";
        renderProducts();
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
            renderProducts();
        } else {
            alert("Contraseña incorrecta");
        }
    });

    // 🔹 Filtrar por categoría
    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            const category = this.getAttribute("data-category");
            renderProducts(category);
        });
    });

    // 🔹 Buscador en tiempo real
    searchBar.addEventListener("input", function () {
        const query = searchBar.value.toLowerCase();
        searchResults.innerHTML = "";

        if (query.trim() === "") {
            searchResults.style.display = "none";
            return;
        }

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

            const viewAll = document.createElement("div");
            viewAll.classList.add("view-all");
            viewAll.textContent = "Ver todos los resultados";
            viewAll.addEventListener("click", function () {
                alert("Redireccionando a página de búsqueda...");
            });

            searchResults.appendChild(viewAll);
        }

        searchResults.style.display = "block";
    });

    // 🔹 Cerrar buscador si se hace clic fuera
    document.addEventListener("click", function (e) {
        if (!searchBar.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = "none";
        }
    });

    productForm.addEventListener("submit", addProduct);
    clearStorageBtn.addEventListener("click", clearStorage);
    renderProducts();
});
document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".carousel img");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    if (images.length === 0) {
        console.error("No se encontraron imágenes en el carrusel.");
        return;
    }

    let index = 0;
    const totalImages = images.length;

    function updateCarousel() {
        images.forEach((img, i) => {
            img.classList.toggle("active", i === index);
        });
    }

    function nextImage() {
        index = (index + 1) % totalImages;
        updateCarousel();
    }

    function prevImage() {
        index = (index - 1 + totalImages) % totalImages;
        updateCarousel();
    }

    nextButton.addEventListener("click", nextImage);
    prevButton.addEventListener("click", prevImage);

    // Cambio automático cada 3 segundos
    setInterval(nextImage, 3000);

    // Inicializar la primera imagen como visible
    updateCarousel();
});
