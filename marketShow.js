import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import $ from "jquery";
import { EditModeToggle } from "./edit";
import { addItemToScene } from "./three";
import { selectedObject, objectMoved, animateToInitialPosition } from "./three";
import toastr from "toastr";
import { showNotification } from "./toastr.js";
import { SettingsOpenModal, SettingsCloseModal } from "./SettingsModals";

let object;
var rect = document.getElementById("scene").getBoundingClientRect();
var width = rect.width;
var height = rect.height;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(800, 500);
document.getElementById("scene").appendChild(renderer.domElement);

scene.background = new THREE.Color("#cccccc");

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.rotateSpeed = 0.5;
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.1;
orbitControls.enableZoom = false;

const trackballControls = new TrackballControls(camera, renderer.domElement);
trackballControls.noRotate = true;
trackballControls.noPan = true;
trackballControls.noZoom = false;
trackballControls.zoomSpeed = 1.5;

camera.position.set(30, 20, 30);
camera.lookAt(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0x404040); // Gridin daha net gözükmesi için hafif bir ışık
scene.add(ambientLight);

// Yönsel Işık
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Yoğunluk: 0.5
directionalLight.position.set(6, 19, 0); // Işık kaynağının konumu
scene.add(directionalLight);

const loaders = new GLTFLoader();

function loadShowItem(item, _isRoom = false) {
  loaders.load(item.modelUrl, (gltf) => {
    object = gltf.scene;

    object.position.set(object.position.x, -5, object.position.y);
    camera.lookAt(object);

    scene.add(object);
  });
}
var room = {
  modelUrl: "./assets/oda2.glb",
  name: "Room",
};
loadShowItem(room, true);

var animate = function () {
  const target = orbitControls.target;
  orbitControls.update();
  trackballControls.target.set(target.x, target.y, target.z);
  trackballControls.update();

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
};

animate();

let addItem;

export function showItem(item) {
  if (!item) {
    return;
  }
  loadShowItem(item);

  addItem = item;

  $(".market-object-modal").fadeIn();
}

$("#market-object-buy-button").on("click", function () {
  if (selectedObject) {
    toastr.error("Eşya konumlandırılmadan yeni eşya eklenemez'");
    return;
  }
  if (addItem.available) {
    if (!window._editMode) {
      EditModeToggle();
    }
    if (window.gold > addItem.price) {
      window.gold = window.gold - addItem.price;
      $("#gold").html(window.gold);
      addItemToScene(addItem.modelUrl, addItem.name);
      addItem.available = false;
    } else {
      toastr.error("Yeterince altının yok");
    }
  } else {
    toastr.error("Aynı eşyadan 1 tane ekleyebilirsin");
  }
  $(".market-object-modal").fadeOut();
  scene.remove(object);
});

$("#market-object-close-button").on("click", function () {
  $(".market-object-modal").fadeOut();
  scene.remove(object);
});
