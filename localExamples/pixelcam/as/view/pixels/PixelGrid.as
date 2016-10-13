package com.twomogscafe.pixelcam.view.pixels 
{
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.geom.Point;
	
	public class PixelGrid extends Sprite {
		
		private var WHITE_VALUE:	Number = 16777215;
		private var size:			int = 11;
		private var w:				int;
		private var h:				int;
		private var pixels:			Array = [];
		private var pixelCoord:		Array = [];
		
		private var characters:		Array = [];
		private var charSplit:		Array = [];
		private var characterSet:	String = "TwoMogsCafe";
		private var concatLoop:		int;
		
		private var pixel:			*;
		private var loop:			uint;
		private var i:				int;
		private var pX:				uint;
		private var pY:				uint;
		private var percent:		Number;
		
		private var runAsText:		Boolean;
		private var runAsDot:		Boolean;
		
		public function PixelGrid(stage:Stage, runastext:Boolean = false, runasdot:Boolean = true) {
			
			runAsText = runastext;
			runAsDot = runasdot;
			
			size = PixelTemplate.SIZE * 2;
			
			w = Math.ceil(stage.stageWidth / size);
			h = Math.ceil(stage.stageHeight / size);
			loop =  w * h;
			
			if(runAsText){
				charSplit = characterSet.split("");
				concatLoop = charSplit.length;
				ensureEnoughCharacters();
			}else {
				buildGrid();
			}
		}
		
		private function ensureEnoughCharacters():void {
			if (characters.length > loop) {
				buildGrid();
			} else {
				for (i = 0; i < concatLoop; i++){
					characters.push(charSplit[i]);
				}
				ensureEnoughCharacters();
			}
		}
		
		private function buildGrid():void {
			var pt:Point;
			for (i = 0; i < loop; i++) {
				if(runAsText){
					pixel = new PixelText(characters[i]);
				} else {
					pixel = runAsDot ? new PixelBar("") : new PixelRect("");
				}
				
				pt = new Point(((i % w) * size), (Math.floor(i / w) * size));
				pixel.x = pt.x;
				pixel.y = pt.y;
				
				pixelCoord.push(pt);
				pixels.push(pixel);
				
				addChild(pixel);
			}
		}
		
		public function toggleInvert():void {
			for (i = 0; i < loop; i++) {
				pixels[i].toggleInvert();
			}
		}
		
		public function update(_data:BitmapData):void {
			for (i = 0; i < loop; i++) {
				pixel = pixels[i];
				percent = _data.getPixel(pixelCoord[i].x, pixelCoord[i].y) / WHITE_VALUE;
				pixel.update(percent);
			}
		}
	}
}