let remove= document.querySelector(".remove")
if(remove){
   remove.addEventListener("click", function() {
        this.parentElement.remove(); // Removes the clicked element from the DOM
        console.log(this)
    });
}