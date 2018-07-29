export default class VffJQ extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        let self = this;
        window.onload = function(){
            setTimeout(function(){
                self.$el = $($(self).children()[0]);
                self.elHeight = self.$el.outerHeight();
                self.elWidth = self.$el.outerWidth();


                self.$wrapper = $(self);


                if(vff.mode === "controller-preview") {
                    self.$wrapper.draggable({
                        appendTo: 'body',
                    });
                    self.$wrapper.resizable({
                        resize: self.doResize()
                    });


                    let starterData = {
                        size: {
                            width: self.$wrapper.width(),
                            height: self.$wrapper.height()
                        }
                    };

                    self.doResize()(null, starterData);
                }
            },100);

        };


    }


    disconnectedCallback() {

    }


    doResize() {
        let self = this;
        return (event, ui) => {
            let scale, origin;

            scale = Math.min(
                ui.size.width / self.elWidth,
                ui.size.height / self.elHeight
            );

            self.$el.css({
                transform: "scale(" + scale + ")",
                "transform-origin": "0 0"
            });
        }

    }

    get left() {
        return this.getBoundingClientRect().left;
    }

    set left(value) {
        $(this).css({'left': value + "px"});
    }
    get top() {
        return this.getBoundingClientRect().top;
    }

    set top(value) {
        $(this).css({'top': value + "px"});
    }

    get width(){
        return this.getBoundingClientRect().width;
    }
    get height(){
        return this.getBoundingClientRect().height;
    }
    set width(value) {
        $(this).css({'width': value + "px"});
    }
    set height(value) {
        $(this).css({'height': value + "px"});
    }


    expose() {
        return {
            x : 'left',
            y : 'top',
            w : 'width',
            h : 'height'
        }
    }

}

window.vff.define("vff-jq-transformable", VffJQ);

