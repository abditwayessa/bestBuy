define({ 

  AS_Button_Delete: function(eventobject, context) {
    var currentForm = kony.application.getCurrentForm();

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
    
     var filteredRecords = myArray.map((record) => {
      return {
        lblProductNames: record.name,
        lblProductPrice: "$"+record.salePrice,
        sku: record.sku,
        imgRemoveProduct: "cartremoveitem.png",
        orderNum:record.orderNum
      }

    });
    
    console.log("Abdi Data deleted: " + JSON.stringify(myArray, null, 2));
    this.view.segCarts.setData(filteredRecords);
    kony.store.removeItem("cart");
    kony.store.setItem("cart", myArray);
  }

});