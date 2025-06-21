/**
 * @Controller: frmHomeController
 * @Author: Abdi T. Wayessa
 * @Description:
 * This controller manages category navigation and interaction for the home screen of the app.
 * It loads subcategories via BestBuyAPI integration, handles navigation to the product list,
 * search/filter animations, back button logic, and hamburger menu transitions.
 *
 * Features:
 * - Category drill-down navigation and caching
 * - Animated transitions (hamburger menu, segment animation, search panel)
 * - Search input with optional rating filter
 * - Smooth backtracking and storage support via kony.store
 * - Segment data binding with animation
 */

define({
  responseDatas: [],
  categoriesPaths: [], // Used for category paths
  categoriesData: [], // Used for subcategory data

  /**
   * @description Initializes event listeners and loads initial categories.
   */
  onInit: function () {
    this.view.segCategories.onRowClick = this.onRowClicked;
    this.view.toolbarMenu.btnBack.onClick = this.onBackClicked;
    this.view.toolbarMenu.btnMenu.onClick = this.menuFunction;
    this.view.toolbarMenu.btnSearch.onClick = this.openAndCloseSearch;
    this.view.btnCancel.onClick = this.closeSearch;
    this.view.txtSearch.onDone = this.searchProduct;
    this.getCategories("cat00000");
  },

  /**
   * @description Pre-show lifecycle event. Displays a loading screen and sets up initial state.
   */
  onPreShow: function () {
    kony.timer.schedule("delayTimer", function () {
      kony.application.showLoadingScreen("sknBluryBackground", "Loading...", constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, {});
      kony.timer.cancel("delayTimer");
    }, 0.1, false);

    this.rateSelection();
  },

  /**
   * @description Post-show lifecycle event. Handles animation for segments and loads data.
   */
  onPostShow: function () {
    var self = this;
    this.segAnimation();

    if(kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)){
      if (kony.application.getPreviousForm("frmProductList")) {
        var nextToLastIndex = 0;
        var categoriesDataFromStores = kony.store.getItem("categoriesList");
        self.categoriesData = categoriesDataFromStores || [];

        if (self.categoriesData.length > 1) {
          nextToLastIndex = self.categoriesData.length - 1;
        }

        var categoriesList = self.categoriesData[nextToLastIndex];
        var filteredRecords = categoriesList.map((record) => ({
          lblCategories: record.name,
          lblId: record.id,
        }));

        self.view.segCategories.setData(filteredRecords);
        kony.application.dismissLoadingScreen();
      }
    }else{
      var alertConfig = {
        message: "Please connect to the internet",
        alertType: constants.ALERT_TYPE_INFO,
        alertTitle: "Connection Error",
        yesLabel: "OK",
        noLabel: "",
        alertHandler: function(response) {
          if (response) { // OK button clicked
            kony.application.exit();
          }
        }
      };

      kony.ui.Alert(alertConfig, {});
    }
  },

  /**
   * @description Fetches categories from the API and updates the UI.
   * @param {string} id - The ID of the category to fetch.
   */
  getCategories: function (id, catName) {
    if(kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)){
      var self = this;
      var serviceName = "BestBuyAPI";
      var client = kony.sdk.getCurrentInstance();
      var integrationSvc = client.getIntegrationService(serviceName);
      var operationName = "getCategories";
      var param = { id: id };
      var catId = id;
      var catNames = catName;

      function getDataCallback(status, response) {
        if (response.errmsg) {
          alert("Connection Error!");	
          kony.application.dismissLoadingScreen();
          return;
        }

        var responseData = JSON.parse(JSON.stringify(response));

        if (responseData.categories && responseData.categories.length > 0) {
          var firstCategory = responseData.categories[0];
          if (firstCategory.subCategories && firstCategory.subCategories.length > 0) {
            var subcategories = firstCategory.subCategories;
            var paths = firstCategory.path;
            var categories = responseData.categories;
          } else {
            self.updateCategoryDataAndNavigate(catId, catNames);
            return;
          }
        } else if(responseData.categories.length === 0) {
          self.updateCategoryDataAndNavigate(catId, catNames);
          return;
        }

        self.categoriesPaths = paths;
        self.categoriesData.push(subcategories);
        self.responseDatas.push(subcategories);

        var filteredRecords = subcategories.map((record) => ({
          lblCategories: record.name,
          lblId: record.id,
        }));

        var names = "Home";
        if (self.categoriesPaths.length > 1) {
          names = "Home -> " + self.categoriesPaths.slice(1).map((item) => item.name).join(" -> ");
        }

        if (subcategories.length < 3) {
          self.updateCategoryDataAndNavigate(catId, catNames);
        } else {
          self.view.lblPage.text = names;
          self.view.segCategories.setData(filteredRecords);
          kony.application.dismissLoadingScreen();
        }
      }

      mfintegrationsecureinvokerasync(param, serviceName, operationName, getDataCallback);
    }else{
      var alertConfig = {
        message: "Please connect to the internet",
        alertType: constants.ALERT_TYPE_INFO,
        alertTitle: "Connection Error",
        yesLabel: "OK",
        noLabel: "",
        alertHandler: function(response) {
          if (response) { // OK button clicked
            kony.application.exit();
          }
        }
      };

      kony.ui.Alert(alertConfig, {});
    }
  },

  /**
   * @description Updates category data and navigates to the product list.
   */
  updateCategoryDataAndNavigate: function (catId, catName) {

    if(kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)){
      var self = this;
      //     kony.store.setItem("categoryID", JSON.stringify(self.categoriesPaths[self.categoriesPaths.length - 1].id));
      //     kony.store.setItem("categoryName", JSON.stringify(self.categoriesPaths[self.categoriesPaths.length - 1].name));

      kony.store.setItem("categoryID", catId);
      kony.store.setItem("categoryName", catName);

      var ntf = new kony.mvc.Navigation("frmProductList");
      ntf.navigate();
    }else{
      alert("Please connect to the internet");
    }
  },

  /**
   * @description Handles row click in category segment.
   * @param {object} seguiWidget - The segment widget.
   * @param {number} sectionNumber - The section number.
   * @param {number} rowNumber - The row number.
   * @param {boolean} selectedState - The selected state.
   */
  onRowClicked: function (seguiWidget, sectionNumber, rowNumber, selectedState) {
    var self = this;
    kony.application.showLoadingScreen("sknBluryBackground","Loading...", constants.LOADING_SCREEN_POSITION_FULL_SCREEN,true,true, {});
    var categoriesId = this.view.segCategories.selectedRowItems[0].lblId;
    var categoriesName = this.view.segCategories.selectedRowItems[0].lblCategories;

    this.getCategories(categoriesId, categoriesName);
    this.view.toolbarMenu.flxBack.setVisibility(true);

    if (kony.store.getItem("categoriesList")) {
      kony.store.removeItem("categoriesList");
    }
    kony.store.setItem("categoriesList", self.categoriesData);
  },

  /**
   * @description Handles back button click and navigates through categories.
   */
  onBackClicked: function () {
    var self = this;
    var nextToLastIndex = 0;

    if (self.categoriesPaths.length > 1) {
      self.categoriesPaths.pop();
      nextToLastIndex = self.categoriesPaths.length - 1;
    }

    if (nextToLastIndex === 0) {
      this.view.toolbarMenu.flxBack.setVisibility(false);
    }

    var names = "Home";
    if (self.categoriesPaths.length > 1) {
      names = "Home -> " + self.categoriesPaths.slice(1).map((item) => item.name).join(" -> ");
    }

    self.view.lblPage.text = names;
    this.getCache();
  },

  /**
   * @description Retrieves cached categories data from local storage.
   */
  getCache: function () {
    var self = this;
    var categoriesDataFromStores = kony.store.getItem("categoriesList");

    if (self.categoriesData.length === 0 && categoriesDataFromStores) {
      self.categoriesData.push(categoriesDataFromStores);
    } else if (self.categoriesData.length > 0) {
      self.categoriesData.pop();
      var nextToLastIndex = self.categoriesData.length - 1;
      var categoriesList = self.categoriesData[nextToLastIndex];
      var filteredRecords = categoriesList.map((record) => ({
        lblCategories: record.name,
        lblId: record.id,
      }));

      self.view.segCategories.setData(filteredRecords);
    }
  },

  /**
   * @description Toggles the visibility of the side menu.
   */
  menuFunction: function () {
    var self = this;
    var animationConfig = {
      delay: 0,
      iterationCount: 1,
      fillMode: kony.anim.FILL_MODE_FORWARDS,
      duration: 0.25,
    };

    if (this.view.humburgerMenu.left === "-80%") {
      self.view.flxMain.animate(
        kony.ui.createAnimation({
          100: { left: "80%", stepConfig: { timingFunction: kony.anim.EASE } },
        }),
        animationConfig
      );
      self.view.humburgerMenu.animate(
        kony.ui.createAnimation({
          100: { left: "0%", stepConfig: { timingFunction: kony.anim.EASE } },
        }),
        animationConfig
      );
    } else {
      self.view.flxMain.animate(
        kony.ui.createAnimation({
          100: { left: "0%", stepConfig: { timingFunction: kony.anim.EASE } },
        }),
        animationConfig
      );
      self.view.humburgerMenu.animate(
        kony.ui.createAnimation({
          100: { left: "-80%", stepConfig: { timingFunction: kony.anim.EASE } },
        }),
        animationConfig
      );
    }
  },

  /**
   * @description Opens the search bar with an animation.
   */
  openAndCloseSearch: function () {
    var self = this;

    self.view.flxSearch.animate(
      kony.ui.createAnimation({ 100: { left: "0%", stepConfig: { timingFunction: kony.anim.EASE } } }),
      { delay: 0, iterationCount: 1, fillMode: kony.anim.FILL_MODE_FORWARDS, duration: 0.55 }
    );
    self.view.flxCategories.animate(
      kony.ui.createAnimation({ 100: { top: "4%", stepConfig: { timingFunction: kony.anim.EASE } } }),
      { delay: 0, iterationCount: 1, fillMode: kony.anim.FILL_MODE_FORWARDS, duration: 0.55, direction: kony.anim.DIRECTION_ALTERNATE }
    );
  },

  /**
   * @description Closes the search bar with an animation.
   */
  closeSearch: function () {
    var self = this;

    self.view.flxSearch.animate(
      kony.ui.createAnimation({ 100: { left: "100%", stepConfig: { timingFunction: kony.anim.EASE } } }),
      { delay: 0, iterationCount: 1, fillMode: kony.anim.FILL_MODE_FORWARDS, duration: 0.55 }
    );
    self.view.flxCategories.animate(
      kony.ui.createAnimation({ 100: { top: "0%", stepConfig: { timingFunction: kony.anim.EASE } } }),
      { delay: 0, iterationCount: 1, fillMode: kony.anim.FILL_MODE_FORWARDS, duration: 0.55, direction: kony.anim.DIRECTION_ALTERNATE }
    );
  },

  /**
   * @description Populates the rate filter dropdown.
   */
  rateSelection: function () {
    this.view.lbxFilter.masterData = [
      [" ", "<Select a value>"],
      ["1", "1 star or better"],
      ["2", "2 star or better"],
      ["3", "3 star or better"],
      ["4", "4 star or better"],
      ["5", "5 star or better"],
    ];
    this.view.lbxFilter.selectedKey = " ";
  },

  /**
   * @description Initiates product search based on the user input.
   */
  searchProduct: function () {
    this.closeSearch();
    if(this.view.txtSearch.text === "" || this.view.txtSearch.text === null || this.view.txtSearch.text === " "){
      alert("Please enter your search keyword!");
      return;
    }else{
      if(kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)){
        kony.application.showLoadingScreen("sknBluryBackground", "Loading...", constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, {});

        var searchData = this.view.txtSearch.text;
        var rateData = this.view.lbxFilter.selectedKey;

        kony.store.setItem("searchData", searchData);
        kony.store.setItem("searchRate", rateData);
        kony.store.setItem("fromSearch", true);

        this.view.txtSearch.text = "";
        this.view.lbxFilter.selectedKey = "";

        var ntf = new kony.mvc.Navigation("frmProductList");
        ntf.navigate();
        kony.application.destroyForm("frmHome");

      }else{
        alert("Please connect to the internet");
      }
    }
  },

  /**
   * @description Defines the animation applied to the categories segment.
   */
  segAnimation: function () {
    var transformObject1 = kony.ui.makeAffineTransform();
    var transformObject2 = kony.ui.makeAffineTransform();

    transformObject1.scale(0, 1); // Start collapsed horizontally
    transformObject2.scale(1, 1); // End at full width

    var animationObject = kony.ui.createAnimation({
      0: { transform: transformObject1, stepConfig: { timingFunction: kony.anim.EASE_IN } },
      100: { transform: transformObject2, stepConfig: { timingFunction: kony.anim.EASE_OUT } },
    });

    var animationConfig = {
      duration: 0.5, 
      fillMode: kony.anim.FILL_MODE_FORWARDS,
    };

    var animationCallbacks = {
      animationEnd: function () {},
    };

    var animationDefObject = {
      definition: animationObject,
      config: animationConfig,
      callbacks: animationCallbacks,
    };

    this.view.segCategories.setAnimations({ visible: animationDefObject });
  }
});
