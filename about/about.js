const submitBtn = document.querySelector('button');
const emailInput = document.querySelector('#email');
const nameInput = document.querySelector('#name');

emailInput.addEventListener('input', checkEmail);
nameInput.addEventListener('input', checkName);

submitBtn.addEventListener('click', (e) => {
    if (!checkEmail() || !checkName()) {
        e.preventDefault();
        window.alert("Form submission prevented due to validation errors.");
    }
})

function checkEmail(){
    const emailPattern =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailPattern.test(emailInput.value)){
        emailInput.style.backgroundColor = 'rgb(200, 250, 200)';
    }
    else{
        emailInput.style.backgroundColor = 'rgb(250, 200, 200';
    }

    return emailPattern.test(emailInput.value);
}

function checkName(){
    const namePattern = /^[A-Za-z\s-]+$/;
    if(namePattern.test(nameInput.value)){
        nameInput.style.backgroundColor = 'rgb(200, 250, 200)';
    }
    else{
        nameInput.style.backgroundColor = 'rgb(250, 200, 200';
    }

    return namePattern.test(nameInput.value);
}