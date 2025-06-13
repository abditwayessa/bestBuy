define({ 

  onInit: function(){
    this.getProductInCart();
//     this.view.
  },
  onPreShow: function(){

  },
  getProductInCart: function(){
    
    var self = this;
    var cartArray = kony.store.getItem("cart");
    var carts = cartArray[0].name;
    this.view.segCarts.setVisibility(true);
    for(var i = 0; i < cartArray.length; i++){
      console.log("Abdi Name: " + cartArray[i].name);
    }

    var filteredRecords = cartArray.map((record) => {
      return {
        lblProductNames: record.name,
        lblProductPrice: "$"+record.salePrice,
        sku: record.sku,
        imgRemoveProduct: "cartremoveitem.png",
        orderNum:record.orderNum
      }

    });
    this.view.segCarts.setData(filteredRecords);
    //     JSON.stringify(value, replacer?, value, space?)
    console.log("Abdi Cart list: " +   JSON.stringify(cartArray, null, 2));
    console.log("Abdi Cart name: " + cartArray.length);

  },
  onDelete: function(){
  
}

});