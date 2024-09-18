window.addEventListener("load", () => {
    const removeClass = (elements, className) => {            
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove(className);
        }
    };

    const optionDivs = document.getElementsByClassName("option");
    for (let i = 0; i < optionDivs.length; i++) {     
        optionDivs[i].addEventListener("click", function() {
            removeClass(optionDivs, "option-selected")
            this.classList.add("option-selected");
        });                         
    }
});