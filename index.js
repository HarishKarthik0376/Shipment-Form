$("#shipment-no").focus(); 

function validateAndGetFormData() { 
    var shipnovar = $("#shipment-no").val(); 
    if (shipnovar === "") { 
        alert("Shipment Number is a Required Value"); 
        $("#shipment-no").focus(); 
        return ""; 
    }

    var descvar = $("#description").val(); 
    if (descvar === "") { 
        alert("Description is a Required Value"); 
        $("#description").focus(); 
        return ""; 
    }

    var sourcevar = $("#source").val(); 
    if (sourcevar === "") { 
        alert("Source is a Required Value"); 
        $("#source").focus(); 
        return ""; 
    }

    var destinationvar = $("#destination").val(); 
    if (destinationvar === "") { 
        alert("Destination is a Required Value"); 
        $("#destination").focus(); 
        return ""; 
    }

    var shippingdatevar = $("#shipping-date").val(); 
    if (shippingdatevar === "") { 
        alert("Shipping-Date is a Required Value"); 
        $("#shipping-date").focus(); 
        return ""; 
    }

    var expecteddeliverydatevar = $("#expected-delivery-date").val(); 
    if (expecteddeliverydatevar === "") { 
        alert("Expected-Delivery-Date is a Required Value"); 
        $("#expected-delivery-date").focus(); 
        return ""; 
    }

    var jsonStrObj = { 
        shipmentno: shipnovar, 
        description: descvar, 
        source: sourcevar, 
        destination: destinationvar, 
        shippingdate: shippingdatevar, 
        expecteddate: expecteddeliverydatevar, 
    }; 

    return JSON.stringify(jsonStrObj); 
} 

function createPUTRequest(connToken, jsonObj, dbName, relName) { 
    var putRequest = "{\n" 
        + "\"token\" : \"" 
        + connToken 
        + "\",\n" 
        + "\"dbName\": \"" 
        + dbName 
        + "\",\n" 
        + "\"cmd\" : \"PUT\",\n" 
        + "\"rel\" : \"" 
        + relName + "\",\n" 
        + "\"jsonStr\": \n" 
        + jsonObj 
        + "\n" 
        + "}"; 
    return putRequest; 
} 

function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) { 
    var url = dbBaseUrl + apiEndPointUrl; 
    var jsonObj; 
    $.post(url, reqString, function (result) { 
        jsonObj = JSON.parse(result); 
    }).fail(function (result) { 
        var dataJsonObj = result.responseText; 
        jsonObj = JSON.parse(dataJsonObj); 
    }); 
    return jsonObj; 
} 
function saverecno(jsonObj)
{
    var lvdata = JSON.parse(jsonObj.data);
    console.log("Record Number:", lvdata.rec_no);
    localStorage.setItem('recno',lvdata.rec_no);
}

function getshipmentno()
{
    var shipmentno = $("#shipment-no").val();
    var jsonStr = {
        shipmentno:shipmentno
    };
    return JSON.stringify(jsonStr);
}
function filldata(jsonObj)
{
    saverecno(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#shipment-no").val(record.shipmentno);
    $("#description").val(record.description);
    $("#source").val(record.source);
    $("#destination").val(record.destination);
    $("#shipping-date").val(record.shippingdate);
    $("#expected-delivery-date").val(record.expecteddate);

}

function resetForm() { 
    $("#shipment-no").val(""); 
    $("#description").val(""); 
    $("#source").val(""); 
    $("#destination").val(""); 
    $("#shipping-date").val(""); 
    $("#expected-delivery-date").val(""); 
    $("#shipment-no").prop("disabled",false); 
    $("#submitbtn").prop("disabled",true); 
    $("#changebtn").prop("disabled",true); 
    $("#resetbtn").prop("disabled",true); 
    $("#shipment-no").focus(); 
} 


function saveEnrollment() { 
    var jsonStr = validateAndGetFormData(); 
    if (jsonStr === "") { 
        return; 
    } 
    var putReqStr = createPUTRequest("90932111|-31949221610822511|90962071", 
        jsonStr, "SHIPMENT-DB", "SHIPMENT-TABLE"); 
    alert(putReqStr); 
    jQuery.ajaxSetup({async: false}); 
    var resultObj = executeCommand(putReqStr, 
        "http://api.login2explore.com:5577", "/api/iml"); 
    alert(JSON.stringify(resultObj)); 
    jQuery.ajaxSetup({async: true}); 
    resetForm(); 
}

function getshipment(){
    var shipnoObj=getshipmentno();
    var getRequest=createGET_BY_KEYRequest("90932111|-31949221610822511|90962071", "SHIPMENT-DB", "SHIPMENT-TABLE",shipnoObj);
    jQuery.ajaxSetup({async:false});
    var resultObj = executeCommand(getRequest, "http://api.login2explore.com:5577", "/api/irl"); 
    jQuery.ajaxSetup({async: true}); 
    if(resultObj.status === 400){
        $("#submitbtn").prop("disabled",false); 
        $("#resetbtn").prop("disabled",false); 
        $("#description").focus(); 
    }else if (resultObj.status === 200){
        $("#shipment-no").prop("disabled",true); 
        filldata(resultObj);
        $("#changebtn").prop("disabled",false); 
        $("#resetbtn").prop("disabled",false); 
        $("#description").focus(); 
    }
}
function changedata()
{
    $("#changebtn").prop("disabled",true);
    jsonchg = validateAndGetFormData();
    var updatereq = createUPDATERecordRequest("90932111|-31949221610822511|90962071",jsonchg,"SHIPMENT-DB","SHIPMENT-TABLE",localStorage.getItem('recno'));
    jQuery.ajaxSetup({async:false});
    var resjsonobj = executeCommand(updatereq,"http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({async:true});
    console.log(resjsonobj);
    resetForm();
    $("#shipment-no").focus();
}