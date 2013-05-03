/**
 * vr.js experimental USB driver.
 *
 * @author Ben Vanik <ben.vanik@gmail.com>
 * @license BSD
 */


var statusEl = document.getElementById('status');

var canvasWidth = 800;
var canvasHeight = 600;
var cameraViewAngle = 45;
var cameraAspect = canvasWidth / canvasHeight;
var cameraNear = 0.1;
var cameraFar = 10000;
var camera = new THREE.PerspectiveCamera(
    cameraViewAngle, cameraAspect, cameraNear, cameraFar);

var scene = new THREE.Scene();
scene.add(camera);
camera.position.z = 800;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
document.body.appendChild(renderer.domElement);

var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;
scene.add(pointLight);

var defaultMaterial = new THREE.MeshLambertMaterial({
  color: 0xCC0000
});

function createPointer() {
  var container = new THREE.Object3D();
  container.useQuaternion = true;
  scene.add(container);

  var arrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 0, 0),
      50,
      0x00CC00);
  container.add(arrow);

  var axis = new THREE.AxisHelper(50);
  container.add(axis);

  // TODO(benvanik): make a little rift model.
  var ball = new THREE.Mesh(
      new THREE.SphereGeometry(10, 16, 16),
      defaultMaterial);
  container.add(ball);

  return {
    container: container,
    ball: ball
  };
};

function togglePointer(pointer, visible) {
  pointer.container.traverse(function(object) {
    object.visible = visible;
  });
};

var oculusPointer = createPointer();

function tick() {
  requestAnimationFrame(tick);

  togglePointer(oculusPointer, true);
  if (true) {
    var container = oculusPointer.container;
    container.quaternion.x = sensorFusion.Q[0];
    container.quaternion.y = sensorFusion.Q[1];
    container.quaternion.z = sensorFusion.Q[2];
    container.quaternion.w = sensorFusion.Q[3];

    statusEl.innerHTML = '';
  } else {
    // Not plugged in.
    statusEl.innerHTML = 'Oculus Rift not found!';
  }

  renderer.render(scene, camera);
};
requestAnimationFrame(tick);

document.addEventListener('keydown', function(e) {
  switch (e.keyCode) {
    case 32:
      sensorFusion.reset();
      e.preventDefault();
      break;
  }
}, false);
