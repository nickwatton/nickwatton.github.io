(function(){
    const scene = new THREE.Scene();
    const aspect = 1;
    const depth = 0.45;
	const size = 512;//512;
	const thumbSize = 128; // 256
    const perspectiveCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const camera = perspectiveCamera;
    const renderer = new THREE.WebGLRenderer({ alpha:true, preserveDrawingBuffer:true });
    let egg, dataURL;
	
	const previewThumbCanvas = document.querySelector('#preview-thumb');
	const previewThumbCTX = previewThumbCanvas.getContext('2d');
	previewThumbCanvas.width = previewThumbCanvas.height = thumbSize;
	
	const textureFlag = document.querySelector('#texture-flag');
	textureFlag.addEventListener('change', (e) => gatherTexture(e));

    renderer.setSize(size, size);
    renderer.shadowMap.enabled = true;
	const domElement = document.querySelector('#preview')
	domElement.appendChild(renderer.domElement);
	domElement.addEventListener('mousemove', (e) => updateRotation(e) );
	domElement.addEventListener('mouseout', () => renderToImage() );
	
    // Instantiate a loader
    const gLTFloader = new THREE.GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
	
	const imgOut = document.createElement('img');
	const canvasOut = document.querySelector('#output-preview');
	const ctxOut = canvasOut.getContext('2d');
	canvasOut.width = canvasOut.height = size;
	
	imgOut.onload = () => ctxOut.drawImage(imgOut, 0,0, size, size);
	
	function gatherTexture(e){
		const generatedTexture = document.querySelector('.output-image img');
		updateTexture(generatedTexture.src);
	}
	function updateTexture(img){
		textureLoader.load(img,  (texture) => {
			/* Replace texture */
			texture.wrapS = THREE.RepeatWrapping; //stops unwanted stretching
			texture.wrapT = THREE.RepeatWrapping; //stops unwanted stretching
			texture.repeat.y = -1; //flip texture vertically;

			try {
				egg.material.map.dispose();
			} catch (error) { /* {[*_*]} */ }
			egg.material.map = texture; // any texture
			egg.material.needsUpdate = true;
			/* Replace texture complete */
			
			renderToImage();
		});
	}
	
	function renderToImage(){
		/* Render the scene to DOM */
		renderScene();
		dataURL = renderer.domElement.toDataURL();
		imgOut.src = dataURL;
		
		// Save the thumb
		previewThumbCTX.drawImage(renderer.domElement, 0, 0, thumbSize, thumbSize);
	}
	
    gLTFloader.load('egg-UV.gltf', function (gltf) {
        if (gltf.scene.children && Array.isArray(gltf.scene.children) && gltf.scene.children.length > 0 & gltf.scene.children[0].name === "Egg") {
            egg = gltf.scene.children[0];
            textureLoader.load('images/blank.png', function (texture) {
                /* Replace texture */
                texture.wrapS = THREE.RepeatWrapping; //stops unwanted stretching
                texture.wrapT = THREE.RepeatWrapping; //stops unwanted stretching
				texture.repeat.y = -1; //flip texture vertically;
				
				egg.material = new THREE.MeshStandardMaterial({
					color: 0xffffff,
					side: THREE.DoubleSide
				});

                try {
					egg.material.map.dispose();
				} catch (error) { /* {[*_*]} */ }
                egg.material.map = texture; // any texture
                egg.material.needsUpdate = true;
                /* Replace texture complete */

                /* Setup basic lighting */
                var directionalLight = new THREE.DirectionalLight(0xffffff, .8);  //main light
                directionalLight.position.x = 10;
                directionalLight.position.y = 15;
                directionalLight.position.z = 10;
                directionalLight.lookAt(0, 0, 0);
                directionalLight.castShadow = true;
                scene.add(directionalLight);

                //Set up shadow properties for the light
                directionalLight.shadow.mapSize.width = 1024;  // default
                directionalLight.shadow.mapSize.height = 1024; // default
                directionalLight.shadow.camera.near = 0.15;    // default
                directionalLight.shadow.camera.far = 5000;     // default

                var light = new THREE.AmbientLight(0x505050); // soft white light
                scene.add(light);
                /* Setup basic lighting complete*/

                /* Enable if Perspective */
                camera.position.set(0, 0.125, 0.9)
                camera.lookAt(new THREE.Vector3(0, 0.5, -1));
                /* Enable if Perspective - End */

				egg.rotation.y = Math.PI * 1.5;
                scene.add(egg);
				
				renderer.domElement.classList.add('ready');
				renderToImage();
            });
        }
    });

	function map(v, i1, i2, o1, o2){
		return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
	}
	
	function updateRotation(e){
		if (egg) {
			egg.rotation.y = map(e.offsetX, 0, size, 0, Math.PI);
		}
		renderScene();
	}
	
	const renderScene = function(){
		renderer.render(scene, camera);
	};
	
}());