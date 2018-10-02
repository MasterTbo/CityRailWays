window.onload = function(){
    //event.preventDefault;
    var submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', function(event){
        validateSurname();
        validateName();
        validateAddress();
        validateAge();
        validateGender();
        validateNumber();


        //alert('Submited in .js file');
        //var name = getName(), surname = getSurname(),
        // age = getAge(), num = getNumber(), gen = getGender(),
        // addr = getAddress();
//
        //if(name == "" || surname == "" || name == undefined || surname == undefined ||
        //    gen == "" || addr == "" || gen == undefined || addr == undefined){
        //    alert('fill in all the provided fields')
        //}else{
        //    if(age < 18){
        //        alert('The age of ' + age + ' is less than 18\nYou are not allowed to use this site')
        //    }else if(num.length < 10 || num.length > 10 || num.charAt(0) != 0){
        //        alert('Check your phone number');
        //    }else{
        //        alert('Hello ' + name + " " + surname + "\nyou are: " + age 
        //            + " years old\nPhone Number: " + num);
        //    }
        //}
    });
}



function validateName(){
    var name = document.getElementById('name');
    var nameError = document.getElementById('nameError');
    if(name.value == "" || name.value == undefined){
        nameError.classList.remove('is-invisible');
    }else{
        nameError.classList.add('is-invisible');
    }


    //return name.value;
}

function validateSurname(){
    var surname = document.getElementById('surname');
    var surnameError = document.getElementById('surnameError');
    if(surname.value == "" || surname.value == undefined){
        surnameError.classList.remove('is-invisible');
    }else{
        surnameError.classList.add('is-invisible');
    }
    //return surname.value;
}

function validateAge(){
    var age = document.getElementById('age');
    var ageError = document.getElementById('ageError');
    if(age.value == "" || age.value == undefined ){ 
        //|| age.value < 18 || age.value > 38 && age.value < 42 || age.value > 64){
        ageError.classList.remove('is-invisible');         
    }
    else if(age.value > 0 && age.value < 18){
        ageError.classList.remove('is-invisible');
        ageError.innerHTML = "You are too young";
    }
    else if(age.value > 0 && age.value > 64){
        ageError.classList.remove('is-invisible');
        ageError.innerHTML = "You are too old";
    }
    else{
        ageError.classList.add('is-invisible');               
    }
}

function validateNumber(){
    var num = document.getElementById('num');
    var numError = document.getElementById('numError');
    if(num.value == null || num.value == "" || num.value == undefined 
        || num.value < 10 || num.value > 10){
        numError.classList.remove('is-invisible');
    }    
    else if(num.value.charAt(0) != 0 || num.value.charAt(1) != 7 || num.value.charAt(2) != 3){
        numError.classList.remove('is-invisible');
        numError.innerHTML = "Invalid code " + num.value.charAt(0) + num.value.charAt(1) + num.value.charAt(2);
    }
    else{
        numError.classList.add('is-invisible');
    }
}

function validateGender(){
    var gen = document.getElementById('gender');
    var genError = document.getElementById('genError');
    if(gen.value == "" || gen.value == undefined){
        genError.classList.remove('is-invisible');
    }else{
        genError.classList.add('is-invisible');
    }
}

function validateAddress(){
    var add = document.getElementById('address');
    var addrError = document.getElementById('addrError');
    if(add.value == "" || add.value == undefined){
        addrError.classList.remove('is-invisible');
    }else{
        addrError.classList.add('is-invisible');
    }
}

