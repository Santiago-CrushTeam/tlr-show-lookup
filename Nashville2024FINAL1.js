var productSearchResults,searchCustomers,searchCounter,searchResults,funcMonth,funcDate,funcYear,product,search,
    storeId="73175160",
    key="secret_N8VmHUJgBESRMA2ihnJUawPVkLRjdgM1",
    checked=0;

const months=["January","February","March","April","May","June","July","August","September","October","November","December"],
      d=new Date;
let todayMonth=months[d.getMonth()];

function showSearch(res, month, day, year){
  $('[show="heading"]').text("Searching...");
  $('[party="heading"]').text("Searching...");

  var smd = (month + "/" + day + "/" + year).toUpperCase();
  var results = [];

  for(let i=0;i<res.items.length;i++){
    var sku = res.items[i].sku.replace(/\s/g,"");
    var dd  = sku.split(",")[0].replace(/\D/g,"");
    var lhs = (sku.split(",")[0].replace(/[0-9]/g,"").toUpperCase()+"/"+dd+"/"+sku.split("-")[0].split(",")[1]).toUpperCase();
    if(smd===lhs){ results.push(res.items[i]); }
  }

  var shows = [];
  $('[show="list"]').empty();
  $('[party="list"]').empty();

  if(results.length===0){
    $('[show="heading"]').text("No Shows On "+month+" "+day+", "+year);
    $('[party="heading"]').text("Make New Search");
  } else {
    for(let i=0;i<results.length;i++){
      searchOrders(results[i].id);
      let obj = {
        name: results[i].name,
        id: results[i].id,
        month: results[i].sku.replace(/\s/g,"").split(",")[0].replace(/[0-9]/g,"").toUpperCase(),
        day: results[i].sku.replace(/\s/g,"").split(",")[0].replace(/\D/g,""),
        year: results[i].sku.replace(/\s/g,"").split("-")[0].split(",")[1],
        time: results[i].sku.replace(/\s/g,"").split("-")[1].toUpperCase(),
        remaining: results[i].quantity,
        purchased: searchCounter,
        customers: searchCustomers,
        status: results[i].enabled
      };
      shows.push(obj);
    }

    for(let i=0;i<shows.length;i++){
      var statusText="error", btnText="error", statusVal;
      if(shows[i].status===false){ statusText="Hidden"; btnText="Enable Show In Shop"; statusVal=0; }
      if(shows[i].status===true){  statusText="Visible"; btnText="Hide Show From Shop"; statusVal=1; }

      var card = `
        <div id="show-div" ct="${i}" class="show-div">
          <h2 show="title" class="show-heading">${shows[i].name}</h2>
          <div class="show-time-div">
            <div class="date-container">
              <div show="month" class="show-date">${shows[i].month}</div>
              <div show="day" class="show-date">${shows[i].day}</div>
              <div class="show-date">,</div>
              <div show="year" class="show-date">${shows[i].year}</div>
            </div>
            <div class="show-time">${shows[i].time}</div>
          </div>
          <div class="show-time-info-div"></div>
          <div class="info-wrapper">
            <div class="info-div">
              <div class="info-container">
                <div class="info-text">Tickets Available: </div>
                <div show="available" class="info-text">${shows[i].remaining}</div>
              </div>
              <div class="info-container">
                <div class="info-text">Tickets Purchased:</div>
                <div show="purchased" class="info-text">${shows[i].purchased}</div>
              </div>
              <div class="info-container">
                <div class="info-text">Initial Total:</div>
                <div show="first-stock" class="info-text">${parseInt(shows[i].purchased)+parseInt(shows[i].remaining)}</div>
              </div>
            </div>
            <div class="btn-div">
              <div class="info-container">
                <div class="info-text"># of Parties:</div>
                <div show="parties" class="info-text">${shows[i].customers.length}</div>
              </div>
              <a show="button" ct="${i}" href="#" class="show-btn w-button">View Parties</a>
            </div>
          </div>
          <div class="status-div">
            <div class="status-text">SHOW&nbsp;STATUS:</div>
            <div show="status" status="${statusVal}" oid="${shows[i].id}" class="status-text">${statusText}</div>
          </div>
          <a show="statusBtn" status="${statusVal}" oid="${shows[i].id}" href="#" class="status-btn w-button">${btnText}</a>
        </div>
      `;
      $('[show="list"]').append(card);
    }

    searchResults = shows;
    $('[show="heading"]').text("Shows On "+month+" "+day+", "+year);
    $('[party="heading"]').text("Select A Show");
  }
}

function searchProducts(keyword){
  var settings = {
    async: !1,
    crossDomain: !0,
    url: "https://app.ecwid.com/api/v3/"+storeId+"/products?keyword="+keyword+"&enabled=true",
    method: "GET",
    headers: { Accept: "application/json", Authorization: "Bearer "+key }
  };
  $.ajax(settings).done(function (response) { productSearchResults = response; });

  var offset=0;
  if(productSearchResults.total>100){
    var s2 = {
      async: !1, crossDomain: !0,
      url: "https://app.ecwid.com/api/v3/"+storeId+"/products?keyword="+keyword+"&enabled=true&offset="+(offset+=100),
      method:"GET",
      headers:{Accept:"application/json",Authorization:"Bearer "+key}
    };
    $.ajax(s2).done(function(r){ productSearchResults.items.push(...r.items); });
  }
  if(productSearchResults.total>200){
    var s3 = {
      async: !1, crossDomain: !0,
      url: "https://app.ecwid.com/api/v3/"+storeId+"/products?keyword="+keyword+"&enabled=true&offset="+(offset+=100),
      method:"GET",
      headers:{Accept:"application/json",Authorization:"Bearer "+key}
    };
    $.ajax(s3).done(function(r){ productSearchResults.items.push(...r.items); });
  }
}

function searchOrders(productId){
  $.ajax({
    async: !1, crossDomain: !0,
    url: "https://app.ecwid.com/api/v3/"+storeId+"/orders?productId="+productId,
    method: "GET",
    headers: { Accept: "application/json", Authorization: "Bearer "+key }
  }).done(function (res) {
    var total = 0, customers = [];
    for (let i=0;i<res.items.length;i++){
      let obj = {
        party: (typeof res.items[i].shippingPerson !== "undefined") ? res.items[i].shippingPerson.name : "No Name",
        orderNum: res.items[i].id
      };
      for (let j=0;j<res.items[i].items.length;j++){
        if (parseInt(res.items[i].items[j].productId) == parseInt(productId)){
          obj.tickets = res.items[i].items[j].quantity;
          total += parseInt(res.items[i].items[j].quantity);
          if (typeof res.items[i].privateAdminNotes === "undefined"){
            obj.quant = "0";
          } else {
            var arr = res.items[i].privateAdminNotes.split("&");
            obj.quant = arr[j];
          }
        }
      }
      customers.push(obj);
    }
    searchCustomers = customers;
    searchCounter   = total;
  });
}

function hideProduct(id){
  $.ajax({
    async: !0, crossDomain: !0,
    url: "https://app.ecwid.com/api/v3/"+storeId+"/products/"+id,
    method: "PUT",
    data: "{enabled: false}",
    headers: { Accept:"application/json", Authorization:"Bearer "+key, "Content-Type":"application/json" }
  }).done(function(res){ console.log(res); });
}

function showProduct(id){
  $.ajax({
    async: !0, crossDomain: !0,
    url: "https://app.ecwid.com/api/v3/"+storeId+"/products/"+id,
    method: "PUT",
    data: "{enabled: true}",
    headers: { Accept:"application/json", Authorization:"Bearer "+key, "Content-Type":"application/json" }
  }).done(function(res){ console.log(res); });
}

/* Order ID click → fill input + run search (works for div or anchor) */
$("body").on("click",'[party="order"]',function(e){
  e.preventDefault();
  $("#orderNum").val($(this).text());
  searchTicketOrders();
});

/* Month -> Day options */
$("#select-month").change(function(){
  const m = $("#select-month").val();
  $("#select-day").empty();
  if(["January","March","May","July","August","October","December"].includes(m)){
    $("#custom-search").removeClass("grey");
    for(let i=0;i<31;i++){ $("#select-day").append(`<option value="${i+1}">${i+1}</option>`); }
  } else if(["April","June","September","November"].includes(m)){
    $("#custom-search").removeClass("grey");
    for(let i=0;i<30;i++){ $("#select-day").append(`<option value="${i+1}">${i+1}</option>`); }
  } else if(["February"].includes(m)){
    $("#custom-search").removeClass("grey");
    for(let i=0;i<29;i++){ $("#select-day").append(`<option value="${i+1}">${i+1}</option>`); }
  } else {
    $("#custom-search").addClass("grey");
    $("#select-day").append(`<option value="Select Day">Select Day</option>`);
  }
});

/* Run search */
$("#custom-search").click(function(){
  if($("#select-day").val()==="Select Day"){ console.log("No proper date"); return; }
  var m = $("#select-month").val().toUpperCase();
  var dStr = $("#select-day").val().toString();
  $("#select-month").val("").trigger("change");
  $('[show="list"]').empty();
  $('[party="list"]').empty();
  $('[show="heading"]').text("Searching...");
  $('[party="heading"]').text("Searching...");
  setTimeout(function(){
    searchProducts(m);
    showSearch(productSearchResults, m, dStr, d.getFullYear().toString());
  }, 100);
});

/* Autoload today */
$(function(){
  console.log("running onload function");
  $('[show="list"]').empty();
  $('[party="list"]').empty();
  $('[show="heading"]').text("Searching...");
  $('[party="heading"]').text("");
  setTimeout(function(){
    searchProducts(todayMonth);
    showSearch(productSearchResults, todayMonth.toUpperCase(), d.getDate().toString(), d.getFullYear().toString());
  }, 200);
});

/* Toggle visibility */
$("body").on("click",'[show="statusBtn"]',function(e){
  var status = parseInt($(this).attr("status"));
  var pid    = $(this).attr("oid");
  if(status===0){
    showProduct(pid);
    $(this).text("Hide Show From Shop").attr("status","1");
    $('[show="status"][oid="'+pid+'"]').text("Visible");
  } else {
    hideProduct(pid);
    $(this).text("Enable Show In Shop").attr("status","0");
    $('[show="status"][oid="'+pid+'"]').text("Hidden");
  }
});

/* View Parties (renders Order # as clickable buttons) */
$("body").on("click",'[show="button"]',function(e){
  $('[party="list"]').empty();
  var idx = $(this).attr("ct");
  var arr = searchResults[idx].customers;
  arr.sort(function(a,b){ return b.tickets - a.tickets; });

  var finished=[], pending=[];
  for(let i=0;i<arr.length;i++){
    (parseInt(arr[i].quant)===arr[i].tickets ? finished : pending).push(arr[i]);
  }

  /* pending first */
  for(let i=0;i<pending.length;i++){
    var html = `
      <div id="party-div" class="party-div w-node-_8d0f08c4-d1dd-5322-5862-e203fbf256bc-ee1bbea5">
        <div class="party-heading-container">
          <h2 class="party-heading">Party:&nbsp;</h2>
          <h2 party="name" class="party-heading">${pending[i].party}</h2>
        </div>
        <div class="party-info">
          <div party="quant" class="party-size">${pending[i].tickets}</div>
          <div class="party-order-div">
            <div class="num-text">Order #:&nbsp;</div>
            <a party="order" class="party-order order-button" href="#" role="button" tabindex="0" aria-label="Open order ${pending[i].orderNum}">${pending[i].orderNum}</a>
          </div>
        </div>
      </div>`;
    $('[party="list"]').append(html);
  }

  /* finished */
  for(let i=0;i<finished.length;i++){
    var html2 = `
      <div id="party-div" class="party-div checked w-node-_8d0f08c4-d1dd-5322-5862-e203fbf256bc-ee1bbea5">
        <div class="party-heading-container">
          <h2 class="party-heading">Party:&nbsp;</h2>
          <h2 party="name" class="party-heading">${finished[i].party}</h2>
        </div>
        <div class="party-info">
          <div party="quant" class="party-size">${finished[i].tickets}</div>
          <div class="party-order-div">
            <div class="num-text">Order #:&nbsp;</div>
            <a party="order" class="party-order order-button" href="#" role="button" tabindex="0" aria-label="Open order ${finished[i].orderNum}">${finished[i].orderNum}</a>
          </div>
        </div>
      </div>`;
    $('[party="list"]').append(html2);
  }

  $('[party="heading"]').text(searchResults[idx].name+" Parties");
});
