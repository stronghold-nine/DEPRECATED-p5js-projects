let particles
let attractCenterForce
let mouseForce
let resetButton
let showParticlePoints, doWrap, doMouseAttract
let particleCount
let maxVel, restrictX, restrictY
let startVelMax
let centerForceRadius
let minForceInCenter
let maxForceInCenter
let elseForceInCenter
let minForceOutCenter
let maxForceOutCenter
let elseMinForceOutCenter
let elseMaxForceOutCenter
let maxLineDist
let canvasElem

function setup() {
  canvas = createCanvas(1024, 1024).parent("canvas-container")

  resetButton = createButton("Reset Canvas").parent("settings-container")
  resetButton.mousePressed(resetSketch).parent("settings-container")
  showParticlePoints = createCheckbox("Show Particles", false).parent("settings-container")
  doWrap = createCheckbox("Wrap Edges", false).parent("settings-container")
  doMouseAttract = createCheckbox("Enable Mouse Attracts Particles", false).parent("settings-container")
  drawTrails = createCheckbox("Draw Trails", true).parent("settings-container")
  createP("Particle Count:").parent("settings-container")
  particleCount = createInput(100).parent("settings-container")
  createP("Cap Velocity:").parent("settings-container")
  maxVel = createInput(2).parent("settings-container")
  restrictX = createCheckbox("Disable Movement on X Axis", false).parent("settings-container")
  restrictY = createCheckbox("Disable Movement on Y Axis", false).parent("settings-container")
  createP("Starting Max Speed:").parent("settings-container")
  startVelMax = createInput(1).parent("settings-container")
  createElement("h1","Center Attraction Force Settings:").parent("settings-container")
  doAttractCenter = createCheckbox("Attract Particles to Center", true).parent("settings-container")
  createP("Center Force Radius:").parent("settings-container")
  centerForceRadius = createInput(50).parent("settings-container")
  createElement("h2","If in radius, apply random force between:").parent("settings-container")
  createSpan("Min:").parent("settings-container")
  minForceInCenter = createInput(-3).parent("settings-container")
  createSpan("Max:").parent("settings-container")
  maxForceInCenter = createInput(1).parent("settings-container")
  createElement("h2","If not in radius, apply random force between:").parent("settings-container")
  createP("If random number is less than 0.0005:").parent("settings-container")
  createSpan("Min:").parent("settings-container")
  minForceOutCenter = createInput(-3).parent("settings-container")
  createSpan("Max:").parent("settings-container")
  maxForceOutCenter = createInput(1).parent("settings-container")
  createP("Else:").parent("settings-container")
  createSpan("Min:").parent("settings-container")
  elseMinForceOutCenter = createInput(-1).parent("settings-container")
  createSpan("Max:").parent("settings-container")
  elseMaxForceOutCenter = createInput(1).parent("settings-container")
  createP("Max Line Dist:").parent("settings-container").parent("settings-container")
  maxLineDist = createInput(30).parent("settings-container")

  resetSketch()
}

function draw() {
  if(!drawTrails.checked()){
    background(255)
  }

  for (var i = 0; i < particles.length; i++) {
    particles[i].update()
    particles[i].capVel(maxVel.value(), restrictX.checked(), restrictY.checked())
    if(showParticlePoints.checked()) {
      particles[i].show(5)
    }
    if(doWrap.checked()) {
      particles[i].wrap()
    }
    if(doMouseAttract.checked()) {
      particles[i].mouseAttract()
    }

    if(Math.random() < 0.1 && doAttractCenter.checked()) {
      attractCenterForce = createVector(width/2, height/2)
      attractCenterForce.sub(particles[i].pos)
      if(dist(particles[i].pos.x, particles[i].pos.y, width/2, height/2) < centerForceRadius.value()) {
        if(Math.random() < 0.5) {
          attractCenterForce.setMag(random(parseFloat(minForceInCenter.value()), parseFloat(maxForceInCenter.value())))
        } else {
          attractCenterForce.setMag(0)
        }
      } else {
        if(Math.random() < 0.0005) {
          attractCenterForce.setMag(random(parseFloat(minForceOutCenter.value()), parseFloat(maxForceOutCenter.value())))
        } else {
          attractCenterForce.setMag(random(parseFloat(elseMinForceOutCenter.value()), parseFloat(elseMaxForceOutCenter.value())))
        }
      }
      particles[i].applyForce(attractCenterForce);
    } else if(Math.random() < 0.01){
      particles[i].applyForce(createVector(random(-startVelMax.value(),startVelMax.value()), random(-startVelMax.value(),startVelMax.value())))
    }

    for(var j = 0; j < particles.length; j++) {
      if(dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y) < maxLineDist.value()){
        if(Math.random() < 0.1) {
          particles[i].vel.mult(0.97)
        }
        stroke(lerpColor(particles[i].color, particles[j].color, 0.5))
        line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y)
      } else {
        if(Math.random() < 0.1) {
          particles[i].vel.mult(1.00001)
        }
      }
    }
  }
}

window.onload = function()  {
  canvasElem = document.getElementById("defaultCanvas0")
  windowResized()
}

function windowResized() {
  console.log("resized")
  if(windowHeight < windowWidth) {
    canvasElem.style.height = "90vh"
    canvasElem.style.width = "90vh"
  } else {
    canvasElem.style.height = "90vw"
    canvasElem.style.width = "90vw"
  }
}

function resetSketch() {
  background(255)
  particles = []
  for (var i = 0; i < particleCount.value();) {
    let origin = createVector(random(width), random(height))
    if(dist(origin.x, origin.y, width/2, height/2) < width/5) {
      particles[i] = new Particle(origin);
      particles[i].applyForce(createVector(random(-startVelMax.value(),startVelMax.value()), random(-startVelMax.value(),startVelMax.value())))
      i++
    }
  }
}