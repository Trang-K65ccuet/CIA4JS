function navSlide() {
    const burger = $(".burger")[0];
    const nav = $(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");
    //Toogle Nav
    burger.addEventListener("click", () => {
        nav.toggleClass("nav-active");
    });


    navLinks.forEach((link, index) => {
        link.style.animation = `navLinkFade 0.7s ease forwards ${index / 7 + 0.3}s`;
    })
}

const NAVBAR_ULTILS = {
    navSlide,
};

export default NAVBAR_ULTILS;
