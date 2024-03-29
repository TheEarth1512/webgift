const productsAPI = 'https://652e74100b8d8ddac0b16666.mockapi.io/api/v1/products';

let amountProducts = 0;
function loadProductsHtml(products) {
    let listProduct = '';
    console.log(products);

    products.forEach((product, index) => {
        index++;
        amountProducts++;
        listProduct+= `
        <tr data-id="${product.id}">
            <td id="select-product" class="text-center">
                <input type="checkbox" id="product-${index}">
            </td>
            <td id="serial" class="text-center">${index}</td>
            <td>
                <div class="m-r-10 img-product"><img src="${product.image}" alt="user" class="rounded" width="45"></div>
            </td>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>${product.price} dong</td>
            <td class="capitalize">${product.status}</td>
            <td>
                <button type="button" id="btn-edit-product" data-pid="${product.id}" class="btn btn-danger btn-edit w-100">
                    <i class="fa-solid fa-gear"></i>
                </button>
            </td>
            <td>
                <button type="button" id="btn-remove-product" class="btn btn-danger btn-remove w-100">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `
    });

    $('#list-products').html(`${listProduct}`);
}

async function getProduct(id) {
    const response = await fetch(`${productsAPI}/${id}`)
    return await response.json();
}

function fetchProducts(keyword) {
    const url = new URL(productsAPI);
    
    if (keyword) {
        url.searchParams.append('search', keyword);
    }
    
    $.ajax({
        url: url,
        type: "GET",
        success: function(data) {
            loadProductsHtml(data);
        },
        error: function() {
        console.log("Error retrieving data.");
        }
    });
}

function addProduct(data) {
    console.log('dataAdd', data);
    $.ajax({
        url: productsAPI,
        method: "POST",
        data,
        success: function(data) {
          console.log("Data received:", data);
          fetchProducts();
          $('#add-product-modal').modal('hide');
          alert('Thêm thành công');
        },
        error: function() {
          console.log("Error retrieving data.");
        }
    });
}

function convertFormValuesToObject(formValues) {
    return formValues.reduce((prev, curr) => ({
        ...prev,
        [curr.name]: curr.value
    }), {});
}

function updateFormFields(product) {
    console.log("updateFormFields");
    product.then((r) => {
        $('#form-edit-product input[name="name"]').val(r.name);
        $('#form-edit-product select[name="category"]').val(r.category);
        $('#form-edit-product input[name="quantity"]').val(r.quantity);
        $('#form-edit-product input[name="price"]').val(r.price);
        $('#form-edit-product select[name="status"]').val(r.status);
        $('#form-edit-product input[name="img-old"]').val(r.image);
        $('#form-edit-product input[name="id"]').val(r.id)
    });
    ;
}

$(function() {
    fetchProducts();
    // Function to add new product to API
    $('#btn-add-product').click(function() {
        $('#add-product-modal').modal('show');
    });

    $('#button-add-product').click (function() {
        const linkImg = $('#form-add-product input[name="img"]').val();
        $('#form-add-product input[name="image"]').val(linkImg);
        const formValues = convertFormValuesToObject($('#form-add-product').serializeArray());
        addProduct(formValues);
        
    });

    $(document).on('click', '#btn-edit-product', function() {
        console.log('product-id: ', $(this).attr('data-pid'));
        $('#edit-product-modal').modal('show');
        const productId = $(this).attr('data-pid');
        updateFormFields(getProduct(productId));
    });

    // Function to edit product to API
    $(document).on('click', '#button-edit-product', async function() {
        $(this).prop('disabled', true);
        const formValues = convertFormValuesToObject($('#form-edit-product').serializeArray());
  
        $.ajax({
          url: `${productsAPI}/${formValues.id}`,
          method: "PUT",
          data: formValues,
          success: (data) => {
            fetchProducts();
            alert('Sửa thành công');
            $(this).prop('disabled', false);
            $('#edit-product-modal').modal('hide');
          },
          error: function() {
            console.log("Error retrieving data.");
          }
        });
      });

    // Function to delete product to API
    $(document).on('click', '#btn-remove-product', async function() {
        const isConfirmed = confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
        const id = $(this).parents('tr').data('id');
        console.log(id);
  
        if (isConfirmed) {
          $(this).prop('disabled', true);
  
          $.ajax({
            url: `${productsAPI}/${id}`,
            method: "DELETE",
            success: (data) => {
              fetchProducts();
              $(this).prop('disabled', false);
            },
            error: function() {
              console.log("Error retrieving data.");
            }
          });
        }
    });

    // Function to delete product to API
    $(document).on('click', '#btn-remove-all-products', async function() {
        const isConfirmed = confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
        const id = $(this).parents('tr').data('id');
        console.log(id);
  
        if (isConfirmed) {
          $(this).prop('disabled', true);
  
          $.ajax({
            url: productsAPI,
            method: "DELETE",
            success: (data) => {
              fetchProducts();
              $(this).prop('disabled', false);
            },
            error: function() {
              console.log("Error retrieving data.");
            }
          });
        }
    });

    $('#select-all-products').on('click', function() {
        if ($(this).is(':checked')) {
            for (let index = 0; index <= amountProducts; index++) {
                $('#product-'+index).prop('checked', true);
            }
        }
        else {
            for (let index = 0; index < amountProducts; index++) {
                $('#product-'+index).prop('checked', false);
            }
        }
    });

    $('.js-btn-close').on('click', function() {
        $('#add-product-modal').modal('hide');
        $('#edit-product-modal').modal('hide');
    });
});