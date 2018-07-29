const interact = require('interactjs');
import VffPositionable from './positionable';


function dragMoveListener (event) {
    let target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}



export default class VffInteractable extends VffPositionable {
    constructor() {
        super();
    }

    connectedCallback() {
        this.style.display = 'inline-block';
        this.style['transform-origin'] = '0 0';
        this.classList.add('draggable');
        var self = this;
        window.onload = function(){
            self.bounding = self.getBoundingClientRect();
        };
        interact('.draggable')
            .draggable({
                onmove: dragMoveListener,
                // restrict: {
                //     restriction: 'parent',
                //     elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                // },
            })
            .resizable({
                // resize from all edges and corners
                edges: { left: true, right: true, bottom: true, top: true },

                // keep the edges inside the parent
                // restrictEdges: {
                //     outer: 'parent',
                //     endOnly: true,
                // },

                // minimum size
                // restrictSize: {
                //     min: { width: 100, height: 50 },
                // },

                inertia: true,
            })
            .on('resizemove', function (event) {
                let target = event.target,
                    x = (parseFloat(target.getAttribute('data-x')) || 0),
                    y = (parseFloat(target.getAttribute('data-y')) || 0);




                self.width = event.rect.width;
                self.height = event.rect.height;


                // update the element's style
                // target.style.width  = event.rect.width + 'px';
                // target.style.height = event.rect.height + 'px';

                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                self.left = x;
                self.top = y;



                // target.style.webkitTransform = target.style.transform =
                //     'translate(' + x + 'px,' + y + 'px)';

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
                // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
            });

    }


    disconnectedCallback() {

    }


}

window.vff.define("vff-interactable", VffInteractable);

