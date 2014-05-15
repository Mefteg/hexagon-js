"use strict";

window.onload = function() {
	boot();
}

var WIDTH=640;
var HEIGHT=360;

var CONTAINER = null;

var STATS = null;
var STATS_ENABLE = true;

var RENDERER;
var SCENE;
var CAMERA;
var CAMERA_ANGLE = 0;
var CAMERA_DISTANCE = 30;
var POINT_LIGHT;

var VIEW_ANGLE=50;
var ASPECT=(WIDTH / HEIGHT);
var NEAR=0.1;
var FAR=1000;

var LOOKAT = new THREE.Vector3();

var DT = 1000 / 60;

var STEP = boot;
var STATE = "do";
var FIRST_TIME_IN_STATE = true;

var HEXAGON = null;

var GUI_VARIABLES = null;

// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, DT);
          };
})();

function animate() {
	
	if (STATS_ENABLE) {
		STATS.update();
	}

	requestAnimFrame(animate);

	STEP();
}

function boot() {
	console.log(">> Boot...");

	CONTAINER = document.getElementById("hexagon");

	if (STATS_ENABLE) {
		STATS = new Stats();
		STATS.domElement.style.position = 'absolute';
		STATS.domElement.style.marginTop = '0px';
		CONTAINER.appendChild(STATS.domElement);
	}

	RENDERER = new THREE.WebGLRenderer();

	RENDERER.setClearColor(0x444444, 1.0);
	RENDERER.setSize(WIDTH, HEIGHT);

	if (CONTAINER != null)
		CONTAINER.appendChild(RENDERER.domElement);
	else
		console.log("no container");

	STEP = load;
	STATE = "do";
	FIRST_TIME_IN_STATE = true;

	animate();
}

function load() {
	if (FIRST_TIME_IN_STATE == true) {
		console.log(">> Load...");
		
		FIRST_TIME_IN_STATE = false;

		STATE = "done";
	}

	if (STATE == "done") {
		STEP = create;
		STATE = "do";
		FIRST_TIME_IN_STATE = true;
	}
}

function create() {
	if (FIRST_TIME_IN_STATE == true) {
		console.log(">> Create...");

		// 3D

		// SCENE
		SCENE = new THREE.Scene();

		// CAMERA
		CAMERA = new THREE.PerspectiveCamera(
			VIEW_ANGLE, ASPECT,
			NEAR, FAR
		);

		LOOKAT = new THREE.Vector3(0, 0, 0);
		CAMERA.lookAt(LOOKAT);

		SCENE.add(CAMERA);

		// LIGHT
		var light = new THREE.SpotLight(0xffffff, 1.25);
	    light.position.x = -500;
	    light.position.y = 900;
	    light.position.z = 600;
	    light.target.position.set( 15 / 2, 0, 15 / 2 );

	    SCENE.add(light);

	    // AMBIENT LIGHT
		SCENE.add(new THREE.AmbientLight(0x808080));

		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);

		var axisHelper = new THREE.AxisHelper(15);
		SCENE.add( axisHelper );

		HEXAGON = new Hexagon();
		SCENE.add(HEXAGON.mesh);

		var hexa2 = new Hexagon();
		hexa2.mesh.position.x = 1.5;
		hexa2.mesh.position.z = 1;
		SCENE.add(hexa2.mesh);

		var hexa3 = new Hexagon();
		hexa3.mesh.position.x = 3;
		hexa3.mesh.position.z = 2;
		SCENE.add(hexa3.mesh);

		createGUI();

		STATE = "done";

		FIRST_TIME_IN_STATE = false;
	}

	if (STATE == "done") {
		STEP = updateAndRender;
		STATE = "do";
		FIRST_TIME_IN_STATE = true;
	}
}

function updateAndRender() {
	update();
	render();

	if (FIRST_TIME_IN_STATE == true) {
		FIRST_TIME_IN_STATE = false;
	}
}

function update() {
	if (FIRST_TIME_IN_STATE == true) {
		console.log(">> Update...");
	}

	CAMERA.position.x = Math.sin(GUI_VARIABLES.angle * 0.0174532925) * CAMERA_DISTANCE;
	CAMERA.position.y = GUI_VARIABLES.distance;
	CAMERA.position.z = Math.cos(GUI_VARIABLES.angle * 0.0174532925) * CAMERA_DISTANCE;
}

function render() {
	if (FIRST_TIME_IN_STATE == true) {
		console.log(">> Render...");
	}

	CAMERA.lookAt(LOOKAT);

	RENDERER.render(SCENE, CAMERA);
}

function onWindowResize() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

	CONTAINER.style.width = WIDTH+"px";
	CONTAINER.style.height = HEIGHT+"px";

	CAMERA.aspect = WIDTH / HEIGHT;
	CAMERA.updateProjectionMatrix();

	RENDERER.setSize(WIDTH, HEIGHT);
}

function createGUI() {
	GUI_VARIABLES = new Variables();

	var gui = new dat.GUI();

	var fSystem = gui.addFolder('System');
	fSystem.add(GUI_VARIABLES, 'start_stop');
	fSystem.add(GUI_VARIABLES, 'volume', 0, 1).step(0.1);
	fSystem.add(GUI_VARIABLES, 'refresh_time', 0, 200).step(10);

	fSystem.open();

	var fDeezer = gui.addFolder('Deezer');

	fDeezer.add(GUI_VARIABLES, 'daft_punk');
	fDeezer.add(GUI_VARIABLES, 'i_blame_coco');
	fDeezer.add(GUI_VARIABLES, 'song_id');
	fDeezer.add(GUI_VARIABLES, 'valid_song_id');

	fDeezer.open();

	var fCamera = gui.addFolder('Camera');
	fCamera.add(GUI_VARIABLES, 'angle', 0, 360).step(10);
	fCamera.add(GUI_VARIABLES, 'distance', 10, 50).step(5);

	fCamera.open();
}

var Variables = function() {
	this.start_stop = function() {
		if (PLAY == true) {
			SOURCE.stop();
		} else {
			SOURCE = AUDIO_CONTEXT.createBufferSource();
			SOURCE.buffer = AUDIO_BUFFER;
			SOURCE.connect(GAIN);
			SOURCE.start(0);
		}

		PLAY = !PLAY;
	}
	this.volume = 0.5;
	this.refresh_time = 50;

	this.angle = 0;
	this.distance = 25;

	this.daft_punk = function() {
		this.switchSource("3135556");
	};
	this.i_blame_coco = function() {
		this.switchSource("7217327");
	};
	this.song_id = "239070";
	this.valid_song_id = function() {
		if (GUI_VARIABLES.song_id.length >= 6) {
			this.switchSource(GUI_VARIABLES.song_id);
		}
	}

	this.switchSource = function(_songId) {
		SOURCE.stop();
		DZ.api("track/" + _songId, function(_response) {
			if (_response.readable == true) {
				SONG_INFOS = _response;

				var request = new XMLHttpRequest();
				request.open('GET', SONG_INFOS.preview, true);
				request.responseType = 'arraybuffer';

				// Decode asynchronously
				request.onload = function() {
					AUDIO_CONTEXT.decodeAudioData(request.response, function(buffer) {
						AUDIO_BUFFER = buffer;

						SOURCE = AUDIO_CONTEXT.createBufferSource();
						SOURCE.buffer = AUDIO_BUFFER;
						SOURCE.connect(GAIN);
						SOURCE.start(0);
					}, function(_error) {
						console.error(_error);
					});
				}
				request.send();
			}
		});
	}
};