/**
 * ==============================================================================
 * ZAHRA'S UNIVERSE - ULTIMATE CORE ENGINE V12.0 (GOD TIER - BUG DESTROYER)
 * ARCHITECTURE: Object-Oriented, High-Performance, WebGL-ready Canvas, Web Audio
 * ==============================================================================
 * WARNING: THIS IS A MASSIVE PHYSICS AND ANIMATION ENGINE.
 * DO NOT MODIFY UNLESS YOU KNOW EXACTLY WHAT YOU ARE DOING.
 */

"use strict";

document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // [1] CORE UTILITIES, MATH ENGINE, & HAPTIC FEEDBACK
    // ========================================================================
    const CoreUtils = {
        lerp: (start, end, factor) => start + (end - start) * factor,
        randomBetween: (min, max) => Math.random() * (max - min) + min,
        distance: (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
        degreesToRads: (degrees) => (degrees * Math.PI) / 180,
        triggerHaptic: (pattern = [15]) => {
            // Aman untuk perangkat Android yang mendukung API Getaran
            if ('vibrate' in navigator) {
                try { navigator.vibrate(pattern); } catch(e) { console.warn("Haptic override prevented by OS"); }
            }
        },
        getElement: (primaryId, fallbackId) => {
            // Smart Selector untuk mencegah crash jika ID HTML berubah
            return document.getElementById(primaryId) || document.getElementById(fallbackId);
        }
    };

    // ========================================================================
    // [2] STELLAR CONSTELLATION & COSMIC DUST PHYSICS ENGINE (DUAL CANVAS)
    // ========================================================================
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
            // Deteksi layar HP untuk optimasi partikel agar tidak lag
            const isMobile = window.innerWidth <= 768;
            const optimizedCount = isMobile ? Math.floor(this.particleCount * 0.5) : this.particleCount;

            for (let i = 0; i < optimizedCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: CoreUtils.randomBetween(-0.2, 0.2),
                    vy: CoreUtils.randomBetween(-0.3, 0.1),
                    radius: this.isDust ? CoreUtils.randomBetween(0.5, 1.5) : CoreUtils.randomBetween(1, 2.5),
                    alpha: CoreUtils.randomBetween(0.2, 0.7)
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
    new StellarPhysicsEngine('stellar-constellation-canvas', 80, 140, false);
    new StellarPhysicsEngine('cosmic-dust-canvas', 150, 0, true);

    // ========================================================================
    // [3] MAGNETIC CURSOR (HOOKE'S LAW SPRING PHYSICS) - MATI DI MOBILE
    // ========================================================================
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
    // Cegah kursor kustom berjalan di HP layar sentuh (mencegah lag)
    if (window.matchMedia("(pointer: fine)").matches) {
        new MagneticCursor();
    }

    // ========================================================================
    // [4] HARDWARE TELEMETRY (BATTERY, TIME, LATENCY) - FIX JAM CRASH!
    // ========================================================================
    const HardwareTelemetry = {
        initTime: () => {
            // Smart selector untuk memastikan jam tetap jalan meski ID berubah
            const wibEl = CoreUtils.getElement('tz-wib', 'time-wib');
            const witaEl = CoreUtils.getElement('tz-wita', 'time-wita');
            const witEl = CoreUtils.getElement('tz-wit', 'time-wit');
            
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
                        const fill = document.getElementById('battery-fluid-fill') || document.getElementById('batt-fill');
                        const text = document.getElementById('battery-percentage') || document.getElementById('batt-val');
                        
                        if(fill) fill.style.width = `${level}%`;
                        if(text) text.innerText = `${level}%`;
                        
                        if (level <= 20 && fill) fill.classList.add('critically-low');
                        else if (fill) fill.classList.remove('critically-low');
                    };
                    updateBattery();
                    battery.addEventListener('levelchange', updateBattery);
                });
            }
        },

        initSimulatedPing: () => {
            const pingEl = document.getElementById('network-ping') || document.getElementById('net-ping');
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

    // ========================================================================
    // [5] WEB AUDIO API & REALTIME FREQUENCY ANALYZER
    // ========================================================================
    class AdvancedAudioEngine {
        constructor() {
            this.audioEl = document.getElementById('core-audio-engine') || document.getElementById('core-audio-bg');
            this.toggleBtn = document.getElementById('music-playback-controller') || document.getElementById('music-controller');
            this.canvas = document.getElementById('frequency-visualizer-bars') || document.getElementById('audio-visualizer');
            this.progressRing = document.getElementById('music-progress-arc'); // Only in V1
            
            if (!this.audioEl || !this.toggleBtn) return;
            
            if (this.canvas) this.ctx = this.canvas.getContext('2d');
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
                if (this.canvas) this.renderVisualizer();
            } catch (e) {
                console.warn("Web Audio API not fully supported. Fallback to basic player.", e);
            }
        }

        bindEvents() {
            this.toggleBtn.addEventListener('click', () => {
                CoreUtils.triggerHaptic([15]);
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
                    this.progressRing.setAttribute('stroke-dasharray', `${percent}, 100`);
                }
            });
            
            this.audioEl.addEventListener('ended', () => this.updateUIState(false));
        }

        updateUIState(playing) {
            this.isPlaying = playing;
            const playIcon = document.querySelector('.svg-icon-play') || document.querySelector('.svg-play');
            const pauseIcon = document.querySelector('.svg-icon-pause') || document.querySelector('.svg-pause');
            
            if (playing) {
                this.toggleBtn.classList.add('is-playing');
                if(playIcon) playIcon.classList.add('hidden-state', 'hidden-element');
                if(pauseIcon) pauseIcon.classList.remove('hidden-state', 'hidden-element');
            } else {
                this.toggleBtn.classList.remove('is-playing');
                if(playIcon) playIcon.classList.remove('hidden-state', 'hidden-element');
                if(pauseIcon) pauseIcon.classList.add('hidden-state', 'hidden-element');
            }
        }

        renderVisualizer() {
            if (!this.isPlaying || !this.analyser || !this.canvas) {
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

    // ========================================================================
    // [6] RIPPLE MICRO-INTERACTION (MATERIAL/APPLE HYBRID)
    // ========================================================================
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('.ripple-effect');
        if(!target) return;
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-circle', 'ripple-wave');
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    });

    // ========================================================================
    // [7] NEUMORPHIC AUTHENTICATION (CRYPTOGRAPHIC DELAY SIMULATION)
    // ========================================================================
    class NeumorphicAuthenticator {
        constructor() {
            this.correctPin = "090812";
            this.currentInput = "";
            this.nodes = document.querySelectorAll('.pin-encryption-node, .pin-dot');
            this.authLayer = document.getElementById('authentication-layer') || document.getElementById('auth-layer');
            this.bindKeypad();
        }

        bindKeypad() {
            document.querySelectorAll('.n-keypad-btn, .n-key').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    CoreUtils.triggerHaptic([15]); // Getaran tombol
                    
                    const key = btn.getAttribute('data-pin-key') || btn.getAttribute('data-key');
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
                    node.classList.add('node-error', 'is-error');
                } else {
                    node.classList.remove('node-error', 'is-error');
                    if (idx < this.currentInput.length) {
                        node.classList.add('node-filled', 'is-filled');
                    } else {
                        node.classList.remove('node-filled', 'is-filled');
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
                        this.authLayer.classList.remove('active-overlay-state', 'active-overlay');
                        this.authLayer.classList.add('hidden-state', 'hidden-element');
                        startQuantumBloomLoader();
                    }, 900); 
                }, 300); 
            } else {
                // Gagal (Error Shake)
                CoreUtils.triggerHaptic([30, 50, 30]); // Getaran error
                const authCard = document.querySelector('.auth-security-card') || document.querySelector('.auth-card');
                authCard.classList.add('matrix-shake-error', 'shake-err');
                this.updateVisuals(true);
                
                setTimeout(() => {
                    this.currentInput = "";
                    this.updateVisuals();
                    authCard.classList.remove('matrix-shake-error', 'shake-err');
                }, 600);
            }
        }
    }
    new NeumorphicAuthenticator();

    // ========================================================================
    // [8] QUANTUM BLOOM LOADING SEQUENCE
    // ========================================================================
    function startQuantumBloomLoader() {
        const loaderLayer = document.getElementById('loading-transition-layer') || document.getElementById('loader-layer');
        loaderLayer.classList.remove('hidden-state', 'hidden-element');
        
        const percentText = document.getElementById('loading-percentage-val') || document.getElementById('load-percent');
        const progressBar = document.getElementById('loading-progress-bar-fill') || document.getElementById('load-bar-fill');
        const statusText = document.getElementById('loading-status-msg') || document.getElementById('load-status');
        
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
            
            if(percentText) percentText.innerText = `${Math.floor(progress)}%`;
            if(progressBar) progressBar.style.width = `${progress}%`;
            
            if(statusText) {
                if (progress > 0 && progress <= 25) statusText.innerText = systemLogs[0];
                else if (progress > 25 && progress <= 50) statusText.innerText = systemLogs[1];
                else if (progress > 50 && progress <= 85) statusText.innerText = systemLogs[2];
                else if (progress > 85) statusText.innerText = systemLogs[3];
            }
            
        }, 150);
    }

    // ========================================================================
    // [9] MASSIVE SYSTEM BOOT & INTERSECTION OBSERVER
    // ========================================================================
    function bootMassiveEngine() {
        const loaderLayer = document.getElementById('loading-transition-layer') || document.getElementById('loader-layer');
        loaderLayer.style.opacity = '0';
        
        setTimeout(() => {
            loaderLayer.classList.add('hidden-state', 'hidden-element');
            document.body.classList.remove('system-locked-state', 'system-locked');
            document.body.classList.add('scroll-unlocked');
            
            // Unhide UI Utama
            const hud = document.getElementById('master-hud-interface') || document.getElementById('master-hud');
            const main = document.getElementById('massive-scroll-engine') || document.getElementById('main-scroll-engine');
            const dock = document.getElementById('master-dock-bar') || document.getElementById('dock-bar');
            
            if(hud) hud.classList.remove('hidden-state', 'hidden-element');
            if(main) main.classList.remove('hidden-state', 'hidden-element');
            if(dock) dock.classList.remove('hidden-state', 'hidden-element');
            
            initIntersectionObserver();
            initDeviceGyroscope();
            initDoubleTapToLove();
            
            // Coba Auto Play Musik
            GlobalAudioEngine.initializeAudioContext();
            const coreAudio = document.getElementById('core-audio-engine') || document.getElementById('core-audio-bg');
            if(coreAudio) {
                coreAudio.play().then(() => {
                    GlobalAudioEngine.updateUIState(true);
                }).catch((err) => console.log("User gesture required for audio"));
            }
            
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
                    entry.target.classList.add('has-revealed', 'is-triggered');
                    
                    // Trigger Menggambar Hati SVG
                    if ((entry.target.id === 'svg-heart-drawing-sequence' || entry.target.id === 'heart-draw-bg') && !window.giftDecryptionSequenceStarted) {
                        window.giftDecryptionSequenceStarted = true;
                        entry.target.classList.add('heart-draw-triggered');
                        
                        // Menunggu SVG selesai digambar (4.5s) sebelum memunculkan kotak kado 3D
                        setTimeout(() => {
                            const boxTrigger = document.getElementById('gift-box-interactive-module') || document.getElementById('gift-box-interactive');
                            if(boxTrigger) {
                                boxTrigger.classList.remove('hidden-state', 'hidden-element');
                                setTimeout(() => boxTrigger.style.opacity = '1', 50);
                            }
                        }, 4500); 
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-up-anim, .split-text-animation-trigger, .reveal-anim').forEach(el => revealObserver.observe(el));
        
        // --- PARALLAX & DOCK NAV LOGIC (60FPS SCROLL) ---
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        const readProgressBar = document.getElementById('reading-progress-bar') || document.getElementById('read-progress');
        const sections = document.querySelectorAll('.massive-section, .mega-section');
        const dockBtns = document.querySelectorAll('.dock-item-btn, .dock-btn');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY || window.pageYOffset;
            
            // 1. Reading Progress
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollY / scrollHeight) * 100;
            if (readProgressBar) readProgressBar.style.width = `${scrollPercent}%`;

            // 2. High-Performance Parallax Matrix
            requestAnimationFrame(() => {
                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.getAttribute('data-parallax-speed') || el.getAttribute('data-speed'));
                    if(!isNaN(speed)) el.style.transform = `translate3d(0, ${-(scrollY * speed)}px, 0)`;
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
                btn.classList.remove('active-dock-link', 'active-dock');
                if (btn.getAttribute('href') === `#${currentSectionId}`) {
                    btn.classList.add('active-dock-link', 'active-dock');
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

    // ========================================================================
    // [10] DEVICE GYROSCOPE (HARDWARE 3D PARALLAX FOR HERO SECTION)
    // ========================================================================
    function initDeviceGyroscope() {
        const gyroWrapper = document.getElementById('gyro-master-wrapper') || document.getElementById('gyro-master');
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
        const heroSection = document.getElementById('module-hero-intro') || document.getElementById('sec-hero');
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

    // ========================================================================
    // [11] INSTAGRAM-STYLE DOUBLE TAP TO LOVE (CALCULATES EXACT XY COORDS)
    // ========================================================================
    function initDoubleTapToLove() {
        const galleryItems = document.querySelectorAll('.double-tap-interactive-zone, .masonry-media-box');
        
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

    // ========================================================================
    // [12] WISH TRANSMITTER (GOOEY EXECUTION & METEOR PROJECTILE)
    // ========================================================================
    const cmdTransmitWish = document.getElementById('cmd-transmit-wish') || document.getElementById('cmd-send-wish');
    if(cmdTransmitWish) {
        cmdTransmitWish.addEventListener('click', () => {
            CoreUtils.triggerHaptic([40]);
            
            const textArea = document.getElementById('wish-textarea-node') || document.getElementById('wish-text-input');
            const textValue = textArea.value.trim();
            
            if (!textValue) {
                // Getaran error jika input kosong
                textArea.style.transform = 'translateX(-10px)';
                setTimeout(() => textArea.style.transform = 'translateX(10px)', 100);
                setTimeout(() => textArea.style.transform = 'translateX(0)', 200);
                return;
            }

            const consoleUI = document.getElementById('wish-console-ui') || document.getElementById('wish-interface');
            const meteorScene = document.getElementById('wish-meteor-execution-scene') || document.getElementById('wish-magic-scene');
            const outputDisplay = document.getElementById('wish-output-display') || document.getElementById('wish-result-text');
            const meteorEntity = document.getElementById('meteor-animated-entity') || document.getElementById('star-vfx-element');

            // Sembunyikan form
            consoleUI.style.opacity = '0';
            consoleUI.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                consoleUI.classList.add('hidden-state', 'hidden-element');
                meteorScene.classList.remove('hidden-state', 'hidden-element');
                
                outputDisplay.innerText = `"${textValue}"`;
                
                // Tunggu user membaca kalimatnya, lalu tembak meteor
                setTimeout(() => {
                    outputDisplay.style.opacity = '0'; 
                    
                    setTimeout(() => {
                        meteorEntity.classList.add('meteor-shoot-trigger', 'shoot-vfx-anim');
                        CoreUtils.triggerHaptic([60, 60, 150]); // Getaran meteor jatuh
                    }, 1000);
                    
                }, 3500); 
                
            }, 800);
        });
    }

    // ========================================================================
    // [13] CONFETTI TORNADO PHYSICS ENGINE (3D GRAVITY & AIR DRAG)
    // ========================================================================
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

    // ========================================================================
    // [14] FINAL GIFT DECRYPTION SEQUENCE (FIXED BUTTON CLICK BUG)
    // ========================================================================
    const ConfettiSystem = new ConfettiTornadoEngine('confetti-physics-canvas');

    const btnOpenGift = document.getElementById('cmd-execute-decryption') || document.getElementById('cmd-open-gift');
    if(btnOpenGift) {
        btnOpenGift.addEventListener('click', (e) => {
            // THE FIX: Hentikan propagasi event biar gak bentrok
            e.stopPropagation();
            
            CoreUtils.triggerHaptic([60, 120, 180]); // Ledakan haptic
            
            const interactionModule = document.getElementById('gift-box-interactive-module') || document.getElementById('gift-box-interactive');
            const backgroundDraw = document.getElementById('svg-heart-drawing-sequence') || document.getElementById('heart-draw-bg');
            const payloadContainer = document.getElementById('reward-payload-container') || document.getElementById('reward-payload');
            const svgBoxWrapper = document.getElementById('svg-gift-box-wrapper') || document.getElementById('the-gift-box');

            // 1. Trigger CSS Animation Ledakan Kado 3D
            if(svgBoxWrapper) svgBoxWrapper.classList.add('box-explode-anim');
            
            // 2. Eksekusi Kanvas Fisika Konfeti
            const confettiCanvas = document.getElementById('confetti-physics-canvas');
            if(confettiCanvas) {
                confettiCanvas.classList.remove('hidden-state', 'hidden-element');
                setTimeout(() => ConfettiSystem.detonate(), 200); 
            }

            // 3. Sinkronisasi Waktu Transisi UI (Mencegah Overlap)
            setTimeout(() => {
                // Pudar
                if(interactionModule) interactionModule.style.opacity = '0';
                if(backgroundDraw) backgroundDraw.style.opacity = '0';

                setTimeout(() => {
                    // Hilangkan sepenuhnya dari aliran DOM
                    if(interactionModule) interactionModule.classList.add('hidden-state', 'hidden-element');
                    if(backgroundDraw) backgroundDraw.classList.add('hidden-state', 'hidden-element');
                    
                    // Munculkan Hadiah Utama (Gambar & Tombol WhatsApp)
                    if(payloadContainer) {
                        payloadContainer.classList.remove('hidden-state', 'hidden-element');
                        setTimeout(() => {
                            payloadContainer.style.opacity = '1';
                            payloadContainer.style.transform = 'translateY(0) scale(1)';
                        }, 50);
                    }
                }, 900); // Sesuaikan durasi CSS Opacity Transition

            }, 1600); // Tunggu kado meledak dan terbang dulu
        });
    }

    // ========================================================================
    // [15] SECRET KONAMI CODE (MATRIX EASTER EGG)
    // ========================================================================
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
