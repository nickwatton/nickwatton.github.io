(function(){
    'use strict';

    var width=500, height=280,
    wrapper = get("wrapper"),

    padding=10, halfPad=padding*.5,
    totalFiles=0, fileLoadedCount=0,
    packer=new GrowingPacker(), blocks=[],

    welcomeMsg="Drop your images here.",
    loadErrorMsg="File load error. Please try again.",
    binErrorMsg="Sorry, bin packing failed. Please try again.",

    cssStringHead=  ".sprite{<br />\
                    &nbsp;&nbsp;&nbsp;background-image: url(spritesheet.png);<br />\
                    &nbsp;&nbsp;&nbsp;background-repeat: no-repeat;<br />\
                    &nbsp;&nbsp;&nbsp;display: block;<br />\
                }<br />",
    cssString="",

    ctx, canvas;

    function setupCanvas(){
        canvas = createCanvas('canvas', width, height);
        ctx = canvas.getContext('2d');

        ctx.fillStyle="#666666";
        ctx.font = '14pt Arial';
        canvasMessage(welcomeMsg, 30, 130, true);

        wrapper.appendChild(canvas);

        // To enable drag and drop
        canvas.addEventListener("dragover", function (evt) {
            evt.preventDefault();
        }, false);

        // Handle dropped image file - only Firefox and Google Chrome
        canvas.addEventListener("drop", function (evt) {
            resetForUpload();
            var files = evt.dataTransfer.files;
            totalFiles = files.length;
            if (files.length > 0) {
                for(var i=0; i<files.length;i++){
                    var file = files[i];
                    // console.log(file.name, file.type, Math.round(file.size/1024)+"kb" );

                    if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
                        var reader = new FileReader();
                        reader.onload = fileLoaded;
                        reader.onerror = fileLoadError;
                        reader.onabort = fileLoadError;
                        reader.onprogress = fileLoadProgress;
                        reader.fileName = file.name;
                        reader.readAsDataURL(file);
                    }
                    else{
                        totalFiles -= 1;
                        console.log("Unsupported file (" + file.name +") ignored");
                    }
                }
            }
            evt.preventDefault();
        }, false);
    }

    function resetForUpload(){
        totalFiles=0;
        fileLoadedCount=0;
        blocks=[];
    }

    function fileLoadProgress(e){
        //console.log("fileLoadProgress", ((e.loaded * 100)/e.total) + "%");
    }

    function fileLoadError(e){
        canvasMessage(loadErrorMsg, 30, 130, true);
    }

    function fileLoaded(e){
        var img = new Image();
        img.src = e.target.result;
        blocks.push( {w:img.width+padding, h:img.height+padding, img:img, filename:this.fileName} );
        checkAllLoaded();
    }

    function checkAllLoaded(){
        fileLoadedCount+=1;
        if(fileLoadedCount === totalFiles){
            doPacking();
        }
    }

    function doPacking(){
        var newWidth=0, newHeight=0, blocksWithFit=0;

        // sort objects for better packing performance
        blocks.sort(function(obj1, obj2){
            var p1 = Math.max(obj1.h,obj1.w);
            var p2 = Math.max(obj2.h,obj2.w);
            return Number(p2) - Number(p1);
        });
        packer.fit(blocks);
        for(var n=0; n<blocks.length; n++) {
            var block = blocks[n];
            if (block.fit) {
                blocksWithFit+=1;
                if(block.fit.x + block.w > newWidth){
                    newWidth = block.fit.x + block.w;
                }
                if(block.fit.y + block.h > newHeight){
                    newHeight = block.fit.y + block.h;
                }
            }
        }
        if(blocksWithFit < blocks.length){
            canvasMessage(binErrorMsg, 30, 130, true);
        }
        else{
            resizeCanvas(newWidth, newHeight);
            draw();
        }
    }

    function resizeCanvas(w,h){
        width = canvas.width = w;
        height = canvas.height = h;
    }

    function draw(){
        ctx.clearRect(0,0,width,height);
        cssString = cssStringHead;
        for(var n=0; n<blocks.length; n++) {
            var block = blocks[n],
            className = block.filename.split(" ").join("").split(".")[0].trim();
            cssString += "  .sprite_" + className + "{<br />\
                            &nbsp;&nbsp;&nbsp;width: "+block.w+"px;<br />\
                            &nbsp;&nbsp;&nbsp;height: "+block.h+"px;<br />\
                            &nbsp;&nbsp;&nbsp;background-position: -"+block.fit.x+"px -"+block.fit.y+"px;<br />\
                            }<br />";
            ctx.drawImage(block.img, block.fit.x+halfPad, block.fit.y+halfPad, block.w-padding, block.h-padding);
        }
        get("cssBox").innerHTML = cssString;
    }

    function canvasMessage(msg, x, y, clear){
        if(clear){
            ctx.clearRect(0,0,width,height);
        }
        ctx.fillText(msg, x, y);
    }

    window.onload = function() {
        if (window.File && window.FileReader && window.FileList && window.Blob){
            setupCanvas();
        }
        else{
            wrapper.innerHTML = "File API is not supported";
        }
    };

    //
    /* Helpers */
    function createCanvas(id, w, h){
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.id = id;
        return canvas;
    }

    function get(id){
        return document.getElementById(id);
    }

}());