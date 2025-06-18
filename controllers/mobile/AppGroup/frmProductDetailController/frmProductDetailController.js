define({
  productsId: "",
  productInCart: [],
  productObject:"",
  onInit: function () {
    this.view.toolbarMenu.btnBack.onClick = this.onBackClick;
    this.view.btnMore.onClick = this.openProductImage;
    this.view.toolbarMenu.btnMenu.onClick = this.menuFunction;
    this.view.btnDrop.onClick = this.onDropDownandUp;
    //     this.getReviewData(kony.store.getItem("productId"));
    this.view.btnAddToCart.onClick = this.addToCart;
    //     this.view.humburgerMenu.segHumbergurMenu.onRowClick = this.navigateToCart;
  },
  onPreShow: function () {
    //     this.getProductDetail();
    //     this.getReviewData(this.productsId);
    this.getProductDetailAndReview();
  },
  onNavigate:function(){
    kony.application.destroyForm("frmProductDetail");
  },
  getProductDetailAndReview: function () {
    var self = this;
    var productId = kony.store.getItem("productId");
    this.productsId = productId;
    kony.store.removeItem("productId");
    var serviceName = "BestBuyAPIs";
    var client = kony.sdk.getCurrentInstance();
    var integrationSvc = client.getIntegrationService(serviceName);
    var operationName = "getProductDetailAndReview";
    var param = { productId: productId, sku: productId };

    function getDataCallback(status, response) {
      const responseData = JSON.parse(JSON.stringify(response));

      if(response.errmsg){
        const errorResponse =  response.errmsg;
        alert("Connection Error!");
        kony.application.dismissLoadingScreen();
        self.onBackClick();
        return;
      }
      var onSale = responseData.products[0].onSale;
      var rate = responseData.products[0].customerReviewAverage;
      var imageArray;
      kony.store.setItem("productThumb", responseData.products[0].mediumImage);
      var cartObject = {};

      cartObject = {
        sku:productId,
        name: responseData.products[0].name,
        salePrice: responseData.products[0].salePrice,
        onSale:  responseData.products[0].onSale,
        regularPrice:responseData.products[0].regularPrice
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


      //       Review
      const reviewCount = JSON.parse(JSON.stringify(response.reviews));
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


      kony.application.dismissLoadingScreen();
    }

    mfintegrationsecureinvokerasync(
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

  addToCart: function(){
    var  self = this;
    var stores = kony.store.getItem("cart");
    var storedData =  JSON.parse(JSON.stringify(stores));


    console.log("Abdi product Object Normal: " + JSON.stringify(self.productObject, null, 2)); 


    console.log("Abdi product Object OrderNum Added: " + JSON.stringify(self.productObject, null, 2));

    // ✅ Create a new object (deep copy)
    var newProduct = JSON.parse(JSON.stringify(self.productObject));

    // ✅ Push the new object, not the reference
    this.productInCart.push(newProduct);



    console.log("Abdi productInCart : " + JSON.stringify(this.productInCart, null, 2));
    kony.store.setItem("cart", this.productInCart);
    console.log("Abdi KOny store : " + JSON.stringify(kony.store.setItem("cart", this.productInCart), null, 2));
    alert("Product Added to the Cart Successfully!");
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
  }

});
