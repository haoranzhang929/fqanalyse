// Global Variables
let yAxis = [];
let xAxis = [];
let frequency;
let frequencyData;
// Audio
let currentTime;
let duration;

// Web Audio API Setup
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const size = 1024;

// Create Audio Analyser
const audioAnalyser = audioCtx.createAnalyser();
audioAnalyser.fftSize = size;
const audioBufferLength = audioAnalyser.frequencyBinCount;
console.log(`Buffer Length is ${audioBufferLength}`);
const audioDataArray = new Float32Array(audioBufferLength);

// Create Audio Element
const audio = new Audio("Biohazard.mp3");
const container = document.getElementById("audio-container");
container.appendChild(audio);
audio.controls = true;
audio.controlsList = "nodownload";

// Create Audio Node
const audioSource = audioCtx.createMediaElementSource(audio);

// Connect Audio Nodes to Analyser
audioSource.connect(audioAnalyser);

// Connect Analyser to Audio Context Destination
audioAnalyser.connect(audioCtx.destination);

// Audio API done

// Canvas Setup
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

if (
  navigator.platform != "iPad" &&
  navigator.platform != "iPhone" &&
  navigator.platform != "iPod"
) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight / 2;
} else {
  canvas.width = screen.width;
  canvas.height = screen.height / 2;
}

window.addEventListener(
  "resize",
  () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 2;
  },
  false
);

ctx.clearRect(0, 0, canvas.width, canvas.height);

const slider = document.getElementById("myRange");
const valueContainer = document.getElementById("value");
const bufferLengthContainer = document.getElementById("max");
slider.value = 1;
slider.min = 1;
slider.max = audioBufferLength;
bufferLengthContainer.innerHTML = audioBufferLength;

slider.addEventListener("change", () => {
  xAxis = [];
  yAxis = [];
});

const render = () => {
  requestAnimationFrame(render);

  valueContainer.innerHTML = slider.value;
  frequency = slider.value;

  // Get Aduio Data from Audio Analysers
  audioAnalyser.getFloatFrequencyData(audioDataArray);
  frequencyData = Math.floor(audioDataArray[frequency]);

  if (frequencyData !== -Infinity && frequencyData > -180) {
    yAxis.push(frequencyData);
  }

  // const kickDrum = Math.floor(audioDataArray[1]) + 30;
  // if (kickDrum > 0) {
  //   console.log(kickDrum);
  // }

  const snare = Math.floor(audioDataArray[10] + 40);

  if (snare > 0) {
    console.log(snare);
  }

  ctx.fillStyle = "rgb(238, 238, 238)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / audioBufferLength;
  let posX = 0;
  for (let i = 0; i < audioBufferLength; i++) {
    const barHeight = (audioDataArray[i] + 170) * 2;
    ctx.fillStyle = `rgb(2, 154, 207)`;
    ctx.fillRect(posX, canvas.height - barHeight, barWidth, barHeight);
    posX += barWidth + 1;
  }
};

const graphContainer = document.getElementById("line-graph");

const generateGraph = () => {
  Plotly.plot(
    graphContainer,
    [
      {
        y: yAxis
      }
    ],
    {
      margin: { t: 100 }
    },
    { scrollZoom: true }
  );
};

const reset = () => {
  xAxis = [];
  yAxis = [];
  Plotly.newPlot(
    graphContainer,
    [
      {
        x: xAxis,
        y: yAxis
      }
    ],
    {
      margin: { t: 100 }
    },
    { scrollZoom: true }
  );
};

render();

// Smooth Scroll

const anchorLink = document.querySelector("a[href='#start']"),
  target = document.getElementById("start");
anchorLink.addEventListener("click", function(e) {
  if (window.scrollTo) {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: target.offsetTop });
  }
});

const play = () => {
  audio.play();
};
const pause = () => {
  audio.pause();
};
const stop = () => {
  audio.pause();
  audio.currentTime = 0;
};
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const stopBtn = document.getElementById("stop");
