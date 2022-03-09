let product = 0;

function displayCategoryList() {
    window.open("category.html", "_self");
}

function displayFormCreate() {
    document.getElementById("form").reset();
    document.getElementById("form").hidden = false;
    document.getElementById("form-button").onclick = function () {
        addNewProduct();
    }
}

function showCategory(category) {
    return `<option value="${category.id}">${category.name}</option>`
}

function showCategories() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/categories`,
        success: function (data) {
            let content = "";
            for (let i = 0; i < data.length; i++) {
                content += showCategory(data[i]);
            }
            document.getElementById("category").innerHTML = content;
        }
    });
}

function addNewProduct() {
    //lấy dữ liệu
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let imageUrl = $('#image').val();
    let category = $('#category').val();
    let newProduct = {
        name: name,
        price: price,
        description: description,
        imageUrl: imageUrl,
        category: {
            id: category
        }
    };

    //gọi ajax
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(newProduct),
        //tên API
        url: `http://localhost:8080/api/products`,
        //xử lý khi thành công
        success: function () {
            getProducts();
        }

    });
    //chặn sự kiện mặc định của thẻ
    event.preventDefault();
}

function getProducts() {
    $.ajax({
        type: "GET",
        //tên API
        url: `http://localhost:8080/api/products`,
        //xử lý khi thành công
        success: function (data) {
            // hiển thị danh sách ở đây
            let content = '<tr>\n' +
                '<th>Name</th>\n' +
                '<th>Price</th>\n' +
                '<th>Description</th>\n' +
                '<th>Image</th>\n' +
                '<th>Category</th>\n' +
                '<th colspan="2">Action</th>\n' +
                '</tr>';
            for (let i = 0; i < data.length; i++) {
                content += displayProduct(data[i]);
            }
            // document.getElementById("studentList").hidden = false;
            document.getElementById("productList").innerHTML = content;
            document.getElementById("form").hidden = true;
        }
    });
}

function displayProduct(product) {
    return `<tr><td>${product.name}</td><td>${product.price}</td><td>${product.description}</td><td>${product.imageUrl}</td><td>${product.category.name}</td>
                    <td><button class="btn btn-danger" onclick="deleteProduct(${product.id})"><i class="fa-solid fa-trash"></i></button></td>
                    <td><button class="btn btn-warning" onclick="editProduct(${product.id})"><i class="fa-solid fa-pencil"></i></button></td></tr>`;
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete ?') === true) {
        $.ajax({
            type: 'DELETE',
            url: `http://localhost:8080/api/products/${id}`,
            success: function () {
                getProducts()
            }
        });
    }
}

function editProduct(id) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/api/products/${id}`,
        success: function (data) {
            $('#name').val(data.name);
            $('#price').val(data.price);
            $('#description').val(data.description);
            $('#image').val(data.imageUrl);
            $('#category').val(data.category.id);
            product = data.id;
            document.getElementById("form").hidden = false;
            document.getElementById("form-button").onclick = function () {
                updateProduct()
            };
        }
    });
}

function updateProduct() {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let imageUrl = $('#image').val();
    let category = $('#category').val();
    let newProduct = {
        name: name,
        price: price,
        description: description,
        imageUrl: imageUrl,
        category: {
            id: category
        }
    };

    //gọi ajax
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'PUT',
        data: JSON.stringify(newProduct),
        //tên API
        url: `http://localhost:8080/api/products/${product}`,
        //xử lý khi thành công
        success: function () {
            getProducts();
        }

    });
    //chặn sự kiện mặc định của thẻ
    event.preventDefault();
}

function searchProduct() {
    let search = document.getElementById('search').value;
    $.ajax({
        type: "GET",
        //tên API
        url: `http://localhost:8080/api/products?search=${search}`,
        //xử lý khi thành công
        success: function (data) {
            // hiển thị danh sách ở đây
            let content = '<tr>\n' +
                '<th>Name</th>\n' +
                '<th>Price</th>\n' +
                '<th>Description</th>\n' +
                '<th>Image</th>\n' +
                '<th>Category</th>\n' +
                '<th colspan="2">Action</th>\n' +
                '</tr>';
            for (let i = 0; i < data.length; i++) {
                content += displayProduct(data[i]);
            }
            document.getElementById("productList").innerHTML = content;
            document.getElementById("search-form").reset();
        }
    });
    event.preventDefault();
}

// function pageProduct(size){
//     $(function (){
//         let container = $('#pagination');
//         container.pagination({
//             dataSource: `http://localhost:8080/api/products`,
//             locator: 'items',
//             totalNumber: size,
//             pageSize: 5,
//             callback: function (response, pagination){
//                 console.log('goi call back')
//                 let dataHtml = '<table border="1" class="table">'
//                 let pageStart = (pagination.pageNumber-1)*pagination.pageSize;
//                 let pageEnd = pageStart + pagination.pageSize;
//                 let pageItems = response.slice(pageStart, pageEnd);
//                 console.log('pageStart == '+pageStart)
//                 console.log('pageItems ---> ', pageItems)
//                 $.each(pageItems, function (index, item){
//                     let indexs = index+1;
//                     console.log('index = ', index)
//                     console.log('item ==', item)
//                     dataHtml +=
//                         '<tr class="table-success">'+
//                         '<th>STT</th>'+
//                         '<th>Producer</th>'+
//                         '<th>Model</th>'+
//                         '<th>Price</th>'+
//                         '<th>Edit</th>'+
//                         '<th>Delete</th>'+
//                         '</tr>'+
//                         '<tr>'+
//                         '<td class="table-danger">'+'<p>'+indexs+'</p>'+'</td>'+
//                         '<td class="table-danger">'+'<p>'+item.producer+'</p>'+'</td>'+
//                         '<td class="table-warning">'+'<p>'+item.model+'</p>'+'</td>'+
//                         '<td class="table-light">'+'<p>'+item.price+'</p>'+'</td>'+
//                         '<td><button class="btn btn-primary" onclick="editSmartPhone('+item.id+')">Edit</button></td>'+
//                         '<td><button class="btn btn-danger" onclick="deleteSmartPhone('+item.id+')">Delete</button></td>'+
//                         '</tr>'
//                 })
//                 dataHtml += '</table>';
//                 container.prev().html(dataHtml);
//             }
//         })
//     })
// }

showCategories()
getProducts()