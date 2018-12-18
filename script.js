// using AJAX call to fetch URL's from specified json file 
function fetchurl(){
  // start the timer... 
  var performance = window.performance; // using performance interface to measure the precise time taken by this function
  var start = performance.now();  // how to measure time taken by a function to execute -- https://www.wikitechy.com/tutorials/javascript/how-to-measure-time-taken-by-a-function-to-execute
  //document.getElementById('fetchurl').disabled = true;
  document.getElementById("displayFetchedUrls").innerHTML = "";
  var option1 = document.getElementById('radio1');
  var requestJSON;
  if (option1.checked == true)
    requestJSON = "links.json";
  else
    //requestJSON = "test-file.json";
    requestJSON = "https://api-ssl.bitly.com/v3/user/link_history?access_token=1ef1315a2efebd7557de137f776602276d833cb9&limit=100";
  var xmlhttp = new XMLHttpRequest();                                        
  xmlhttp.onreadystatechange = function(){
    document.getElementById("requestStatus").innerHTML = "Request status code = " + this.status;
    if (this.readyState == 4 && this.status == 200){
      var result = JSON.parse(this.responseText); 
      //displayurl(result);
      displayFromAPI(result);
    }
  }
  xmlhttp.open("GET", requestJSON, true);
  xmlhttp.send();
  var end = performance.now();  // stop the timer and display the time taken to fetch the URLs
  document.getElementById('fetchTime').innerHTML = "Fetch time: ~" + Math.round(end - start) + "ms";  
}
function displayurl(url){
  var i;
  var fetchedurl;
  var urldiv;
  for (i = 0; i < url.length; i++){
    fetchedurl = url[i]  + "<br>";
    urldiv = document.createElement('div');
    urldiv.id="block" + i;
    urldiv.innerHTML = fetchedurl;
    document.getElementById("displayFetchedUrls").appendChild(urldiv)
    //document.getElementsByTagName('body')[0].appendChild(urldiv);
  }     
  document.getElementById("totalLinks").innerHTML = " " + i + " " + "<i>links</i>";
}


var needleToDisplayMatchedURLs = null;
var toggleButton = document.getElementById("toggleMatchedAll");

function searchurl(needleurl){
  needleToDisplayMatchedURLs = needleurl;
  var i = 0;
  var hayurl = document.getElementById("block" + i).innerHTML;
  while (hayurl){
    if (needleurl == ""){
      if (toggleButton.value == "Matched Only")
        document.getElementById("block" + i).style.display = "block";        
      else
        document.getElementById("block" + i).style.display = "none";                
      document.getElementById("block" + i).classList.remove("displayMatchedURLs");
    }
    else if (hayurl.toLowerCase().includes(needleurl.toLowerCase())){
      document.getElementById("block" + i).style.display = "block";        
      document.getElementById("block" + i).classList.add("displayMatchedURLs");
    }
    else{
      if (toggleButton.value == "Matched Only")
        document.getElementById("block" + i).style.display = "block";        
      else
        document.getElementById("block" + i).style.display = "none";                
      document.getElementById("block" + i).classList.remove("displayMatchedURLs");
    }
    i++;
    hayurl = document.getElementById("block" + i).innerHTML;
  }
}


function displayMatchedURLs(){
  if (toggleButton.value == "Matched Only")
    toggleButton.value = "Show All";
  else
    toggleButton.value = "Matched Only";
  searchurl(needleToDisplayMatchedURLs);
}



function displayFromAPI(url){
  var result = document.getElementById("displayFetchedUrls");
  var i = 0;
  var links = url["data"]["link_history"];
  for (; i < links.length; i++){
    if (links[i]["keyword_link"] !== undefined) {
      var displayURL = "<br>";
      var urldiv = document.createElement('div');
      urldiv.id="block" + i;
      displayURL += links[i]["keyword_link"] + "<br>";
      displayURL += links[i]["long_url"] + "<br>" + "<br>";
      urldiv.innerHTML = displayURL;
      //result.innerHTML = urldiv + "<br>" + "<br>" + i;
      result.appendChild(urldiv); // + "<br>" + "<br>" + i;
    }
  }
}
