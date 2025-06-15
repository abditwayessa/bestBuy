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
  },

  getProductList: function () {
    var self = this;
    var categoryId = kony.store.getItem("categoryID");
    var categoryName = "Category: " + kony.store.getItem("categoryName").replace(
      new RegExp('"', "g"),
      ""
    );
    var serviceName = "BestBuyAPI";
    var client = kony.sdk.getCurrentInstance();
    var integrationSvc = client.getIntegrationService(serviceName);
    var operationName = "getProductLists";
    var param = { id: categoryId };

    this.view.lblProductPage.text = categoryName;

    function getDataCallback(status, response) {
      if (response.errmsg) {
        alert("Connection Error!");
        kony.application.dismissLoadingScreen();
        return;
      }

      var productList = response.products;
      if (productList.length < 1) {
        self.view.segProducts.setVisibility(false);
        self.view.lblProductPage.text = "No product for this category";
        kony.application.dismissLoadingScreen();
        return;
      }

      self.view.segProducts.setVisibility(true);
      var filteredRecords = productList.map((record) => ({
        sku: record.sku,
        flxShipping: { isVisible: record.freeShipping },
        lblFreeShipping: { text: "!!! Free Shipping !!!", isVisible: record.freeShipping },
        imgProduct: record.image,
        lblProductName: record.name,
        lblProductPrice: "$ " + record.salePrice,
        lblProductReview: {
          text: (!record.customerReviewAverage || record.customerReviewAverage === "undefined") ? "Avg User Rating: " : "Avg User Rating: " + record.customerReviewAverage
        }
      }));

      self.view.segProducts.setData(filteredRecords);
      kony.application.dismissLoadingScreen();
    }

    mfintegrationsecureinvokerasync(param, serviceName, operationName, getDataCallback);
  },

  getProductBySearch: function (inputText, inputRate) {
    var self = this;
    var serviceName = "BestBuyAPI";
    var client = kony.sdk.getCurrentInstance();
    var integrationSvc = client.getIntegrationService(serviceName);
    var operationName = "getProductBySearch";
    var param = { inputText: inputText, rate: inputRate };

    this.view.lblProductPage.text = "Results for: " + inputText;

    function getDataCallback(status, response) {
      if (response.errmsg) {
        alert("Connection Error!");
        kony.application.dismissLoadingScreen();
        return;
      }

      var productList = response.products;
      if (productList.length < 1) {
        self.view.segProducts.setVisibility(false);
        self.view.lblProductPage.text = "No products found for this search.";
        kony.application.dismissLoadingScreen();
        return;
      }

      self.view.segProducts.setVisibility(true);
      var filteredRecords = productList.map((record) => ({
        sku: record.sku,
        flxShipping: { isVisible: record.freeShipping },
        lblFreeShipping: { text: "!!! Free Shipping !!!", isVisible: record.freeShipping },
        imgProduct: record.image,
        lblProductName: record.name,
        lblProductPrice: "$ " + record.salePrice,
        lblProductReview: {
          text: (!record.customerReviewAverage || record.customerReviewAverage === "undefined") ? "Avg User Rating: " : "Avg User Rating: " + record.customerReviewAverage
        }
      }));

      self.view.segProducts.setData(filteredRecords);
      kony.application.dismissLoadingScreen();
    }

    mfintegrationsecureinvokerasync(param, serviceName, operationName, getDataCallback);
  },

  onBackClick: function () {
    if (!this.view.lblProductPage.text.includes("Category")) {
      kony.application.destroyForm("frmHome");
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
