

function addProduct() {
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productImagesInput = document.getElementById('productImages');
    const productPrice = document.getElementById('productPrice').value;
    const productManufacturer = document.getElementById('productManufacturer').value;
    const productCategory = document.getElementById('productCategory').value;
    const productSpecifications = document.getElementById('productSpecifications').value.split('\n');


    let formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", productDescription);
    formData.append("imageURL", productImagesInput.files[0]);

    formData.append("price", productPrice);
    formData.append("manufacturer", productManufacturer);
    formData.append("category", productCategory);
    formData.append("specifications", productSpecifications);

    fetch('https://assesmentmarch.onrender.com/api/addProduct', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            alert('Product added successfully:', data);
            window.location.reload()
        })
        .catch(error => {
            console.error('Error adding product:', error);
        });
}

// const submitProduct = () => {
   
//     const productName = document.getElementById('productName').value;
//     const productDescription = document.getElementById('productDescription').value;
//     const productImagesInput = document.getElementById('productImages').files[0];
//     const productPrice = document.getElementById('productPrice').value;
//     const productManufacturer = document.getElementById('productManufacturer').value;
//     const productCategory = document.getElementById('productCategory').value;
//     const productSpecifications = document.getElementById('productSpecifications').value.split('\n');

    
//     const formData = new FormData();
//     formData.append("productName", productName);
//     formData.append("description", productDescription);
//     formData.append("imageURL", productImagesInput);
//     formData.append("price", productPrice);
//     formData.append("manufacturer", productManufacturer);
//     formData.append("category", productCategory);
//     formData.append("specifications", productSpecifications);

//     // Determine the URL and method based on whether we're adding a new product or updating an existing one
//     const url = IsEditable ?
//      ` https://assesmentmarch.onrender.com/api/updateproduct/${currentProductId}` 
//      : ' https://assesmentmarch.onrender.com/api/addProduct';
//     const method = IsEditable ? 'PUT' : 'POST';

//     // Send the request
//     fetch(url, {
//         method: method,
//         body: formData,
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert(`Product ${IsEditable ? 'updated' : 'added'} successfully: ${data}`);
//         // Clear form fields after successful submission
//         clearForm();
//     })
//     .catch(error => {
//         console.error(`Error ${IsEditable ? 'updating' : 'adding'} product: ${error}`);
//     });
// }

const clearForm = () => {
    document.getElementById('productForm').reset();
}



const handleEdit = async (id) => {
    try {
        const response = await fetch(`https://assesmentmarch.onrender.com/api/getbyid/${id}`);
        const data = await response.json();
    
      
        document.getElementById('productCategory').value = data.data.category;
        document.getElementById('productName').value = data.data.productName;
        document.getElementById('productDescription').value = data.data.description;
        document.getElementById('productManufacturer').value = data.data.manufacturer;
        document.getElementById('productPrice').value = data.data.price;
        document.getElementById('productImages').value = '';
        const productImageFile = new File([null], data.data.imageURL, { type: 'image/*' });
        document.getElementById('productImages').files[0] = productImageFile;
        document.getElementById('productSpecifications').value = data.data.specifications.join('\n');
        document.getElementById('submitButton').textContent = 'Update Product';
        IsEditable = true;
        currentProductId = id;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchData() {
    try {
        const response = await fetch('https://assesmentmarch.onrender.com/api/getproduct');
        const data = await response.json();

        return data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

const itemsPerPage = 8;
let currentPage = 1;

async function displayUsers(page) {
    const userListContainer = document.getElementById('userList');
    userListContainer.innerHTML = '';

    const users = await fetchData();
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedUsers = users.slice(startIndex, endIndex);

    displayedUsers.forEach((user, index) => {
        const userRow = document.createElement('div');
        userRow.classList.add('table-row');


        userRow.innerHTML = `
    <div class="table-cell">
    ${index + 1}</div>
    <div class="table-cell">${user.productName}</div>
    <div class="table-cell">${user.category}</div>
    <div class="table-cell">${user.price}</div>
    <div class="table-cell">${user.manufacturer}</div>
    <div class="table-cell">${user.specifications}</div>
    <div class="table-cell">${user.description}</div>
    <div class="table-cell">
    <span onclick="handleEdit('${user._id}')">Edit</span>
    <span onclick="handledelete('${user._id}')">Delete</span></div>

`;

        userListContainer.appendChild(userRow);
    });
}


function displayPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    fetchData().then(users => {
        const totalPages = Math.ceil(users.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = i;
            if (i === currentPage) {
                link.classList.add('active');
            }
            link.addEventListener('click', () => {
                currentPage = i;
                displayUsers(currentPage);
                highlightActivePage();
            });
            pageLink.appendChild(link);
            pagination.appendChild(pageLink);
        }
    });
}

function highlightActivePage() {
    const links = document.querySelectorAll('.pagination li a');
    links.forEach(link => {
        link.classList.remove('active');
        if (parseInt(link.textContent) === currentPage) {
            link.classList.add('active');
        }
    });
}

displayUsers(currentPage);
displayPagination();




function handledelete(id) {
    if (id) {
        const confirmed = window.confirm("Are you sure you want to delete?");
        if (confirmed) {
            fetch(`https://assesmentmarch.onrender.com/api/trashproduct/${id}`, {
                method: 'post'
            })
                .then(response => response.json())
                .then(data => {
                    alert('Product deleted successfully:', data);
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                });
        }
    }
}



// const handleEdit = async (id) => {
//     try {
//         const response = await fetch(`http://localhost:8000/api/getbyid/${id}`);
//         const data = await response.json();
//         const productName = document.getElementById('productName').value = 
//         data.data.productName;
//         const productDescription =
//          document.getElementById('productDescription').value = data.data.description;
//         const productImagesInput = 
//         document.getElementById('productImages') = data.data.imageURL;
//         const productPrice = 
//         document.getElementById('productPrice').value = data.data.price;
//         const productManufacturer = document.getElementById('productManufacturer').value =
//             data.data.manufacturer;
//         const productCategory = document.getElementById('productCategory').value
//             = data.data.category;
//         const productSpecifications =
//             document.getElementById('productSpecifications').value.split('\n')
//             = data.data.specifications;


//         let formData = new FormData();
//         formData.append("productName", productName);
//         formData.append("description", productDescription);
//         formData.append("imageURL", productImagesInput.files[0]);
//         formData.append("price", productPrice);
//         formData.append("manufacturer", productManufacturer);
//         formData.append("category", productCategory);
//         formData.append("specifications", productSpecifications);

//         fetch(`http://localhost:8000/api/updateproduct/${id}`, {
//             method: 'put',
//             body: formData,
//         })
//             .then(response => response.json())
//             .then(data => {
//                 alert('Product updated successfully:', data);
//             })
//             .catch(error => {
//                 console.error('Error updating product:', error);
//             });

//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return [];
//     }
// }
