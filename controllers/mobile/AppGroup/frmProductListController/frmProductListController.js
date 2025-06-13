define({ 

  onInit: function(){
    this.getProductList();
    this.view.segProducts.onRowClick = this.onRowClicked;
    this.view.toolbarMenu.btnBack.onClick = this.onBackClick;
  },
  getProductList: function(){
    var self = this;
    var categoryId = kony.store.getItem("categoryID");
    var categoryName = "Category: " + kony.store.getItem("categoryName");
    var serviceName = "BestBuyAPI";
    var client = kony.sdk.getCurrentInstance();
    var integrationSvc = client.getIntegrationService(serviceName);
    var operationName = "getProductLists";
    var param = {id:categoryId};
    this.view.lblProductPage.text = categoryName.replace(new RegExp('"', 'g'), '');

    kony.store.removeItem("categoryID");
    kony.store.removeItem("categoryName");

    function getDataCallback(status, response) {
      const responseData = JSON.parse(JSON.stringify(response));
      if(response.errmsg){
        const errorResponse =  response.errmsg;
        self.view.ErrorPopup.lblError.text = errorResponse;
        function errorCallback() {}
        self.view.ErrorPopup.animate(
          kony.ui.createAnimation({
            "100": {
              "left": "0%",
              "stepConfig": {
                "timingFunction": kony.anim.EASE
              }
            }
          }), {
            "delay": 0,
            "iterationCount": 1,
            "fillMode": kony.anim.FILL_MODE_FORWARDS,
            "duration": 0.1,
            "direction": kony.anim.DIRECTION_ALTERNATE
          }, {
            "animationEnd": errorCallback
          });
        return;
      }

      var productList = responseData.products;

      //flxShipping: {isVisible: record.freeShipping},
      var filteredRecords = productList.map((record) => ({
        sku:record.sku,

        flxShipping: {
          isVisible: record.freeShipping
        },
        lblFreeShipping: {
          text: "!!! Free Shipping !!!",    
          isVisible: record.freeShipping
        },
        imgProduct: record.image,
        lblProductName: record.name,
        lblProductPrice: "$ " + record.salePrice,
        lblProductReview: {
          text: (record.customerReviewAverage === "undefined" || !record.customerReviewAverage) ? "Avg User Rating: " : "Avg User Rating: " + record.customerReviewAverage
        }
      }));
      console.log("Abdi Data filter: " + JSON.stringify(filteredRecords, null, 2));
      self.view.segProducts.setData(filteredRecords);
    }
    getProductListService = mfintegrationsecureinvokerasync(
      param,
      serviceName,
      operationName,
      getDataCallback
    );
  },
  onBackClick: function(){
    var self
    var ntf = new kony.mvc.Navigation("frmHome");
    ntf.navigate();
    kony.application.destroyForm("frmProductList");
  },
  onRowClicked: function (
    seguiWidget,
    sectionNumber,
    rowNumber,
    selectedState
  ) {
    var self = this;
    var productId = this.view.segProducts.selectedRowItems[0].sku;
    var productNames = this.view.segProducts.selectedRowItems[0].lblProductName;
    console.log("Abdi SKU: " + productId + " Name: " + productNames);
    kony.store.setItem("productId", productId)

    var ntf = new kony.mvc.Navigation("frmProductDetail");
    ntf.navigate();
    //     kony.application.destroyForm("frmProductList");


    //     var pathInfos = self.navigationTracker.reduce(
    //       (acc, val) => acc.concat(val),
    //       []
    //     );
    //     const names = pathInfos.slice(1).map((item) => item.name);

    //     this.view.toolbarMenu.flxBack.setVisibility(true);
    //     this.getCategories(categoriesId);
  },

});