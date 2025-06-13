define({
  productsId: "",
  productInCart: [],
  productObject:"",
  onInit: function () {
    this.view.toolbarMenu.btnBack.onClick = this.onBackClick;
    this.view.btnMore.onClick = this.openProductImage;
    this.view.toolbarMenu.btnMenu.onClick = this.menuFunction;
    this.view.btnDrop.onClick = this.onDropDownandUp;
    this.getReviewData(kony.store.getItem("productId"));
    this.view.btnAddToCart.onClick = this.addToCart;
//     this.view.humburgerMenu.segHumbergurMenu.onRowClick = this.navigateToCart;
  },
  onPreShow: function () {
    this.getProductDetail();
    this.getReviewData(this.productsId);
  },
  getProductDetail: function () {
    var self = this;
    var productId = kony.store.getItem("productId");
    this.productsId = productId;
    kony.store.removeItem("productId");
    var serviceName = "BestBuyAPI";
    var client = kony.sdk.getCurrentInstance();
    var integrationSvc = client.getIntegrationService(serviceName);
    var operationName = "getProductDetails";
    var param = { productId: productId };

    function getDataCallback(status, response) {
      const responseData = JSON.parse(JSON.stringify(response));
      var onSale = responseData.products[0].onSale;
      var rate = responseData.products[0].customerReviewAverage;
      var imageArray;
      kony.store.setItem("productThumb", responseData.products[0].mediumImage);
      var cartObject = {};
      //       var orderNumber;
      //       if(!kony.store.getItem("cart")){
      //         orderNumber=0;
      //         console.log("Abdi kony no ");
      //       }else{
      //         orderNumber = kony.store.getItem("cart").length;
      //          console.log("Abdi kony len: " + kony.store.getItem("cart").length);
      //       }


      cartObject = {
        orderNum:"",
        sku:productId,
        name: responseData.products[0].name,
        salePrice: responseData.products[0].salePrice
      }
      self.productObject = "";
      self.productObject = cartObject;
      //       self.productInCart.push(cartObject);

      imageArray = responseData.products[0].images;
      kony.store.setItem("productImage", imageArray);
      if (rate > 4.5) {
        self.view.imgRate.src = "ratings_star_5.png";
      } else if (rate > 3.5 && rate <= 4.5) {
        self.view.imgRate.src = "ratings_star_4.png";
      } else if (rate > 2.5 && rate <= 3.5) {
        self.view.imgRate.src = "ratings_star_3.png";
      } else if (rate > 1.5 && rate <= 2.5) {
        self.view.imgRate.src = "ratings_star_2.png";
      } else {
        self.view.imgRate.src = "ratings_star_1.png";
      }
      if (onSale === true) {
        self.view.lblProductsPrice.text =
          "On Sale! $" + responseData.products[0].salePrice;
      } else {
        self.view.lblProductsPrice.text =
          "$" + responseData.products[0].salePrice;
      }

      self.view.lblProductsName.text = responseData.products[0].name;
      if (
        responseData.products[0].customerReviewAverage === "undefined" ||
        !responseData.products[0].customerReviewAverage
      ) {
        self.view.lblProductsReview.text = "Avg review: ";
      } else {
        self.view.lblProductsReview.text =
          "Avg review: " + responseData.products[0].customerReviewAverage;
      }

      self.view.imgProducts.src = responseData.products[0].mediumImage;
      self.view.rtxtProductDetail.text =
        responseData.products[0].longDescription;
    }
    getProductDetailService = mfintegrationsecureinvokerasync(
      param,
      serviceName,
      operationName,
      getDataCallback
    );
  },
  onBackClick: function () {
    var self;
    var ntf = new kony.mvc.Navigation("frmProductList");
    ntf.navigate();
    kony.application.destroyForm("frmProductDetail");
  },
  openProductImage: function () {
    var ntf = new kony.mvc.Navigation("frmProductImage");
    ntf.navigate();
  },
  onDropDownandUp: function () {
    var self = this;
    function dropDownAndUpCallback() {}
    if (this.view.flxDropBtn.top === "80%") {
      this.view.imgDownArrow.src = "downarrow.png";
      this.view.flxDropBtn.animate(
        kony.ui.createAnimation({
          100: {
            top: "0%",
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
          animationEnd: dropDownAndUpCallback,
        }
      );
    } else {
      this.view.imgDownArrow.src = "uparrow.png";
      this.view.flxDropBtn.animate(
        kony.ui.createAnimation({
          100: {
            top: "80%",
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
          animationEnd: dropDownAndUpCallback,
        }
      );
    }
  },
  getReviewData: function (id) {
    var self = this;
    var serviceName = "BestBuyAPI";
    var client = kony.sdk.getCurrentInstance();
    var integrationSvc = client.getIntegrationService(serviceName);
    var operationName = "getProductReviews";
    var param = { sku: id };
    console.log("Abdi review id: " + id);

    function getDataCallback(status, response) {
      const responseData = JSON.parse(JSON.stringify(response));
      const reviewCount = JSON.parse(JSON.stringify(response.reviews));
      //       console.log("Abdi review: " +  JSON.stringify(responseData, null, 2));
      self.view.lblTotalReview.text =
        "Total Number Of Reviews: " + reviewCount.length;
      var allReview = responseData.reviews;

      var filteredRecordsa = allReview.map((record) => ({
        lblFeedback: record.comment,
        lblGrade: record.title,
        lblSubmittedBy: "submitted by: " + record.reviewer[0].name,
        // imgReviewRate:
      }));

      var filteredRecords = allReview.map((record) => {
        var imgSrc = "";
        var reviewCount = record.rating
        if (reviewCount > 4.5) {
          imgSrc = "ratings_star_5.png";
        } else if (reviewCount > 3.5 && reviewCount <= 4.5) {
          imgSrc= "ratings_star_4.png";
        } else if (reviewCount > 2.5 && reviewCount <= 3.5) {
          imgSrc = "ratings_star_3.png";
        } else if (reviewCount > 1.5 && reviewCount <= 2.5) {
          imgSrc = "ratings_star_2.png";
        } else {
          imgSrc= "ratings_star_1.png";
        }
        return {
          lblFeedback: record.comment,
          lblGrade: record.title,
          lblSubmittedBy: "submitted by: " + record.reviewer[0].name,
          imgReviewRate:imgSrc
        };
      });

      self.view.segReview.setData(filteredRecords);
      //       var reviewCount =
      //       var reviewIndex =responseData[0].comment;
      //       console.log("Abdi review length: " + JSON.stringify(reviewIndex, null, 2));
    }

    getCategorieService = mfintegrationsecureinvokerasync(
      param,
      serviceName,
      operationName,
      getDataCallback
    );
  },
  addToCart: function(){
    var  self = this;
    var stores = kony.store.getItem("cart");
    var storedData =  JSON.parse(JSON.stringify(stores));
    //     var orderNumber;
    //     if(!kony.store.getItem("cart")){
    //       orderNumber = 0;
    //       console.log("Abdi kony no frm Add ");
    //     }else{
    //       orderNumber = kony.store.getItem("cart").length;
    //       console.log("Abdi kony len: frm Add " + kony.store.getItem("cart").length);
    //     }

    //     console.log("Abdi product Object Normal: " + JSON.stringify(self.productObject, null, 2)); 
    //     //ordernum = 0;
    //     self.productObject.orderNum = orderNumber;
    //     console.log("Abdi product Object OrderNum Added: " + JSON.stringify(self.productObject, null, 2));
    // //     ordernum =2
    //     this.productInCart.push(self.productObject);

    var orderNumber;
    if (!kony.store.getItem("cart")) {
      orderNumber = 0;
      console.log("Abdi kony no frm Add ");
    } else {
      orderNumber = kony.store.getItem("cart").length;
      console.log("Abdi kony len: frm Add " + kony.store.getItem("cart").length);
    }

    console.log("Abdi product Object Normal: " + JSON.stringify(self.productObject, null, 2)); 

    // Set order number
    self.productObject.orderNum = orderNumber;

    console.log("Abdi product Object OrderNum Added: " + JSON.stringify(self.productObject, null, 2));

    // ✅ Create a new object (deep copy)
    var newProduct = JSON.parse(JSON.stringify(self.productObject));

    // ✅ Push the new object, not the reference
    this.productInCart.push(newProduct);



    console.log("Abdi productInCart : " + JSON.stringify(this.productInCart, null, 2));
    kony.store.setItem("cart", this.productInCart);
    console.log("Abdi KOny store : " + JSON.stringify(kony.store.setItem("cart", this.productInCart), null, 2));

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
  navigateToCart: function( seguiWidget, sectionNumber, rowNumber, selectedState){
    var selectedMenu =this.view.humburgerMenu.segHumbergurMenu.selectedRowItems[0].lblMenuName;
    console.log("Abdi Menu : " + selectedMenu);
    kony.application.destroyForm("frmShoppingCart");
    var ntf = new kony.mvc.Navigation("frmShoppingCart");
    ntf.navigate();
    //     if(selectedMenu === "Cart"){

    //       var ntf = new kony.mvc.Navigation("frmShoppingCart");
    //       ntf.navigate();
    //     }

  }
});
