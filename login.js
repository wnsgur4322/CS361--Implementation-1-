//function for login identification
var password = ["derek"];
var username = ["Derek"];

function redirect(){
  window.location ="https://www.google.com";
  return false;
}

function check(){
  var redirect_true = 0;
  for(var i = 0; i < username.length; i++){
    username[i] = username[i].toLowerCase();

    if(document.getElementById('userid').value == username[i] && document.getElementById('pswrd').value == password[i]){
      redirect_true = 1;
    }
  }
  if(redirect_true == 1){
    //window.open(document.getElementById('userid').value); <- for interaction with js node
    window.open("https://www.google.com");
  }
  if(redirect_true == 0){
    alert("Check your password or username!");
  }
}


var login_button = document.querySelector(".Login_button");
login_button.addEventListener('click', check);

//change password modal open part (remove hidden)
var modal = document.querySelector(".modal");
var modal_button = document.querySelector("#create-changepwd-button");

function remove_hidden(){
  document.getElementById("create-changepwd-modal").classList.remove('hidden');
  document.getElementById("modal-backdrop").classList.remove('hidden');
}

modal_button.addEventListener('click', remove_hidden);

//change password modal close part (rollback hidden option)
var cancel_button = document.querySelector(".modal-cancel-button");

function rollback(){
  document.getElementById("changepwd-username-attribution-input").value = "";
  document.getElementById("changepwd-attribution-input").value = "";
  document.getElementById("create-changepwd-modal").classList.add('hidden');
  document.getElementById("modal-backdrop").classList.add('hidden');
}

cancel_button.addEventListener('click', rollback);

//create account modal open part (remove hidden)
var modal_2 = document.querySelector(".modal");
var modal_button_2 = document.querySelector("#create-account-button");

function remove_hidden_2(){
  document.getElementById("create-account-modal").classList.remove('hidden');
  document.getElementById("modal-backdrop-2").classList.remove('hidden');
}

modal_button_2.addEventListener('click', remove_hidden_2);

//create account password modal close part (rollback hidden option)
var cancel_button_2 = document.querySelector(".modal-cancel-button-2");

function rollback_2(){
  document.getElementById("account-username-attribution-input").value = "";
  document.getElementById("account-password-attribution-input").value = "";
  document.getElementById("create-account-modal").classList.add('hidden');
  document.getElementById("modal-backdrop-2").classList.add('hidden');
}

cancel_button_2.addEventListener('click', rollback_2);

// Change password part
function password_change(){
  var identify = 0;
  var user_key = -1;

  for(var j = 0; j < username.length; j++){
    username[j] = username[j].toLowerCase();
    if(document.getElementById("changepwd-username-attribution-input").value == username[j] ){
      identify = 1;
      user_key = j;
    }
  }

  if(document.getElementById("changepwd-attribution-input").value.length < 5){
    identify = 0;
  }

  if(identify == 1){
    password[user_key] = document.getElementById("changepwd-attribution-input").value;
    alert("Your password changed successfully!");
    document.getElementById("create-changepwd-modal").classList.add('hidden');
    document.getElementById("modal-backdrop").classList.add('hidden');
  }

  if(identify == 0){
    alert("Check your username or set new password at least 5 characters!");
    document.getElementById("changepwd-username-attribution-input").value = "";
    document.getElementById("changepwd-attribution-input").value = "";
  }
}

var changepwd_button = document.querySelector(".modal-changepwd-button");
changepwd_button.addEventListener('click', password_change);

// create an account part
function create_account(){
  var creating_bool = 0;

  if(document.getElementById("account-username-attribution-input").value != "" && document.getElementById("account-password-attribution-input").value != "" ){
    creating_bool = 1;
  }
  if(document.getElementById("account-password-attribution-input").value.length < 5){
    creating_bool = 0;
  }

  if(creating_bool == 1){
    alert("Your account is successfully created !");
    username.push(document.getElementById("account-username-attribution-input").value);
    password.push(document.getElementById("account-password-attribution-input").value);
    document.getElementById("create-account-modal").classList.add('hidden');
    document.getElementById("modal-backdrop-2").classList.add('hidden');
    console.log(username, password);
  }

  if(creating_bool == 0){
    alert("check your password length or don't left any blank for creating your account !");
    document.getElementById("account-username-attribution-input").value = "";
    document.getElementById("account-password-attribution-input").value = "";

  }
}

var create_account_button = document.querySelector(".modal-account-button");
create_account_button.addEventListener('click', create_account);
