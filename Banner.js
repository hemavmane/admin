


function addBanner() {
    const productImagesInput = document.getElementById('productImages');

   
    if (productImagesInput.files.length === 1) {
        let formData = new FormData();
        formData.append("BannerImag", productImagesInput.files[0]);  // Keep your original variable name
       
        fetch('https://assesmentmarch.onrender.com/api/addbanner', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            alert('Banner added successfully:', data);
            window.location.reload()
        })
        .catch(error => {
            console.error('Error adding banner:', error);
        });
    } else {
        console.error('Please select exactly one image.');
    }
}


async function fetchData() {
    try {
        const response = await fetch('https://assesmentmarch.onrender.com/api/getbanner');
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

    displayedUsers.forEach((user,index) => {
        const userRow = document.createElement('div');
        userRow.classList.add('table-row');

      
        userRow.innerHTML = `
    <div class="table-cell">${index+1}</div>
    <img class=" table-cell tableimage" src="https://assesmentmarch.onrender.com/Banner/${user.BannerImag}" />
   
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