import TransformBox from './transform-box';
import VffPositionable from './positionable';
let d3 = require('d3');


export default class VffTransformable extends VffPositionable {
    constructor() {
        super();


        this.outline = 1;
        this.options = {
            crop:{x0 : 0, y0 : 0, x1 : 1, y1 : 1},


        };

        // this.flippedX = false;
        // this.flippedY = false;
        // this.lastLimitedDX = 0;
        // this.lastLimitedDY = 0;

        this.handleSize = 10;
        this.handleMargin = this.handleSize / 2;
        this.parentWidth = Number(this.options.parentWidth);
        this.parentHeight = Number(this.options.parentHeight);

        this.aspectRatio = this.parentWidth / this.parentHeight;

        this.CROP_SIZE_DELTA = 0.005;

        this.operators = {
            "+":(a,b) => {return a+b;},
            "-":(a,b) => {return a-b;}
        };

    }

    connectedCallback() {
        let self = this;

        window.onload = function () {
            self.style['transform-origin'] = '0 0';
            self.style['position'] = 'absolute';
            self.bounding = self.getBoundingClientRect();
            self.boxData = new TransformBox(self.bounding);
            self.svg = d3.select("body").append('svg').attr({width: '100%', height: '100%'});
            self.draw();
            self.update();
            window.addEventListener("resize", self.redraw);
        };

    }


    disconnectedCallback() {

    }


    //**************** Helpers ****************/

    createHandle(dragFunc, cursor){
        return this.boxContainer.append("rect")
            .attr("height", this.handleSize)
            .attr("width", this.handleSize)
            .attr("fill", d3.rgb("#39f"))
            .attr("cursor",cursor)
            .call(dragFunc);
    }
    createGridLine(){
        return this.boxContainer.append("line")
            .attr('stroke', 'white')
            .style('stroke-opacity',0.3)
            .style("stroke-dasharray", ("3, 3"));

    }
    invertX() {
        let tmpX = this.boxData.getX0();
        this.boxData.setX0(this.boxData.getX1());
        this.boxData.setX1(tmpX);
    }
    invertY() {
        let tmpY = this.boxData.getY0();
        this.boxData.setY0(this.boxData.getY1());
        this.boxData.setY1(tmpY);
    }
    invert(){
        if(this.boxData.getX0() > this.boxData.getX1()){
            this.invertX();
        }
        if(this.boxData.getY0() > this.boxData.getY1()){
            this.invertY();
        }
        this.update();
    }
    //*****************************************/



    //**************** Draw Functions ****************/

    redraw() {
        this.svg.attr({width: this.bounding.width, height: this.bounding.width});
        this.update();
    }
    drawOverlay(){
        this.overlay = this.svg.append("g").append("path").attr("class", "cropbox-overlay").attr({
            'fill-opacity' : 0.5,
            'fill' : 'black',
            'fill-rule' : "evenodd"
        });
    }
    drawBox(){
        this.boxContainer = this.svg.append("g");
        this.box = this.boxContainer
            .append("rect")
            .attr("class", "cropbox")
            .attr("fill-opacity", 0)
            .attr("cursor", "move")
            .style("stroke", d3.rgb("#39f"))
            .style("stroke-width", this.outline)
            .call(d3.behavior.drag().on('drag', this.dragBox()).on('dragend', this.dragEnd()));
    }
    drawGrid(){
        this.tgl = this.createGridLine();
        this.bgl = this.createGridLine();
        this.lgl = this.createGridLine();
        this.rgl = this.createGridLine();
    }

    drawHandles(){
        this.nw = this.createHandle(this.dragNW(), 'nw-resize');
        this.ne = this.createHandle(this.dragNE(), 'ne-resize');
        this.se = this.createHandle(this.dragSE(), 'se-resize');
        this.sw = this.createHandle(this.dragSW(), 'sw-resize');
        this.n = this.createHandle(this.dragN(), 'n-resize');
        this.s = this.createHandle(this.dragS(), 's-resize');
        this.e = this.createHandle(this.dragE(), 'e-resize');
        this.w = this.createHandle(this.dragW(), 'w-resize');
    }

    draw(){
        // this.drawOverlay();
        this.drawBox();
        this.drawHandles();
        this.drawGrid();
    }

    //************************************************/


    //**************** Update Functions ****************/
    updateOverlay(){
        this.overlay.attr('d',
            " M 0 0" +
            " H " + this.bounding.width +
            " V " + this.bounding.height +
            " H " + 0 +
            " V " + 0 +

            " M " + this.boxData.getX0() + " " + this.boxData.getY0() +
            " L " + this.boxData.getX0() + " " + this.boxData.getY1() +
            " L " + this.boxData.getX1() + " " + this.boxData.getY1() +
            " L " + this.boxData.getX1() + " " + this.boxData.getY0() +
            " L " + this.boxData.getX0() + " " + this.boxData.getY0()
        );
    }
    updateBox(){
        this.box.attr({
            x: Math.min(this.boxData.getX0(), this.boxData.getX1()),
            y: Math.min(this.boxData.getY0(), this.boxData.getY1()),
            width: Math.abs(this.boxData.getX1() - this.boxData.getX0()),
            height: Math.abs(this.boxData.getY1() - this.boxData.getY0())
        });
    }
    updateGrid(){
        this.tgl
            .attr("x1", this.boxData.getX0() + this.outline)
            .attr("y1", this.boxData.getY0() + ((this.boxData.getY1() - this.boxData.getY0()) /3))
            .attr("x2", this.boxData.getX1() - this.outline)
            .attr("y2", this.boxData.getY0() + ((this.boxData.getY1() - this.boxData.getY0()) /3));

        this.bgl
            .attr("x1", this.boxData.getX0() + this.outline)
            .attr("y1", this.boxData.getY0() + ((this.boxData.getY1() - this.boxData.getY0()) /3 * 2))
            .attr("x2", this.boxData.getX1() - this.outline)
            .attr("y2", this.boxData.getY0() + ((this.boxData.getY1() - this.boxData.getY0()) /3 * 2));

        this.lgl
            .attr("x1", this.boxData.getX0() + ((this.boxData.getX1() - this.boxData.getX0()) /3))
            .attr("y1", this.boxData.getY0() + this.outline)
            .attr("x2", this.boxData.getX0() + ((this.boxData.getX1() - this.boxData.getX0()) /3))
            .attr("y2", this.boxData.getY1() - this.outline);

        this.rgl
            .attr("x1", this.boxData.getX0() + ((this.boxData.getX1() - this.boxData.getX0()) /3 * 2))
            .attr("y1", this.boxData.getY0() + this.outline)
            .attr("x2", this.boxData.getX0() + ((this.boxData.getX1() - this.boxData.getX0()) /3 * 2))
            .attr("y2", this.boxData.getY1() - this.outline);
    }
    updateHandles(){
        this.nw
            .attr('x', this.boxData.getX0() - this.handleMargin)
            .attr('y', this.boxData.getY0() - this.handleMargin);
        this.ne
            .attr('x', this.boxData.getX1() - this.handleSize + this.handleMargin)
            .attr('y', this.boxData.getY0() - this.handleMargin);
        this.se
            .attr('x', this.boxData.getX1() - this.handleSize + this.handleMargin)
            .attr('y', this.boxData.getY1() - this.handleSize + this.handleMargin);
        this.sw
            .attr('x', this.boxData.getX0() - this.handleMargin)
            .attr('y', this.boxData.getY1() - this.handleSize + this.handleMargin);
        this.n
            .attr('x', this.boxData.getX0() + ((this.boxData.getX1() - this.boxData.getX0() - this.handleSize) /2))
            .attr('y', this.boxData.getY0() - this.handleMargin);
        this.s
            .attr('x', this.boxData.getX0() + ((this.boxData.getX1() - this.boxData.getX0() - this.handleSize) /2))
            .attr('y', this.boxData.getY1() - this.handleSize + this.handleMargin);
        this.e
            .attr('x', this.boxData.getX1() - this.handleSize + this.handleMargin)
            .attr('y', this.boxData.getY0() + ((this.boxData.getY1() - this.boxData.getY0() - this.handleSize) /2));
        this.w
            .attr('x', this.boxData.getX0() - this.handleMargin)
            .attr('y', this.boxData.getY0() + ((this.boxData.getY1() - this.boxData.getY0() - this.handleSize) /2));
    }
    update(){
        // this.updateOverlay();
        this.updateBox();
        this.updateGrid();
        this.updateHandles();

        // let xy = this.boxData.getPoints();
        //
        // let ox = 8, oy = 120.59, ow = 500, oh = 500;
        //
        // this.left = xy.x0;
        // this.top = xy.y0;
        // this.width = (xy.x1 - xy.x0) * this.bounding.width;
        // this.height = (xy.y1 - xy.y0) * this.bounding.height;
    }

    //**************************************************/

    //**************** Behaviors ****************/

    dragBox() {
        let self = this;
        return () => {
            let e = d3.event;

            let w = Math.abs(self.boxData.getX1() - self.boxData.getX0());
            let h = Math.abs(self.boxData.getY1() - self.boxData.getY0());
            self.boxData.setX0(Math.max(0, Math.min(self.boxData.getX0() + e.dx, self.bounding.width - w)));
            self.boxData.setX1(Math.max(w, Math.min(self.boxData.getX1() + e.dx, self.bounding.width)));

            self.boxData.setY0(Math.max(0, Math.min(self.boxData.getY0() + e.dy, self.bounding.height - h)));
            self.boxData.setY1(Math.max(h, Math.min(self.boxData.getY1() + e.dy, self.bounding.height)));

            self.box.style('cursor', 'move');
            self.update();
        };

    }
    dragEnd(){
        let self = this;
        return () => {
            self.invert();

            self.boxData.flippedX = false;
            self.boxData.flippedY = false;
            self.boxData.lastLimitedDX = 0;
            self.boxData.lastLimitedDY = 0;
            // scope.$apply();
        };
    }

    isLimitReached(){
        return this.isNLimitReached() || this.isSLimitReached() || this.isWLimitReached() || this.isELimitReached();
    }

    isNLimitReached(){
        return this.boxData.getY0() <= 0 ||
            this.boxData.getY1() <= 0;
    }
    isSLimitReached(){
        return this.boxData.getY0() >= this.bounding.height ||
            this.boxData.getY1() >= this.bounding.height;
    }
    isELimitReached(){
        return this.boxData.getX0() >= this.bounding.width ||
            this.boxData.getX1() >= this.bounding.width;
    }
    isWLimitReached(){
        return this.boxData.getX0() <= 0 ||
            this.boxData.getX1() <= 0;
    }

    setToLimitedXDimensions(){
        if (this.isWLimitReached()) {
            this.boxData.setX1(this.boxData.getX0() + (this.lastLimitedDY * this.aspectRatio));
        } else if (this.isELimitReached()) {
            this.boxData.setX0(this.boxData.getX1() - (this.lastLimitedDY * this.aspectRatio));
        }
    }

    setToLimitedYDimensions(){
        if (this.isNLimitReached()) {
            this.boxData.setY1(this.boxData.getY0() + (this.boxData.lastLimitedDX / this.aspectRatio));
        } else if (this.isSLimitReached()) {
            this.boxData.setY0(this.boxData.getY1() - (this.boxData.lastLimitedDX / this.aspectRatio));
        }
    }

    dragNW(){
        let self = this;
        return d3.behavior.drag().on('drag', function(){
            var e = d3.event;
            if(self.options.lockAspect && self.aspectRatio) {
                if(!self.isLimitReached() ||
                    (!self.boxData.isFlipped() && (e.dy > 0 || ((self.isSLimitReached() || self.isELimitReached()) && !self.isWLimitReached() && !self.isNLimitReached()))) ||
                    (self.boxData.isFlipped() && e.dy < 0)){
                    self.boxData.setY0(self.boxData.getY0() + e.dy);
                    if(self.boxData.getY0() < self.boxData.getY1()) {
                        self.boxData.setX0(self.boxData.getX1() - (self.boxData.getDY() * self.aspectRatio));
                    }else{
                        self.boxData.setX0(self.boxData.getX1() + (self.boxData.getDY() * self.aspectRatio));
                    }
                }else{
                    self.boxData.setY0(self.operators[self.boxData.isFlippedY() ? "+" : "-"](self.boxData.getY1(), (self.boxData.getDX() / self.aspectRatio)));
                }
            }else{
                self.boxData.setX0(self.boxData.getX0() + e.dx);
                self.boxData.setY0(self.boxData.getY0() + e.dy);
            }
            self.update();
        })
            .on('dragend', self.dragEnd);
    }

    dragNE(){
        let self = this;
        return d3.behavior.drag().on('drag', function(){
            var e = d3.event;
            if(self.options.lockAspect && self.aspectRatio) {
                if(!self.isLimitReached() ||
                    (!self.boxData.isFlipped() && (e.dy > 0 || ((self.isSLimitReached() || self.isWLimitReached()) && !self.isELimitReached() && !self.isNLimitReached()))) ||
                    (self.boxData.isFlipped() && e.dy < 0)){
                    self.boxData.setY0(self.boxData.getY0() + e.dy);
                    if(self.boxData.getY0() < self.boxData.getY1()){
                        self.boxData.setX1(self.boxData.getX0() + (self.boxData.getDY() * self.aspectRatio));
                    }else{
                        self.boxData.setX1(self.boxData.getX0() - (self.boxData.getDY() * self.aspectRatio));
                    }
                }else{
                    self.boxData.setY0(self.operators[self.boxData.isFlippedY() ? "+" : "-"](self.boxData.getY1(), (self.boxData.getDX() / self.aspectRatio)));
                }
            }else{
                self.boxData.setX1(self.boxData.getX1() + e.dx);
                self.boxData.setY0(self.boxData.getY0() + e.dy);
            }

            self.update();
        }).on('dragend', self.dragEnd);
    }

    dragSW(){
        let self = this;
        return d3.behavior.drag().on('drag', function(){
            var e = d3.event;
            if(self.options.lockAspect && self.aspectRatio) {
                if(!self.isLimitReached() ||
                    (!self.self.boxData.isFlipped() && (e.dx > 0 || ((self.isNLimitReached() || self.isELimitReached()) && !self.isWLimitReached() && !self.isSLimitReached()))) ||
                    (self.self.boxData.isFlipped() && e.dx < 0) ){
                    self.self.boxData.setX0(self.boxData.getX0() + e.dx);
                    if(self.boxData.getX0() < self.boxData.getX1()) {
                        self.boxData.setY1(self.boxData.getY0() + (self.boxData.getDX() / self.aspectRatio));
                    }else{
                        self.boxData.setY1(self.boxData.getY0() - (self.boxData.getDX() / self.aspectRatio));
                    }
                }else{
                    self.boxData.setX0(self.operators[self.boxData.isFlippedX() ? "+" : "-"](self.boxData.getX1(), (self.boxData.getDY() * self.aspectRatio)));
                }
            }else{
                self.boxData.setX0(self.boxData.getX0() + e.dx);
                self.boxData.setY1(self.boxData.getY1() + e.dy);
            }

            self.update();
        }).on('dragend', self.dragEnd);
    }

    dragSE(){
        let self = this;
        return d3.behavior.drag().on('drag', function(){
            var e = d3.event;
            if(self.options.lockAspect && self.aspectRatio) {

                if(!self.isLimitReached() ||
                    (!self.boxData.isFlipped() && (e.dx < 0 || ((self.isNLimitReached() || self.isWLimitReached()) && !self.isELimitReached() && !self.isSLimitReached()))) ||
                    (self.boxData.isFlipped() && e.dx > 0)){
                    self.boxData.setX1(self.boxData.getX1() + e.dx);
                    if(self.boxData.getX0() < self.boxData.getX1()) {
                        self.boxData.setY1(self.boxData.getY0() + (self.boxData.getDX() / self.aspectRatio));
                    }else {
                        self.boxData.setY1(self.boxData.getY0() - (self.boxData.getDX() / self.aspectRatio));
                    }
                }else{
                    self.boxData.setX1(self.operators[!self.boxData.isFlippedX() ? "+" : "-"](self.boxData.getX0(), (self.boxData.getDY() * self.aspectRatio)));
                }
            }else{
                self.boxData.setX1(self.boxData.getX1() + e.dx);
                self.boxData.setY1(self.boxData.getY1() + e.dy);
            }

            self.update();
        }).on('dragend', self.dragEnd);
    }

    dragN(){
        let self = this;
        return d3.behavior.drag().on('drag', function(){
            var e = d3.event;

            if(self.options.lockAspect && self.aspectRatio) {
                if (!self.isLimitReached() ||
                    (!self.boxData.isFlippedY() && (e.dy > 0 || (self.isSLimitReached() && !self.isELimitReached() && !self.isWLimitReached() && !self.isNLimitReached()))) ||
                    (self.boxData.isFlippedY() && e.dy < 0)) {
                    self.boxData.setY0(self.boxData.getY0() + e.dy);
                    let middleX = self.boxData.getMiddleX();
                    self.boxData.setX0(middleX - (self.boxData.getDY() * self.aspectRatio) / 2);
                    self.boxData.setX1(middleX + (self.boxData.getDY() * self.aspectRatio) / 2);
                }else{
                    if(self.lastLimitedDY === 0) {
                        self.lastLimitedDY = self.boxData.getDY();
                    }
                    self.boxData.setY0(self.operators[self.boxData.isFlippedY() ? "+" : "-"](self.boxData.getY1(), (self.boxData.getDX() / self.aspectRatio)));
                    self.setToLimitedXDimensions();
                }
            } else {
                self.boxData.setY0(self.boxData.getY0() + e.dy);
            }

            self.update();
        }).on('dragend', self.dragEnd);
    }

    dragS(){
        let self = this;
        return d3.behavior.drag().on('drag', function(){
            var e = d3.event;
            if(self.options.lockAspect && self.aspectRatio){
                if(!self.isLimitReached() ||
                    (!self.boxData.isFlippedY() && (e.dy < 0 || (self.isNLimitReached() && !self.isELimitReached() && !self.isWLimitReached() && !self.isSLimitReached()))) ||
                    (self.boxData.isFlippedY() && e.dy > 0)) {
                    self.boxData.setY1(self.boxData.getY1() + e.dy);
                    let middleX = self.boxData.getMiddleX();
                    self.boxData.setX0(middleX - (self.boxData.getDY() * self.aspectRatio) / 2);
                    self.boxData.setX1(middleX + (self.boxData.getDY() * self.aspectRatio) / 2);
                }else{
                    if(self.lastLimitedDY === 0) {
                        self.lastLimitedDY = self.boxData.getDY();
                    }
                    self.boxData.setY1(self.operators[!self.boxData.isFlippedY() ? "+" : "-"](self.boxData.getY0(), (self.boxData.getDX() / self.aspectRatio)));
                    self.setToLimitedXDimensions();
                }
            } else {
                self.boxData.setY1(self.boxData.getY1() + e.dy);
            }
            self.update();
        }).on('dragend', self.dragEnd);
    }

    dragE(){
        let self = this;
        return d3.behavior.drag().on('drag', function(){
            var e = d3.event;
            if(self.options.lockAspect && self.aspectRatio) {

                if(!self.isLimitReached() ||
                    (!self.boxData.isFlippedX() && (e.dx < 0 || (self.isWLimitReached() && !self.isELimitReached() && !self.isSLimitReached() && !self.isNLimitReached()))) ||
                    (self.boxData.isFlippedX() && e.dx > 0)){
                    self.boxData.setX1(self.boxData.getX1() + e.dx);
                    let middleY = self.boxData.getMiddleY();
                    self.boxData.setY0(middleY - ((self.boxData.getDX() / self.aspectRatio) / 2));
                    self.boxData.setY1(middleY + ((self.boxData.getDX() / self.aspectRatio) / 2));
                }else{
                    if(self.boxData.lastLimitedDX === 0) {
                        self.boxData.lastLimitedDX = self.boxData.getDX();
                    }
                    self.boxData.setX1(self.operators[!self.boxData.isFlippedX() ? "+" : "-"](self.boxData.getX0(), (self.boxData.getDY() * self.aspectRatio)));
                    self.setToLimitedYDimensions();
                }
            } else{
                self.boxData.setX1(self.boxData.getX1() + e.dx);
            }

            self.update();
        }).on('dragend', self.dragEnd);
    }

    dragW(){
        let self = this;
        return d3.behavior.drag().on('drag', function(){
            var e = d3.event;
            if(self.options.lockAspect && self.aspectRatio) {
                if(!self.isLimitReached() ||
                    (!self.boxData.isFlippedX() && (e.dx > 0 || (self.isELimitReached() && !self.isSLimitReached() && !self.isWLimitReached() && !self.isNLimitReached()))) ||
                    (self.boxData.isFlippedX() && e.dx < 0)){
                    self.boxData.setX0(self.boxData.getX0() + e.dx);
                    let middleY = self.boxData.getMiddleY();
                    self.boxData.setY0(middleY - ((self.boxData.getDX() / self.aspectRatio) / 2));
                    self.boxData.setY1(middleY + ((self.boxData.getDX() / self.aspectRatio) / 2));
                }else{
                    if(self.boxData.lastLimitedDX === 0) {
                        self.boxData.lastLimitedDX = self.boxData.getDX();
                    }
                    self.boxData.setX0(self.operators[self.boxData.isFlippedX() ? "+" : "-"](self.boxData.getX1(), (self.boxData.getDY() * self.aspectRatio)));
                    self.setToLimitedYDimensions();
                }
            }else{
                self.boxData.setX0(self.boxData.getX0() + e.dx);
            }
            self.update();
        }).on('dragend', self.dragEnd);
    }

    //*******************************************/


}

window.vff.define("vff-transformable", VffTransformable);

