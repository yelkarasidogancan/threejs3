import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import toastr from "toastr";
import { showNotification } from "./toastr.js";
import $ from "jquery";
import { EditModeToggle } from "./edit";
import { showItem } from "./marketShow";

let collision;
let selectedObject = null;
// Sahne oluştur
var inventory = [];
var maxInventorySlots = 8;
let objectMoved = false;
let roomObject;
let isObjectSelected = false; // Seçili nesne bayrağı

window.gold = 200;
$("#gold").html(window.gold);

const scene = new THREE.Scene();

// Kamera oluştur
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// camera.position.set(40, 30, 2);
camera.position.set(40, 30, 40);
camera.lookAt(0, 0, 0);
console.log(camera.position);
const loader = new GLTFLoader();
const loaderCheckMark = new GLTFLoader();

// Nesneleri saklayacak bir dizi tanımlayın
const objects = [];

const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(0, 5, 0);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Yoğunluk: 0.5
directionalLight.position.set(0, 10, 0); // Işık kaynağının konumu
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8); // Yoğunluk: 0.5
directionalLight2.position.set(10, 10, 10); // Işık kaynağının konumu
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8); // Yoğunluk: 0.5
directionalLight3.position.set(-10, 10, -10); // Işık kaynağının konumu
scene.add(directionalLight3);

// Renderer oluştur
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
var sceneContainer = document.getElementById("canvas-container");

sceneContainer.appendChild(renderer.domElement);

scene.background = new THREE.CubeTextureLoader()
  .setPath("./assets/")
  .load([
    "cube.jpg",
    "cube.jpg",
    "cube.jpg",
    "cube.jpg",
    "cube.jpg",
    "cube.jpg",
  ]);
scene.backgroundBlurriness = 0.1;

let _checkMark;

function loadCheckMark(url) {
  loaderCheckMark.load(url, (gltf) => {
    const object = gltf.scene;
    object.scale.set(0.3, 0.3, 0.3);
    object.visible = false;
    scene.add(object);

    objects.push(object);
    object.target = {
      name: "check-mark",
    };
    object.userData.selectable = true;
    // Nesne tıklanabilir hale getirme
    _checkMark = object;
  });
}

loadCheckMark("./assets/checkmark.glb");

function CheckPosition() {
  checkCollisions();
  if (collision) {
    toastr.error("Çarpışma var");
    return;
  }

  if (isObjectSelected) {
    // Seçili nesne yoksa ve önce seçilmiş bir nesne varsa, orijinal renklere geri dönüş yap
    restoreOriginalColors(selectedObject);
    isObjectSelected = false; // Bayrağı false yap
  }

  selectedObject = null;
  _checkMark.visible = false;
  objectMoved = false;
}
const controls = document.createElement("div");
controls.innerHTML = `
  <div id='edit-features' class='display_n' style='position:absolute;top:0; color:white;'>
    <button id="leftButton">Left</button>
    <button id="rightButton">Right</button>
    <button id="forwardButton">Forward</button>
    <button id="backwardButton">Backward</button>
    <button id="rotateLeft">Left</button>
    <button id="rotateRight">Right</button>
    <button id="toInventory">toInventory</button>
  </div>
`;
document.body.appendChild(controls);

const _editModeButton = document.getElementById("edit-mode");
const _pomodoroStart = document.querySelector(".start");
const _profileContainer = document.querySelector(".profile-container");

// Edit Mod Açma-Kapama

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

function loadObject(url, img, objArray, objRotationArray, objName) {
  loader.load(url, (gltf) => {
    const object = gltf.scene;

    object.position.set(objArray[0], objArray[1], objArray[2]);
    object.rotation.set(
      objRotationArray[0],
      objRotationArray[1],
      objRotationArray[2]
    );

    scene.add(object);

    var bbox = new THREE.Box3().setFromObject(object);
    var size = new THREE.Vector3();
    bbox.getSize(size);

    console.log(objName + " boyutu: ", size.y);
    if (objName == "car") {
      object.scale.set(0.001, 0.001, 0.001);
    }

    if (objName != "oda") {
      objects.push(object);
    } else {
      roomObject = object;
    }

    object.target = {
      name: objName,
      height: size.y,
      src: img,
    };

    object.userData.selectable = true;
    object.addEventListener("click", () => {
      selectedObject = object;
    });
  });
}

loadObject(
  "./assets/yatakdeneme1.glb",
  "./assets/yatak.png",
  [6, -5, -4],
  [0, 0, 0],
  "yatak"
);
loadObject(
  "./assets/masa1.glb",
  "./assets/masa.png",
  [-6.5, -5, 4],
  [0, 0, 0],
  "masa"
);
loadObject(
  "./assets/dolap1.glb",
  "./assets/dolap.png",
  [-7.5, -5, -6.5],
  [0, 0, 0],
  "dolap"
);
loadObject(
  "./assets/sandalye1.glb",
  "./assets/sandalye.png",
  [-2, -5, 3.5],
  [0, 5.3, 0],
  "sandalye"
);
loadObject(
  "./assets/komidin1.glb",
  "./assets/komidin.png",
  [1, -5, -7.5],
  [0, 0, 0],
  "komidin"
);
loadObject("./assets/car.glb", "", [5, -5, 5], [0, 0, 0], "car");
loadObject("./assets/oda2.glb", "", [-0.5, -5, -0.5], [0, 0, 0], "oda");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const forwardButton = document.getElementById("forwardButton");
const backwardButton = document.getElementById("backwardButton");
const rotateLeft = document.getElementById("rotateLeft");
const rotateRight = document.getElementById("rotateRight");
const toInventory = document.getElementById("toInventory");

$(document).keydown(function (e) {
  switch (e.which) {
    case 37: // sol ok
      if (selectedObject) {
        arrowkey("left");
        moveObject("left", selectedObject);
        checkCollisions();
      }

      break;
    case 38: // yukarı ok
      if (selectedObject) {
        arrowkey("forward");
        moveObject("forward", selectedObject);
        checkCollisions();
      }
      break;
    case 39: // sağ ok
      if (selectedObject) {
        arrowkey("right");
        moveObject("right", selectedObject);
        checkCollisions();
      }
      break;
    case 40: // aşağı ok
      if (selectedObject) {
        arrowkey("backward");
        moveObject("backward", selectedObject);
        checkCollisions();
      }
      break;
    case 13: // aşağı ok
      if (selectedObject) {
        CheckPosition();
      }
      break;
    default:
      return; // Başka bir tuşa tıklanırsa, işlem yapma
  }
  e.preventDefault(); // Sayfanın kaymasını engelle
});

function arrowkey(arrow) {
  if (arrow == "left") {
    $("#arrow-l").css("background", "grey");
  }
  if (arrow == "right") {
    $("#arrow-r").css("background", "grey");
  }
  if (arrow == "forward") {
    $("#arrow-f").css("background", "grey");
  }
  if (arrow == "backward") {
    $("#arrow-b").css("background", "grey");
  }
  setTimeout(function () {
    $("#arrow-l").css("background", "white");
    $("#arrow-r").css("background", "white");
    $("#arrow-b").css("background", "white");
    $("#arrow-f").css("background", "white");
  }, 100); // 1 saniye sonra eski rengine geri dönecek
}

leftButton.addEventListener("click", () => {
  moveObject("left", selectedObject);
  checkCollisions();
});
rightButton.addEventListener("click", () => {
  moveObject("right", selectedObject);
  checkCollisions();
});
forwardButton.addEventListener("click", () => {
  moveObject("forward", selectedObject);
  checkCollisions();
});
backwardButton.addEventListener("click", () => {
  moveObject("backward", selectedObject);
  checkCollisions();
});
rotateLeft.addEventListener("click", () => {
  rotateObject("rotateLeft", selectedObject);
  checkCollisions();
});
rotateRight.addEventListener("click", () => {
  rotateObject("rotateRight", selectedObject);
  checkCollisions();
});
toInventory.addEventListener("click", () => {
  removeItemFromScene(selectedObject);
});

// Mouse tıklamasını dinley
renderer.domElement.addEventListener("click", (event) => {
  if (!window._editMode) {
    return;
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Fare pozisyonunu normalize etme
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycaster'ı ayarla
  raycaster.setFromCamera(mouse, camera);

  // Tıklanan nesneyi bulma
  const intersects = raycaster.intersectObjects(
    objects.filter((obj) => obj.userData.selectable)
  );

  if (intersects.length > 0) {
    while (!intersects[0].object.hasOwnProperty("target")) {
      intersects[0].object = intersects[0].object.parent;
    }
    if (intersects[0].object.target.name == "check-mark") {
      CheckPosition();
      return;
    } else {
      if (objectMoved) {
        toastr.error("Hareket ettirdiğin obje var!");
        return;
      }
      if (selectedObject) {
        toastr.error("Konumlandırmadığın eşyan var");
        return;
      }
      selectedObject = intersects[0].object;

      if (selectedObject.target.name == "oda") {
        selectedObject = null;
        return;
      }
    }
  }
});

function checkCollision(object1, object2) {
  var box1 = new THREE.Box3().setFromObject(object1);
  var box2 = new THREE.Box3().setFromObject(object2);

  return box1.intersectsBox(box2);
}
// Nesnelerin çarpışma durumunu kontrol etmek için bir döngü
function checkCollisions() {
  collision = false;
  for (var i = 0; i < objects.length; i++) {
    if (objects[i].hasOwnProperty("target")) {
      if (objects[i].target.name == selectedObject.target.name) {
      } else {
        if (checkCollision(selectedObject, objects[i])) {
          collision = true;
        }
      }
    }
  }
}

function rotateObject(direction, selectedObject) {
  if (selectedObject) {
    while (!selectedObject.hasOwnProperty("target")) {
      // Eğer tıklanan nesne bir grup veya Object3D ise ilk çocuğunu kullan
      selectedObject = selectedObject.parent;
    }
    switch (direction) {
      case "rotateLeft":
        const targetPositionl = { y: selectedObject.rotation.y + Math.PI / 8 };
        var tween = new TWEEN.Tween(selectedObject.rotation)
          .to(targetPositionl, 300) // Yeni pozisyon ve animasyon süresi
          .easing(TWEEN.Easing.Quadratic.InOut) // Kullanılan animasyon eğrisi
          .start(); // Animasyonu başlat
        break;
      case "rotateRight":
        const targetPositionr = { y: selectedObject.rotation.y - Math.PI / 8 };
        var tween = new TWEEN.Tween(selectedObject.rotation)
          .to(targetPositionr, 300) // Yeni pozisyon ve animasyon süresi
          .easing(TWEEN.Easing.Quadratic.InOut) // Kullanılan animasyon eğrisi
          .start(); // Animasyonu başlat
        break;
      default:
        break;
    }
  }
}

function moveObject(direction, selectedObject) {
  if (selectedObject) {
    while (!selectedObject.hasOwnProperty("target")) {
      // Eğer tıklanan nesne bir grup veya Object3D ise ilk çocuğunu kullan
      selectedObject = selectedObject.parent;
    }
    switch (direction) {
      case "left":
        const targetPositionl = { x: selectedObject.position.x - 2 };
        var tween = new TWEEN.Tween(selectedObject.position)
          .to(targetPositionl, 200) // Yeni pozisyon ve animasyon süresi
          .easing(TWEEN.Easing.Quadratic.InOut) // Kullanılan animasyon eğrisi
          .start(); // Animasyonu başlat
        objectMoved = true;
        break;
      case "right":
        const targetPositionr = { x: selectedObject.position.x + 2 };
        var tween = new TWEEN.Tween(selectedObject.position)
          .to(targetPositionr, 200) // Yeni pozisyon ve animasyon süresi
          .easing(TWEEN.Easing.Quadratic.InOut) // Kullanılan animasyon eğrisi
          .start(); // Animasyonu başlat
        objectMoved = true;
        break;
      case "forward":
        const targetPositionf = { z: selectedObject.position.z - 2 };
        var tween = new TWEEN.Tween(selectedObject.position)
          .to(targetPositionf, 200) // Yeni pozisyon ve animasyon süresi
          .easing(TWEEN.Easing.Quadratic.InOut) // Kullanılan animasyon eğrisi
          .start(); // Animasyonu başlat
        objectMoved = true;
        break;
      case "backward":
        const targetPositionb = { z: selectedObject.position.z + 2 };
        var tween = new TWEEN.Tween(selectedObject.position)
          .to(targetPositionb, 200) // Yeni pozisyon ve animasyon süresi
          .easing(TWEEN.Easing.Quadratic.InOut) // Kullanılan animasyon eğrisi
          .start(); // Animasyonu başlat
        objectMoved = true;
        break;
      default:
        break;
    }
  }
}

function removeItemFromScene(object) {
  if (object) {
    scene.remove(object);
    toastr.info("Eşya Envantere Kaldırıldı");
    var index = objects.indexOf(object);
    if (index !== -1) {
      objects.splice(index, 1);
    }

    selectedObject = null; // Seçilen nesneyi temizle
    _checkMark.visible = false; // checkmark görünürlüğü kapa
    objectMoved = false; // hareket kontrolünü kapa

    addItemToInventory(object);
  }
}

function addItemToInventory(object) {
  if (inventory.length < maxInventorySlots) {
    inventory.push(object);
    renderInventory();
  } else {
    toastr.error("Envanter dolu");
  }
}

function renderInventory() {
  var inventoryDiv = document.getElementById("inventory-content");
  inventoryDiv.innerHTML = ""; // Clear previous items

  for (var i = 0; i < maxInventorySlots; i++) {
    var itemDiv;
    if (i < inventory.length) {
      itemDiv = createInventoryItem(i);
    } else {
      itemDiv = createEmptySlot();
    }
    inventoryDiv.appendChild(itemDiv);
  }
}
function createInventoryItem(index) {
  let object = inventory[index];
  var itemDiv = document.createElement("img");
  itemDiv.className = "inventory-item";
  itemDiv.src = object.target.src;
  itemDiv.onclick = function () {
    addItemToSceneFromInventory(index);
  };
  return itemDiv;
}

function addItemToSceneFromInventory(index) {
  if (selectedObject) {
    toastr.error("Eşya konumlandırılmadan yeni eşya eklenemez!");
    return;
  }
  if (!window._editMode) {
    EditModeToggle();
  }
  var object = inventory[index];
  scene.add(object);
  object.position.set(0, -5, 0);
  objects.push(object);
  selectedObject = object;

  inventory.splice(index, 1); // Remove from inventory
  renderInventory();
}

function createEmptySlot() {
  var emptySlot = document.createElement("div");
  emptySlot.className = "inventory-item";
  return emptySlot;
}

// Market Kodları

function renderMarket() {
  var marketDiv = document.getElementById("market-content");
  marketDiv.innerHTML = ""; // Clear previous items

  // Sample market items (replace with your own)
  var marketItems = [
    {
      name: "Dolap",
      modelUrl: "./assets/dolap1.glb",
      src: "./assets/dolap.png",
      available: true,
      price: 20,
    },
    {
      name: "Sandalye",
      modelUrl: "./assets/sandalye1.glb",
      src: "./assets/sandalye.png",
      available: true,
      price: 30,
    },
    {
      name: "Masa",
      modelUrl: "./assets/masa1.glb",
      src: "./assets/masa.png",
      price: 24,
      available: true,
    },
    {
      name: "Masa",
      modelUrl: "./assets/masa1.glb",
      src: "./assets/masa.png",
      price: 5,
      available: true,
    },
    {
      name: "Komidin",
      modelUrl: "./assets/komidin1.glb",
      src: "./assets/komidin.png",
      price: 10,
      available: true,
    },
    {
      name: "Yatak",
      modelUrl: "./assets/yatakdeneme1.glb",
      src: "./assets/yatak.png",
      price: 13,
      available: true,
    },
    {
      name: "Sandalye",
      modelUrl: "./assets/sandalye1.glb",
      src: "./assets/sandalye.png",
      price: 15,
      available: true,
    },
    {
      name: "Masa",
      modelUrl: "./assets/masa1.glb",
      src: "./assets/masa.png",
      price: 20,
      available: true,
    },
    {
      name: "Komidin",
      modelUrl: "./assets/komidin1.glb",
      src: "./assets/komidin.png",
      price: 10,
      available: true,
    },
    {
      name: "Yatak",
      modelUrl: "./assets/yatakdeneme1.glb",
      src: "./assets/yatak.png",
      price: 240,
      available: true,
    },
    // Add more market items here
  ];

  marketItems.forEach(function (item) {
    var parentDiv = document.createElement("div");
    parentDiv.classList = "market-parent";
    var itemDiv = document.createElement("img");
    itemDiv.className = "market-item";
    itemDiv.src = item.src;

    var priceDiv = document.createElement("div");
    priceDiv.className = "price-value";
    priceDiv.innerHTML = item.price;

    parentDiv.onclick = function () {
      showItem(item);
    };

    parentDiv.appendChild(itemDiv);
    parentDiv.appendChild(priceDiv);
    marketDiv.appendChild(parentDiv);
  });
}

export function addItemToScene(modelUrl, name) {
  var loader = new GLTFLoader();
  loader.load(modelUrl, function (gltf) {
    var object = gltf.scene;

    scene.add(object);

    objects.push(object);

    object.position.y = -5;

    var bbox = new THREE.Box3().setFromObject(object);
    var size = new THREE.Vector3();

    bbox.getSize(size);

    object.target = {
      name: name,
      height: size.y,
    };
    // Nesne tıklanabilir hale getirme
    object.userData.selectable = true;
    selectedObject = object;
    object.addEventListener("click", () => {
      selectedObject = object;
    });
  });
}

renderInventory();
renderMarket();

export function animateToInitialPosition() {
  var targetPosition = new THREE.Vector3(40, 30, 40); // Yeni pozisyon
  if (!camera.position.equals(targetPosition)) {
    var tween = new TWEEN.Tween(camera.position)
      .to(targetPosition, 2000) // Yeni pozisyon ve animasyon süresi
      .easing(TWEEN.Easing.Quadratic.InOut) // Kullanılan animasyon eğrisi
      .onUpdate(() => {
        // Her güncelleme işleminde kamerayı hedefe doğru çevir
        camera.lookAt(0, 0, 0);
        // Sahneyi yeniden çiz
        // renderer.render(scene, camera);
      })
      .start(); // Animasyonu başlat
  }
}

export function PomodoroPositionStart() {
  objects.push(roomObject);
  objects.forEach(function (object) {
    var targetPosition = new THREE.Vector3(
      object.position.x,
      5,
      object.position.z
    );
    var tween = new TWEEN.Tween(object.position)
      .to(targetPosition, 1000) // Yeni pozisyon ve animasyon süresi
      .easing(TWEEN.Easing.Quadratic.InOut) // Kullanılan animasyon eğrisi
      .start(); // Animasyonu başlat
  });
  animateToInitialPosition();
}
export function PomodoroPositionEnd() {
  objects.forEach(function (object) {
    var targetPosition = new THREE.Vector3(
      object.position.x,
      -5,
      object.position.z
    );
    var tween = new TWEEN.Tween(object.position)
      .to(targetPosition, 1000) // Yeni pozisyon ve animasyon süresi
      .easing(TWEEN.Easing.Quadratic.InOut) // Kullanılan animasyon eğrisi
      .start(); // Animasyonu başlat
  });
  var index = objects.indexOf(roomObject); // roomObject'in dizideki indeksini alın

  if (index !== -1) {
    // roomObject bulunduysa
    objects.splice(index, 1); // indeksten itibaren bir öğe silin
  }
}

const originalColors = {};

// Seçilen nesnenin orijinal renklerini saklamak için bir fonksiyon
function saveOriginalColors(object) {
  object.traverse((child) => {
    if (child.isMesh) {
      if (!originalColors[child.uuid]) {
        originalColors[child.uuid] = child.material.color.clone();
      }
    }
  });
}

function restoreOriginalColors(object) {
  object.traverse((child) => {
    if (child.isMesh) {
      if (originalColors[child.uuid]) {
        child.material.color.copy(originalColors[child.uuid]);
      }
    }
  });
}

window.addEventListener("resize", onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
const animationSpeed = 6;

// Render fonksiyonunu tanımla
function animate(time) {
  time *= 0.001 * animationSpeed;
  if (selectedObject) {
    isObjectSelected = true;
    const colorIntensity = (Math.sin(time) + 1) / 2; // 0-1 arası bir değer elde etmek için sinüs kullanırız

    selectedObject.traverse((child) => {
      if (child.isMesh) {
        if (!originalColors[child.uuid]) {
          saveOriginalColors(selectedObject);
        }
        child.material.color.setRGB(
          colorIntensity,
          colorIntensity,
          colorIntensity
        );
      }
    });
    _checkMark.position.set(
      selectedObject.position.x,
      selectedObject.target.height - 1,
      selectedObject.position.z
    );
    _checkMark.visible = true;
    _checkMark.lookAt(camera.position);
  }
  const target = orbitControls.target;
  orbitControls.update();
  trackballControls.target.set(target.x, target.y, target.z);
  trackballControls.update();
  TWEEN.update();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Animasyonu başlat
animate();
export { objectMoved, selectedObject };
