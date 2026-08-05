/**
 * ==============================================================================
 * ZAHRA'S UNIVERSE - ULTIMATE CORE ENGINE V9.9.9
 * ARCHITECTURE: Object-Oriented, High-Performance, WebGL-ready Canvas, Web Audio
 * ==============================================================================
 */

"use strict";

document.addEventListener('DOMContentLoaded', () => {

    /** ========================================================================
     * [1] CORE UTILITIES & MATH ENGINE
     * ======================================================================== */
    const MathEngine = {
        lerp: (start, end, factor) => start + (end - start) * factor,
        randomBetween: (min, max) => Math.random() * (max - min) + min,
        distance: (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
        degreesToRads: (degrees) => (degrees * Math.PI) / 180
    };

    /** ========================================================================
     * [2] STELLAR CONSTELLATION & COSMIC DUST PHYSICS ENGINE (DUAL CANVAS)
     * ======================================================================== */
    class StellarPhysicsEngine {
        constructor(canvasId, particleCount, connectionDistance, isDust = false) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d', { alpha: true });
            this.particles = [];
            this.particleCount = particleCount;
            this.connectionDistance = connectionDistance;
            this.isDust = isDust;
            
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.populateUniverse();
            this.renderLoop();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        populateUniverse() {
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: MathEngine.randomBetween(-0.3, 0.3),
                    vy: MathEngine.randomBetween(-0.3, 0.3),
                    radius: this.isDust ? MathEngine.randomBetween(0.5, 1.5) : MathEngine.randomBetween(1, 2.5),
                    mass: MathEngine.randomBetween(1, 3),
                    alpha: MathEngine.randomBetween(0.2, 0.8)
                });
            }
        }

        renderLoop() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            for (let i = 0; i < this.particles.length; i++) {
                let p = this.particles[i];
                
                // Kinematics
                p.x += p.vx;
                p.y += p.vy;

                // Screen Wrap (Continuous Universe)
                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;

                // Draw Particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(212, 139, 160, ${p.alpha})`;
                this.ctx.fill();

                // Draw Constellation Lines (Only for non-dust)
                if (!this.isDust) {
                    for (let j = i + 1; j < this.particles.length; j++) {
                        let p2 = this.particles[j];
                        let dist = MathEngine.distance(p.x, p.y, p2.x, p2.y);
                        
                        if (dist < this.connectionDistance) {
                            this.ctx.beginPath();
                            this.ctx.strokeStyle = `rgba(212, 139, 160, ${0.2 * (1 - dist / this.connectionDistance)})`;
                            this.ctx.lineWidth = 0.5;
                            this.ctx.moveTo(p.x, p.y);
                            this.ctx.lineTo(p2.x, p2.y);
                            this.ctx.stroke();
                        }
                    }
                }
            }
            requestAnimationFrame(() => this.renderLoop());
        }
    }

    // Initialize Dual Background Engines
    new StellarPhysicsEngine('stellar-constellation-canvas', 80, 150, false);
    new StellarPhysicsEngine('cosmic-dust-canvas', 150, 0, true);

    /** ========================================================================
     * [3] MAGNETIC CURSOR (HOOKE'S LAW SPRING PHYSICS)
     * ======================================================================== */
    class MagneticCursor {
        constructor() {
            this.core = document.getElementById('cursor-magnetic-core');
            this.aura = document.getElementById('cursor-magnetic-aura');
            if (!this.core || !this.aura) return;

            this.target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.corePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.auraPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            
            this.bindEvents();
            this.render();
        }

        bindEvents() {
            window.addEventListener('mousemove', (e) => {
                this.target.x = e.clientX;
                this.target.y = e.clientY;
            });

            // Magnetic Hover Detection
            const interactables = document.querySelectorAll('button, a, .magnetic-hover-target');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('magnetic-hover-active'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('magnetic-hover-active'));
            });
        }

        render() {
            // Core uses fast linear interpolation
            this.corePos.x = MathEngine.lerp(this.corePos.x, this.target.x, 0.4);
            this.corePos.y = MathEngine.lerp(this.corePos.y, this.target.y, 0.4);
            
            // Aura uses spring physics (slower, bouncy)
            this.auraPos.x = MathEngine.lerp(this.auraPos.x, this.target.x, 0.15);
            this.auraPos.y = MathEngine.lerp(this.auraPos.y, this.target.y, 0.15);

            this.core.style.transform = `translate(${this.corePos.x}px, ${this.corePos.y}px)`;
            this.aura.style.transform = `translate(${this.auraPos.x}px, ${this.auraPos.y}px)`;

            requestAnimationFrame(() => this.render());
        }
    }
    new MagneticCursor();

    /** ========================================================================
     * [4] HARDWARE TELEMETRY (BATTERY, TIME, LATENCY, HAPTIC)
     * ======================================================================== */
    const HardwareTelemetry = {
        initTime: () => {
            const wibEl = document.getElementById('time-wib');
            const witaEl = document.getElementById('time-wita');
            const witEl = document.getElementById('time-wit');
            
            setInterval(() => {
                const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
                const format = (offset) => {
                    const d = new Date(utc + (3600000 * offset));
                    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
                };
                if(wibEl) wibEl.innerText = format(7);
                if(witaEl) witaEl.innerText = format(8);
                if(witEl) witEl.innerText = format(9);
            }, 1000);
        },

        initBattery: () => {
            if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                    const updateBattery = () => {
                        const level = Math.round(battery.level * 100);
                        const fill = document.getElementById('battery-fluid-fill');
                        const text = document.getElementById('battery-percentage');
                        
                        if(fill) fill.style.width = `${level}%`;
                        if(text) text.innerText = `${level}%`;
                        
                        if (level <= 20) fill.classList.add('critically-low');
                        else fill.classList.remove('critically-low');
                    };
                    updateBattery();
                    battery.addEventListener('levelchange', updateBattery);
                });
            }
        },

        initSimulatedPing: () => {
            const pingEl = document.getElementById('network-ping');
            if(!pingEl) return;
            setInterval(() => {
                const ping = Math.floor(MathEngine.randomBetween(12, 45));
                pingEl.innerText = `${ping}ms`;
            }, 3000);
        },

        triggerHaptic: (pattern = [15]) => {
            if ('vibrate' in navigator) navigator.vibrate(pattern);
        }
    };
    
    HardwareTelemetry.initTime();
    HardwareTelemetry.initBattery();
    HardwareTelemetry.initSimulatedPing();

    /** ========================================================================
     * [5] WEB AUDIO API & REALTIME FREQUENCY ANALYZER
     * ======================================================================== */
    class AdvancedAudioEngine {
        constructor() {
            this.audioEl = document.getElementById('core-audio-engine');
            this.toggleBtn = document.getElementById('music-playback-controller');
            this.canvas = document.getElementById('frequency-visualizer-bars');
            this.progressRing = document.getElementById('music-progress-arc');
            
            if (!this.audioEl || !this.toggleBtn || !this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.isInitialized = false;
            this.isPlaying = false;
            
            this.bindEvents();
        }

        initializeAudioContext() {
            if (this.isInitialized) return;
            
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
            this.analyser = this.audioCtx.createAnalyser();
            
            this.source = this.audioCtx.createMediaElementSource(this.audioEl);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);
            
            this.analyser.fftSize = 64; // High frequency resolution
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            this.isInitialized = true;
            this.renderVisualizer();
        }

        bindEvents() {
            this.toggleBtn.addEventListener('click', () => {
                HardwareTelemetry.triggerHaptic([10]);
                this.initializeAudioContext();
                
                if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
                
                if (this.audioEl.paused) {
                    this.audioEl.play();
                    this.updateUIState(true);
                } else {
                    this.audioEl.pause();
                    this.updateUIState(false);
                }
            });

            this.audioEl.addEventListener('timeupdate', () => {
                if (this.audioEl.duration && this.progressRing) {
                    const percent = (this.audioEl.currentTime / this.audioEl.duration) * 100;
                    this.progressRing.setAttribute('stroke-dasharray', `${percent}, 100`);
                }
            });
            
            this.audioEl.addEventListener('ended', () => this.updateUIState(false));
        }

        updateUIState(playing) {
            this.isPlaying = playing;
            const playIcon = document.querySelector('.svg-icon-play');
            const pauseIcon = document.querySelector('.svg-icon-pause');
            
            if (playing) {
                this.toggleBtn.classList.add('is-playing');
                playIcon.classList.add('hidden-state');
                pauseIcon.classList.remove('hidden-state');
            } else {
                this.toggleBtn.classList.remove('is-playing');
                playIcon.classList.remove('hidden-state');
                pauseIcon.classList.add('hidden-state');
            }
        }

        renderVisualizer() {
            if (!this.isPlaying) {
                requestAnimationFrame(() => this.renderVisualizer());
                return;
            }

            this.analyser.getByteFrequencyData(this.dataArray);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            const barWidth = (this.canvas.width / this.bufferLength) * 2.5;
            let x = 0;
            
            for (let i = 0; i < this.bufferLength; i++) {
                const barHeight = (this.dataArray[i] / 255) * this.canvas.height;
                
                // Dynamic Gradient based on frequency height
                const gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, 0);
                gradient.addColorStop(0, '#d48ba0');
                gradient.addColorStop(1, '#a9677b');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
            requestAnimationFrame(() => this.renderVisualizer());
        }
    }
    const GlobalAudioEngine = new AdvancedAudioEngine();

    /** ========================================================================
     * [6] NEUMORPHIC AUTHENTICATION (CRYPTOGRAPHIC DELAY SIMULATION)
     * ======================================================================== */
    class NeumorphicAuthenticator {
        constructor() {
            this.correctPin = "090812";
            this.currentInput = "";
            this.nodes = document.querySelectorAll('.pin-encryption-node');
            this.authLayer = document.getElementById('authentication-layer');
            this.bindKeypad();
        }

        bindKeypad() {
            document.querySelectorAll('.n-keypad-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    HardwareTelemetry.triggerHaptic([15]); // Haptic Feedback
                    
                    const key = btn.getAttribute('data-pin-key');
                    if (key === 'C') this.currentInput = "";
                    else if (key === 'DEL') this.currentInput = this.currentInput.slice(0, -1);
                    else if (this.currentInput.length < 6) {
                        this.currentInput += key;
                        if (this.currentInput.length === 6) this.validate();
                    }
                    this.updateVisuals();
                });
            });
        }

        updateVisuals(isError = false) {
            this.nodes.forEach((node, idx) => {
                if (isError) {
                    node.classList.add('node-error');
                } else {
                    node.classList.remove('node-error');
                    if (idx < this.currentInput.length) {
                        node.classList.add('node-filled');
                    } else {
                        node.classList.remove('node-filled');
                    }
                }
            });
        }

        validate() {
            if (this.currentInput === this.correctPin) {
                // Success Sequence
                setTimeout(() => {
                    this.authLayer.style.opacity = '0';
                    setTimeout(() => {
                        this.authLayer.classList.remove('active-overlay-state');
                        this.authLayer.classList.add('hidden-state');
                        startQuantumBloomLoader();
                    }, 900); // 0.9s defined in CSS
                }, 300); // Cryptographic delay
            } else {
                // Error Sequence
                HardwareTelemetry.triggerHaptic([30, 50, 30]); // Error vibration
                document.querySelector('.auth-security-card').classList.add('matrix-shake-error');
                this.updateVisuals(true);
                
                setTimeout(() => {
                    this.currentInput = "";
                    this.updateVisuals();
                    document.querySelector('.auth-security-card').classList.remove('matrix-shake-error');
                }, 600);
            }
        }
    }
    new NeumorphicAuthenticator();

    /** ========================================================================
     * [7] QUANTUM BLOOM LOADING SEQUENCE
     * ======================================================================== */
    function startQuantumBloomLoader() {
        const loaderLayer = document.getElementById('loading-transition-layer');
        loaderLayer.classList.remove('hidden-state');
        
        const percentText = document.getElementById('loading-percentage-val');
        const progressBar = document.getElementById('loading-progress-bar-fill');
        const statusText = document.getElementById('loading-status-msg');
        
        let progress = 0;
        const systemLogs = [
            "Menyelaraskan frekuensi hati...",
            "Mendekripsi jutaan memori indah...",
            "Mengoptimalkan dimensi ruang dan waktu...",
            "Menyiapkan mahakarya untuk Zahra..."
        ];
        
        const loadingInterval = setInterval(() => {
            // Easing function for realistic loading (fast start, slow end)
            let increment = MathEngine.randomBetween(2, 8);
            if (progress > 80) increment = MathEngine.randomBetween(1, 3);
            
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(bootMassiveEngine, 500); // Wait for 100% to linger
            }
            
            percentText.innerText = `${Math.floor(progress)}%`;
            progressBar.style.width = `${progress}%`;
            
            // Change text dynamically based on progress
            if (progress > 0 && progress <= 25) statusText.innerText = systemLogs[0];
            else if (progress > 25 && progress <= 50) statusText.innerText = systemLogs[1];
            else if (progress > 50 && progress <= 85) statusText.innerText = systemLogs[2];
            else if (progress > 85) statusText.innerText = systemLogs[3];
            
        }, 120);
    }

    /** ========================================================================
     * [8] MASSIVE SYSTEM BOOT & INTERSECTION OBSERVER
     * ======================================================================== */
    function bootMassiveEngine() {
        const loaderLayer = document.getElementById('loading-transition-layer');
        loaderLayer.style.opacity = '0';
        
        setTimeout(() => {
            loaderLayer.classList.add('hidden-state');
            document.body.classList.remove('system-locked-state');
            document.body.classList.add('scroll-unlocked');
            
            // Reveal HUD, Scroll Container, and Dock
            document.getElementById('master-hud-interface').classList.remove('hidden-state');
            document.getElementById('massive-scroll-engine').classList.remove('hidden-state');
            document.getElementById('master-dock-bar').classList.remove('hidden-state');
            
            // Initialize Core Systems
            initIntersectionObserver();
            initDeviceGyroscope();
            initDoubleTapToLove();
            
            // Auto Play Audio Attempt
            GlobalAudioEngine.initializeAudioContext();
            document.getElementById('core-audio-engine').play().then(() => {
                GlobalAudioEngine.updateUIState(true);
            }).catch((err) => console.log("User gesture required for audio playback."));
            
        }, 900); // CSS transition duration
    }

    function initIntersectionObserver() {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: "0px 0px -100px 0px" // Trigger slightly before it hits bottom
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('has-revealed');
                    
                    // Final Gift Heart SVG Drawing Trigger
                    if (entry.target.id === 'svg-heart-drawing-sequence' && !window.giftDecryptionSequenceStarted) {
                        window.giftDecryptionSequenceStarted = true;
                        entry.target.classList.add('heart-draw-triggered');
                        
                        // Wait for SVG path to finish drawing (4.5s) before revealing the 3D Box
                        setTimeout(() => {
                            const boxTrigger = document.getElementById('gift-box-interactive-module');
                            boxTrigger.classList.remove('hidden-state');
                            setTimeout(() => boxTrigger.style.opacity = '1', 50);
                        }, 4500); 
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-up-anim, .split-text-animation-trigger').forEach(el => revealObserver.observe(el));
        
        // --- PARALLAX, SCROLL PROGRESS & DOCK NAV LOGIC ---
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        const readProgressBar = document.getElementById('reading-progress-bar');
        const sections = document.querySelectorAll('.massive-section');
        const dockBtns = document.querySelectorAll('.dock-item-btn');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY || window.pageYOffset;
            
            // 1. Reading Progress Calculation
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollY / scrollHeight) * 100;
            readProgressBar.style.width = `${scrollPercent}%`;

            // 2. High-Performance Parallax Matrix
            requestAnimationFrame(() => {
                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.getAttribute('data-parallax-speed'));
                    el.style.transform = `translate3d(0, ${-(scrollY * speed)}px, 0)`;
                });
            });

            // 3. Apple Dock Highlight Tracker
            let currentSectionId = '';
            sections.forEach(sec => {
                const secTop = sec.offsetTop;
                if (scrollY >= secTop - (window.innerHeight / 2)) {
                    currentSectionId = sec.getAttribute('id');
                }
            });

            dockBtns.forEach(btn => {
                btn.classList.remove('active-dock-link');
                if (btn.getAttribute('href') === `#${currentSectionId}`) {
                    btn.classList.add('active-dock-link');
                }
            });

        }, { passive: true }); // Passive flag for 60FPS scroll performance

        // Smooth Anchor Scrolling
        dockBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                HardwareTelemetry.triggerHaptic([15]);
                const targetId = btn.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /** ========================================================================
     * [9] DEVICE GYROSCOPE (HARDWARE 3D PARALLAX FOR HERO SECTION)
     * ======================================================================== */
    function initDeviceGyroscope() {
        const gyroWrapper = document.getElementById('gyro-master-wrapper');
        if (!gyroWrapper) return;

        // Mobile Gyroscope
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                let beta = e.beta; // X-axis (-180 to 180)
                let gamma = e.gamma; // Y-axis (-90 to 90)
                
                // Clamp values
                if (beta > 90) beta = 90; if (beta < -90) beta = -90;
                if (gamma > 90) gamma = 90; if (gamma < -90) gamma = -90;
                
                // Calculate Rotation
                const rotX = (beta / 90) * -15; // Max 15 deg
                const rotY = (gamma / 90) * 15;  // Max 15 deg
                
                requestAnimationFrame(() => {
                    gyroWrapper.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                });
            });
        }

        // Desktop Mouse Fallback
        const heroSection = document.getElementById('module-hero-intro');
        heroSection.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotX = (mouseY / centerY) * -10; // Max 10 deg
            const rotY = (mouseX / centerX) * 10;  // Max 10 deg
            
            requestAnimationFrame(() => {
                gyroWrapper.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                gyroWrapper.style.transform = `rotateX(0deg) rotateY(0deg)`;
            });
        });
    }

    /** ========================================================================
     * [10] INSTAGRAM-STYLE DOUBLE TAP TO LOVE (CALCULATES EXACT XY COORDS)
     * ======================================================================== */
    function initDoubleTapToLove() {
        const galleryItems = document.querySelectorAll('.double-tap-interactive-zone');
        
        galleryItems.forEach(item => {
            let lastTapTime = 0;
            
            item.addEventListener('click', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTapTime;
                
                if (tapLength < 300 && tapLength > 0) {
                    // Double Tap Detected!
                    e.preventDefault();
                    HardwareTelemetry.triggerHaptic([20, 30, 20]); // Heartbeat haptic
                    
                    const rect = item.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const loveFx = item.querySelector('.love-popup-fx-container');
                    
                    // Position the heart exactly where the user tapped
                    loveFx.style.left = `${x}px`;
                    loveFx.style.top = `${y}px`;
                    
                    // Retrigger animation
                    loveFx.classList.remove('love-anim-active');
                    void loveFx.offsetWidth; // Force reflow
                    loveFx.classList.add('love-anim-active');
                    
                    lastTapTime = 0; // Reset
                } else {
                    lastTapTime = currentTime;
                }
            });
        });
    }

    /** ========================================================================
     * [11] WISH TRANSMITTER (GOOEY EXECUTION & METEOR PROJECTILE)
     * ======================================================================== */
    document.getElementById('cmd-transmit-wish').addEventListener('click', () => {
        HardwareTelemetry.triggerHaptic([40]);
        
        const textArea = document.getElementById('wish-textarea-node');
        const textValue = textArea.value.trim();
        
        if (!textValue) {
            // Shake textarea if empty
            textArea.style.transform = 'translateX(-10px)';
            setTimeout(() => textArea.style.transform = 'translateX(10px)', 100);
            setTimeout(() => textArea.style.transform = 'translateX(0)', 200);
            return;
        }

        const consoleUI = document.getElementById('wish-console-ui');
        const meteorScene = document.getElementById('wish-meteor-execution-scene');
        const outputDisplay = document.getElementById('wish-output-display');
        const meteorEntity = document.getElementById('meteor-animated-entity');

        // Fade out console
        consoleUI.style.opacity = '0';
        consoleUI.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            consoleUI.classList.add('hidden-state');
            meteorScene.classList.remove('hidden-state');
            
            // Format and display text
            outputDisplay.innerText = `"${textValue}"`;
            
            // Trigger sequence
            setTimeout(() => {
                outputDisplay.style.opacity = '0'; // Fade text out
                
                setTimeout(() => {
                    // Trigger Meteor Animation
                    meteorEntity.classList.add('meteor-shoot-trigger');
                    HardwareTelemetry.triggerHaptic([50, 50, 100]); // Long vibration for shooting star
                }, 1000);
                
            }, 3500); // Read time
            
        }, 800);
    });

    /** ========================================================================
     * [12] CONFETTI TORNADO PHYSICS ENGINE (3D GRAVITY & AIR DRAG)
     * ======================================================================== */
    class ConfettiTornadoEngine {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.colors = ['#d48ba0', '#f8cdd6', '#FFD700', '#ffffff', '#e6c8d3', '#a9677b'];
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animationId = null;
        }

        resize() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }

        detonate() {
            // Generate 250 particles for a massive burst
            for(let i=0; i<250; i++) {
                this.particles.push({
                    x: this.canvas.width / 2,
                    y: this.canvas.height / 2 + 100, // Start from the box
                    vx: MathEngine.randomBetween(-25, 25), // Explosive X velocity
                    vy: MathEngine.randomBetween(-35, -5), // Explosive Y velocity upwards
                    size: MathEngine.randomBetween(6, 12),
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    rotation: MathEngine.randomBetween(0, 360),
                    rotationSpeed: MathEngine.randomBetween(-15, 15),
                    tilt: MathEngine.randomBetween(0, 360),
                    tiltSpeed: MathEngine.randomBetween(-15, 15)
                });
            }
            if (this.animationId) cancelAnimationFrame(this.animationId);
            this.render();
        }

        render() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let activeParticles = false;

            this.particles.forEach(p => {
                // Physics calculation
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.8; // Heavy Gravity
                p.vx *= 0.98; // Air drag / Friction X
                
                // Rotation & Tilt 3D illusion
                p.rotation += p.rotationSpeed;
                p.tilt += p.tiltSpeed;

                // Check if still on screen
                if (p.y < this.canvas.height + 50) {
                    activeParticles = true;
                    
                    this.ctx.save();
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(MathEngine.degreesToRads(p.rotation));
                    
                    // Simulate 3D flip by scaling Y based on tilt sine wave
                    const scaleY = Math.abs(Math.sin(MathEngine.degreesToRads(p.tilt)));
                    this.ctx.scale(1, scaleY);
                    
                    this.ctx.fillStyle = p.color;
                    this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    this.ctx.restore();
                }
            });

            if (activeParticles) {
                this.animationId = requestAnimationFrame(() => this.render());
            } else {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.particles = []; // Free memory
            }
        }
    }

    /** ========================================================================
     * [13] FINAL GIFT DECRYPTION SEQUENCE
     * ======================================================================== */
    const ConfettiSystem = new ConfettiTornadoEngine('confetti-physics-canvas');

    document.getElementById('cmd-execute-decryption').addEventListener('click', () => {
        HardwareTelemetry.triggerHaptic([50, 100, 150]); // Heavy haptic impact
        
        const interactionModule = document.getElementById('gift-box-interactive-module');
        const backgroundDraw = document.getElementById('heart-draw-engine');
        const payloadContainer = document.getElementById('reward-payload-container');
        const svgBoxWrapper = document.getElementById('svg-gift-box-wrapper');

        // 1. Trigger Box CSS Animation (Lid flies off, box shrinks)
        svgBoxWrapper.classList.add('box-explode-anim');
        
        // 2. Detonate Canvas Confetti Physics
        document.getElementById('confetti-physics-canvas').classList.remove('hidden-state');
        ConfettiSystem.detonate();

        // 3. Sequence Timing
        setTimeout(() => {
            // Fade out the interactive modules
            interactionModule.style.opacity = '0';
            backgroundDraw.style.opacity = '0';

            setTimeout(() => {
                // Hide them completely
                interactionModule.classList.add('hidden-state');
                backgroundDraw.classList.add('hidden-state');
                
                // Reveal the Final Payload
                payloadContainer.classList.remove('hidden-state');
                setTimeout(() => {
                    payloadContainer.style.opacity = '1';
                    payloadContainer.style.transform = 'translateY(0) scale(1)';
                }, 50);
            }, 800); // Match CSS opacity transition

        }, 1500); // Wait for confetti burst to peak and lid to fly away
    });

    /** ========================================================================
     * [14] SECRET KONAMI CODE (MEMORY MATRIX EASTER EGG)
     * ======================================================================== */
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                activateMatrixEasterEgg();
                konamiIndex = 0; // Reset
            }
        } else {
            konamiIndex = 0; // Reset on wrong key
        }
    });

    function activateMatrixEasterEgg() {
        const overlay = document.getElementById('secret-konami-overlay');
        overlay.classList.remove('hidden-state');
        HardwareTelemetry.triggerHaptic([100, 50, 100, 50, 100]);
        
        // Matrix Rain Canvas Logic
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.getElementById('matrix-rain-canvas').appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*ZAHRA'.split('');
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        for(let x = 0; x < columns; x++) drops[x] = 1;

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';
            
            for(let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }
        setInterval(drawMatrix, 33);
        
        // Auto close after 10 seconds
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.classList.add('hidden-state');
                document.getElementById('matrix-rain-canvas').innerHTML = '';
            }, 1000);
        }, 10000);
    }

});
