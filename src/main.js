import * as THREE from '../js/three/three.module.js';

// import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';
import { GUI } from '../js/libs/dat.gui.module.js';

import { TrackballControls } from '../js/three/examples/jsm/controls/TrackballControls.js';

// import * as jQuery from '../js/libs/jquery-3.5.1.min.js';

let camera, controls, scene, renderer, stats;

const params = {
    orthographicCamera: false
};

const frustumSize = 400;

var container;
const CANVAS_WIDTH = $('#canvas').width(),
      CANVAS_HEIGHT = $('#canvas').height();
console.log(CANVAS_HEIGHT);


$(document).ready(function() {
    $.getJSON("data/vl2_sm.json", function(data) {
        init(data);
        animate();
    });
});

// init();
// animate();

function init(data) {

    //const aspect = window.innerWidth / window.innerHeight;
    const aspect = CANVAS_WIDTH / CANVAS_HEIGHT;

    camera = new THREE.PerspectiveCamera(75, aspect, 10, -10);
    //camera.position.x = 100;
    camera.position.y = 100;
    camera.up = new THREE.Vector3(0, 0, 1);

    // world

    // ----
    container = document.getElementById( 'canvas' );
    // document.body.appendChild( container );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
    container.appendChild( renderer.domElement );
    // ----

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x0f1116 );
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    const texture = new THREE.Texture( generateTexture( ) );
    texture.needsUpdate = true; // important

    var keys = [];
    for (var k in data) {
        keys.push(k);
    }

    var geometry, vertex, material, randClr, particles, position;
    for (var j=0; j < keys.length; j++) {
        geometry = new THREE.Geometry();

        // pull out xyz position data:
        position = data[keys[j]]['data'];

        for (var i=0; i < position.length; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = position[i][0]
            vertex.y = position[i][1]
            vertex.z = position[i][2]
            geometry.vertices.push(vertex);
        }

        material = new THREE.PointsMaterial({
            size: 0.2,
            map: texture,
            blending: THREE.AdditiveBlending, // required
            depthTest: false, // required
        });
        material.transparent = true;
        material.opacity = 0.8;

        randClr = '0x' + Math.floor(Math.random()*16777215).toString(16);
        material.color.setHex( randClr );
        // material.color.setRGB( 0.6, 0., 0.6 );

        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    /*
    const geometry = new THREE.Geometry();

    for ( let i = 0; i < 1250; i ++ ) {
        var vertex = new THREE.Vector3();
        vertex.x = ( Math.random() - 0.5 ) * 100;
        vertex.y = ( Math.random() - 0.5 ) * 100;
        vertex.z = ( Math.random() - 0.5 ) * 100;
        geometry.vertices.push(vertex);
    }

    var material = new THREE.PointsMaterial({
        size: 0.5,
        map: texture,
        blending: THREE.AdditiveBlending, // required
        depthTest: false, // required
    });
    material.transparent = true;
    material.opacity = 0.8;
    var randClr = '0x' + Math.floor(Math.random()*16777215).toString(16);
    // material.color.setHex( randClr );
    material.color.setRGB( 0.6, 0., 0.6 );

    var particles = new THREE.Points(geometry, material);
    scene.add(particles);
    */

    createControls( camera );

}

function generateTexture( ) {
    // draw a circle in the center of the canvas
    var size = 128;

    // create canvas
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    // get context
    var context = canvas.getContext('2d');

    // draw circle
    var centerX = size / 2;
    var centerY = size / 2;
    var radius = size / 2;

    context.beginPath();
    context.arc( centerX, centerY, radius, 0, 2 * Math.PI, false );
    context.fillStyle = "#FFFFFF";
    context.fill();

    return canvas;
}

function createControls( camera ) {

    controls = new TrackballControls( camera, renderer.domElement );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.keys = [ 65, 83, 68 ];

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

}

function animate() {

    requestAnimationFrame( animate );

    controls.update();

    render();

}

function render() {
    camera.lookAt(scene.position);
    renderer.render( scene, camera );
}

