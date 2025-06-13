define({ 

  onInit: function(){
    this.view.btnSearch.onClick = this.loadStoreMap;

    this.view.toolbarMenu.btnMenu.onClick = this.menuFunction;
  },
  preShow: function(){
    this.loadStoreMap();
  },
  loadStoreMap: function(){
    var locData = [
      {
        lat: "43.47591",
        lon: "-80.53964",
        calloutData: {
          lblAddressForDetail: "Address:",
          lblAddressName: "Location One",
          lblAddressDetail: "Adress One",
          imgCompass: "compass.png" 	
        },
        image: "pinb.png",
      },
      {
        lat: "43.4643",
        lon: "-80.51009",
        calloutData: {
          lblAddressForDetail: "Address:",
          lblAddressName: "Location Two",
          lblAddressDetail: "Adress Two",
          imgCompass: "compass.png"
        },
        image: "pinb.png",
        showCallout: true,
      },
    ];
    this.view.mapStores.locationData = locData;
  },
  searchLocation:function(){
     var self = this;
    var searchData = this.view.txtLocation.text;
    var serviceName = "BestBuyAPI";
    var client = kony.sdk.getCurrentInstance();
    var integrationSvc = client.getIntegrationService(serviceName);
    var operationName = "getCategories";
    var param = { inputText: searchData };
    
    
    
    function getDataCallback(status, response) {
      //  all responses
      const responseData = JSON.parse(JSON.stringify(response));
      if(response.errmsg){
        alert("Network Error");
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
      }
    }

    getCategorieService = mfintegrationsecureinvokerasync(
      param,
      serviceName,
      operationName,
      getDataCallback
    );
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