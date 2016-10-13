package com.twomogscafe.pixelcam.view.pixels 
{
	import flash.display.Sprite;
	
	public class PixelTemplate extends Sprite {
		
		public static var SIZE:			int = 5;
		
		protected var pixelGrfx:		Sprite;
		protected var colour:			int = 0xFFFFFF;
		protected var invert:			Boolean;
		
		public function PixelTemplate(character:String) {
			invert = false;
			build(character);
		}
		
		public function build(character:String):void{
			// override this function
		}
		
		public function toggleInvert():void {
			invert = !invert;
		}
		
		public function update(newScale:Number):void {
			pixelGrfx.scaleX = pixelGrfx.scaleY = invert ? 1 - newScale : newScale;
		}
	}
}