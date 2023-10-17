const productsAPI = 'https://6523fd48ea560a22a4e9318b.mockapi.io/api/v1/products';
const PAGE_SIZE = 10;

function loadProductsHtml(products, page) {
  let listProducts = '';

  products.forEach((product, index) => {
    const date = new Date(product.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/(\d+)\/(\d+)\/(\d+)/, "$2/$1/$3")
    const orderBy = (page - 1) * PAGE_SIZE;

    listProducts += `
    <tr data-id="${product.id}">
      <th scope="row">${(index+1) + orderBy}</th>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td><img src="${product.image}" width="100" /></td>
      <td>${product.description}</td>
      <td>${date}</td>
      <td>
        <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
          <div class="btn-group me-2" role="group" aria-label="First group">
            <button type="button" class="btn btn-warning btn-edit-product">Edit</button>
          </div>
          <div class="btn-group me-2" role="group" aria-label="Second group">
            <button type="button" class="btn btn-danger btn-delete-product">Delete</button>
          </div>
        </div>
      </td>
      <td>
      </td>
    </tr>    
    `
  });

  $('#table-products tbody').html(listProducts);
}

function convertFormValuesToObject(formValues) {
  return formValues.reduce((prev, curr) => ({
    ...prev,
    [curr.name]: curr.value
  }), {});
}

async function getProduct(id) {
  const response = await fetch(`${productsAPI}/${id}`)
  return await response.json()
}

async function fetchProductsTotal(keyword) {
  const url = new URL(productsAPI);
  if (keyword) {
    url.searchParams.append('search', keyword);
  }  
  const response = await fetch(url)
  return (await response.json()).length || 0
}

async function renderPagination() {
  const total = await fetchProductsTotal();
  const totalPages = Math.ceil(total / PAGE_SIZE);
  console.log('totalPages', totalPages)
  let paginationHtml = '';

  for (let i = 1; i <= totalPages; i++) {
    paginationHtml += `
      <li class="page-item"><a data-page="${i}" class="page-link" href="javascript:void()">${i}</a></li>
    `
  }

  $('#pagination').html(paginationHtml);
}

async function fetchProducts(keyword, page = 1) {
  const total = await fetchProductsTotal(keyword);
  console.log('total', total);
 
  const url = new URL(productsAPI);
  url.searchParams.append('page', page);
  url.searchParams.append('limit', PAGE_SIZE);  

  if (keyword) {
    url.searchParams.append('search', keyword);
  }

  $.ajax({
    url: url,
    method: "GET",
    success: function(data) {
      loadProductsHtml(data, page);
      renderPagination();
    },
    error: function() {
      console.log("Error retrieving data.");
    }
  });
}

function addProduct(data) {
    $.ajax({
      url: productsAPI,
      method: "POST",
      data,
      success: function(data) {
        console.log("Data received:", data);
        fetchProducts();
        alert('Thêm thành công');
        $('#add-product-modal').modal('hide');
      },
      error: function() {
        console.log("Error retrieving data.");
      }
    });
}

function updateFormFields(product) {
  $('#form-edit-product input[name="name"]').val(product.name);
  $('#form-edit-product input[name="price"]').val(product.price);
  $('#form-edit-product input[name="image"]').val(product.image);
  $('#form-edit-product textarea[name="description"]').val(product.description);
  $('#form-edit-product input[name="id"]').val(product.id);
}

$(function() {
    fetchProducts();

    // Function to add new product to API
    $('#button-add-product').click(function() {
        const formValues = convertFormValuesToObject($('#form-add-product').serializeArray())

        addProduct(formValues);
    });

    // Function to edit product to API
    $(document).on('click', '.btn-edit-product', async function() {
      $(this).prop('disabled', true);
      const id = $(this).parents('tr').data('id');
      const product = await getProduct(id);
      updateFormFields(product);
      $('#edit-product-modal').modal('show');
      $(this).prop('disabled', false);
    });

    // Function to delete product to API
    $(document).on('click', '.btn-delete-product', async function() {
      const isConfirmed = confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
      const id = $(this).parents('tr').data('id');

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


    // Function to edit product to API
    $('#button-edit-product').click(function() {
      $(this).prop('disabled', true);
      const formValues = convertFormValuesToObject($('#form-edit-product').serializeArray())

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

    // Function to search product to API
    $('#button-search').click(function() {  
      const keyword = $('#search-keyword').val();

      fetchProducts(keyword);

      console.log('keyword', keyword)
    });

    // function click for pagination
    $(document).on('click', '#pagination li a', function() {
      const page = $(this).data('page');
      const keyword = $('#search-keyword').val();

      fetchProducts(keyword, page);
    });
});
