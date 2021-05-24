const baseURL = "http://127.0.0.1:12345";

let TOKEN = "";

// imports form HTML
let tokenBtn = document.getElementById("btnToken");
let dataBtn = document.getElementById("btnUserData");
let btnContainer = document.getElementById("btnContainer");
let container = document.getElementById("container");
let formToken = document.getElementById("tokenPara");
let form = document.getElementById("registerForm");
let homeBtn = document.getElementById("Home");
let dataContainer = document.getElementById("dataContainer");
let dataForm = document.getElementById("dataForm");
let dataHome = document.getElementById("dataHome");
let dataToken = document.getElementById("dataToken");


// Utility functions
const getToken = async () => {
    await fetch(baseURL+"/get_token")
    .then(res => res.json())
    .then(data => {
        TOKEN = data['token'].toString();
            // console.log(TOKEN);
        }
    );
};

// Events
tokenBtn.addEventListener('click', async () =>{
    await getToken();
    btnContainer.style.display = 'none';
    container.style.display = 'flex';
    console.log(TOKEN);
    formToken.innerHTML = "The token is: " + TOKEN;
    console.log('Done');
});


form.onsubmit = async (e) => {
    e.preventDefault();

    let name = document.getElementById("name");
    let data = document.getElementById("data");
    let token = document.getElementById("token");
    let resPara = document.getElementById("res")
    let payload = {
        "username" : name.value,
        "data" : data.value,
        "token" : token.value
    };
    console.log(payload);
    let error = false;
    let response = await fetch(baseURL + "/register", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(res => {
        console.log(res.status);
        if(res.status != 200){
            error = true;
            return res.json();
        }else{
            error = false;
            return res.text();
        }
    })
    .then(d => {
        if (error) {
            d = d['error'];
            resPara.style.color = 'red';
        }
        if(!error){
            resPara.style.color = 'green';
        }
        console.log(d);
        resPara.innerHTML = d.toUpperCase();
        name.value = "";
        data.value = "";
        token.value = "";
        return d;
    })
    .catch(err => console.log(err));
};

homeBtn.addEventListener('click', () =>{
    btnContainer.style.display = 'flex';
    container.style.display = 'none';
});

dataBtn.addEventListener('click', () => {
    btnContainer.style.display = 'none';
    dataContainer.style.display = 'flex';
});

dataHome.addEventListener('click', () =>{
    btnContainer.style.display = 'flex';
    dataContainer.style.display = 'none';
});

dataForm.onsubmit = async (e) => {
    e.preventDefault();

    let token = document.getElementById("dataToken");
    let error = false;
    let payload = {
        "token" : token.value
    }
    let resDataPara = document.getElementById("dataRes");

    let response = await fetch(baseURL + "/get_data", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(res => {
        console.log(res.status);
        if(res.status != 200){
            error = true;
        }else{
            error = false;
        }
        return res.json();
    })
    .then(d => {
        let uname = document.getElementById("unameSpan");
        let udata = document.getElementById("dataSpan");
        if (error) {
            d = d['error'];
            resDataPara.style.color = 'red';
            resDataPara.innerHTML = d.toUpperCase();
            uname.innerHTML = "";
            udata.innerHTML = "";
            document.getElementById("results").style.visibility = 'hidden';
        }

        if(!error){
            resDataPara.innerHTML = "";
            resDataPara.style.color = 'green';
            token.value = "";
            uname.innerHTML = d['username'];
            udata.innerHTML = d['data'];
            document.getElementById("results").style.visibility = 'visible';
        }
    })
    .catch(err => console.log(err));
};
