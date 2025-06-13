define({ 
  onInit: function(){
    this.view.lbxImageSize.onSelection = this.onSelected;
    this.view.toolbarMenu.btnBack.onClick = this.onBackClick;
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
  }
});