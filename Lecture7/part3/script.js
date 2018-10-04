window.onload = function(){

    show('loginForm');
    try {
        getAgencies(getToken() );
        show('agencies-form');
    } catch (error) {
        console.log(error);
    }    

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
        show('agencies-form');
    });

   documen.getElementById('map').style.display = 'none';


}

function show(frmID){
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('agencies-form').style.display = 'none';
    document.getElementById('lines-form').style.display = 'none';
    document.getElementById('logout-form').style.display = 'none';

    document.getElementById(frmID).style.display = 'block';
    if(frmID != 'loginForm'){
        document.getElementById('logout-form').style.display = 'block';
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
        show('loginForm');
        show('agencies-form');
        getAgencies(getToken());
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
