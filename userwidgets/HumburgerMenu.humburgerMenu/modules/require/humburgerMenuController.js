define(function () {
  return {
    onRowClick: function (
      seguiWidget,
      sectionNumber,
      rowNumber,
      selectedState
    ) {
      var self = this;
      var selectedMenu =this.view.segHumbergurMenu.selectedRowItems[0].menuId;
      var currentForm = kony.application.getCurrentForm().id;

      switch(selectedMenu){
        case "home":
          if(currentForm === "frmHome"){
            this.hideHumburger();
          }else{
            kony.application.destroyForm("frmHome");
            var ntf = new kony.mvc.Navigation("frmHome");
            ntf.navigate();
          }
          break;
        case "store":   
          if(currentForm === "frmStoreLocator"){
            this.hideHumburger();
          }else{
            kony.application.destroyForm("frmStoreLocator");
            var ntf = new kony.mvc.Navigation("frmStoreLocator");
            ntf.navigate();
          }
          break;
        case "cart":
          if(currentForm === "frmShoppingCart"){
            this.hideHumburger();
          }else{
            var ntf = new kony.mvc.Navigation("frmShoppingCart");
            ntf.navigate();
          }
          break;
        case "logout":
          if(currentForm === "frmHome"){
            this.hideHumburger();
          }else{
            var ntf = new kony.mvc.Navigation("frmHome");
            ntf.navigate();
          }
          break;
      }


    },
    hideHumburger: function(){
      var currentForms = kony.application.getCurrentForm();
      function moveCallback(){}

      currentForms.flxMain.animate(
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
      currentForms.humburgerMenu.animate(
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
