import {endpoint, apiKey} from "./modules/settings";

window.addEventListener("load", init);

function init(){
    setUpForm();
    getSuperHeroes();
}

function setUpForm(){ 
const form = document.querySelector("form");
//make some things part of the global scope so that I can access them from the console, when dealing with parcel: ***to debug in the console
window.form = form;

//to get all the elements from my form, kinda like an object: "form.elements"
const elements = form.elements;
window.elements = elements;
console.log(elements);
//console.log(elements.enemies)
//console.log(elements.enemies.value)



elements.unknown.addEventListener("click", (e) => {
    //when user selects unknown, dob is disabled
    //elements.dob.setAttribute("disabled", true);
    //but I want it to be both ways so, set it to the opposite (if is clicked, disabled, if not, nope)
    elements.dob.disabled = !elements.dob.disabled;
});

/* //add something the moment the page loads: (only makes sense like in google home page)
window.addEventListener("load", e=> {
    elements.real_name.focus();
}) */

/* //makes it impossible to use the field
elements.real_name.addEventListener("click", (e)=> {
    elements.real_name.blur();
}) */




//disable default messages
form.setAttribute("novalidate", true);

form.addEventListener("submit", (e) => {
    //console.log("submited")
    e.preventDefault();
    //set the form to true, is valid
    let validForm = true;
    //console.log(form.checkValidity());
    //first clear all invalid fields
    const formElements = document.querySelectorAll("input");
    formElements.forEach((oneElement) => {
        oneElement.classList.remove("invalid");
        
    });  

    //2.at least one checkbox
    //transform it into an array
    const checkBoxes = [ ... form.querySelectorAll(`[name=powers]`)];
    //".checked" to find out wich were selected. default
    const checkedBox = checkBoxes.filter((e) => e.checked);
    //console.log(checkBoxes)
    //console.log(checkedBox)

    //4. select the alert for the checkboxes
    const powersFail = form.querySelector("fieldset p");
    //3. specify critereas
    if (checkedBox.length===0){
    //if the lenght is 0 the form is not valid
    validForm = false;
    //show error message
    powersFail.classList.remove("hidden");
    } else {
    //keep it hidden
    powersFail.classList.add("hidden");
    }
    //1.all input validate
    if (form.checkValidity() && validForm) {
        //send to api
    postSuperHero({
        //creating an object to pass along with that function all the data,
        real_name: form.elements.real_name.value,
        alias: form.elements.alias.value,
        dob: form.elements.dob.value, //fix
        location: form.elements.location.value,
        enemies: form.elements.enemies.value,
        //fav_color: form.elements.fav_color.value,
        powers: checkedBox.map((el)=>el.value),
    });
    form.reset();
    } else {
        //if there is an error, we go through them
        formElements.forEach((oneElement) => {
           
            if(!oneElement.checkValidity()){
                oneElement.classList.add("invalid");
            }
        });   

        }
    });

}

function postSuperHero(newSuperHeroData){
        const postData = JSON.stringify(newSuperHeroData);
        fetch(endpoint + "rest/superheroes", {
        method: "post",
        headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": apiKey,
        "cache-control": "no-cache",
  },
  body: postData,
})
  .then((res) => res.json())
  .then((data) => {
      console.log(data);
      showSuperHeroes(data);
  });
};

function getSuperHeroes(){
   
    fetch(endpoint + "rest/superheroes", {
    method: "get",
    headers: {
    "accept": "application/json",
    "x-apikey": apiKey,
    "cache-control": "no-cache",
}
})
.then((res) => res.json())
.then((data) => data.forEach(showSuperHeroes));
};

const template = document.querySelector("template").content;
const heroArea = document.querySelector("#heroeslist");

function showSuperHeroes(oneHero){
    const clone = template.cloneNode(true);
    clone.querySelector("p.alias").textContent = oneHero.alias;
    clone.querySelector("p.fullName").textContent = oneHero.real_name;
    //action on the delete button
    clone.querySelector(`[data-action="delete"]`).addEventListener("click", (e) => deleteSuperHero(oneHero._id));
    clone.querySelectorAll(`article, button[data-action="delete"]`).forEach(el=>el.dataset.id=oneHero._id);
    //powers list
    const ul = clone.querySelector("ul");
    oneHero.powers.forEach(pow=>{
        const li = document.createElement("li");
        li.textContent = pow;
        ul.appendChild(li);
    })

    heroArea.appendChild(clone);
}

function deleteSuperHero(id){
    //1.send request to api
    fetch(endpoint + "rest/superheroes/" + id, {
        method: "delete",
        headers: {
        "accept": "application/json",
        "x-apikey": apiKey,
        "cache-control": "no-cache",
    }
    })
    .then((res) => res.json())
    .then((data) => {});
    //2.remove from dom
    document.querySelector(`article[data-id="${id}"]`).remove();
}