const envelope = document.getElementById("envelope");
const paper = document.getElementById("paper");
const letterWrap = document.querySelector(".letter-wrap");
const womenDayLine = document.querySelector(".women-day-line");

const backgroundMusic = new Audio("./music/Flower Day.mp3");
backgroundMusic.loop = true;
backgroundMusic.preload = "auto";
backgroundMusic.volume = 0.55;

let hasOpened = false;

function playBackgroundMusic() {
	backgroundMusic.currentTime = 0;
	backgroundMusic.play().catch(() => {
		// Ignore autoplay errors on strict browsers.
	});
}

function stopBackgroundMusic() {
	backgroundMusic.pause();
	backgroundMusic.currentTime = 0;
}

function setupWomenDayLineChars() {
	if (!womenDayLine || womenDayLine.dataset.prepared === "true") {
		return;
	}

	const originalText = womenDayLine.textContent || "";
	womenDayLine.textContent = "";

	let charIndex = 0;
	for (const ch of originalText) {
		const span = document.createElement("span");
		span.className = "char";

		if (ch === " ") {
			span.classList.add("char-space");
			span.innerHTML = "&nbsp;";
			womenDayLine.appendChild(span);
			continue;
		}

		span.textContent = ch;
		span.style.setProperty("--char-index", String(charIndex));
		womenDayLine.appendChild(span);
		charIndex += 1;
	}

	const bounceStart = 0.95 + charIndex * 0.08;
	womenDayLine.style.setProperty("--bounce-start", `${bounceStart.toFixed(2)}s`);
	womenDayLine.dataset.prepared = "true";
}

setupWomenDayLineChars();


function startIconRain() {
	if (document.querySelector(".icon-rain")) {
		return;
	}

	const rainLayer = document.createElement("div");
	rainLayer.className = "icon-rain";
	document.body.appendChild(rainLayer);

	const icons = ["💖", "❤️", "🌸", "🌺", "🌷", "💗","🎀","🌼","💐","☘️","🍁"];
	const totalItems = 100;

	for (let index = 0; index < totalItems; index += 1) {
		const item = document.createElement("span");
		item.className = "rain-item";
		item.textContent = icons[Math.floor(Math.random() * icons.length)];

		const left = Math.random() * 100;
		const size = 16 + Math.random() * 22;
		const delay = Math.random() * 1.8;
		const duration = 2.8 + Math.random() * 2.5;
		const drift = -70 + Math.random() * 140;

		item.style.left = `${left}vw`;
		item.style.fontSize = `${size}px`;
		item.style.animationDelay = `${delay}s`;
		item.style.animationDuration = `${duration}s`;
		item.style.setProperty("--drift", `${drift}px`);

		rainLayer.appendChild(item);
	}

	setTimeout(() => {
		rainLayer.remove();
	}, 7000);
}

envelope?.addEventListener("click", () => {
	if (hasOpened) {
		return;
	}

	hasOpened = true;
	envelope.classList.add("click-bounce");
	playBackgroundMusic();


	setTimeout(() => {
		letterWrap?.classList.add("opened");
		envelope.setAttribute("aria-expanded", "true");
		paper?.setAttribute("aria-hidden", "false");
		startIconRain();
	}, 360);
});

// Corner pinwheel: rotate 360deg on click (single-spin, repeatable)
const cornerPinwheel = document.getElementById("corner-pinwheel");
if (cornerPinwheel) {
	cornerPinwheel.addEventListener("click", () => {
		// restart animation by removing and forcing reflow
		cornerPinwheel.classList.remove("spin");
		// force reflow
		void cornerPinwheel.offsetWidth;
		cornerPinwheel.classList.add("spin");
	});

	cornerPinwheel.addEventListener("animationend", () => {
		cornerPinwheel.classList.remove("spin");
	});
}

// Close button behaviour: close the letter and stop rain/sounds
const closeBtn = document.getElementById("close-btn");
if (closeBtn) {
	closeBtn.addEventListener("click", () => {
		// remove opened state
		letterWrap?.classList.remove("opened");
		envelope?.setAttribute("aria-expanded", "false");
		paper?.setAttribute("aria-hidden", "true");
		hasOpened = false;
		// stop rain icons and sounds if any
		const rainLayer = document.querySelector('.icon-rain');
		if (rainLayer) rainLayer.remove();
		stopBackgroundMusic();
	});
}
