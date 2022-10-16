import './style.css'
const THREE = require("three")
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"
const clock = new THREE.Clock()

// console.log("dat:", dat);
const gui = new dat.GUI({ width: 360 })
gui.closed = true

// Scene
const scene = new THREE.Scene()

// Sizes of screen
const size = {
    width: innerWidth,
    height: innerHeight
} 

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width/size.height)
camera.position.z = 8  
camera.position.y = 4 
scene.add(camera)

// Select webgl class in DOM
const canvas = document.querySelector(".webgl")

// ################################################################################################################################################################################################


// // Material
// const box = new THREE.SphereBufferGeometry(2, 32, 32)
// const pointMaterial = new THREE.PointsMaterial({ color: '#ffffff' })
// pointMaterial.sizeAttenuation = true
// pointMaterial.size = 0.03
// const Points = new THREE.Points( box, pointMaterial)
// scene.add(Points)

// Get all parameters in one object
const parameters = {}
parameters.count = 30000
parameters.particalSize = 0.02
parameters.radius = 7
parameters.branchesOfGalaxy = 5
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 5
parameters.insideColor = '#ff5588'
parameters.outsideColor = '#1b3984'

let geomatery, Points, material = null
// Generate the galaxy
const generateGalaxy = () => {


    /**
     * Delete the created scene if before they have (because we are using dat when it will update it will automatically add new things without removing the older)
     */
    if( Points != null ){
        geomatery.dispose()
        material.dispose()
        scene.remove(Points)
    }

    // Create Geomatery
    geomatery = new THREE.BufferGeometry()

    //  Color
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.colorOutside)

    // Positions
    const positions = new Float32Array( parameters.count * 3 )
    const colors = new Float32Array( parameters.count * 3 )

    for(let i=0; i<parameters.count; i++){
        const i3 = i * 3

        // Get Branch Angle
        const radius = Math.random() * parameters.radius
        // get Branches
        const branch = (i % parameters.branchesOfGalaxy) / parameters.branchesOfGalaxy * Math.PI * 2
        // spin Angle
        const spin = radius * parameters.spin


        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1: -1) //* parameters.randomness
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1: -1) //* parameters.randomness
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5? 1: -1) //* parameters.randomness

        positions[i3] =  Math.cos(branch + spin) * radius + randomX
        positions[i3+1] = randomY
        positions[i3+2] = Math.sin(branch + spin) * radius + randomZ

        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius/parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3+1] = mixedColor.g
        colors[i3+2] = mixedColor.b
    }
    // console.log(positions)

    geomatery.setAttribute(
        'position',
        new THREE.BufferAttribute(
            positions,              // Array
            3
        )
    )
    geomatery.setAttribute(
        'color',
        new THREE.BufferAttribute(
            colors,
            3
        )
    )

    /**
     * Material for galaxy
     */
    material = new THREE.PointsMaterial({
        size: parameters.particalSize,
        sizeAttenuation: true,
        depthWrite: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    Points = new THREE.Points(geomatery, material)
    scene.add(Points)

}

generateGalaxy()

gui.add(parameters, 'count').name("Number of Particle").min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'particalSize').name("Size of Particle").min(0.001).max(0.09).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(1).name("Galaxy Radius").max(10).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'branchesOfGalaxy').name("Galaxy Branches").min(3).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').name("Galaxy Spin").min(-5).max(5).step(0.5).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').name("Randomness").min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').name("Randomness Power").min(2).max(5).step(0.5).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').name("Galaxy Color").onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').name("Galaxy Color").onFinishChange(generateGalaxy)

// ################################################################################################################################################################################################

// Get rendrer from Three js
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(size.width, size.height)
renderer.render(scene, camera)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true       // Smooth movment


const AnimationEffect = () => {

    // console.log("ElapsedTime: ", clock.getElapsedTime());
    Points.rotation.y =   clock.getElapsedTime() * 0.009
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(AnimationEffect)
    // console.log( Math.random())
}
AnimationEffect()