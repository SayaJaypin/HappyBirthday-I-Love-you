/**
 * ==============================================================================
 * ZAHRA'S UNIVERSE - ULTIMATE CORE ENGINE V11.0 (ANTI-BUG MOBILE FIRST EDITION)
 * ARCHITECTURE: Object-Oriented, High-Performance, WebGL-ready Canvas, Web Audio
 * ==============================================================================
 */

"use strict";

document.addEventListener('DOMContentLoaded', () => {

    /** ========================================================================
     * [1] CORE UTILITIES, MATH ENGINE, & HAPTIC FEEDBACK
     * ======================================================================== */
    const CoreUtils = {
        lerp: (start, end, factor) => start + (end - start) * factor,
        randomBetween: (min, max) => Math.random() * (max - min) + min,
        distance: (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
        degreesToRads: (degrees) => (degrees * Math.PI) / 180,
        triggerHaptic: (pattern = [15]) => {
            // Aman untuk perangkat yang mendukung API Getaran (Android)
            if ('vibrate' in navigator) {
                try { navigator.vibrate(pattern); } catch(e) { console.warn("Haptic disabled"); }
            }
        }
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
            // Deteksi layar HP untuk optimasi partikel
            const isMobile = window.innerWidth <= 768;
            const optimizedCount = isMobile ? Math.floor(this.particleCount * 0.6) : this.particleCount;

            for (let i = 0; i < optimizedCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: CoreUtils.randomBetween(-0.2, 0.2),
                    vy: CoreUtils.randomBetween(-0.3, 0.1),
                    radius: this.isDust ? CoreUtils.randomBetween(0.5, 1.5) : CoreUtils.randomBetween(1, 2.5),
                    alpha: CoreUtils.randomBetween(0.2, 0.8)
                });
            }
        }

        renderLoop() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            for (let i = 0; i < this.particles.length; i++) {
                let p = this.particles[i];
                
                // Kinematics updates
                p.x += p.vx;
                p.y += p.vy;

                // Continuous Universe (Screen Wrap)
                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;

                // Draw Particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(212, 139, 160, ${p.alpha})`;
                this.ctx.fill();

                // Draw Constellation Lines (Hanya untuk kanvas konstelasi)
                if (!this.isDust) {
                    for (let j = i + 1; j < this.particles.length; j++) {
                        let p2 = this.particles[j];
                        let dist = CoreUtils.distance(p.x, p.y, p2.x, p2.y);
                        
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

    // Inisialisasi Latar Belakang Ganda
    new StellarPhysicsEngine('stellar-constellation-canvas', 70, 140, false);
    new StellarPhysicsEngine('cosmic-dust-canvas', 120, 0, true);

    /** ========================================================================
     * [3] MAGNETIC CURSOR (HOOKE'S LAW SPRING PHYSICS) - MATI DI MOBILE
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

            // Deteksi Magnetik pada Tombol
            const interactables = document.querySelectorAll('button, a, .magnetic-hover-target');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('magnetic-hover-active'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('magnetic-hover-active'));
            });
        }

        render() {
            // Core menggunakan interpolasi linear cepat
            this.corePos.x = CoreUtils.lerp(this.corePos.x, this.target.x, 0.4);
            this.corePos.y = CoreUtils.lerp(this.corePos.y, this.target.y, 0.4);
            
            // Aura menggunakan fisika pegas (spring) yang memantul
            this.auraPos.x = CoreUtils.lerp(this.auraPos.x, this.target.x, 0.15);
            this.auraPos.y = CoreUtils.lerp(this.auraPos.y, this.target.y, 0.15);

            this.core.style.transform = `translate(${this.corePos.x}px, ${this.corePos.y}px)`;
            this.aura.style.transform = `translate(${this.auraPos.x}px, ${this.auraPos.y}px)`;

            requestAnimationFrame(() => this.render());
        }
    }
    // Cegah kursor kustom berjalan di HP layar sentuh
    if (window.matchMedia("(pointer: fine)").matches) {
        new MagneticCursor();
    }

    /** ========================================================================
     * [4] HARDWARE TELEMETRY (BATTERY, TIME, LATENCY)
     * ======================================================================== */
    const HardwareTelemetry = {
        initTime: () => {
            const wibEl = document.getElementById('tz-wib');
            const witaEl = document.getElementById('tz-wita');
            const witEl = document.getElementById('tz-wit');
            
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
                const ping = Math.floor(CoreUtils.randomBetween(12, 45));
                pingEl.innerText = `${ping}ms`;
            }, 3000);
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
            
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioContext();
                this.analyser = this.audioCtx.createAnalyser();
                
                this.source = this.audioCtx.createMediaElementSource(this.audioEl);
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioCtx.destination);
                
                this.analyser.fftSize = 64; 
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
                
                this.isInitialized = true;
                this.renderVisualizer();
            } catch (e) {
                console.warn("Web Audio API not fully supported. Fallback to basic player.", e);
            }
        }

        bindEvents() {
            this.toggleBtn.addEventListener('click', () => {
                CoreUtils.triggerHaptic([10]);
                this.initializeAudioContext();
                
                if (this.audioCtx && this.audioCtx.state === 'suspended') this.audioCtx.resume();
                
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
                    // Circle path length is approx 100
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
                if(playIcon) playIcon.classList.add('hidden-state');
                if(pauseIcon) pauseIcon.classList.remove('hidden-state');
            } else {
                this.toggleBtn.classList.remove('is-playing');
                if(playIcon) playIcon.classList.remove('hidden-state');
                if(pauseIcon) pauseIcon.classList.add('hidden-state');
            }
        }

        renderVisualizer() {
            if (!this.isPlaying || !this.analyser) {
                requestAnimationFrame(() => this.renderVisualizer());
                return;
            }

            this.analyser.getByteFrequencyData(this.dataArray);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            const barWidth = (this.canvas.width / this.bufferLength) * 2.5;
            let x = 0;
            
            for (let i = 0; i < this.bufferLength; i++) {
                const barHeight = (this.dataArray[i] / 255) * this.canvas.height;
                
                const gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, 0);
                gradient.addColorStop(0, '#d48ba0');
                gradient.addColorStop(1, '#a9677b');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1.5;
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
                    CoreUtils.triggerHaptic([15]); // Getaran tombol
                    
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
                // Berhasil
                setTimeout(() => {
                    this.authLayer.style.opacity = '0';
                    setTimeout(() => {
                        this.authLayer.classList.remove('active-overlay-state');
                        this.authLayer.classList.add('hidden-state');
                        startQuantumBloomLoader();
                    }, 900); // Sinkron dengan CSS transition
                }, 400); // Simulasi delay verifikasi
            } else {
                // Gagal (Error Shake)
                CoreUtils.triggerHaptic([30, 50, 30]); // Getaran error
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
            let increment = CoreUtils.randomBetween(3, 9);
            if (progress > 85) increment = CoreUtils.randomBetween(1, 2); // Melambat di akhir
            
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                setTimeout(bootMassiveEngine, 600); 
            }
            
            percentText.innerText = `${Math.floor(progress)}%`;
            progressBar.style.width = `${progress}%`;
            
            if (progress > 0 && progress <= 25) statusText.innerText = systemLogs[0];
            else if (progress > 25 && progress <= 50) statusText.innerText = systemLogs[1];
            else if (progress > 50 && progress <= 85) statusText.innerText = systemLogs[2];
            else if (progress > 85) statusText.innerText = systemLogs[3];
            
        }, 150);
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
            
            // Unhide UI Utama
            document.getElementById('master-hud-interface').classList.remove('hidden-state');
            document.getElementById('massive-scroll-engine').classList.remove('hidden-state');
            document.getElementById('master-dock-bar').classList.remove('hidden-state');
            
            initIntersectionObserver();
            initDeviceGyroscope();
            initDoubleTapToLove();
            
            // Coba Auto Play Musik
            GlobalAudioEngine.initializeAudioContext();
            document.getElementById('core-audio-engine').play().then(() => {
                GlobalAudioEngine.updateUIState(true);
            }).catch((err) => console.log("User gesture required for audio"));
            
        }, 900);
    }

    function initIntersectionObserver() {
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -100px 0px"
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('has-revealed');
                    
                    // Trigger Menggambar Hati SVG
                    if (entry.target.id === 'svg-heart-drawing-sequence' && !window.giftDecryptionSequenceStarted) {
                        window.giftDecryptionSequenceStarted = true;
                        entry.target.classList.add('heart-draw-triggered');
                        
                        // Menunggu SVG selesai digambar (4.5s) sebelum memunculkan kotak kado 3D
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
        
        // --- PARALLAX & DOCK NAV LOGIC (60FPS SCROLL) ---
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        const readProgressBar = document.getElementById('reading-progress-bar');
        const sections = document.querySelectorAll('.massive-section');
        const dockBtns = document.querySelectorAll('.dock-item-btn');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY || window.pageYOffset;
            
            // 1. Reading Progress
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollY / scrollHeight) * 100;
            if (readProgressBar) readProgressBar.style.width = `${scrollPercent}%`;

            // 2. High-Performance Parallax Matrix
            requestAnimationFrame(() => {
                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.getAttribute('data-parallax-speed'));
                    el.style.transform = `translate3d(0, ${-(scrollY * speed)}px, 0)`;
                });
            });

            // 3. Apple Dock Highlight
            let currentSectionId = '';
            sections.forEach(sec => {
                const secTop = sec.offsetTop;
                if (scrollY >= secTop - (window.innerHeight / 2.5)) {
                    currentSectionId = sec.getAttribute('id');
                }
            });

            dockBtns.forEach(btn => {
                btn.classList.remove('active-dock-link');
                if (btn.getAttribute('href') === `#${currentSectionId}`) {
                    btn.classList.add('active-dock-link');
                }
            });

        }, { passive: true }); // Passive flag mencegah scroll ngelag

        // Smooth Anchor Scrolling
        dockBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                CoreUtils.triggerHaptic([15]);
                const targetId = btn.getAttribute('href');
                const targetEl = document.querySelector(targetId);
                if(targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /** ========================================================================
     * [9] DEVICE GYROSCOPE (HARDWARE 3D PARALLAX FOR HERO SECTION)
     * ======================================================================== */
    function initDeviceGyroscope() {
        const gyroWrapper = document.getElementById('gyro-master-wrapper');
        if (!gyroWrapper) return;

        // Mobile Gyroscope Parallax
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                let beta = e.beta; 
                let gamma = e.gamma; 
                
                if (beta > 90) beta = 90; if (beta < -90) beta = -90;
                if (gamma > 90) gamma = 90; if (gamma < -90) gamma = -90;
                
                const rotX = (beta / 90) * -12; 
                const rotY = (gamma / 90) * 12;  
                
                requestAnimationFrame(() => {
                    gyroWrapper.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                });
            });
        }

        // Desktop Mouse Fallback
        const heroSection = document.getElementById('module-hero-intro');
        if(heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const rotX = (mouseY / centerY) * -8; 
                const rotY = (mouseX / centerX) * 8;  
                
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
                
                if (tapLength < 350 && tapLength > 0) {
                    // Terdeteksi klik dua kali!
                    e.preventDefault();
                    CoreUtils.triggerHaptic([20, 40, 20]); // Getaran detak jantung
                    
                    const rect = item.getBoundingClientRect();
                    // Akurasi koordinat X dan Y di dalam elemen
                    let x = e.clientX - rect.left;
                    let y = e.clientY - rect.top;
                    
                    // Fallback untuk sentuhan mobile
                    if (e.touches && e.touches.length > 0) {
                        x = e.touches[0].clientX - rect.left;
                        y = e.touches[0].clientY - rect.top;
                    }
                    
                    const loveFx = item.querySelector('.love-popup-fx-container');
                    if(!loveFx) return;
                    
                    // Posisi Hati presisi di tempat sentuhan
                    loveFx.style.left = `${x}px`;
                    loveFx.style.top = `${y}px`;
                    
                    // Trigger ulang animasi
                    loveFx.classList.remove('love-anim-active');
                    void loveFx.offsetWidth; 
                    loveFx.classList.add('love-anim-active');
                    
                    lastTapTime = 0; 
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
        CoreUtils.triggerHaptic([40]);
        
        const textArea = document.getElementById('wish-textarea-node');
        const textValue = textArea.value.trim();
        
        if (!textValue) {
            // Getaran error jika input kosong
            textArea.style.transform = 'translateX(-10px)';
            setTimeout(() => textArea.style.transform = 'translateX(10px)', 100);
            setTimeout(() => textArea.style.transform = 'translateX(0)', 200);
            return;
        }

        const consoleUI = document.getElementById('wish-console-ui');
        const meteorScene = document.getElementById('wish-meteor-execution-scene');
        const outputDisplay = document.getElementById('wish-output-display');
        const meteorEntity = document.getElementById('meteor-animated-entity');

        // Sembunyikan form
        consoleUI.style.opacity = '0';
        consoleUI.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            consoleUI.classList.add('hidden-state');
            meteorScene.classList.remove('hidden-state');
            
            outputDisplay.innerText = `"${textValue}"`;
            
            // Tunggu user membaca kalimatnya, lalu tembak meteor
            setTimeout(() => {
                outputDisplay.style.opacity = '0'; 
                
                setTimeout(() => {
                    meteorEntity.classList.add('meteor-shoot-trigger');
                    CoreUtils.triggerHaptic([60, 60, 150]); // Getaran meteor jatuh
                }, 1000);
                
            }, 3500); 
            
        }, 800);
    });

    /** ========================================================================
     * [12] CONFETTI TORNADO PHYSICS ENGINE (3D GRAVITY, DRAG & TILT)
     * ======================================================================== */
    class ConfettiTornadoEngine {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
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
            this.particles = [];
            // Buat 300 partikel untuk ledakan brutal
            for(let i=0; i<300; i++) {
                this.particles.push({
                    x: this.canvas.width / 2,
                    y: this.canvas.height / 2 + 100, 
                    vx: CoreUtils.randomBetween(-35, 35), // Sebaran sumbu X
                    vy: CoreUtils.randomBetween(-45, -10), // Ledakan ke atas sumbu Y
                    size: CoreUtils.randomBetween(6, 15),
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    rotation: CoreUtils.randomBetween(0, 360),
                    rotationSpeed: CoreUtils.randomBetween(-20, 20),
                    tilt: CoreUtils.randomBetween(0, 360),
                    tiltSpeed: CoreUtils.randomBetween(-20, 20)
                });
            }
            if (this.animationId) cancelAnimationFrame(this.animationId);
            this.render();
        }

        render() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let activeParticles = false;

            this.particles.forEach(p => {
                // Kalkulasi Fisika
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.9; // Tarikan Gravitasi Bumi
                p.vx *= 0.96; // Gesekan Angin (Air Drag)
                
                // Ilusi 3D Rotasi
                p.rotation += p.rotationSpeed;
                p.tilt += p.tiltSpeed;

                // Render hanya partikel yang belum jatuh melewati layar
                if (p.y < this.canvas.height + 50) {
                    activeParticles = true;
                    
                    this.ctx.save();
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(CoreUtils.degreesToRads(p.rotation));
                    
                    // Ilusi putaran koin 3D dengan scaleY
                    const scaleY = Math.abs(Math.sin(CoreUtils.degreesToRads(p.tilt)));
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
                this.particles = []; // Bersihkan memori
            }
        }
    }

    /** ========================================================================
     * [13] FINAL GIFT DECRYPTION SEQUENCE (FIXED BUTTON CLICK BUG)
     * ======================================================================== */
    const ConfettiSystem = new ConfettiTornadoEngine('confetti-physics-canvas');

    const btnOpenGift = document.getElementById('cmd-execute-decryption');
    if(btnOpenGift) {
        btnOpenGift.addEventListener('click', (e) => {
            // Hentikan propagasi event biar gak bentrok
            e.stopPropagation();
            
            CoreUtils.triggerHaptic([60, 120, 180]); // Ledakan haptic
            
            const interactionModule = document.getElementById('gift-box-interactive-module');
            const backgroundDraw = document.getElementById('heart-draw-engine');
            const payloadContainer = document.getElementById('reward-payload-container');
            const svgBoxWrapper = document.getElementById('svg-gift-box-wrapper');

            // 1. Trigger CSS Animation Ledakan Kado 3D
            if(svgBoxWrapper) svgBoxWrapper.classList.add('box-explode-anim');
            
            // 2. Eksekusi Kanvas Fisika Konfeti
            const confettiCanvas = document.getElementById('confetti-physics-canvas');
            if(confettiCanvas) {
                confettiCanvas.classList.remove('hidden-state');
                setTimeout(() => ConfettiSystem.detonate(), 200); 
            }

            // 3. Sinkronisasi Waktu Transisi UI (Mencegah Overlap)
            setTimeout(() => {
                // Pudar
                if(interactionModule) interactionModule.style.opacity = '0';
                if(backgroundDraw) backgroundDraw.style.opacity = '0';

                setTimeout(() => {
                    // Hilangkan sepenuhnya dari aliran DOM
                    if(interactionModule) interactionModule.classList.add('hidden-state');
                    if(backgroundDraw) backgroundDraw.classList.add('hidden-state');
                    
                    // Munculkan Hadiah Utama (Gambar & Tombol WhatsApp)
                    if(payloadContainer) {
                        payloadContainer.classList.remove('hidden-state');
                        setTimeout(() => {
                            payloadContainer.style.opacity = '1';
                            payloadContainer.style.transform = 'translateY(0) scale(1)';
                        }, 50);
                    }
                }, 900); // Sesuaikan durasi CSS Opacity Transition

            }, 1600); // Tunggu kado meledak dan terbang dulu
        });
    }

    /** ========================================================================
     * [14] SECRET KONAMI CODE (MATRIX EASTER EGG)
     * ======================================================================== */
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                activateMatrixEasterEgg();
                konamiIndex = 0; 
            }
        } else {
            konamiIndex = 0; 
        }
    });

    function activateMatrixEasterEgg() {
        const overlay = document.getElementById('secret-konami-overlay');
        if(!overlay) return;
        
        overlay.classList.remove('hidden-state');
        CoreUtils.triggerHaptic([100, 50, 100, 50, 100]);
        
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.getElementById('matrix-rain-canvas').appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*ZAHRA'.split('');
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];
        for(let x = 0; x < columns; x++) drops[x] = 1;

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#d48ba0'; // Matrix Warna Pink
            ctx.font = fontSize + 'px monospace';
            
            for(let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }
        const matrixIntv = setInterval(drawMatrix, 35);
        
        // Auto close
        setTimeout(() => {
            overlay.style.opacity = '0';
            clearInterval(matrixIntv);
            setTimeout(() => {
                overlay.classList.add('hidden-state');
                document.getElementById('matrix-rain-canvas').innerHTML = '';
            }, 1000);
        }, 12000);
    }

});
