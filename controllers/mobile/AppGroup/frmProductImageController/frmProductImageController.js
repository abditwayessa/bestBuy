define({ 
  onInit: function(){
    this.view.lbxImageSize.onSelection = this.onSelected;
    this.view.toolbarMenu.btnBack.onClick = this.onBackClick;
    this.view.toolbarMenu.btnMenu.onClick = this.menuFunction;
  },
  onPreShow: function(){
    this.getProductImage();
  },
  getProductImage: function(){
    var self = this;
    var imageArray =  JSON.parse(JSON.stringify(kony.store.getItem("productImage")));
    var listBoxData = [];
    this.view.imgProduct.src = imageArray[0].href;
    for (var i = 0; i < imageArray.length; i++) {
      var rel = imageArray[i].rel;
      var displayName = rel.replace(/_/g, ' '); // Replace underscores with spaces
      listBoxData.push([rel, displayName]);
    }
    self.view.lbxImageSize.masterData = listBoxData;
    self.view.lbxImageSize.selectedKey = imageArray[0].rel;
  },
  onSelected: function(){
    var self = this;
    var imgSrc = "";
    var images = JSON.parse(JSON.stringify(kony.store.getItem("productImage")));
    var selectedKey = JSON.stringify(this.view.lbxImageSize.selectedKeys);
    for (var i = 0; i < images.length; i++) {
      if(images[i].rel.indexOf(JSON.parse(selectedKey)[0]) !== -1){
        imgSrc =  images[i].href; 
      }
    }
   
    this.view.imgProduct.src = imgSrc;
  },
  onBackClick: function(){
    var self
    var ntf = new kony.mvc.Navigation("frmProductDetail");
    ntf.navigate();
    kony.store.removeItem("productImage");
    kony.application.destroyForm("frmProductImage");
  },
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

});