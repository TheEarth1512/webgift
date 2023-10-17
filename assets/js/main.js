const productsAPI = 'https://6523fd48ea560a22a4e9318b.mockapi.io/api/v1/products';

$(function(){
  $("body").append($('<div>').load("headroom.html")); 
  // $("body").append($('<div>').load("banner.html")); 
  $("body").append($('<div>').load("products.html")); 

  function fetchProducts() {
    // return by localStorage
    // [TODO] Helo

    //return by API
  }

  function loadProducts(products) {
    let listProduct = '';

    // fetch products from API
    products.forEach(product => {
      listProduct+= `
        <li>
            <a href="javascript:void(0)" data-id="${product.id}">
                <div class="item-img">
                    <img src="${product.image}" alt="">
                </div>
                <h3>${product.name}</h3>
                <strong class="price">
                    ${product.price}
                </strong>

                          
            </a>
        </li>      
      `
    });


    $('#products').html(`<ul>${listProduct}</ul>`);

    $('#products ul li a').click(function(e){
      const id = $(this).data('id');
      const $this = $(this);
      console.log('ABC', id)

      // write jquery ajax delete product by id
      $.ajax({
        url: `${productsAPI}/${id}`,
        method: "DELETE",
        success: function(data) {
          console.log("Data received:", data);
          $this.parent().remove();
          alert('Xóa thành công');
        },
        error: function() {
          console.log("Error retrieving data.");
        }
      });
    }); 
  }


  $.ajax({
    url: `${productsAPI}?sortBy=createdAt`,
    method: "GET",
    success: function(data) {
      console.log("Data received:", data);
      loadProducts(data);
    },
    error: function() {
      console.log("Error retrieving data.");
    }
  });

  //
  $('#add-product').click(function(){
    // add product to api using jquery ajax post
    $.ajax({
      url: productsAPI,
      method: "POST",
      data: {
        name: 'Áo khoác Adidas',
        price: 2000,
        description: 'Mô tả sản phẩm balo',
        image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'
      },
      success: function(data) {
        console.log("Data received:", data);
        alert('Thêm thành công');
      },
      error: function() {
        console.log("Error retrieving data.");
      }
    });
  });
  

  $('#update-product').click(function(){
    // update product to api using jquery ajax put
    $.ajax({
      url: `${productsAPI}/51`,
      method: "PUT",
      data: {
        name: 'Ba lô Adidas',
        price: 2000,
        description: 'Mô tả sản phẩm balo',
        image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'
      },
      success: function(data) {
        console.log("Data received:", data);
        alert('Cập nhật thành công');
      },
      error: function() {
        console.log("Error retrieving data.");
      }
    });
  });
});