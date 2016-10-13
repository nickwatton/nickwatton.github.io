package com.twomogscafe.pixelcam {
	
	import com.twomogscafe.pixelcam.view.pixels.PixelGrid;
	import com.twomogscafe.ui.button.events.SimpleGraphicButtonEvent;
	import com.twomogscafe.ui.button.SimpleGraphicBttn;
	import com.twomogscafe.video.Webcam;
	import com.twomogscafe.video.WebcamData;
	
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.BlendMode;
	import flash.display.Shader;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.ShaderFilter;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.ByteArray;
	
	[SWF(width = "640", height = "480", frameRate = "30", backgroundColor = "#000000")]
	
	public class Application extends Sprite {
		
		private var webcam:				Webcam;
		private var webcamData:			WebcamData;
		private var camBitmapData:		BitmapData;
		private var output:				Bitmap;
		private var displayCam:			Boolean;
		private var displayOutput:		Boolean;
		
		private var gridHolder			:Sprite = new Sprite();
		private var grid:				PixelGrid;
		private var gridType:			int = 0;
		
		private var cameraW:			int = 640;
		private var cameraH:			int = 480;
		
		public function Application() 
		{
			addEventListener(Event.ADDED_TO_STAGE, addedToStage, false, 0, true);
		}
		
		private function addedToStage(e:Event):void 
		{
			removeEventListener(Event.ADDED_TO_STAGE, addedToStage);
			
			displayCam		=	false;
			displayOutput	=	false;
			
			addChild(gridHolder);
			setupWebcam();
		}
		
		private function setupWebcam():void {
			webcamData = new WebcamData(cameraW, cameraH);
			webcam = new Webcam(webcamData);
			
			if (webcam.webcam) {
				init();
			}else {
				trace(WebcamData.CAMERA_NULL);
			}
		}
		
		private function init() {
			setupWebcamFilter();
			
			if (displayCam) {
				addChild(webcam);
			}
			if (displayOutput) {
				addChild(output);
			}
			
			buildInterface();
			buildGrid();
			
			addEventListener(Event.ENTER_FRAME, doEF, false, 0, true);
		}
		
		private function setupWebcamFilter():void {
			camBitmapData = new BitmapData(cameraW, cameraH, false, 0 );
			output = new Bitmap(camBitmapData);
		}
		
		private function buildGrid():void {
			
			if (grid != null) {
				removeGrid();
			}
			
			switch(gridType) {
				case 0:
					grid = new PixelGrid(stage, true, false);
					break;
				case 1:
					grid = new PixelGrid(stage, false, true);
					break;
				case 2:
					grid = new PixelGrid(stage, false, false);
					break;
				default:
					grid = new PixelGrid(stage, false, false);
					break;
			}
			
			gridType = gridType == 2 ? 0 : gridType + 1;
			
			gridHolder.addChild(grid);
		}
		
		private function removeGrid():void {
			gridHolder.removeChild(grid);
		}
		
		private function buildInterface():void {
			var toggle:SimpleGraphicBttn = new SimpleGraphicBttn();
			var next:SimpleGraphicBttn = new SimpleGraphicBttn();
			
			toggle.x = 5;
			next.x = toggle.x + toggle.width + 5;
			
			toggle.y = cameraH - toggle.height - 5;
			next.y = cameraH - next.height - 5;
			
			toggle.addEventListener(SimpleGraphicButtonEvent.UP, onToggle, false, 0, true);
			next.addEventListener(SimpleGraphicButtonEvent.UP, onNext, false, 0, true);
			
			addChild(toggle);
			addChild(next);
		}
		
		private function onToggle(e:SimpleGraphicButtonEvent):void {
			grid.toggleInvert();
		}
		private function onNext(e:SimpleGraphicButtonEvent):void {
			buildGrid();
		}
		
		private function doEF(e:Event):void {
			camBitmapData.draw(webcam);
			grid.update(camBitmapData);
		}
	}
}