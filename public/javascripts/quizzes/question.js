window.addEventListener("load", () => {
    const removeClass = (elements, className) => {            
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove(className);
        }
    };

    const optionDivs = document.getElementsByClassName("option");
    if (questionGraded) {
        for (let i = 0; i < optionDivs.length; i++) {     
            optionDivs[i].classList.add("disabled");                       
        }
    } else {
        const gradeBtn = document.getElementById("gradeBtn");
        for (let i = 0; i < optionDivs.length; i++) {     
            optionDivs[i].addEventListener("click", function() {
                removeClass(optionDivs, "option-selected")
                this.classList.add("option-selected");
    
                gradeBtn.style.backgroundColor = "#0A66C2";
                gradeBtn.removeAttribute("disabled");
                gradeBtn.setAttribute("enabled", true);
            });                         
        }
    }
});