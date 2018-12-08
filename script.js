// using AJAX call to fetch URL's from specified json file 

function fetchurl(){
  //document.getElementById('fetchurl').disabled = true;
  document.getElementById("displayFetchedUrls").innerHTML = "";
  var option1 = document.getElementById('radio1');
  var requestJSON;
  if (option1.checked == true)
    requestJSON = "links.json";
  else
    requestJSON = "test-file.json";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    document.getElementById("requestStatus").innerHTML = "Request status code = " + this.status;
    if (this.readyState == 4 && this.status == 200){
      var result = JSON.parse(this.responseText); 
      displayurl(result);
    }
  }
  xmlhttp.open("GET", requestJSON, true);
  xmlhttp.send();
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