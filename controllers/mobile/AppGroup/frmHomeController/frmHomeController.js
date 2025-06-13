define({
  navigationTracker: [],

  responseDatas: [],

  categoriesPaths: [], //in use for path

  categoriesData: [], //in use for subcategories

  onInit: function () {
    kony.ui.makeAffineTransform()

    this.view.segCategories.onRowClick = this.onRowClicked;
    this.view.toolbarMenu.btnBack.onClick = this.onBackClicked;
    this.view.toolbarMenu.btnMenu.onClick = this.menuFunction;
    this.view.toolbarMenu.btnSearch.onClick = this.openAndCloseSearch;
    this.view.btnCancel.onClick = this.closeSearch;
    this.view.txtSearch.onDone = this.searchProduct;
    this.view.error.btnRetry.onClick = this.getCategories;
  },
  onPreShow: function () {
    kony.application.showLoadingScreen("sknBluryBackground", "Loading...", constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, {});
    this.rateSelection();
    this.getCategories();
  },
  getCategories: function (id) {

    var self = this;
    var serviceName = "BestBuyAPI";
    var client = kony.sdk.getCurrentInstance();
    var integrationSvc = client.getIntegrationService(serviceName);
    var operationName = "getCategories";
    var param = { id: id };

    function getDataCallback(status, response) {
      //  all responses
      const responseData = JSON.parse(JSON.stringify(response));
      if(response.errmsg){
        self.view.error.lblError.text = "Network Error! Please try again!";
        function moveCallback(){}

        self.view.error.animate(
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
        kony.application.dismissLoadingScreen();
        return;
      }

      //    Subcategories extracted
      if (responseData.categories && responseData.categories.length > 0) {
        var firstCategory = responseData.categories[0];

        if (
          firstCategory.subCategories &&
          firstCategory.subCategories.length > 0
        ) {
          var subcategories = responseData.categories[0].subCategories;
          var paths = responseData.categories[0].path;
          var categories = response.categories;
        } else {
          kony.store.setItem(
            "categoryID",
            JSON.stringify(
              self.categoriesPaths[self.categoriesPaths.length - 1].id,
              null,
              2
            )
          );
          //           kony.store.setItem("categoryID", id);
          kony.store.setItem(
            "categoryName",
            JSON.stringify(
              self.categoriesPaths[self.categoriesPaths.length - 1].name,
              null,
              2
            )
          );

          //           self.categoriesPaths.pop();
          //           self.categoriesData.pop();
          var ntf = new kony.mvc.Navigation("frmProductList");
          ntf.navigate();
          return;
          //           alert("No subcategories.");
        }
      } else {
        kony.store.setItem(
          "categoryID",
          JSON.stringify(
            self.categoriesPaths[self.categoriesPaths.length - 1].id,
            null,
            2
          )
        );
        //         kony.store.setItem("categoryID",id);
        kony.store.setItem(
          "categoryName",
          JSON.stringify(
            self.categoriesPaths[self.categoriesPaths.length - 1].name,
            null,
            2
          )
        );

        //               self.categoriesPaths.pop();
        //               self.categoriesData.pop();
        var ntf = new kony.mvc.Navigation("frmProductList");
        ntf.navigate();

        return;
      }

      self.categoriesPaths = [];

      for (var i = 0; i < paths.length; i++) {
        self.categoriesPaths.push(paths[i]);
      }

      self.categoriesData.push(subcategories);

      self.responseDatas.push(subcategories);
      var filteredRecords = subcategories.map((record) => ({
        lblCategories: record.name,
        lblId: record.id,
      }));

      if (
        Array.isArray(categories) &&
        categories.length > 0 &&
        Array.isArray(categories[0].subCategories) &&
        categories[0].subCategories.length > 0
      ) {
        console.log("Abdi :  Subcategories found!");
      } else {
        console.log("Abdi :  No subcategories found.");
      }

      var names = "Home";
      if (self.categoriesPaths.length > 1) {
        names =
          "Home -> " +
          self.categoriesPaths
          .slice(1)
          .map((item) => item.name)
          .join(" -> ");
      }

      if (subcategories.length < 3) {
        kony.store.setItem(
          "categoryID",
          JSON.stringify(
            self.categoriesPaths[self.categoriesPaths.length - 1].id,
            null,
            2
          )
        );
        kony.store.setItem(
          "categoryName",
          JSON.stringify(
            self.categoriesPaths[self.categoriesPaths.length - 1].name,
            null,
            2
          )
        );
        kony.store.setItem(
          "categoryIDToBack",
          JSON.stringify(
            self.categoriesPaths[self.categoriesPaths.length - 2].id,
            null,
            2
          )
        );

        self.categoriesPaths.pop();
        self.categoriesData.pop();
        var ntf = new kony.mvc.Navigation("frmProductList");
        ntf.navigate();
        //         console.log("Abdi : " + JSON.stringify(self.categoriesPaths[self.categoriesPaths.length - 1].id, null, 2));
      } else {
        self.view.lblPage.text = names;

        self.view.segCategories.setData(filteredRecords);

        kony.application.dismissLoadingScreen();
      }
    }

    getCategorieService = mfintegrationsecureinvokerasync(
      param,
      serviceName,
      operationName,
      getDataCallback
    );
  },
  onRowClicked: function (
    seguiWidget,
    sectionNumber,
    rowNumber,
    selectedState
  ) {
    var self = this;
    kony.application.showLoadingScreen("sknBluryBackground", "Loading...", constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, {});
    var categoriesId = this.view.segCategories.selectedRowItems[0].lblId;

    var pathInfos = self.navigationTracker.reduce(
      (acc, val) => acc.concat(val),
      []
    );
    const names = pathInfos.slice(1).map((item) => item.name);

    this.getCategories(categoriesId);
    this.view.toolbarMenu.flxBack.setVisibility(true);
  },
  onBackClicked: function () {
    var self = this;
    var categoriesIdForBack;

    var nextToLastIndex = 0;
    if (self.categoriesPaths.length > 1) {
      self.categoriesPaths.pop();
      nextToLastIndex = self.categoriesPaths.length - 1;
    }
    if (nextToLastIndex == 0) {
      this.view.toolbarMenu.flxBack.setVisibility(false);
    }
    categoriesIdForBack = self.categoriesPaths[nextToLastIndex].id;
    var names = "Home";
    if (self.categoriesPaths.length > 1) {
      names =
        "Home -> " +
        self.categoriesPaths
        .slice(1)
        .map((item) => item.name)
        .join(" -> ");
    }

    self.view.lblPage.text = names;

    this.getCache();
    //     this.getCategories(categoriesIdForBack);
  },
  getCache: function () {
    var self = this;
    var nextToLastIndex = 0;

    if (self.categoriesData.length > 1) {
      self.categoriesData.pop();
      nextToLastIndex = self.categoriesData.length - 1;
    }

    var categoriesList = self.categoriesData[nextToLastIndex];
    var filteredRecords = categoriesList.map((record) => ({
      lblCategories: record.name,
      lblId: record.id,
    }));
    self.view.segCategories.setData(filteredRecords);
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
  openAndCloseSearch: function () {
    var self = this;

    function openSearchCallback() {}
    self.view.flxSearch.animate(
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
        duration: 0.55,
      },
      {
        animationEnd: openSearchCallback,
      }
    );
    self.view.flxCategories.animate(
      kony.ui.createAnimation({
        100: {
          top: "4%",
          stepConfig: {
            timingFunction: kony.anim.EASE,
          },
        },
      }),
      {
        delay: 0,
        iterationCount: 1,
        fillMode: kony.anim.FILL_MODE_FORWARDS,
        duration: 0.55,
        direction: kony.anim.DIRECTION_ALTERNATE,
      },
      {
        animationEnd: openSearchCallback,
      }
    );
  },
  closeSearch: function () {
    var self = this;

    function closeSearchCallback() {}
    self.view.flxSearch.animate(
      kony.ui.createAnimation({
        100: {
          left: "100%",
          stepConfig: {
            timingFunction: kony.anim.EASE,
          },
        },
      }),
      {
        delay: 0,
        iterationCount: 1,
        fillMode: kony.anim.FILL_MODE_FORWARDS,
        duration: 0.55,
      },
      {
        animationEnd: closeSearchCallback,
      }
    );
    self.view.flxCategories.animate(
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
        duration: 0.55,
        direction: kony.anim.DIRECTION_ALTERNATE,
      },
      {
        animationEnd: closeSearchCallback,
      }
    );
  },
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
  searchProduct: function(){
    this.closeSearch();
    var searchData = this.view.txtSearch.text;
    var rateData = this.view.lbxFilter.selectedKey;
    this.closeSearch();
    console.log("Abdi Search : " + searchData);
    console.log("Abdi Rate : " + rateData);
    kony.store.setItem("searchData", searchData);
    kony.store.setItem("searchRate", rateData);
    this.view.txtSearch.text = "";
    this.view.lbxFilter.selectedKey="";
    var ntf = new kony.mvc.Navigation("frmProductList");
    ntf.navigate();

  },
  setAnimationforSeg: function() {
    // Create two transform objects
    var transformObject1 = kony.ui.makeAffineTransform();
    var transformObject2 = kony.ui.makeAffineTransform();

    // Start from 0% width (scaleX = 0), keep full height (scaleY = 1)
    transformObject1.scale(0, 1); // Start collapsed horizontally
    transformObject2.scale(1, 1); // End at full width

    // Define the animation steps
    var animationObject = kony.ui.createAnimation({
      "0": { 
        "transform": transformObject1, 
        "stepConfig": { "timingFunction": kony.anim.EASE_IN }
      },
      "100": { 
        "transform": transformObject2, 
        "stepConfig": { "timingFunction": kony.anim.EASE_OUT }
      }
    });

    // Animation configuration
    var animationConfig = {
      duration: 0.5, // Half a second for smooth transition
      fillMode: kony.anim.FILL_MODE_FORWARDS
    };

    // Optional callback when animation ends
    var animationCallbacks = {
      "animationEnd": function() { kony.print("Animation Finished!"); }
    };

    // Combine everything into one animation definition
    var animationDefObject = {
      definition: animationObject,
      config: animationConfig,
      callbacks: animationCallbacks
    };

    // Apply the animation to segment when it becomes visible
    this.view.segCategories.setAnimations({ visible: animationDefObject });
  },

});
