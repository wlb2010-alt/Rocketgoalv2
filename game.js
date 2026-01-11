import * as THREE from 'three';
import * as CANNON from 'cannon-es';

let scene, camera, renderer;
let world, ballBody, carBody;

init();
animate();

function init() {
    // Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // sky blue

    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Cannon.js world
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Floor
    const floorMat = new CANNON.Material();
    const floorBody = new CANNON.Body({ mass: 0, material: floorMat });
    floorBody.addShape(new CANNON.Box(new CANNON.Vec3(20, 1, 30)));
    floorBody.position.set(0, -1, 0);
    world.addBody(floorBody);

    const floorGeo = new THREE.BoxGeometry(40, 2, 60);
    const floorMesh = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({color:0x228B22}));
    floorMesh.position.copy(floorBody.position);
    scene.add(floorMesh);

    // Ball
    const ballMat = new CANNON.Material();
    ballBody = new CANNON.Body({ mass: 5, material: ballMat });
    ballBody.addShape(new CANNON.Sphere(1));
    ballBody.position.set(0, 1, 0);
    world.addBody(ballBody);

    const ballGeo = new THREE.SphereGeometry(1, 32, 32);
    const ballMesh = new THREE.Mesh(ballGeo, new THREE.MeshStandardMaterial({color:0xffff00}));
    ballMesh.position.copy(ballBody.position);
    ballMesh.name = "ball";
    scene.add(ballMesh);

    // Car
    const carMat = new CANNON.Material();
    carBody = new CANNON.Body({ mass: 1, material: carMat });
    carBody.addShape(new CANNON.Box(new CANNON.Vec3(1,0.5,2)));
    carBody.position.set(0,0.5,-10);
    world.addBody(carBody);

    const carGeo = new THREE.BoxGeometry(2,1,4);
    const carMesh = new THREE.Mesh(carGeo, new THREE.MeshStandardMaterial({color:0xff0000}));
    carMesh.position.copy(carBody.position);
    carMesh.name = "car";
    scene.add(carMesh);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10,20,10);
    scene.add(light);

    window.addEventListener('keydown', keyDown);
}

function keyDown(event){
    const force = 50;
    if(event.key === 'w'){ carBody.applyForce(new CANNON.Vec3(0,0, -force), carBody.position);}
    if(event.key === 's'){ carBody.applyForce(new CANNON.Vec3(0,0, force), carBody.position);}
    if(event.key === 'a'){ carBody.applyForce(new CANNON.Vec3(-force,0,0), carBody.position);}
    if(event.key === 'd'){ carBody.applyForce(new CANNON.Vec3(force,0,0), carBody.position);}
}

function animate(){
    requestAnimationFrame(animate);
    world.step(1/60);

    // Sync Three.js meshes with Cannon.js bodies
    scene.getObjectByName("ball").position.copy(ballBody.position);
    scene.getObjectByName("car").position.copy(carBody.position);

    renderer.render(scene, camera);
}

  score++;
  scoreText.setText("Score: " + score);
  resetBall();
}

function resetBall() {
  ball.setPosition(400, 300);
  ball.setVelocity(0, 0);
}
