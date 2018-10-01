window.onload = function(){
    //event.preventDefault;
    var submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', function(event){
        //alert('Submited in .js file');
        var name = getName(), surname = getSurname(),
         age = getAge(), num = getNumber(), gen = getGender(),
         addr = getAddress();

        if(name == "" || surname == "" || name == undefined || surname == undefined ||
            gen == "" || addr == "" || gen == undefined || addr == undefined){
            alert('fill in all the provided fields')
        }else{
            if(age < 18){
                alert('The age of ' + age + ' is less than 18\nYou are not allowed to use this site')
            }else if(num.length < 10 || num.length > 10 || num.charAt(0) != 0){
                alert('Check your phone number');
            }else{
                alert('Hello ' + name + " " + surname + "\nyou are: " + age 
                    + " years old\nPhone Number: " + num);
            }
        }
    });
}

function getName(){
    var name = document.getElementById('name');
    return name.value;
}

function getSurname(){
    var surname = document.getElementById('surname');
    return surname.value;
}

function getAge(){
    var age = document.getElementById('age');
    return age.value;
}

function getNumber(){
    var num = document.getElementById('num');
    return num.value;
}

function getGender(){
    var gen = document.getElementById('gender');
    return gen.value;
}

function getAddress(){
    var add = document.getElementById('address');
    return add.value;
}

