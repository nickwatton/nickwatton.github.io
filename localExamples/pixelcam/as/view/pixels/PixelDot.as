package com.twomogscafe.pixelcam.view.pixels 
{
	import flash.display.Sprite;
	
	public class PixelDot extends PixelTemplate {
		
		public function PixelDot(character:String) {
			super(character);
		}
		
		override public function build(character:String):void{
			pixelGrfx = new Sprite();
			pixelGrfx.graphics.beginFill(colour);
			
			pixelGrfx.graphics.drawCircle(SIZE, SIZE, SIZE);
			addChild(pixelGrfx);
		}
	}
}