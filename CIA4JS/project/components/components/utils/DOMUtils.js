export const DOMUtils = {
    createElementFromHTML(htmlString) {
        let div = document.createElement("div");
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    },

    createElement(htmlString, type) {
        let component = document.createElement(type);
        component.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return component.firstChild;
    },

    hideNavLinks() {
        let navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach(nav => {
            nav.style.display = "none";
        })
    },

    showNavLink() {
        let navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach(nav => {
            nav.style.display = "block";
        })
    },
    removeInputValidate(domId) {
        let div = document.querySelector(`#${domId}`);
        div.classList.remove("is-valid");
        div.classList.remove("is-invalid");
    },

    scrollIfNeeded(element, container) {
        if (element.offsetTop < container.scrollTop) {
            container.scrollTop = element.offsetTop;
        } else {
            const offsetBottom = element.offsetTop + element.offsetHeight;
            const scrollBottom = container.scrollTop + container.offsetHeight;
            if (offsetBottom > scrollBottom) {
                container.scrollTop = offsetBottom - container.offsetHeight;
            }
        }
    },

    scrollToElm(container, elm, duration){
    let pos = this.getRelativePos(elm);
    this.scrollTo( container, pos.top , 2);  // duration in seconds
    },
    getRelativePos(elm){
    let pPos = elm.parentNode.getBoundingClientRect(), // parent pos
        cPos = elm.getBoundingClientRect(), // target pos
        pos = {};

    pos.top    = cPos.top    - pPos.top + elm.parentNode.scrollTop,
        pos.right  = cPos.right  - pPos.right,
        pos.bottom = cPos.bottom - pPos.bottom,
        pos.left   = cPos.left   - pPos.left;

    return pos;
    },
    scrollTo(element, to, duration, onDone) {
    let start = element.scrollTop,
        change = to - start,
        startTime = performance.now(),
        val, now, elapsed, t;

    function animateScroll(){
        now = performance.now();
        elapsed = (now - startTime)/1000;
        t = (elapsed/duration);

        element.scrollTop = start + change * DOMUtils.easeInOutQuad(t);

        if( t < 1 )
            window.requestAnimationFrame(animateScroll);
        else
            onDone && onDone();
    }

    animateScroll();
    },

    easeInOutQuad(t){
        return t<.5 ? 2*t*t : -1+(4-2*t)*t
    }

}