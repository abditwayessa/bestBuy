/**
 * @Controller: frmProductListController
 * @Author: Abdi T. Wayessa
 * @Description:
 * This controller manages product listing, product search, and navigation to product details.
 * It integrates with the BestBuyAPI to fetch product lists by category or search input.
 *
 * Features:
 * - Fetch product lists by category or search term
 * - Display Free Shipping indicators conditionally
 * - Smooth animations for segments and hamburger menu
 * - Seamless navigation to product details
 * - Local storage management for product and search data
 */
define({
  onInit: function () {
    this.view.segProducts.onRowClick = this.onRowClicked;
    this.view.toolbarMenu.btnBack.onClick = this.onBackClick;
    this.view.toolbarMenu.btnMenu.onClick = this.menuFunction;
    this.view.btnNext.onClick = this.goToNextPage;
    this.view.btnPrevoius.onClick = this.goToPreviousPage;
  },

  onPreShow: function () {
    var inputText = kony.store.getItem("searchData");
    var inputRate = kony.store.getItem("rateData") || "";
    kony.store.removeItem("searchData");
    kony.store.removeItem("rateData");

    if (!inputText) {
      this.getProductList();
    } else {
      this.getProductBySearch(inputText, inputRate);
    }
  },
  onPostShow: function () {
    this.segAnimation();
    if(kony.application.getPreviousForm("frmProductDetail").id ){
      //       alert("Yes");
    }
  },
  onNaviaget: function(){
    kony.store.removeItem("currentPage");
    kony.store.removeItem("totalPage");
  },
  getProductList: function (pageNumber) {
    var self = this;
    var categoryId = kony.store.getItem("categoryID");
    kony.store.getItem("categoryName");
    var categoryName = "Category: " + kony.store.getItem("categoryName").replace(
      new RegExp('"', "g"),
      ""
    );
    var serviceName = "BestBuyAPI";
    var client = kony.sdk.getCurrentInstance();
    var integrationSvc = client.getIntegrationService(serviceName);
    var operationName = "getProductLists";
    var pageNum = "";

    if(pageNumber !== undefined){  
      pageNum = pageNumber;
    }else{
      pageNum = 1;
    }
    var param = { id: categoryId, pages: pageNum };

    this.view.lblProductPage.text = categoryName;

    function getDataCallback(status, response) {
      if (response.errmsg) {
        alert("Connection Error!");
        self.onBackClick();
        kony.application.dismissLoadingScreen();
        return;
      }

      var productList = response.products;
      var totalPage = response.totalPages;
      var currentPages = response.currentPage;

      kony.store.setItem("currentPage", currentPages);
      kony.store.setItem("totalPage", totalPage);


      if (productList.length < 1) {
        self.view.segProducts.setVisibility(false);
        self.view.lblProductPage.text = "No product for this category";
        kony.application.dismissLoadingScreen();
        return;
      }
      //       Previouspage
      if(currentPages === 1){
        self.view.btnPrevoius.setVisibility(false);
        self.view.btnNext.setVisibility(true)
      }else{
        self.view.btnPrevoius.setVisibility(true);
      }
      //       NextPage
      if(currentPages === totalPage){
        self.view.btnNext.setVisibility(false);
      }else{
        self.view.btnNext.setVisibility(true);
      }

      self.view.lblPage.text = "Page " + currentPages + " of " + totalPage;
      self.view.segProducts.setVisibility(true);
      var filteredRecords = productList.map((record) => ({
        sku: record.sku,
        flxShipping: { isVisible: record.freeShipping },
        lblFreeShipping: { text: "!!! Free Shipping !!!", isVisible: record.freeShipping },
        imgProduct: record.image,
        lblProductName: record.name,
        lblProductPrice: { 
          text: record.onSale ? "$" + record.salePrice : "$" + record.regularPrice,
          skin: record.onSale ? "sknRed100Font" : "sknGray100Font"
        },
        lblProductReview: {
          text: (!record.customerReviewAverage || record.customerReviewAverage === "undefined") ? "Avg User Rating: " : "Avg User Rating: " + record.customerReviewAverage
        }
      }));

      self.view.segProducts.setData(filteredRecords);
      kony.application.dismissLoadingScreen();
    }

    mfintegrationsecureinvokerasync(param, serviceName, operationName, getDataCallback);
  },

  getProductBySearch: function (inputText, inputRate, pageNumber) {
    var self = this;
    var serviceName = "BestBuyAPI";
    var client = kony.sdk.getCurrentInstance();
    var integrationSvc = client.getIntegrationService(serviceName);
    var operationName = "getProductBySearch";
    var pageNum = "";

    if(pageNumber !== undefined){  
      pageNum = pageNumber;
    }else{
      pageNum = 1;
    }

    kony.store.setItem("inputText", inputText);
    kony.store.setItem("inputRate", inputRate);

    var param = { inputText: inputText, rate: inputRate, pages: pageNum};

    this.view.lblProductPage.text = "Results for: " + inputText;

    kony.store.setItem("inputTextReuse", inputText);
    kony.store.setItem("inputRateReuse", inputRate);
    kony.store.setItem("pageNumReuse", pageNum);
    kony.store.setItem("lableTextReuse",  this.view.lblProductPage.text);

    function getDataCallback(status, response) {
      if (response.errmsg) {
        alert("Connection Error!");
        kony.application.dismissLoadingScreen();
        return;
      }

      var productList = response.products;
      var totalPage = response.totalPages;
      var currentPages = response.currentPage;

      kony.store.setItem("currentPage", currentPages);
      kony.store.setItem("totalPage", totalPage);




      if (productList.length < 1) {
        self.view.segProducts.setVisibility(false);
        self.view.lblProductPage.text = "No products found for this search.";
        kony.application.dismissLoadingScreen();
        return;
      }
      //       Previouspage
      if(currentPages === 1){
        self.view.btnPrevoius.setVisibility(false);
        self.view.btnNext.setVisibility(true)
      }else{
        self.view.btnPrevoius.setVisibility(true);
      }
      //       NextPage
      if(currentPages === totalPage){
        self.view.btnNext.setVisibility(false);
      }else{
        self.view.btnNext.setVisibility(true);
      }

      self.view.lblPage.text = "Page " + currentPages + " of " + totalPage;
      self.view.segProducts.setVisibility(true);
      var filteredRecords = productList.map((record) => ({
        sku: record.sku,
        flxShipping: { isVisible: record.freeShipping },
        lblFreeShipping: { text: "!!! Free Shipping !!!", isVisible: record.freeShipping },
        imgProduct: record.image,
        lblProductName: record.name,
        lblProductPrice: { 
          text: "$" + record.salePrice,
          skin: record.onSale ? "sknRed100Font" : "sknGray100Font"
        },
        lblProductReview: {
          text: (!record.customerReviewAverage || record.customerReviewAverage === "undefined") ? "Avg User Rating: " : "Avg User Rating: " + record.customerReviewAverage
        }
      }));

      self.view.segProducts.setData(filteredRecords);
      kony.application.dismissLoadingScreen();
    }

    mfintegrationsecureinvokerasync(param, serviceName, operationName, getDataCallback);
  },
  goToPreviousPage: function(){
    kony.application.showLoadingScreen("sknBluryBackground", "Loading...", constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, {});
    var currentPages = kony.store.getItem("currentPage");
    if(currentPages > 1 ){
      currentPages--;
      if(this.view.lblProductPage.text.includes("Category")){
        this.getProductList(currentPages);
      }else{
        var inputText = kony.store.getItem("inputText");
        var inputRate = kony.store.getItem("inputRate");
        this.getProductBySearch(inputText, inputRate, currentPages);
      }
    }else{
      return;
    }
  },
  goToNextPage: function(){
    kony.application.showLoadingScreen("sknBluryBackground", "Loading...", constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, {});
    var currentPages = kony.store.getItem("currentPage");
    var totalPage = kony.store.getItem("totalPage");
    if(currentPages <= totalPage){
      currentPages++;
      if(this.view.lblProductPage.text.includes("Category")){
        this.getProductList(currentPages);
      }else{
        var inputText = kony.store.getItem("inputText");
        var inputRate = kony.store.getItem("inputRate");
        this.getProductBySearch(inputText, inputRate, currentPages);
      }
    }else{
      return;
    }
  },
  onBackClick: function () {
    //     if (!this.view.lblProductPage.text.includes("Category") || !this.view.lblProductPage.text.includes("category")) {
    //       kony.application.destroyForm("frmHome");
    //     }
    if(kony.store.getItem("fromSearch")){
      kony.application.destroyForm("frmHome");
      kony.store.removeItem("fromSearch");
    }
    var ntf = new kony.mvc.Navigation("frmHome");
    ntf.navigate();
    kony.application.destroyForm("frmProductList");
  },

  onRowClicked: function () {
    var productId = this.view.segProducts.selectedRowItems[0].sku;
    var productName = this.view.segProducts.selectedRowItems[0].lblProductName;

    kony.store.setItem("productId", productId);
    kony.application.showLoadingScreen("sknBluryBackground", "Loading...", constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, {});

    var ntf = new kony.mvc.Navigation("frmProductDetail");
    ntf.navigate();
  },

  menuFunction: function () {
    var self = this;
    var showMenu = self.view.humburgerMenu.left === "-80%";
    var flxLeft = showMenu ? "80%" : "0%";
    var menuLeft = showMenu ? "0%" : "-80%";

    self.view.flxMain.animate(kony.ui.createAnimation({ 100: { left: flxLeft, stepConfig: { timingFunction: kony.anim.EASE } } }),
                              { duration: 0.25, fillMode: kony.anim.FILL_MODE_FORWARDS }, {});

    self.view.humburgerMenu.animate(kony.ui.createAnimation({ 100: { left: menuLeft, stepConfig: { timingFunction: kony.anim.EASE } } }),
                                    { duration: 0.25, fillMode: kony.anim.FILL_MODE_FORWARDS }, {});
  },

  segAnimation: function () {
    var transformStart = kony.ui.makeAffineTransform();
    var transformMiddle = kony.ui.makeAffineTransform();
    var transformEnd = kony.ui.makeAffineTransform();

    transformStart.scale(0.0, 0.0);
    transformMiddle.scale(0.5, 0.5);
    transformEnd.scale(1, 1);

    var animationObject = kony.ui.createAnimation({
      0: { transform: transformStart, anchorPoint: { x: 0.5, y: 0.5 } },
      50: { transform: transformMiddle, anchorPoint: { x: 0.5, y: 0.5 } },
      100: { transform: transformEnd, anchorPoint: { x: 0.5, y: 0.5 } }
    });

    var animationConfig = { duration: 0.3, iterationCount: 1, delay: 0, fillMode: kony.anim.FORWARDS };

    this.view.segProducts.setAnimations({ visible: { definition: animationObject, config: animationConfig, callbacks: {} } });
  }
});
