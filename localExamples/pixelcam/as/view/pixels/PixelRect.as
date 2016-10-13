package com.twomogscafe.pixelcam.view.pixels 
{
	import flash.display.Sprite;
	
	public class PixelRect extends PixelTemplate {
		
		private var spin:			Boolean;
		private var randomScale:	Boolean;
		
		public function PixelRect(character:String) {
			super(character);
		}
		
		override public function build(character:String):void {
			
			spin = false;
			randomScale = false;
			
			var sizeScalar:int = randomScale? 2 + getRandom(2) : 2;
			
			pixelGrfx = new Sprite();
			pixelGrfx.graphics.beginFill(getRandom(colour));
			pixelGrfx.graphics.drawRect(0, 0, SIZE * sizeScalar, SIZE * sizeScalar);
			
			if(spin){
				pixelGrfx.rotation = getRandom(90) - 45;
			}
			addChild(pixelGrfx);
		}
		
		private function getRandom(seed:int):int {
			return Math.random() * seed;
		}
	}
}