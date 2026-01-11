// RocketGoal 3D Game (Three.js + Cannon.js)

// --- Global variables ---
let scene, camera, renderer;
let world;
let ballBody, carBody, carMesh, ballMesh;
let scoreA = 0, scoreB = 0;

// --- Init ---
init();
animate();

function init() {
  // Three.js scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Physics
  world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);

  // Floor
  createFloor();
  createWalls();

  // Ball
  createBall();

  // Player Car
  createCar();

  // Lights
  let light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  window.addEventListener("keydown", keyDown);
}

// --- Create arena floor ---
function createFloor() {
  const floorShape = new CANNON.Plane();
  const floorMat = new CANNON.Material();
  let floorBody = new CANNON.Body({ mass: 0, material: floorMat });
  floorBody.addShape(floorShape);
  floorBody.quaternion.setFromEuler(-Math.PI/2, 0, 0);
  world.addBody(floorBody);

  const geo = new THREE.PlaneGeometry(50, 100);
  const mat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);
}

// --- Create walls around arena ---
function createWalls() {
  const wallMat = new CANNON.Material();
  const thickness = 1;

  const walls = [
    { x:0, y:5, z:-50, sx:25, sy:5, sz:thickness }, // back
    { x:0, y:5, z:50, sx:25, sy:5, sz:thickness },  // front
    { x:-25, y:5, z:0, sx:thickness, sy:5, sz:50 }, // left
    { x:25, y:5, z:0, sx:thickness, sy:5, sz:50 },  // right
  ];

  walls.forEach(w => {
    let body = new CANNON.Body({ mass: 0, material: wallMat });
    body.addShape(new CANNON.Box(new CANNON.Vec3(w.sx, w.sy, w.sz)));
    body.position.set(w.x, w.y, w.z);
    world.addBody(body);

    const geo = new THREE.BoxGeometry(w.sx*2, w.sy*2, w.sz*2);
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({color:0x555555}));
    mesh.position.copy(body.position);
    scene.add(mesh);
  });
}

// --- Ball create ---
function createBall() {
  ballBody = new CANNON.Body({ mass: 5 });
  ballBody.addShape(new CANNON.Sphere(1.2));
  ballBody.position.set(0, 1.2, 0);
  world.addBody(ballBody);

  const ballGeo = new THREE.SphereGeometry(1.2, 32, 32);
  const ballMat = new THREE.MeshStandardMaterial({ color:0xffff00 });
  ballMesh = new THREE.Mesh(ballGeo, ballMat);
  scene.add(ballMesh);
}

// --- Car create ---
function createCar() {
  carBody = new CANNON.Body({ mass: 2 });
  carBody.addShape(new CANNON.Box(new CANNON.Vec3(1,0.5,2)));
  carBody.position.set(0, 1, -20);
  world.addBody(carBody);

  const carGeo = new THREE.BoxGeometry(2,1,4);
  const carMat = new THREE.MeshStandardMaterial({ color:0xff0000 });
  carMesh = new THREE.Mesh(carGeo, carMat);
  scene.add(carMesh);
}

// --- Input ---
function keyDown(e) {
  const force = 300;
  if (e.key === "w") carBody.applyForce(new CANNON.Vec3(0,0,-force), carBody.position);
  if (e.key === "s") carBody.applyForce(new CANNON.Vec3(0,0,force), carBody.position);
  if (e.key === "a") carBody.applyForce(new CANNON.Vec3(-force,0,0), carBody.position);
  if (e.key === "d") carBody.applyForce(new CANNON.Vec3(force,0,0), carBody.position);
  if (e.key === " ") carBody.applyImpulse(new CANNON.Vec3(0,200,0), carBody.position); // jump
}

// --- Animate ---
function animate() {
  requestAnimationFrame(animate);
  world.step(1/60);

  ballMesh.position.copy(ballBody.position);
  carMesh.position.copy(carBody.position);

  camera.position.set(carMesh.position.x, carMesh.position.y+10, carMesh.position.z+20);
  camera.lookAt(carMesh.position);

  renderer.render(scene, camera);
}

