var offset = 0;
var id = 0;
var loader = document.getElementById('loader');

function getButtonChoice(){  //function that gets the input choice and returns the corresponding JSON file
  var requestJSON;
  var option1 = document.getElementById('radio1');
  var option2 = document.getElementById('radio2');
  var option3 = document.getElementById('radio3');
  if (option1.checked == true)
    return requestJSON = "links.json";
  else if (option2.checked == true)
    return requestJSON = "test-file.json";
  else if (option3.checked == true)
    return requestJSON = "https://api.myjson.com/bins/skw8e";
  else
    return requestJSON = "https://api-ssl.bitly.com/v3/user/link_history?access_token=1ef1315a2efebd7557de137f776602276d833cb9&limit=100&offset=" + offset;
}


function checkToggleButton(i){     // checks whether the button's toggled as 'Matched Only' or 'Show All'
  if (toggleButton.value == "Matched Only")
    document.getElementById("block" + i).style.display = "block";        
  else
    document.getElementById("block" + i).style.display = "none";  
  document.getElementById("block" + i).classList.remove("displayMatchedURLs");  
}


// using AJAX call to fetch URL's from specified json file 
function fetchurl(){               // fetches URLs from the specified JSON file
  id = 0;
  totalLinksFetched(id);  
  loader.classList.add('loader');  // initiate the 'loader' and starts fetching URLs.
  // start the timer... 
  var performance = window.performance; // using performance object to measure the precise time taken by this function
  var start = performance.now();  // how to measure time taken by a function to execute -- https://www.wikitechy.com/tutorials/javascript/how-to-measure-time-taken-by-a-function-to-execute
  document.getElementById("displayFetchedUrls").innerHTML = "";
  var requestJSON = getButtonChoice();
  var useAPI = 0;
  if (requestJSON.includes("api"))
    useAPI = 1;
  var xmlhttp = new XMLHttpRequest();                                        
  xmlhttp.onreadystatechange = function(){
    document.getElementById("requestStatus").innerHTML = "Request status code = " + this.status;
    if (this.readyState == 4 && this.status == 200){
      var result = JSON.parse(this.responseText); 
      if (useAPI)
        displayFromAPI(result);
      else
        displayurl(result);
      loader.classList.remove('loader');      // removes the 'loader' after fetching URLs.
    }
  }
  xmlhttp.open("GET", requestJSON, true);
  xmlhttp.send();
  var end = performance.now();  // stop the timer and display the time taken to fetch the URLs
  document.getElementById('fetchTime').innerHTML = "Fetch time: ~" + Math.round(end - start) + "ms";  
}


function displayurl(url){   // displays URLs from 'links.json' and 'test-file.json'
  var i;
  var fetchedurl;
  var urldiv;
  for (i = 0; i < url.length; i++){
    fetchedurl = url[i]  + "<br>";
    urldiv = document.createElement('div');
    urldiv.id="block" + i;
    urldiv.innerHTML = fetchedurl + "<hr>";
    document.getElementById("displayFetchedUrls").appendChild(urldiv)
    //document.getElementsByTagName('body')[0].appendChild(urldiv);
  }     
  totalLinksFetched(i);
}


var needleToDisplayMatchedURLs = null;
var toggleButton = document.getElementById("toggleMatchedAll");

var matchCount;
function searchurl(needleurl){    // searches whether the given needle URl matches with the hay URLs and displays matched ones
  matchCount = 0;
  needleToDisplayMatchedURLs = needleurl;
  var i = 0;
  var checkURLMatch;
  var hayurl = document.getElementById("block" + i).innerHTML;
  while (hayurl){
    checkURLMatch = hayurl.toLowerCase().includes(needleurl.toLowerCase()); // checks whether the 'needle' matches with the 'hay' and stores the 'boolean value' into the variable.
    if (needleurl == "" || !checkURLMatch){  // if the URL is 'not' 'found' or if the 'needle' is 'empty', check the button's value ( toggled as 'Matched Only' or 'Show All' ) and display the unmatched URLs according to it.
      checkToggleButton(i);
    }
    else if (checkURLMatch){                // by default, the matched URLs are always displayed irrespective of the button value ( toggled as 'Matched Only' or 'Show All' ).
      document.getElementById("block" + i).style.display = "block";        
      document.getElementById("block" + i).classList.add("displayMatchedURLs");
      matchCount++;
    }
    i++;
    try {
      hayurl = document.getElementById("block" + i).innerHTML;
    }
    catch(e) {
      console.log(e.description);
      break;
    }
  }
  setTimeout(matchURLCount, 500);
}


function toggleURLDisplayButton(){   // toggles between 'Matched Only' and 'Show ALL'
  if (toggleButton.value == "Matched Only")
    toggleButton.value = "Show All";
  else
    toggleButton.value = "Matched Only";
  searchurl(needleToDisplayMatchedURLs);
}


function displayFromAPI(url){   // function that decides whether to fetch URLs from either 'Myjson-API' or 'Bitly-API'
  displayAPIurl(url);
  if (document.getElementById('radio4').checked == true){
    fetchNextURL(offset);
  }
  else
    totalLinksFetched(id);  
}


function displayAPIurl(url){   // fetches URls from either 'Myjson-API' or 'Bitly-API'
  var result = document.getElementById("displayFetchedUrls");
  var i = 0;
  var links = url["data"]["link_history"];
  var linksLength = links.length;
  if (links[0] !== undefined){
    for (; i < linksLength; i++){
        var displayURL = "<hr>";
        var urldiv = document.createElement('div');
        urldiv.id="block" + id;
        id++;
        if (links[i]["keyword_link"] !== undefined)
          displayURL += links[i]["keyword_link"] + "<br>";
        displayURL += links[i]["long_url"] + "<br>" + "<br>";
        urldiv.innerHTML = displayURL;
        result.appendChild(urldiv); 
    }
  }
}


//https://javascript.info/recursion
function fetchNextURL(offset){   // a recursive function that fetches next 100 links from 'Bitly-API'. By default, it fetches 1000 links.
  loader.classList.add('loader');
  totalLinksFetched(id);
  offset += 100;
  var requestJSON = "https://api-ssl.bitly.com/v3/user/link_history?access_token=1ef1315a2efebd7557de137f776602276d833cb9&limit=100&offset=" + offset;
  var xmlhttp = new XMLHttpRequest();                                        
  xmlhttp.onreadystatechange = function(){
    document.getElementById("requestStatus").innerHTML = "Request status code = " + this.status;
    if (this.readyState == 4 && this.status == 200){
      var url = JSON.parse(this.responseText); 
      displayAPIurl(url);
      if (offset != 9900)
        fetchNextURL(offset);
      else {
        totalLinksFetched(id);  
        loader.classList.remove('loader');      
      }
    }
  }
  xmlhttp.open("GET", requestJSON, true);
  xmlhttp.send();  
}


function totalLinksFetched(n){   //  displays total number of links fetched from the JSON file
  document.getElementById("totalLinks").innerHTML = " " + n + " " + "<i>links</i>";
}


function matchURLCount() {
  // Get the snackbar DIV
  var snackbar = document.getElementById("matchurlcountsnackbar");
  snackbar.innerHTML = matchCount + " Matches Found!!!";
  // Add the "show" class to DIV
  snackbar.className = "show";
  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ snackbar.className = ""; }, 3000);
}

// function to scroll to the top of the page. -- https://html-online.com/articles/dynamic-scroll-back-top-page-button-javascript/
$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#back2Top').fadeIn();
    } else {
        $('#back2Top').fadeOut();
    }
});
$(document).ready(function() {
    $("#back2Top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });
});

