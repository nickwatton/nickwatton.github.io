package com.twomogscafe.pixelcam.view.pixels 
{
	import flash.display.Sprite;
	
	public class PixelBar extends PixelTemplate {
		
		public function PixelBar(character:String) {
			super(character);
		}
		
		override public function build(character:String):void {
			
			pixelGrfx = new Sprite();
			pixelGrfx.graphics.beginFill(colour);
			pixelGrfx.graphics.drawRect(0, 0, SIZE*1.8, SIZE*2);
			
			addChild(pixelGrfx);
		}
		
		override public function update(newScale:Number):void {
			pixelGrfx.scaleX = invert ? 1 - newScale : newScale;
			pixelGrfx.x = -pixelGrfx.width / 2;
		}
	}
}