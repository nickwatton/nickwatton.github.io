var realUtils = {};

realUtils.FPS = function(){
    Object.defineProperty(this, 'display', { writable:true} );
    Object.defineProperty(this, 'frames', { value:0, writable:true} );
    Object.defineProperty(this, 'average', { value:[], writable:true} );
    Object.defineProperty(this, 'loop', { value:0, writable:true} );
    Object.defineProperty(this, 'num', { value:1, writable:true} );
    Object.defineProperty(this, 'timer', { writable:true} );
    var that = this;
    this.timer = setInterval( function(){
        that.calculate();
        that.updateView();
        that.resetCounts();
    }, 1000);
    console.log("sffsfs")
    this.display = document.createElement('div');
    this.display.style.cssText = 'padding-bottom:5px; zIndex:999999';
    this.display.innerHTML = 'FPS display';

    var insertHere = document.body;
    insertHere.insertBefore(this.display,insertHere.firstChild);
}
realUtils.FPS.prototype.calculate = function(){
    this.average.push(this.frames);
    this.loop = this.average.length;
    for (var i = 0; i < this.loop; i++){
        this.num += this.average[i];
    }
}
realUtils.FPS.prototype.updateView = function(){
    this.display.innerHTML = this.frames + ' fps [' + Math.round(this.num / this.average.length) + ' avrg]';
}
realUtils.FPS.prototype.resetCounts = function(){
    this.frames = 0;
    this.num = 0;
    if (this.loop > 30){
        this.average.splice(0, 5);
    }
}
realUtils.FPS.prototype.update = function(){
    this.frames += 1;
}
realUtils.FPS.prototype.stop = function(){
    this.display.innerHTML = 'FPS display: STOPPED';
}