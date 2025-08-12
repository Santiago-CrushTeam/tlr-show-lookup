var productSearchResults,searchCustomers,searchCounter,searchResults,funcMonth,funcDate,funcYear,product,search,storeId="73175160",key="secret_N8VmHUJgBESRMA2ihnJUawPVkLRjdgM1",checked=0;const months=["January","February","March","April","May","June","July","August","September","October","November","December"],d=new Date;let todayMonth=months[d.getMonth()];function showSearch(t,e,s,a){$('[show="heading"]').text("Searching..."),$('[party="heading"]').text("Searching...");var i=[],o=(e+"/"+s+"/"+a).toUpperCase();for(let r=0;r<t.items.length;r++){var c,l=t.items[r].sku.replace(/\s/g,""),h=l.split(",")[0].replace(/\D/g,"");o===(l.split(",")[0].replace(/[0-9]/g,"").toUpperCase()+"/"+h+"/"+l.split("-")[0].split(",")[1]).toUpperCase()&&i.push(t.items[r])}var p=[];if($('[show="list"]').empty(),$('[party="list"]').empty(),0===i.length)$('[show="heading"]').text("No Shows On "+e+" "+s+", "+a),$('[party="heading"]').text("Make New Search");else if(i.length>0){for(let u=0;u<i.length;u++){searchOrders(i[u].id);let v={name:i[u].name,id:i[u].id,month:i[u].sku.replace(/\s/g,"").split(",")[0].replace(/[0-9]/g,"").toUpperCase(),day:i[u].sku.replace(/\s/g,"").split(",")[0].replace(/\D/g,""),year:i[u].sku.replace(/\s/g,"").split("-")[0].split(",")[1],time:i[u].sku.replace(/\s/g,"").split("-")[1].toUpperCase(),remaining:i[u].quantity,purchased:searchCounter,customers:searchCustomers,status:i[u].enabled};p.push(v)}for(let y=0;y<p.length;y++){var m,g="error",f="error";!1===p[y].status?(g="Hidden",f="Enable Show In Shop",m=0):!0===p[y].status&&(g="Visible",f="Hide Show From Shop",m=1);var w=`
            <div id="show-div" ct="${y}" class="show-div">
                <h2 show="title" class="show-heading">${p[y].name}</h2>
                <div class="show-time-div">
                    <div class="date-container">
                        <div show="month" class="show-date">${p[y].month}</div>
                        <div show="day" class="show-date">${p[y].day}</div>
                        <div class="show-date">,</div>
                        <div show="year" class="show-date">${p[y].year}</div>
                    </div>
                    <div class="show-time">${p[y].time}</div>
                </div>
                <div class="show-time-info-div"></div>
                <div class="info-wrapper">
                    <div class="info-div">
                        <div class="info-container">
                            <div class="info-text">Tickets Available: </div>
                            <div show="available" class="info-text">${p[y].remaining}</div>
                        </div>
                        <div class="info-container">
                            <div class="info-text">Tickets Purchased:</div>
                            <div show="purchased" class="info-text">${p[y].purchased}</div>
                        </div>
                        <div class="info-container">
                            <div class="info-text">Initial Total:</div>
                            <div show="first-stock" class="info-text">${parseInt(p[y].purchased)+parseInt(p[y].remaining)}</div>
                        </div>
                    </div>
                    <div class="btn-div">
                        <div class="info-container">
                            <div class="info-text"># of Parties:</div>
                            <div show="parties" class="info-text">${p[y].customers.length}</div>
                        </div>
                        <a show="button" ct="${y}" href="#" class="show-btn w-button">View Parties</a>
                    </div>
                </div>
                <div class="status-div">
                    <div class="status-text">SHOW&nbsp;STATUS:</div>
                    <div show="status" status="${m}" oid="${p[y].id}" class="status-text">${g}</div>
                </div>
                <a show="statusBtn" status="${m}" oid="${p[y].id}" href="#" class="status-btn w-button">${f}</a>
            </div>
            `;$('[show="list"]').append(w)}searchResults=p,$('[show="heading"]').text("Shows On "+e+" "+s+", "+a),$('[party="heading"]').text("Select A Show")}else console.log("Unknown Error")}function searchProducts(t){var e={async:!1,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/products?keyword="+t+"&enabled=true",method:"GET",headers:{Accept:"application/json",Authorization:"Bearer "+key}};$.ajax(e).done(function(t){productSearchResults=t});var s=0;if(productSearchResults.total>100){var e={async:!1,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/products?keyword="+t+"&enabled=true&offset="+(s+=100),method:"GET",headers:{Accept:"application/json",Authorization:"Bearer "+key}};$.ajax(e).done(function(t){productSearchResults.items.push(...t.items)})}if(productSearchResults.total>200){var e={async:!1,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/products?keyword="+t+"&enabled=true&offset="+(s+=100),method:"GET",headers:{Accept:"application/json",Authorization:"Bearer "+key}};$.ajax(e).done(function(t){productSearchResults.items.push(...t.items)})}}function searchOrders(t){$.ajax({async:!1,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/orders?productId="+t,method:"GET",headers:{Accept:"application/json",Authorization:"Bearer "+key}}).done(function(e){var s=0,a=[];for(let i=0;i<e.items.length;i++){let o={party:n=void 0!==e.items[i].shippingPerson?e.items[i].shippingPerson.name:"No Name",orderNum:e.items[i].id};for(let r=0;r<e.items[i].items.length;r++)if(parseInt(e.items[i].items[r].productId)==parseInt(t)){if(o.tickets=e.items[i].items[r].quantity,s+=parseInt(e.items[i].items[r].quantity),void 0===e.items[i].privateAdminNotes)o.quant="0";else{var c=e.items[i].privateAdminNotes.split("&");o.quant=c[r]}}a.push(o)}searchCustomers=a,searchCounter=s})}function hideProduct(t){$.ajax({async:!0,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/products/"+t,method:"PUT",data:"{enabled: false}",headers:{Accept:"application/json",Authorization:"Bearer "+key,"Content-Type":"application/json"}}).done(function(t){console.log(t)})}function showProduct(t){$.ajax({async:!0,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/products/"+t,method:"PUT",data:"{enabled: true}",headers:{Accept:"application/json",Authorization:"Bearer "+key,"Content-Type":"application/json"}}).done(function(t){console.log(t)})}$("body").on("click",'[party="order"]',function(t){t.preventDefault();$("#orderNum").val($(this).text()),searchTicketOrders()}),$("#select-month").change(function(){if(["January","March","May","July","August","October","December"].includes($("#select-month").val())){$("#select-day").empty(),$("#custom-search").removeClass("grey");for(let t=0;t<31;t++){var e=`<option value="${t+1}">${t+1}</option>`;$("#select-day").append(e)}}else if(["April","June","September","November"].includes($("#select-month").val())){$("#select-day").empty(),$("#custom-search").removeClass("grey");for(let s=0;s<30;s++){var e=`<option value="${s+1}">${s+1}</option>`;$("#select-day").append(e)}}else if(["February"].includes($("#select-month").val())){$("#select-day").empty(),$("#custom-search").removeClass("grey");for(let a=0;a<29;a++){var e=`<option value="${a+1}">${a+1}</option>`;$("#select-day").append(e)}}else{$("#custom-search").addClass("grey"),$("#select-day").empty();var e=`
        <option value="Select Day">Select Day</option>
        `;$("#select-day").append(e)}}),$("#custom-search").click(function(){if("Select Day"===$("#select-day").val())console.log("No proper date");else{var t=$("#select-month").val().toUpperCase(),e=$("#select-day").val().toString();$("#select-month").val(""),$("#select-month").trigger("change"),$('[show="list"]').empty(),$('[party="list"]').empty(),$('[show="heading"]').text("Searching..."),$('[party="heading"]').text("Searching..."),setTimeout(function(){searchProducts(t),showSearch(productSearchResults,t,e,d.getFullYear().toString())},100)}}),$(function(){console.log("running onload function"),console.log(todayMonth.toUpperCase()),console.log(d.getDate().toString()),console.log(d.getFullYear().toString()),$('[show="list"]').empty(),$('[party="list"]').empty(),$('[show="heading"]').text("Searching..."),$('[party="heading"]').text(""),setTimeout(function(){searchProducts(todayMonth),showSearch(productSearchResults,todayMonth.toUpperCase(),d.getDate().toString(),d.getFullYear().toString())},200)}),$("body").on("click",'[show="statusBtn"]',function(t){0==parseInt($(this).attr("status"))?(showProduct($(this).attr("oid")),$(this).text("Hide Show From Shop"),$('[show="status"][oid="'+$(this).attr("oid")+'"]').text("Visible"),$(this).attr("status","1")):1==parseInt($(this).attr("status"))&&(hideProduct($(this).attr("oid")),$(this).text("Enable Show In Shop"),$('[show="status"][oid="'+$(this).attr("oid")+'"]').text("Hidden"),$(this).attr("status","0"))}),$("body").on("click",'[show="button"]',function(t){$('[party="list"]').empty();var e=$(this).attr("ct"),s=searchResults[e].customers;s.sort(function(t,e){return e.tickets-t.tickets});var a=[],i=[];for(let o=0;o<s.length;o++)parseInt(s[o].quant)==s[o].tickets?a.push(s[o]):i.push(s[o]);for(let r=0;r<i.length;r++){var c=`
        <div id="party-div" class="party-div w-node-_8d0f08c4-d1dd-5322-5862-e203fbf256bc-ee1bbea5">
            <div class="party-heading-container">
                <h2 class="party-heading">Party:&nbsp;</h2>
                <h2 party="name" class="party-heading">${i[r].party}</h2>
            </div>
            <div class="party-info">
                <div party="quant" class="party-size">${i[r].tickets}</div>
                <div class="party-order-div">
                    <div class="num-text">Order #:&nbsp;</div>
                    <a party="order" class="party-order order-button" href="#" role="button" tabindex="0" aria-label="Open order \${i[r].orderNum}">\${i[r].orderNum}</a>
                </div>
            </div>
        </div>
        `;$('[party="list"]').append(c)}for(let l=0;l<a.length;l++){var c=`
        <div id="party-div" class="party-div checked w-node-_8d0f08c4-d1dd-5322-5862-e203fbf256bc-ee1bbea5">
            <div class="party-heading-container">
                <h2 class="party-heading">Party:&nbsp;</h2>
                <h2 party="name" class="party-heading">${a[l].party}</h2>
            </div>
            <div class="party-info">
                <div party="quant" class="party-size">${a[l].tickets}</div>
                <div class="party-order-div">
                    <div class="num-text">Order #:&nbsp;</div>
                    <a party="order" class="party-order order-button" href="#" role="button" tabindex="0" aria-label="Open order \${a[l].orderNum}">\${a[l].orderNum}</a>
                </div>
            </div>
        </div>
        `;$('[party="list"]').append(c)}$('[party="heading"]').text(searchResults[e].name+" Parties")});
