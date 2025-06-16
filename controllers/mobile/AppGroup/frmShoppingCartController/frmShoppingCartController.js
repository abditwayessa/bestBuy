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
      return;
    }else{
      this.view.lblNoProduct.setVisibility(false);
      this.view.segCarts.setVisibility(true);      
    }
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