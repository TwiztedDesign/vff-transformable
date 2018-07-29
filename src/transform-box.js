export default class TransformBox{
    constructor(bounding) {
        this.x0 = 0.0;
        this.y0 = 0.0;
        this.x1 = 1.0;
        this.y1 = 1.0;
        this.bounding = bounding;
        this.flippedX = false;
        this.flippedY = false;

    }

    limitX(value){
        return Math.max(0, Math.min(value, this.bounding.width));
    }
    limitY(value){
        return Math.max(0, Math.min(value, this.bounding.height));
    }

    getX0() { return this.x0 * this.bounding.width; }
    getY0() { return this.y0 * this.bounding.height; }
    getX1() { return this.x1 * this.bounding.width; }
    getY1() { return this.y1 * this.bounding.height; }
    setX0(value) {
        this.x0 = this.limitX(value) / this.bounding.width;
        let wasFlipped = this.flippedX;
        this.flippedX = this.x0 > this.x1;
        if (this.flippedX !== wasFlipped) {
            this.lastLimitedDX = 0;
        }
    }
    setY0(value){
        this.y0 = this.limitY(value) / this.bounding.height;
        let wasFlipped = this.flippedY;
        this.flippedY = this.y0 > this.y1;
        if(this.flippedY !== wasFlipped) {
            this.lastLimitedDY = 0;
        }
    }
    setX1(value){
        this.x1 = this.limitX(value) / this.bounding.width;
        let wasFlipped = this.flippedX;
        this.flippedX = this.x0 > this.x1;
        if(this.flippedX !== wasFlipped){
            this.lastLimitedDX = 0;
        }
    }
    setY1(value){
        this.y1 = this.limitY(value) / this.bounding.height;
        let wasFlipped = this.flippedY;
        this.flippedY = this.y0 > this.y1;
        if(this.flippedY !== wasFlipped) {
            this.lastLimitedDY = 0;
        }
    }
    isFlipped(){
        return this.flippedX && this.flippedY;
    }
    isFlippedX(){
        return this.flippedX;
    }
    isFlippedY(){
        return this.flippedY;
    }
    getDX(){
        return Math.abs(this.getX1() - this.getX0());
    }
    getDY(){
        return Math.abs(this.getY1() - this.getY0());
    }
    getPoints(){
        return {x0 : this.x0, y0 : this.y0, x1 : this.x1, y1 : this.y1};
    }
    getMiddleX(){
        return Math.min(this.getX0(), this.getX1()) + (this.getDX() / 2);
    }
    getMiddleY(){
        return Math.min(this.getY0(), this.getY1()) + (this.getDY() / 2);
    }
}