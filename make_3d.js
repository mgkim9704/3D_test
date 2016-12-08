var width, height, renderer, scene, camera;
function init() {
width = window.innerWidth;
			height = window.innerHeight;
			
			renderer = new THREE.WebGLRenderer();
			renderer.setSize(width, height);
			document.body.appendChild(renderer.domElement);
			
			scene = new THREE.Scene();
			
			var angle=45;
			var aspect=width/height;
			var near=0.1;
			var far=10000;
			camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
			camera.position.set(0,0,1000);
			scene.add(camera);
			
			var light = new THREE.PointLight();
			light.position.set(1000,1000,1000);
			scene.add(light);
		}
