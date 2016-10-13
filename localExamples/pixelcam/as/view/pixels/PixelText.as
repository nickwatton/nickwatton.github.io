package com.twomogscafe.pixelcam.view.pixels 
{
	import flash.display.Sprite;
	
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class PixelText extends PixelTemplate {
		
		private var txt:			TextField;
		private var fmt:			TextFormat;
		
		public function PixelText(character:String) {
			super(character);
		}
		
		override public function build(character:String):void{
			fmt = new TextFormat();
			fmt.size = 13;
			fmt.font = "Impact";
			
			txt = new TextField();
			txt.text = character ? character : "@";
			
			txt.textColor = colour;
			txt.selectable = false;
			txt.embedFonts = true;
			
			txt.setTextFormat(fmt);
			
			pixelGrfx = new Sprite();
			pixelGrfx.addChild(txt);
			addChild(pixelGrfx);
		}
	}
}