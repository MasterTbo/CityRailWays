window.onload = function(){
    if(hasToken()){
        //get Agencies
        getAgencies(this.localStorage.getItem('token'));
        //get Lines
        getLines(this.localStorage.getItem('token'));
    }
    var sub = this.document.getElementById('submit');
    sub.addEventListener('click', function(event){
        event.preventDefault();         
        var id = getClientId();
        var sc = getClientSecret();
        login(id, sc);               
    });
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

function getLines(token){
    var request = new XMLHttpRequest();
    request.addEventListener('load', function () {
        var response = JSON.parse(this.responseText);
        addLinesToDropDown(response);
    });
    request.open('GET', 'https://platform.whereismytransport.com/api/lines', true);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.send();
}

function addLinesToDropDown(linesList){
    var linesSelect = document.getElementById('linesSelect')
    linesSelect.options.length = 0
    linesSelect.options.add(new Option("Select an option", null, true, true))
    linesList.forEach(function(line) {
        linesSelect.options.add(new Option(line.name, line.id, false, false))
    })
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
      localStorage.setItem('token', token);
      localStorage.setItem('storageDate', Date.now().toLocaleString());

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
