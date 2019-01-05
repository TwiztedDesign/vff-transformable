const interact = require('interactjs');

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



export default class VffTransformable extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.style.display = 'block';
        this.style['user-select'] = 'none';
        this.classList.add('draggable');
        let self = this;
        window.onload = function(){
            self.bounding = self.getBoundingClientRect();
        };
        interact('.draggable')
            .draggable({
                onmove: dragMoveListener,
            })
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                inertia: false,
            })
            .on('resizemove', event => {
                let target = event.target;
                let x = (parseFloat(target.getAttribute('data-x')) || 0);
                let y = (parseFloat(target.getAttribute('data-y')) || 0);

                // update the element's style

                target.style.width  = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';

                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform =
                    'translate(' + x + 'px,' + y + 'px)';

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            });
    }

    get x() {
        return this.getAttribute("data-x") || "";
    }
    set y(value) {
        this.setAttribute('data-x', value);

        let target = this;
        let x = (parseFloat(target.getAttribute('data-x')) || 0);
        let y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style

        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

    }


    disconnectedCallback() {

    }
    expose(){
        return {
            X       : 'x',
            Y       : 'y',
            Width   : 'width',
            Height  : 'height'
        };
    }
}

window.vff.define("vff-transformable", VffTransformable);

