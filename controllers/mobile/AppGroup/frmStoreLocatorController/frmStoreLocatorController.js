define({ 

  onInit: function(){
    this.view.btnSearch.onClick = this.searchLocation;
    this.view.toolbarMenu.btnMenu.onClick = this.menuFunction;
  },
  preShow: function(){
    //     this.loadStoreMap();
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
  searchLocation: function(){
    var self = this;
    kony.application.showLoadingScreen("sknBluryBackground", "Loading...", constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, true, {});

    var searchData = this.view.txtLocation.text;
    var serviceName = "BestBuyAPI";
    var client = kony.sdk.getCurrentInstance();
    var integrationSvc = client.getIntegrationService(serviceName);
    var operationName = "getLocation";
    var param = { location: searchData };

    function getDataCallback(status, response) {
      const responseData = JSON.parse(JSON.stringify(response));
      if(response.errmsg){
        alert("Network Error");

        kony.application.dismissLoadingScreen();
        //         kony.application.destroyForm("frmHome");
        //         var ntf = new kony.mvc.Navigation("frmHome");
        //         ntf.navigate();
        return;
      }
      if(response.stores.length < 1){
        alert("Location not found!");
        kony.application.dismissLoadingScreen();
        return;
      }
      var validStores = response.stores.filter(function (store) {
        return store.lat !== undefined && store.lng !== undefined || store.lat !== "" && store.lng !== "";
      });


      var mappedMarkers = validStores.map((store) => {
        return {
          lat: store.lat ? store.lat.toString() : "0",
          lon: store.lng ? store.lng.toString() : "0",
          calloutData: {
            lblAddressForDetail: "Address:",
            lblAddressName: store.name,
            lblAddressDetail: store.address,
            imgCompass: "compass.png"
          },
          image: "pinb.png",
          showCallout: true 
        }

      });
      console.log("Abdi Map: " +   JSON.stringify(mappedMarkers, null, 2));
      var locationDatas = JSON.stringify(mappedMarkers, null, 2);
      self.view.mapStores.mapKey
      self.view.mapStores.locationData = mappedMarkers;
      kony.application.dismissLoadingScreen();

    }

    mfintegrationsecureinvokerasync(
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