

export default class VffPositionable extends HTMLElement {
    constructor() {
        super();
        this.scaleFactor = 100;


    }

    connectedCallback() {

        let self = this;
        this.style['transform-origin'] = '0 0';
        this.style['position'] = 'absolute';
        window.onload = function(){
            self.bounding = self.getBoundingClientRect();
        };
    }


    disconnectedCallback() {

    }

    get left() {
        return this.getBoundingClientRect().left;
    }
    set left(value) {
        // this.style.left = value + 'px';
        setTransform(this, "translateX", (value - this.bounding.left) + 'px');

    }

    get top() {
        return this.getBoundingClientRect().top;
    }

    set top(value) {
        // this.style.top = value + 'px';
        setTransform(this, "translateY", (value - this.bounding.top) + 'px');
    }



    get width(){
        return this.getBoundingClientRect().width;
    }
    get height(){
        return this.getBoundingClientRect().height;
    }


    set width(value) {
        let scale = value/this.bounding.width;
        setTransform(this, 'scaleX', scale);
    }
    set height(value) {
        let scale = value/this.bounding.height;
        setTransform(this, 'scaleY', scale);
    }


    expose() {
        return {
            x       : 'left',
            y       : 'top',
            Width   : 'width',
            Height  : 'height'
        };
    }
}


function setTransform(element, property, value){
    let regex = new RegExp(property + "\\([+-]?[0-9]*[.]?[0-9]+(px)?(\\,\\s*?[+-]?[0-9]*[.]?[0-9]+)?(px)?\\)");
    if(element.style.transform.match(regex)){
        element.style.transform = element.style.transform.replace(regex,property +  "(" + value + ")");
    } else {
        element.style.transform = element.style.transform + " " + property + "(" + value + ")";
    }
}
// function getTransform(element, property){
//     var style = window.getComputedStyle(element);
//     var matrix = new WebKitCSSMatrix(style.webkitTransform);
//     return matrix.m41;
// }

window.vff.define("vff-positionable", VffPositionable);

