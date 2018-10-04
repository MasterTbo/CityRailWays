window.onload = function(){

    show('loginForm');
    try {
        getTrip(getToken());
        show('trip-form');
        
        loadMap();
    } catch (error) {
        console.log(error);
    }
    
    loadButtonEvents();    
}

function loadButtonEvents(){
    var sub = this.document.getElementById('submit');
    sub.addEventListener('click', function(event){
        event.preventDefault();         
        var id = getClientId();
        var sc = getClientSecret();
        login(id, sc);               
    });

    var logoutButton = document.getElementById('submit-logout')
    logoutButton.addEventListener('click', function(event){
        event.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('storageDate');
        show('loginForm');
        //console.log("you loged out");
    });

    var line = this.document.getElementById('submitAgency');
    line.addEventListener('click', function(event){
        event.preventDefault();
        var agencies = document.getElementById('agenciesSelect');
        var selectedAgency = agencies.options[agencies.selectedIndex].value;
        
        getLines(getToken(), selectedAgency);
        show('lines-form');
    })

    var back = document.getElementById('backToAgency');
    back.addEventListener('click', function(event){
        event.preventDefault();
        //show('agencies-form');
        show('trip-form');
    });

    var submitAgency = document.getElementById('submitLines');
    submitAgency.addEventListener('click', function(event){
        event.preventDefault();
    });

    var tripButton = document.getElementById('tripSubmit');
    tripButton.addEventListener('click', function(event){
        event.preventDefault();
        var start = document.getElementById('start').value;
        var destination = document.getElementById('destination').value;
        //alert(start + ", " + destination);
        getTrip(getToken());
    });

}

function loadMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoidGJvLTAiLCJhIjoiY2ptdDhsZXY1MmM3NTNrbnhiOGJ1bHZoaCJ9.qh77ltMqwFPAZrbUcTNNMw';
    window.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',       
        center: [18.4241, -33.9249], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    window.startPin = new mapboxgl.Marker({draggable : true}).setLngLat([0, 0]).addTo(window.map)
    window.destinationPin = new mapboxgl.Marker({draggable : true}).setLngLat([0, 0]).addTo(window.map)

    window.map.on('click', function(event){
        event.preventDefault();
        if(window.startPoint == true){
            window.destinationPin.setLngLat(event.lngLat);
            window.startPoint = false;
            document.getElementById('destination').value = event.lngLat.lng + "," + event.lngLat.lat;
        }else{
            window.startPin.setLngLat(event.lngLat);
            window.startPoint = true;
            document.getElementById('start').value = event.lngLat.lng + "," + event.lngLat.lat;
        }
    })

    

}

function show(frmID){
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('agencies-form').style.display = 'none';
    document.getElementById('lines-form').style.display = 'none';
    document.getElementById('logout-form').style.display = 'none';
    document.getElementById('map-show').style.display = 'none';
    document.getElementById('trip-form').style.display = 'none'


    document.getElementById(frmID).style.display = 'block';
    if(frmID != 'loginForm'){
        document.getElementById('logout-form').style.display = 'block';
        document.getElementById('map-show').style.display = 'block'
    }
}

function getAgencies(token){
    //var token = window.token; // retrieved in previous request;

    var request = new XMLHttpRequest();
    request.addEventListener('load', function () {
      var response = JSON.parse(this.responseText);
      //console.log('Response', response);
      //var agency = document.getElementById('ag');
      //agency.textContent = this.responseText;

      addAgenciesToDropDown(response);
    });
    request.open('GET', 'https://platform.whereismytransport.com/api/agencies', true);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.send();
}

function addAgenciesToDropDown(agenciesList) {
    var agenciesSelect = document.getElementById('agenciesSelect')
    agenciesSelect.options.length = 0
    agenciesSelect.options.add(new Option("Select an option", null, true, true))
    agenciesList.forEach(function(agency) {
        agenciesSelect.options.add(new Option(agency.name, agency.id, false, false))
    })
}

function getLines(token, agency){
    var request = new XMLHttpRequest();
    request.addEventListener('load', function () {
        var response = JSON.parse(this.responseText);
        show('lines-form');
        addLinesToDropDown(response);
    });
    request.open('GET', 'https://platform.whereismytransport.com/api/lines?agencies=' + agency, true);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.send();
}

function getTrip(token, start, destination){
    start = document.getElementById('start').value;
    destination = document.getElementById('destination').value;    
    
    start = start.split(',');
    destination = destination.split(',');


    var request = new XMLHttpRequest();
    var payload = {
    "geometry": {
        "type": "MultiPoint",
        "coordinates": [
            start,
            destination
        ]
    },
    "maxItineraries": 5
    }
    request.addEventListener('load', function () {
        var response = JSON.parse(this.responseText);
        //show('lines-form');
        //addLinesToDropDown(response);
        console.log(response);
    });
    request.open('POST', 'https://platform.whereismytransport.com/api/journeys', true);
    
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + token);    
    request.send(JSON.stringify(payload));
}


function addLinesToDropDown(linesList){
    var linesSelect = document.getElementById('linesSelect')
    linesSelect.options.length = 0
    linesSelect.options.add(new Option("Select an option", null, true, true))
    linesList.forEach(function(line) {
        linesSelect.options.add(new Option(line.name, line.id, false, false))
    })
}

function getToken(){
    var token = localStorage.getItem('token');
    if(token == "" || token == undefined || token == 'undefined'){
        throw new Error('Invalid token');
    }else{
        return token;
    }
}

function hasToken(){
    var token = localStorage.getItem('token')
    if(token){
        var logFrm = document.getElementById('loginForm');
        //logFrm.classList.add('is-invisible');
        logFrm.style.display = 'none';
        return true;
    }else{
        return false;
    }
}

function getClientId(){
    var clientId = document.getElementById('clientId');
    return clientId.value;
}

function getClientSecret(){
    var clientSecret = document.getElementById('clientSecret');
    return clientSecret.value;
}

function login(clientId, clientSecret){
    // create a client here: https://developer.whereismytransport.com/clients
    var CLIENT_ID = clientId;
    var CLIENT_SECRET = clientSecret;
    var payload = {
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'grant_type': 'client_credentials',
      'scope': 'transportapi:all'
    };
    var request = new XMLHttpRequest();
    request.open('POST', 'https://identity.whereismytransport.com/connect/token', true);
    request.addEventListener('load', function () {
      var response = JSON.parse(this.responseText);
      var token = response.access_token;
      window.token = token;

    //Store password on login
    if(this.status == 200){
        localStorage.setItem('token', token);
        localStorage.setItem('storageDate', Date.now().toLocaleString());
        show('trip-form');
        loadMap();
    }

        //var result = document.getElementById('results');
        //result.textContent = this.responseText;

    });
    request.setRequestHeader('Accept', 'application/json');
    var formData = new FormData();

    for (var key in payload) {
      formData.append(key, payload[key]);
    }

    request.send(formData);
}
