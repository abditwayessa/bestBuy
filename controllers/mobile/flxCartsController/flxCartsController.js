define({ 

  AS_Button_Delete: function(eventobject, context) {
    var currentForm = kony.application.getCurrentForm();
    var previousForm = kony.application.getPreviousForm();

    // Get the clicked row data
    var selectedRecord = currentForm.segCarts.data[context.rowIndex];

    var productName =currentForm.segCarts.selectedRowItems[0].lblProductNames;

    var rowIndex = context.rowIndex;

    var myArray = kony.store.getItem("cart");

    console.log("Abdi Data received: " + JSON.stringify(myArray, null, 2));
    //     alert("You clicked delete for: " + orderNums);

    for (var i = 0; i < myArray.length; i++) {
      if (myArray.indexOf(myArray[i]) === rowIndex) {
        myArray.splice(i, 1);
        break; 
      }
    }

    var totalValue = 0; var totalRegularPrice = 0;
    var totalSalePrice = 0;
    var totalSaved = 0
    for(var j = 0; j < myArray.length; j++){
      totalValue = totalValue + myArray[j].salePrice;
      if(myArray[j].onSale){
        totalRegularPrice = totalRegularPrice + myArray[j].regularPrice;
        totalSalePrice = totalSalePrice + myArray[j].salePrice;
      }
    }
    var filteredRecords = myArray.map((record) => {
      return {
        lblProductNames: record.name,
        lblProductPrice:  {
          text: "$" + record.salePraice,
          skin: record.onSale ? "sknRed60Font" : "sknGray60Font"
        },
        sku: record.sku,
        imgRemoveProduct: "cartremoveitem.png",
        orderNum:record.orderNum
      }

    });
    if(myArray.length < 1){
      currentForm.lblNoProduct.setVisibility(true);
      currentForm.segCarts.setVisibility(false); 
      currentForm.lblTotalPrice.setVisibility(false);
    }else{
      currentForm.segCarts.setVisibility(true); 
      currentForm.lblTotalPrice.setVisibility(true);
      currentForm.lblNoProduct.setVisibility(false);     
    }
    console.log("Abdi Data deleted: " + JSON.stringify(myArray, null, 2));

    currentForm.lblTotalPrice.text = "Total: $"+totalValue.toFixed(2);
    totalSaved = totalRegularPrice - totalSalePrice;
    if(totalSaved > 0 ){
      currentForm.lblSavedAmount.text = "You have items that are ON SALE !!! You Saved $" + totalSaved.toFixed(2) + " on this order.";
      currentForm.lblSavedAmount.setVisibility(true);
    }else{
      currentForm.lblSavedAmount.setVisibility(false);
    }



    // Animate the row using animateRows
    currentForm.segCarts.animateRows({
      rows: [{ sectionIndex: 0, rowIndex: context.rowIndex }],
      animation: {
        definition: kony.ui.createAnimation({ "100": { "transform": kony.ui.makeAffineTransform().scale(0.1, 0) } }),
        config: { duration: 0.3, fillMode: kony.anim.FILL_MODE_FORWARDS }
      }
    });

    // ✅ Add a timer to delay row deletion after the animation (simulate callback)
    kony.timer.schedule("deleteRowTimer", function () {
      var segData = currentForm.segCarts.data;
      segData.splice(context.rowIndex, 1);
      currentForm.segCarts.setData(segData);
      kony.timer.cancel("deleteRowTimer"); // Clean up timer
    }, 0.35, false); // Timer delay (slightly longer than animation)
    kony.store.removeItem("cart");
    kony.store.setItem("cart", myArray);
  }
});