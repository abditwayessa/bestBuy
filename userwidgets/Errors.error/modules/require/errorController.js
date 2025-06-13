define(function () {
  return {
    retryFunction: function () {
      var currentForm = kony.application.getCurrentForm().id;

      switch(currentForm){
        case "frmHome":
          if(currentForm === "frmHome"){
            this.hideError();
          }else{
            kony.application.destroyForm("frmHome");
            var ntf = new kony.mvc.Navigation("frmHome");
            ntf.navigate();
            this.hideError();
          }
          break;
        case "store":   
          if(currentForm === "frmStoreLocator"){
            this.hideError();
          }else{
            var ntf = new kony.mvc.Navigation("frmStoreLocator");
            ntf.navigate();
          }
          break;
        case "cart":
          if(currentForm === "frmShoppingCart"){
            this.hideError();
          }else{
            var ntf = new kony.mvc.Navigation("frmShoppingCart");
            ntf.navigate();
            this.hideError();
          }
          break;
        case "logout":
          if(currentForm === "frmHome"){
            this.hideError();
          }else{
            var ntf = new kony.mvc.Navigation("frmHome");
            ntf.navigate();
          }
          break;
      }


    },
    hideError: function(){
      var currentForms = kony.application.getCurrentForm();
      function moveCallback(){}

      currentForms.error.animate(
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
          duration: 0.25,
        },
        {
          animationEnd: moveCallback,
        }
      );
    }

  }
});
