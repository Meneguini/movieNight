document.addEventListener('DOMContentLoaded', () => {
    // check if there is a = icon, if there is one it means we are in a mobile. Add event listener
    if(document.querySelector(".equal-icon")) {
        document.querySelector(".equal-icon").addEventListener('click', toggleNav);
    }
});

function toggleNav() {
    // toggle the icon 
    if(document.querySelector(".toggled").style.display == 'block') {
        document.querySelector(".toggled").style.display = 'none';
    }
    else {
        document.querySelector(".toggled").style.display = 'block';   
    }
}