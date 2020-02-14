/* Based on example created by Lee Stemkoski: https://github.com/stemkoski */

(function(){
    'use strict';
    
    const   mcos = Math.cos,
            mPI = Math.PI,
            mrandom = Math.random;
    const easeInOutSine = function (t, b, c, d) {
        return c/2 * (1 - mcos(mPI*t/d)) + b;
    }
    
    let scene, camera, renderer, clock, deltaTime, totalTime, 
    arToolkitSource, arToolkitContext, AR_Marker, 
    egg, 
    eggMeshed, 
    textureLoader = new THREE.TextureLoader(), textureURLs = [], textureNames = [], textureIDs = [],
    markerControls,
    particleSystem, particles, particleCount = 1000,
    
    font, textGeo1, textMesh1, textGeo2, textMesh2,
    textGeoParams = { size: 0.05, height: 0.0001, curveSegments: 4, bevelEnabled: false },
    textMaterial = new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0x333333, blending: THREE.AdditiveBlending }),
    textRotation = -90 * (Math.PI / 180);

    // Animation variables
    let eggBehaviour = 0, eggMinY = -.75, eggMaxY = 0, eggStep = 0.01, eggTick = 0, eggTime = 100, eggDisplayTime=7500, eggHideTime=750;


    function initThree(){
        scene = new THREE.Scene();
        camera = new THREE.Camera();
        camera.position.set(0, -0.02, 0);
        // camera.position.set(0, 0, 0);
        scene.add(camera);

        // scene.fog = new THREE.Fog( 0xff6633, 2, 10 );
    
        renderer = new THREE.WebGLRenderer({
            antialias : true,
            alpha: true
        });
        renderer.shadowMap.enabled = true;
        renderer.localClippingEnabled = true;
        renderer.setClearColor(new THREE.Color('lightgrey'), 0);
        renderer.setSize( 640, 640 );
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0px';
        renderer.domElement.style.left = '0px';

        document.body.appendChild( renderer.domElement );
    
        clock = new THREE.Clock();
        deltaTime = 0;
        totalTime = 0;
    }
    function initAR(){
        // setup arToolkitSource
        arToolkitSource = new THREEx.ArToolkitSource({
            sourceType : 'webcam',
        });
        
        arToolkitSource.init(function onReady(){ onResize() });
        window.addEventListener('resize', function(){ onResize() });

        // create atToolkitContext
        arToolkitContext = new THREEx.ArToolkitContext({
            cameraParametersUrl: 'data/camera_para.dat',
            detectionMode: 'mono'
        });

        // copy projection matrix to camera when initialization complete
        arToolkitContext.init( function onCompleted(){
            camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
        });

         // build markerControls
        AR_Marker = new THREE.Group();
        scene.add(AR_Marker);
        markerControls = new THREEx.ArMarkerControls(arToolkitContext, AR_Marker, {
            type: 'pattern', patternUrl: "data/hiro.patt",
        });
    }
    function buildScene(){
        /* Base geometry */
        let floorGeometry = new THREE.PlaneBufferGeometry(1.0,1.0, 2, 2);
        let floorMaterial = new THREE.MeshBasicMaterial({ 
            transparent : true,
            opacity: 0.2,  // For placement
            side: THREE.FrontSide,
            // color: 0xff0000,
            // color: 0xb5b5b5,
            color: 0xff4411
        });
        let floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );
        floorMesh.rotation.x = -Math.PI/2;
        floorMesh.receiveShadow = true;
        AR_Marker.add( floorMesh );

        // Cheap neat grid
        // let gridHelper = new THREE.GridHelper( 1, 20, 0x444444, 0x888888 );
        // AR_Marker.add( gridHelper );

        // The pit
        let eggPitGeometry	= new THREE.CubeGeometry(1,1,1, 1,1,1);
        let pitTexture = textureLoader.load( 'images/tiles.jpg', render );
        let pitMaterial	= new THREE.MeshLambertMaterial({
            transparent : true,
            map: pitTexture,
            // wireframe: true,
            side: THREE.BackSide,
            color: 0xbababa
        }); 
        let pitMesh = new THREE.Mesh( eggPitGeometry, pitMaterial );
        pitMesh.position.y = -eggPitGeometry.parameters.height / 2;
        AR_Marker.add( pitMesh );

        // Matte to hide egg under floor (plane with a hole)
        let matteGeometry = new THREE.PlaneGeometry(9.05,9.05, 9,9);
        matteGeometry.faces.splice(80, 2); // make hole by removing top two triangles
        matteGeometry.faceVertexUvs[0].splice(80, 2);
        let matteMaterial = new THREE.MeshBasicMaterial({
            // opacity: 0.01,  // For placement
            // color: 0xff3366,// For placement
            colorWrite: false
        });
        let floorMatteMesh = new THREE.Mesh( matteGeometry, matteMaterial );
        floorMatteMesh.rotation.x = -Math.PI/2;
        AR_Marker.add(floorMatteMesh);
        
        // addParticles();

        addTextGeometry();
        
        /* Lighting */
        let directionalLight_main = new THREE.DirectionalLight(0xffffff, 2);  // main light
        directionalLight_main.position.x = 10;
        directionalLight_main.position.y = 15;
        directionalLight_main.position.z = 20;
        directionalLight_main.lookAt(0, 0, 0);

        directionalLight_main.castShadow = true;
        directionalLight_main.shadow.camera.near = 1;
        directionalLight_main.shadow.camera.far = 10;
        directionalLight_main.shadow.camera.right = 1;
        directionalLight_main.shadow.camera.left = - 1;
        directionalLight_main.shadow.camera.top	= 1;
        directionalLight_main.shadow.camera.bottom = - 1;
                
        AR_Marker.add(directionalLight_main);

        let directionalLight_secondary = new THREE.DirectionalLight(0xffffff, .5);  // back-fill light
        directionalLight_secondary.position.x = -10;
        directionalLight_secondary.position.y = 15;
        directionalLight_secondary.position.z = 5;
        directionalLight_secondary.lookAt(0, 0, 0);
        
        directionalLight_secondary.castShadow = true;
        directionalLight_secondary.shadow.camera.near = 1;
        directionalLight_secondary.shadow.camera.far = 10;
        directionalLight_secondary.shadow.camera.right = 1;
        directionalLight_secondary.shadow.camera.left = - 1;
        directionalLight_secondary.shadow.camera.top	= 1;
        directionalLight_secondary.shadow.camera.bottom = - 1;

        AR_Marker.add(directionalLight_secondary);

        let light = new THREE.AmbientLight(0x505050); // soft white light
        AR_Marker.add(light);
        /* Setup basic lighting complete*/
    }

    function addTextGeometry(){
        let loader = new THREE.FontLoader();
        loader.load( 'fonts/helvetiker_regular.typeface.json', function ( response ) {
            font = response;
            textGeoParams.font = font;
            createText();
        } );
    }
    function createText(copy1='', copy2=''){
        textGeoParams.size = 0.04;
        textGeo1 = new THREE.TextGeometry('"'+copy1+'"', textGeoParams);
        textGeo1.computeBoundingBox();
        textGeo1.computeVertexNormals();
        fixTextSideNormals(textGeo1);
        textGeo1 = new THREE.BufferGeometry().fromGeometry( textGeo1 );
        textMesh1 = new THREE.Mesh( textGeo1, textMaterial );
        
        textGeoParams.size = 0.03;
        textGeo2 = new THREE.TextGeometry(copy2, textGeoParams);
        textGeo2.computeBoundingBox();
        textGeo2.computeVertexNormals();
        fixTextSideNormals(textGeo2);

        textGeo2 = new THREE.BufferGeometry().fromGeometry( textGeo2 );
        textMesh2 = new THREE.Mesh( textGeo2, textMaterial );
        
        let centerOffset = - 0.5 * ( textGeo1.boundingBox.max.x - textGeo1.boundingBox.min.x );
        textMesh1.position.x = centerOffset;
        centerOffset = - 0.5 * ( textGeo2.boundingBox.max.x - textGeo2.boundingBox.min.x );
        textMesh2.position.x = centerOffset;

        textMesh1.position.y = textMesh2.position.y = 0.01;
        textMesh1.position.z = .625;
        textMesh2.position.z = textMesh1.position.z + 0.05;
        textMesh1.rotation.x = textMesh2.rotation.x = textRotation;

        AR_Marker.add(textMesh1);
        AR_Marker.add(textMesh2);
    }
    function fixTextSideNormals(txtGeo){
        let triangle = new THREE.Triangle();
        // "fix" side normals by removing z-component of normals for side faces
        // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
        if ( ! txtGeo.bevelEnabled ) {
            let triangleAreaHeuristics = 0.1 * ( txtGeo.height * txtGeo.size );
            for ( let i = 0; i < txtGeo.faces.length; i ++ ) {
                let face = txtGeo.faces[ i ];
                if ( face.materialIndex == 1 ) {
                    for ( let j = 0; j < face.vertexNormals.length; j ++ ) {
                        face.vertexNormals[ j ].z = 0;
                        face.vertexNormals[ j ].normalize();
                    }
                    let va = txtGeo.vertices[ face.a ];
                    let vb = txtGeo.vertices[ face.b ];
                    let vc = txtGeo.vertices[ face.c ];
                    let s = triangle.set( va, vb, vc ).getArea();
                    if ( s > triangleAreaHeuristics ) {
                        for ( let j = 0; j < face.vertexNormals.length; j ++ ) {
                            face.vertexNormals[ j ].copy( face.normal );
                        }
                    }
                }
            }
        }
    }
    function updateText(copy1, copy2){
        if(copy1 === undefined) return;
        AR_Marker.remove(textMesh1);
        AR_Marker.remove(textMesh2);
        createText(copy1, copy2);
    }

    function addParticles(){
        // Particles
        let pSpanX = 0.3,
        pSpanY = 4,
        pSpanZ = 0.3,
        // pTexture = textureLoader.load( 'images/particle.png', render ),
        pMaterial = new THREE.PointsMaterial({
            color: 0xc30000,
            size: 0.01,
            // map: pTexture,
            blending: THREE.MultiplyBlending,
            transparent: true
        });
        particles = new THREE.Geometry();
        for(let p = 0; p < particleCount; p++) {
        let pX = Math.sin(p) * pSpanX, //  - (pSpanX * .5),
            pY = mrandom() * pSpanY,// - pSpanY,
            pZ = Math.cos(p) * pSpanZ, // - (pSpanZ * .5),
            particle = new THREE.Vector3(pX, pY, pZ);
            particle.velocity = new THREE.Vector3(0, Math.random()*5, 0);
            particles.vertices.push(particle);
        }
        particleSystem = new THREE.Points(particles, pMaterial);
        AR_Marker.add(particleSystem);
    }

    function loadModel(){
        let gLTFloader = new THREE.GLTFLoader();
        gLTFloader.load('models/egg.gltf', function (gltf) {
            if (gltf.scene.children && Array.isArray(gltf.scene.children) && gltf.scene.children.length > 0 && gltf.scene.children[0].name === "Egg") {
                egg = gltf.scene.children[0];
                egg.castShadow = true;
                eggMeshed = egg.clone();
                eggMeshed.position.x = -.5;
                updateTexture('images/blank.png', true);
            }
        });
    }
    
    function loadTextureURLs(){
        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
        };
        fetch("https://project-egg.azurewebsites.net/api/eggs")
            .then(response => response.text())
            .then(result => {
                let data = JSON.parse(result);
                for (var i = 0; i < data.eggs.length; i++) {
                    textureURLs.push(data.eggs[i].textureImageUrl);
                    textureNames.push (data.eggs[i].title);
                    textureIDs.push (data.eggs[i].author);
                }
                // When textures are ready, kick it off!
            })
            .catch(error => console.log('error', error));
    }
    function pickRandomTexture(){
        let id = Math.floor(Math.random() * textureURLs.length);
        updateTexture(textureURLs[id]);
        updateText(textureNames[id],textureIDs[id]);
    }
    function updateTexture(img, initial=false){
        textureLoader.load(img,  (texture) => {
            texture.wrapS = THREE.RepeatWrapping; //stops unwanted stretching
            texture.wrapT = THREE.RepeatWrapping; //stops unwanted stretching
            texture.repeat.y = -1; //flip texture vertically;
            try {
                egg.material.map.dispose();
            } catch (error) { /* {[*_*]} */ }
            // egg.material.clippingPlanes = [ localPlane ];
            egg.material.map = texture;

            eggMeshed.material = egg.material.clone();
            eggMeshed.material.wireframe = true;

            // egg.material.needsUpdate = true;
            egg.castShadow = true;
            
            if(initial){
                pickRandomTexture();
                eggBehaviour = 1;
                // egg.material.wireframe = true;
                AR_Marker.add(egg);
                // AR_Marker.add(eggMeshed);
            }
        });
    }

    function onResize(){
        arToolkitSource.onResizeElement();
        arToolkitSource.copyElementSizeTo(renderer.domElement)	;
        if ( arToolkitContext.arController !== null ){
            arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)	
        }
    }

    function eggAnimation(){
        switch(eggBehaviour){
            case 0:
                break;
            case 1:
                driftUp();
                break;
            case 2:
                driftDown();
                break;
        }
        egg.rotation.y += 0.01;
        eggMeshed.rotation.y = egg.rotation.y;
        eggMeshed.position.y = egg.position.y;
    }
    function driftUp(){
        if(egg.position.y <= eggMaxY){
            egg.position.y += eggStep;
        }
        else{
            eggBehaviour = 0;
            setTimeout(() => { eggBehaviour = 2; }, eggDisplayTime);
        }
        // if(egg.position.y <= eggMaxY){
        // 	egg.position.y = easeInOutSine(eggTick++, eggMinY, eggMaxY, eggTime);
        // }
        // else{
        // 	eggBehaviour = 0;
        // 	eggTick = 0;
        // 	setTimeout(() => { eggBehaviour = 2; }, eggDisplayTime);
        // }
    }
    function driftDown(){
        if(egg.position.y >= eggMinY){
            egg.position.y -= eggStep;
        }
        else{
            eggBehaviour = 0;
            setTimeout(() => { pickRandomTexture(); eggBehaviour = 1; }, eggHideTime);
        }
        // if(egg.position.y >= eggMinY){
        // 	egg.position.y = easeInOutSine(eggTick++, eggMaxY, eggMinY, eggTime);
        // }
        // else{
        // 	eggBehaviour = 0;
        // 	eggTick = 0;
        // 	setTimeout(() => { pickRandomTexture(); eggBehaviour = 1; }, eggHideTime);
        // }
    }

    function updateParticles(){
        // particleSystem.rotation.y -= 0.1;
        let pCount = particleCount, particle;
        while (pCount--) {
            particle = particles.vertices[pCount];
            if (particle.y >= 0.05) {
                particle.y = -0.5;
                particle.velocity.y = 0;
            }
            particle.velocity.y += Math.random() * .0001;
            particle.add(particle.velocity);

        }
        // Flag to updtae geometry
        particleSystem.geometry. verticesNeedUpdate = true;
    }
    
    function update(){
        if ( arToolkitSource.ready !== false ){
            arToolkitContext.update( arToolkitSource.domElement );
        }
        if (egg) {
            eggAnimation();
        }
        if(particleSystem){
            updateParticles();
        }
    }
    function render(){
        renderer.render( scene, camera );
    }
    function animate(){
        requestAnimationFrame(animate);
        deltaTime = clock.getDelta();
        totalTime += deltaTime;
        update();
        render();
    }
    
    initThree();
    initAR();
    buildScene();
    loadModel();
    loadTextureURLs();
    animate();
}());
