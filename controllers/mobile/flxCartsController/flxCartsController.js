define({ 

  AS_Button_Delete: function(eventobject, context) {
    var currentForm = kony.application.getCurrentForm();
    var previousForm = kony.application.getPreviousForm();

    // Get the clicked row data
    var selectedRecord = currentForm.segCarts.data[context.rowIndex];

    var productName =currentForm.segCarts.selectedRowItems[0].lblProductNames;

    var orderNums =currentForm.segCarts.selectedRowItems[0].orderNum;


    var myArray = kony.store.getItem("cart");

    console.log("Abdi Data received: " + JSON.stringify(myArray, null, 2));
    alert("You clicked delete for: " + orderNums);

    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].orderNum === orderNums) {
        myArray.splice(i, 1); // Remove the item
        console.log("Item with orderNum " + orderNums + " deleted.");
        break; // Exit the loop after deleting
      }
    }
    var totalValue = 0; var totalRegularPrice = 0;
    var totalSalePrice = 0;
    var totalSaved = 0
    for(var j = 0; j < myArray.length; j++){
      totalValue = totalValue + myArray[j].salePrice;
      if(myArray[i].onSale === true){
        totalRegularPrice = totalRegularPrice + myArray[i].regularPrice;
        totalSalePrice = totalSalePrice + myArray[i].salePrice;
      }
    }
    var filteredRecords = myArray.map((record) => {
      return {
        lblProductNames: record.name,
        lblProductPrice:  {
          text: "$" + record.salePrice,
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
    currentForm.segCarts.setData(filteredRecords);
    currentForm.lblTotalPrice.text = "Total: $"+totalValue.toFixed(2);
    totalSaved = totalRegularPrice - totalSalePrice;
    if(totalSaved > 0 ){
      currentForm.lblSavedAmount.text = "You have items that are ON SALE !!! You Saved $" + totalSaved.toFixed(2) + " on this order.";
      currentForm.lblSavedAmount.setVisibility(true);
    }else{
     currentForm.lblSavedAmount.setVisibility(false);
    }
    kony.store.removeItem("cart");
    kony.store.setItem("cart", myArray);
  }

});