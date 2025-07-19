let capturedImage = null;
let selectedFlight = null;
let selectedSeat = null;

// Indian airports data
const airports = [
  { code: 'DEL', name: 'Delhi - Indira Gandhi International' },
  { code: 'BOM', name: 'Mumbai - Chhatrapati Shivaji' },
  { code: 'BLR', name: 'Bengaluru International' },
  { code: 'HYD', name: 'Hyderabad - Rajiv Gandhi International' },
  { code: 'CCU', name: 'Kolkata - Netaji Subhas Chandra Bose' },
  { code: 'MAA', name: 'Chennai International' },
  { code: 'COK', name: 'Kochi International' }
];

// Mock flight data
const flights = [
  { id: 1, from: 'DEL', to: 'BOM', time: '10:00', price: '₹5000' },
  { id: 2, from: 'BLR', to: 'DEL', time: '14:00', price: '₹6000' },
  { id: 3, from: 'HYD', to: 'BOM', time: '18:00', price: '₹4500' },
  { id: 4, from: 'MAA', to: 'DEL', time: '12:00', price: '₹5500' },
  { id: 5, from: 'COK', to: 'BLR', time: '16:00', price: '₹4000' }
];

// Create dropdowns for airports
function createAirportDropdowns() {
  const fromAirport = document.getElementById('fromAirport');
  const toAirport = document.getElementById('toAirport');

  fromAirport.innerHTML = `
    <option value="">Select Departure Airport</option>
    ${airports.map(airport => `<option value="${airport.code}">${airport.code} - ${airport.name}</option>`).join('')}
  `;

  toAirport.innerHTML = `
    <option value="">Select Arrival Airport</option>
    ${airports.map(airport => `<option value="${airport.code}">${airport.code} - ${airport.name}</option>`).join('')}
  `;
}

// Tooltips configuration
const tooltips = {
  search: "Planning a vacation? Search for flights between your desired destinations",
  selectFlight: "Choose from available flights with different timings and prices",
  passenger: "Enter passenger details and take a selfie for DigiYatra verification",
  faceCapture: "Your face photo will be used for seamless airport check-in",
  seat: "Select your preferred seat for a comfortable journey",
  verify: "Quick face verification ensures secure and paperless travel",
  boarding: "Get your digital boarding pass ready for your journey"
};

// Add tooltips to sections
function addTooltips() {
  const sections = {
    'searchSection': tooltips.search,
    'flightResults': tooltips.selectFlight,
    'passengerDetails': tooltips.passenger,
    'faceCapture': tooltips.faceCapture,
    'seatLayout': tooltips.seat,
    'verificationSection': tooltips.verify,
    'boardingPass': tooltips.boarding
  };

  for (const [id, text] of Object.entries(sections)) {
    const section = document.getElementById(id);
    if (section) {
      let tooltipShown = false;
      section.addEventListener('mouseenter', () => {
        if (!tooltipShown) {
          showTooltip(text);
          tooltipShown = true;
        }
      });
    }
  }
}

function showTooltip(text) {
  const popup = document.createElement('div');
  popup.className = 'tooltip-popup';
  popup.innerHTML = `
    <h2>Digi Yatra Guide</h2>
    <p>${text}</p>
    <button onclick="closeTooltip()">OK</button>
  `;

  const overlay = document.createElement('div');
  overlay.className = 'tooltip-overlay';

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.display = 'block';
    overlay.style.display = 'block';
  }, 100);
}

function closeTooltip() {
  const popup = document.querySelector('.tooltip-popup');
  const overlay = document.querySelector('.tooltip-overlay');
  if (popup) popup.remove();
  if (overlay) overlay.remove();
}

// Call addTooltips when DOM is loaded
document.addEventListener('DOMContentLoaded', addTooltips);

// Welcome popup function
function showWelcomePopup() {
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.2);
    text-align: center;
    z-index: 1000;
  `;

  popup.innerHTML = `
    <h2 style="color: #4169E1; margin-bottom: 15px;">Welcome to Digi Yatra!</h2>
    <p style="margin-bottom: 20px;">Get ready to embark on a virtual flight journey, experiencing seamless travel and witnessing the power of AI-driven face detection.</p>
    <button style="background: #4169E1; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">OK</button>
  `;

  document.body.appendChild(popup);

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 999;
  `;

  document.body.appendChild(overlay);

  popup.querySelector('button').onclick = () => {
    popup.remove();
    overlay.remove();
  };
}

// Show popup when page loads
window.addEventListener('load', showWelcomePopup);

// Flow section toggle
document.getElementById('toggleFlow').addEventListener('click', () => {
  document.querySelector('.flow-section').classList.toggle('active');
});

// Flow navigation functionality
document.querySelectorAll('.flow-content li').forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    const flowText = item.textContent.toLowerCase();

    // Hide all sections first
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('hidden');
    });

    // Show relevant section based on flow item clicked
    if (flowText.includes('search flights')) {
      document.getElementById('searchSection').classList.remove('hidden');
    } else if (flowText.includes('select flight')) {
      document.getElementById('flightResults').classList.remove('hidden');
    } else if (flowText.includes('passenger details')) {
      document.getElementById('passengerDetails').classList.remove('hidden');
    } else if (flowText.includes('face capture')) {
      document.getElementById('passengerDetails').classList.remove('hidden');
      initializeCamera();
    } else if (flowText.includes('seat selection')) {
      document.getElementById('seatLayout').classList.remove('hidden');
      generateSeatLayout();
    } else if (flowText.includes('verification')) {
      document.getElementById('verificationSection').classList.remove('hidden');
      initializeVerificationCamera();
    } else if (flowText.includes('boarding pass')) {
      document.getElementById('boardingPass').classList.remove('hidden');
      showBoardingPass();
    }
  });
});

// Initialize dropdowns
createAirportDropdowns();

document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const fromAirport = document.getElementById('fromAirport').value.split(' - ')[0];
  const toAirport = document.getElementById('toAirport').value.split(' - ')[0];

  const sampleFlights = [
    { id: 1, from: fromAirport, to: toAirport, time: '06:00', price: '₹4,500', airline: 'Air India', duration: '2h 15m', aircraft: 'Airbus A320' },
    { id: 2, from: fromAirport, to: toAirport, time: '09:30', price: '₹5,200', airline: 'IndiGo', duration: '2h 30m', aircraft: 'Boeing 737' },
    { id: 3, from: fromAirport, to: toAirport, time: '13:45', price: '₹3,900', airline: 'SpiceJet', duration: '2h 10m', aircraft: 'ATR-72' },
    { id: 4, from: fromAirport, to: toAirport, time: '16:20', price: '₹6,100', airline: 'Vistara', duration: '2h 20m', aircraft: 'Airbus A321' }
  ];

  const resultsDiv = document.getElementById('flightResults');
  resultsDiv.innerHTML = sampleFlights.map(flight => `
    <div class="flight-card">
      <div class="airline-name">
        ${flight.airline}
      </div>
      <div class="flight-time-info">
        <div class="time-section">
          <div class="departure-time">${flight.time}</div>
          <div class="airport-code">${flight.from}</div>
        </div>
        <div class="duration-section">
          <div class="duration">${flight.duration}</div>
          <div class="stop-type">Non Stop</div>
        </div>
        <div class="time-section">
          <div class="arrival-time">${(parseInt(flight.time.split(':')[0]) + parseInt(flight.duration.split('h')[0])).toString().padStart(2, '0')}:${flight.time.split(':')[1]}</div>
          <div class="airport-code">${flight.to}</div>
        </div>
      </div>
      <div class="price-section">
        <div class="price">₹ ${flight.price.replace('₹', '').trim()}</div>
        <button onclick="selectFlight(${flight.id})" class="select-btn">SELECT</button>
      </div>
    </div>
  `).join('');

  resultsDiv.classList.remove('hidden');
});

function selectFlight(flightId) {
  const fromAirport = document.getElementById('fromAirport').value;
  const toAirport = document.getElementById('toAirport').value;
  const time = document.querySelector(`.flight-card:nth-child(${flightId}) .departure-time`).textContent;
  
  selectedFlight = {
    id: flightId,
    from: fromAirport.split(' - ')[0],
    to: toAirport.split(' - ')[0],
    time: time
  };
  
  document.getElementById('flightResults').classList.add('hidden');
  document.getElementById('passengerDetails').classList.remove('hidden');
  initializeCamera();
}

async function initializeCamera() {
  const video = document.getElementById('video');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error('Error accessing camera:', err);
  }
}

function stopCamera(videoElement) {
  if (videoElement && videoElement.srcObject) {
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
  }
}

document.getElementById('captureBtn').addEventListener('click', () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  capturedImage = canvas.toDataURL('image/png');
  
  stopCamera(video);
  alert('Face captured successfully!');
});

document.getElementById('passengerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!capturedImage) {
    alert('Please capture your face first!');
    return;
  }

  document.getElementById('passengerDetails').classList.add('hidden');
  document.getElementById('seatLayout').classList.remove('hidden');
  generateSeatLayout();
});

function generateSeatLayout() {
  const seatsContainer = document.getElementById('seats');
  seatsContainer.innerHTML = '';

  // ATR-style seating (2-2 configuration)
  for (let row = 1; row <= 8; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';

    // Left pair (A, B)
    for (let i = 0; i < 2; i++) {
      const seat = document.createElement('div');
      seat.className = 'seat';
      const seatLetter = i === 0 ? 'A' : 'B';
      const seatNumber = `${row}${seatLetter}`;
      seat.textContent = seatNumber;
      seat.onclick = () => selectSeatNumber(seatNumber);
      rowDiv.appendChild(seat);
    }

    // Aisle
    const aisle = document.createElement('div');
    aisle.className = 'aisle';
    rowDiv.appendChild(aisle);

    // Right pair (C, D)
    for (let i = 0; i < 2; i++) {
      const seat = document.createElement('div');
      seat.className = 'seat';
      const seatLetter = i === 0 ? 'C' : 'D';
      const seatNumber = `${row}${seatLetter}`;
      seat.textContent = seatNumber;
      seat.onclick = () => selectSeatNumber(seatNumber);
      rowDiv.appendChild(seat);
    }

    seatsContainer.appendChild(rowDiv);
  }
}

function selectSeatNumber(seatNum) {
  const seats = document.querySelectorAll('.seat');
  seats.forEach(seat => {
    if (seat.textContent === seatNum) {
      seat.classList.add('selected');
    } else {
      seat.classList.remove('selected');
    }
  });
  selectedSeat = seatNum;
}

document.getElementById('confirmSeat').addEventListener('click', () => {
  if (!selectedSeat) {
    alert('Please select a seat!');
    return;
  }

  document.getElementById('seatLayout').classList.add('hidden');
  document.getElementById('ticketSection').classList.remove('hidden');
});

document.getElementById('checkIn').addEventListener('click', () => {
  document.getElementById('verificationSection').classList.remove('hidden');
  initializeVerificationCamera();
});

async function initializeVerificationCamera() {
  const video = document.getElementById('verifyVideo');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error('Error accessing camera:', err);
  }
}

document.getElementById('verifyFace').addEventListener('click', async () => {
  try {
    const verifyVideo = document.getElementById('verifyVideo');
    if (!verifyVideo.srcObject) {
      await initializeVerificationCamera();
      return;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = verifyVideo.videoWidth;
    canvas.height = verifyVideo.videoHeight;
    context.drawImage(verifyVideo, 0, 0);
    const verificationImage = canvas.toDataURL('image/png');
    console.log("Verifying face...");

    // Compare the captured images
    if (verificationImage && capturedImage) {
      try {
        // Load face-api.js model for face comparison
        const similarity = await compareFaces(capturedImage, verificationImage);
        if (similarity > 0.4) { // Adjusted threshold for face match
          stopCamera(verifyVideo);
          alert('Face verified successfully!');
          document.getElementById('verificationSection').classList.add('hidden');
          showBoardingPass(true);
        } else {
          alert('Face verification failed. Please try again.');
          // Reinitialize camera for another attempt
          stopCamera(verifyVideo);
          await initializeVerificationCamera();
        }
      } catch (error) {
        console.error('Face verification error:', error);
        alert('Face verification failed. Please try again.');
        stopCamera(verifyVideo);
        await initializeVerificationCamera();
      }
    } else {
      alert('Missing face data. Please try again.');
      stopCamera(verifyVideo);
      await initializeVerificationCamera();
    }
  } catch (error) {
    console.error("Error during face verification:", error);
    alert('An error occurred during face verification. Please try again.');
    stopCamera(verifyVideo);
    await initializeVerificationCamera();
  }
});

async function compareFaces(image1, image2) {
  try {
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);
    console.log("Models loaded successfully");

    const img1 = await createImageFromBase64(image1);
    const img2 = await createImageFromBase64(image2);

    // Detect faces and compute descriptors
    const detection1 = await faceapi.detectSingleFace(img1)
      .withFaceLandmarks()
      .withFaceDescriptor();
    const detection2 = await faceapi.detectSingleFace(img2)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection1 || !detection2) {
      console.log("No face detected in one or both images");
      return 0;
    }

    // Calculate Euclidean distance between face descriptors
    const distance = faceapi.euclideanDistance(detection1.descriptor, detection2.descriptor);
    console.log("Face similarity score:", 1 - distance);
    return 1 - distance; // Convert distance to similarity score
  } catch (error) {
    console.error('Face comparison error:', error);
    return 0;
  }
}

async function createImageFromBase64(base64String) {
  const img = new Image();
  img.src = base64String;
  await new Promise(resolve => img.onload = resolve);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return canvas;
}

function showBoardingPass(isVerified = false) {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const date = document.getElementById('travelDate').value;
  const gate = Math.floor(Math.random() * 20) + 1;
  const terminal = '2C';
  const flightNumber = 'A' + Math.floor(1000 + Math.random() * 9000);
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric'
  });

  document.getElementById('boardingPass').classList.remove('hidden');
  document.getElementById('boardingPassContent').innerHTML = `
    <div class="boarding-pass-container">
      <div class="boarding-pass-main">
        <div class="boarding-pass-header">
          <div class="route">
            <div class="from">
              <h2>FROM:</h2>
              <h1>${selectedFlight.from}</h1>
              <p class="city">${airports.find(a => a.code === selectedFlight.from)?.name.split(' - ')[0] || ''}</p>
              <p>${formattedDate}<br>${selectedFlight.time}</p>
            </div>
            <div class="plane-icon">✈</div>
            <div class="to">
              <h2>TO:</h2>
              <h1>${selectedFlight.to}</h1>
              <p class="city">${airports.find(a => a.code === selectedFlight.to)?.name.split(' - ')[0] || ''}</p>
              <p>${formattedDate}<br>${selectedFlight.time}</p>
            </div>
          </div>
        </div>
        <div class="boarding-pass-details">
          <div class="detail">
            <span>Passenger</span>
            <strong>${firstName.toUpperCase()} ${lastName.toUpperCase()}</strong>
          </div>
          <div class="detail">
            <span>Flight</span>
            <strong>${flightNumber}</strong>
          </div>
          <div class="detail">
            <span>Seat</span>
            <strong>${selectedSeat}</strong>
          </div>
          <div class="detail">
            <span>Gate</span>
            <strong>${gate}</strong>
          </div>
          <div class="detail">
            <span>Terminal</span>
            <strong>${terminal}</strong>
          </div>
          <div class="detail">
            <span>Status</span>
            <strong>${isVerified ? 'VERIFIED ✓' : 'NOT VERIFIED ✗'}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

document.getElementById('viewBoardingPass').addEventListener('click', () => showBoardingPass(false));

function showInitialBoardingPass() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;

  document.getElementById('boardingPass').classList.remove('hidden');
  document.getElementById('boardingPassContent').innerHTML = `
    <h3>BOARDING PASS</h3>
    <p>Passenger: ${firstName} ${lastName}</p>
    <p>Flight: ${selectedFlight.from} to ${selectedFlight.to}</p>
    <p>Time: ${selectedFlight.time}</p>
    <p>Seat: ${selectedSeat}</p>
    <p>Status: VERIFIED</p>
  `;
}
