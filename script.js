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


//https://www.w3schools.com/js/js_regexp.asp
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
/*
function searchurl(needleurl){
  var i = 0;
  var hayurl = document.getElementById("block" + i).innerHTML;
  while (hayurl){
    if (needleurl == ""){
      document.getElementById("block" + i).style.backgroundColor = "white";
      document.getElementById("block" + i).style.fontSize = "20px";
    }
    else if (hayurl.toLowerCase().includes(needleurl.toLowerCase())){
      document.getElementById("block" + i).style.backgroundColor = "violet";      
      document.getElementById("block" + i).style.fontSize = "25px";
    }
    else{
      document.getElementById("block" + i).style.backgroundColor = "white";             
      document.getElementById("block" + i).style.fontSize = "20px";
    }
    i++;
    hayurl = document.getElementById("block" + i).innerHTML;
  }
}
*/

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
      document.getElementById("block" + i).style.backgroundColor = "white";
      document.getElementById("block" + i).style.fontSize = "20px";
    }
    else if (hayurl.toLowerCase().includes(needleurl.toLowerCase())){
      document.getElementById("block" + i).style.display = "block";        
      document.getElementById("block" + i).style.backgroundColor = "violet";      
      document.getElementById("block" + i).style.fontSize = "25px";
    }
    else{
      if (toggleButton.value == "Matched Only")
        document.getElementById("block" + i).style.display = "block";        
      else
        document.getElementById("block" + i).style.display = "none";                
      document.getElementById("block" + i).style.backgroundColor = "white";             
      document.getElementById("block" + i).style.fontSize = "20px";
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