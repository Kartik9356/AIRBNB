document.querySelector(".remove").addEventListener("click", function() {
    this.parentElement.remove(); // Removes the clicked element from the DOM
    console.log(this)
});