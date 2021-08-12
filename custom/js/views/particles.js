import * as THREE from 'https://cdn.skypack.dev/three@0.130.1';

/* --------------------------------- Shaders -------------------------------- */
const vertexshader1 = `
	attribute float scale;
	void main() {
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
		gl_PointSize = scale * ( 300.0 / - mvPosition.z );
		gl_Position = projectionMatrix * mvPosition;
	}
`;

const vertexshader2 = `
	attribute float scale;
	void main() {
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.1 );
		gl_PointSize = scale * ( 300.0 / - mvPosition.z );
		gl_Position = projectionMatrix * mvPosition;
	}
`;

const fragmentshader1 = `
	uniform vec3 color;
	void main() {
		if ( length( gl_PointCoord - vec2( 1, 1 ) ) > 0.475 ) discard;
		gl_FragColor = vec4( color, 1.0 );
	}
`;

const fragmentshader2 = `
	uniform vec3 color;
	void main() {
		if ( length( gl_PointCoord - vec2( 1, 1 ) ) > 0.475 ) discard;
		gl_FragColor = vec4( color, 1.0 );
	}
`;

/* ----------------------------- Main variables ----------------------------- */
const SEPARATION = 50;
const AMOUNTX = 50;
const AMOUNTY = 90;

let container;
let camera;
let scene;
let renderer;

let particles1;
let particles2;
let count = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Initialize
init();
animate();

/* -------------------------------- Functions ------------------------------- */
function init() {
	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(
		55,
		window.innerWidth / window.innerHeight,
		2000,
		5500
	);
	camera.position.z = 1000;

	scene = new THREE.Scene();

	const numParticles = AMOUNTX * AMOUNTY;

	const positions1 = new Float32Array(numParticles * 3);
	const scales1 = new Float32Array(numParticles);

	let i = 0,
		j = 0;

	for (let ix = 0; ix < AMOUNTX; ix++) {
		for (let iy = 0; iy < AMOUNTY; iy++) {
			positions1[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
			positions1[i + 1] = 0; // y
			positions1[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z

			scales1[j] = 1;

			i += 3;
			j++;
		}
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(positions1, 3));
	geometry.setAttribute('scale', new THREE.BufferAttribute(scales1, 1));

	const material1 = new THREE.ShaderMaterial({
		uniforms: {
			color: { value: new THREE.Color(0x0d8097) },
		},
		vertexShader: vertexshader1,
		fragmentShader: fragmentshader1,
	});

	const material2 = new THREE.ShaderMaterial({
		uniforms: {
			color: { value: new THREE.Color(0x622f88) },
		},
		vertexShader: vertexshader2,
		fragmentShader: fragmentshader2,
	});

	particles1 = new THREE.Points(geometry, material1);
	particles2 = new THREE.Points(geometry, material2);
	scene.add(particles1);
	scene.add(particles2);

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	const canvas = renderer.domElement;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(canvas);

	container.style.touchAction = 'none';
	container.id = 'projector';

	window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	// Slow down
	setTimeout(function () {
		requestAnimationFrame(animate);
	}, 1000 / 10);
	render();
}

function render() {
	camera.position.x = -2045;
	camera.position.y = 1000;
	camera.lookAt(scene.position);

	const positions1 = particles1.geometry.attributes.position.array;
	const scales1 = particles1.geometry.attributes.scale.array;

	let i = 0,
		j = 0;

	for (let ix = 0; ix < AMOUNTX; ix++) {
		for (let iy = 0; iy < AMOUNTY; iy++) {
			positions1[i + 1] =
				Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.2) * 50;

			scales1[j] =
				(Math.sin((ix + count) * 0.3) + 1) * 20 +
				(Math.sin((iy + count) * 0.2) + 1) * 20;

			i += 3;
			j++;
		}
	}

	particles1.geometry.attributes.position.needsUpdate = true;
	particles1.geometry.attributes.scale.needsUpdate = true;

	renderer.render(scene, camera);

	count += 0.1;
}
