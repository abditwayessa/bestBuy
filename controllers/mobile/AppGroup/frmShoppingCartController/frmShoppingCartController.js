define({ 

  onInit: function(){
    this.getProductInCart();
    this.view.toolbarMenu.btnMenu.onClick = this.menuFunction;
    //     this.view.
  },
  onPreShow: function(){

  },
  getProductInCart: function(){

    var self = this;
    var cartArray = kony.store.getItem("cart");
    console.log("Abdi " + cartArray);
    //     var carts = cartArray[0].name;
    if(!cartArray || cartArray === null || cartArray.length < 1){
      this.view.lblNoProduct.setVisibility(true);
      this.view.segCarts.setVisibility(false);
      this.view.lblTotalPrice.setVisibility(false);
      return;
    }else{
      this.view.lblNoProduct.setVisibility(false);
      this.view.segCarts.setVisibility(true);
      this.view.lblTotalPrice.setVisibility(true);      
    }
    var totalValue = 0;
    var totalRegularPrice = 0;
    var totalSalePrice = 0;
    var totalSaved = 0
    for(var i = 0; i < cartArray.length; i++){
      totalValue = totalValue + cartArray[i].salePrice;
      if(cartArray[i].onSale){
        totalRegularPrice = totalRegularPrice + cartArray[i].regularPrice;
        totalSalePrice = totalSalePrice + cartArray[i].salePrice;
      }
    }
    totalSaved = totalRegularPrice - totalSalePrice;
    var filteredRecords = cartArray.map((record) => {
      return {
        lblProductNames: record.name,
        lblProductPrice:  {
          text: "$" + record.salePrice,
          skin: record.onSale ? "sknRed60Font" : "sknGray60Font"
        },
        sku: record.sku,
        imgRemoveProduct: "cartremoveitem.png",
        orderNum:record.orderNum
      }

    });
    this.view.segCarts.setData(filteredRecords);
    this.view.lblTotalPrice.text = "Total: $"+totalValue.toFixed(2);
    if(totalSaved > 0 ){
      this.view.lblSavedAmount.text = "You have items that are ON SALE !!! You Saved $" + totalSaved.toFixed(2) + " on this order.";
      this.view.lblSavedAmount.setVisibility(true);
    }else{
       this.view.lblSavedAmount.setVisibility(false);
    }
    //     JSON.stringify(value, replacer?, value, space?)
    console.log("Abdi Cart list: " +   JSON.stringify(cartArray, null, 2));
    console.log("Abdi Cart name: " + cartArray.length);

  },
  menuFunction: function () {
    var self = this;
    function moveCallback() {}
    if (this.view.humburgerMenu.left === "-80%") {
      self.view.flxMain.animate(
        kony.ui.createAnimation({
          100: {
            left: "80%",
            stepConfig: {
              timingFunction: kony.anim.EASE,
            },
          },
        }),
        {
          delay: 0,
          iterationCount: 1,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
          duration: 0.25,
        },
        {
          animationEnd: moveCallback,
        }
      );
      self.view.humburgerMenu.animate(
        kony.ui.createAnimation({
          100: {
            left: "0%",
            stepConfig: {
              timingFunction: kony.anim.EASE,
            },
          },
        }),
        {
          delay: 0,
          iterationCount: 1,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
          duration: 0.25,
        },
        {
          animationEnd: moveCallback,
        }
      );
    } else {
      self.view.flxMain.animate(
        kony.ui.createAnimation({
          100: {
            left: "0%",
            stepConfig: {
              timingFunction: kony.anim.EASE,
            },
          },
        }),
        {
          delay: 0,
          iterationCount: 1,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
          duration: 0.25,
        },
        {
          animationEnd: moveCallback,
        }
      );
      self.view.humburgerMenu.animate(
        kony.ui.createAnimation({
          100: {
            left: "-80%",
            stepConfig: {
              timingFunction: kony.anim.EASE,
            },
          },
        }),
        {
          delay: 0,
          iterationCount: 1,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
          duration: 0.25,
        },
        {
          animationEnd: moveCallback,
        }
      );
    }
  },

});