//import {endpoint, apiKey} from "./modules/settings";

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
    console.log(form.checkValidity());
    if (form.checkValidity()) {
        //send to api
       console.log("okay")
    } else {
        const formElements = document.querySelectorAll("input");
        formElements.forEach((oneElement) => {
            oneElement.classList.remove("invalid");
            if(!oneElement.checkValidity()){
                oneElement.classList.add("invalid");
            }
        });   

        }
    });