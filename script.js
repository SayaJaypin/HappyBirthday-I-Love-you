document.addEventListener('DOMContentLoaded', () => {
    
    /** ========================================================================
     *  SYSTEM 1: AESTHETIC PARTICLE PHYSICS ENGINE
     *  ======================================================================== */
    class ParticleEngine {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if(!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.initParticles();
            this.animate();
        }
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        initParticles() {
            for (let i = 0; i < 70; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    r: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4 - 0.1,
                    alpha: Math.random() * 0.4 + 0.1
                });
            }
        }
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.y < 0) { p.y = this.canvas.height; p.x = Math.random() * this.canvas.width; }
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(212, 139, 160, ${p.alpha})`;
                this.ctx.fill();
            });
            requestAnimationFrame(() => this.animate());
        }
    }
    new ParticleEngine('premium-particle-canvas');

    /** ========================================================================
     *  SYSTEM 2: RIPPLE MICRO-INTERACTION (MATERIAL/APPLE STYLE)
     *  ======================================================================== */
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('.ripple-effect');
        if(!target) return;
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-circle');
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });

    /** ========================================================================
     *  SYSTEM 3: WORLD CLOCK & DATE ENGINE
     *  ======================================================================== */
    function updateClocks() {
        const d = new Date();
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        const format = (offset) => {
            const td = new Date(utc + (3600000 * offset));
            return `${String(td.getHours()).padStart(2,'0')}:${String(td.getMinutes()).padStart(2,'0')}`;
        };
        document.getElementById('clock-wib').innerText = format(7);
        document.getElementById('clock-wita').innerText = format(8);
        document.getElementById('clock-wit').innerText = format(9);
    }
    setInterval(updateClocks, 1000);
    updateClocks();

    /** ========================================================================
     *  SYSTEM 4: SECURITY PROTOCOL (PIN ENTRY)
     *  ======================================================================== */
    class SecurityProtocol {
        constructor() {
            this.pin = "090812";
            this.input = "";
            this.dots = document.querySelectorAll('.pin-indicator-dot');
            this.layer = document.getElementById('security-layer');
            this.loader = document.getElementById('loading-layer');
            this.bindEvents();
        }
        bindEvents() {
            document.querySelectorAll('.keypad-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = btn.getAttribute('data-val');
                    if (val === 'C') this.input = "";
                    else if (val === 'DEL') this.input = this.input.slice(0, -1);
                    else if (this.input.length < 6) {
                        this.input += val;
                        if (this.input.length === 6) this.verify();
                    }
                    this.updateUI();
                });
            });
        }
        updateUI(error = false) {
            this.dots.forEach((dot, index) => {
                if (error) dot.classList.add('error-dot');
                else {
                    dot.classList.remove('error-dot');
                    index < this.input.length ? dot.classList.add('filled-dot') : dot.classList.remove('filled-dot');
                }
            });
        }
        verify() {
            if (this.input === this.pin) {
                this.layer.style.opacity = '0';
                setTimeout(() => {
                    this.layer.classList.remove('active-overlay');
                    this.layer.classList.add('hidden-element');
                    initiateLoadingSequence();
                }, 800);
            } else {
                document.querySelector('.security-card').classList.add('shake-animation');
                this.updateUI(true);
                setTimeout(() => {
                    this.input = ""; this.updateUI();
                    document.querySelector('.security-card').classList.remove('shake-animation');
                }, 500);
            }
        }
    }
    new SecurityProtocol();

    /** ========================================================================
     *  SYSTEM 5: PREMIUM LOADING SEQUENCE
     *  ======================================================================== */
    function initiateLoadingSequence() {
        const loader = document.getElementById('loading-layer');
        loader.classList.remove('hidden-element');
        
        let progress = 0;
        const fillEl = document.getElementById('loading-fill-element');
        const txtEl = document.getElementById('loading-typography');
        const texts = ["Mendekripsi keindahan...", "Menyusun memori...", "Menyiapkan mahakarya..."];
        
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 12) + 4;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                bootMainExperience();
            }
            fillEl.style.width = `${progress}%`;
            if (progress % 30 === 0) txtEl.innerText = texts[Math.min(Math.floor(progress/30), 2)];
        }, 200);
    }

    /** ========================================================================
     *  SYSTEM 6: BOOT MAIN EXPERIENCE & AUDIO ENGINE
     *  ======================================================================== */
    const audioEl = document.getElementById('core-bg-music');
    const musicTrig = document.getElementById('global-music-trigger');
    const progArc = document.getElementById('music-progress-arc');

    function bootMainExperience() {
        const loader = document.getElementById('loading-layer');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.classList.add('hidden-element');
            document.body.classList.remove('locked-state');
            document.body.classList.add('scroll-unlocked');
            
            // Show HUDs
            document.getElementById('main-interface-hud').classList.remove('hidden-element');
            document.getElementById('smooth-scroll-container').classList.remove('hidden-element');
            document.getElementById('global-dock-nav').classList.remove('hidden-element');
            
            initScrollEngine();
            
            // Try AutoPlay
            audioEl.play().then(() => toggleAudioUI(true)).catch(() => console.log("User Interaction Required"));
        }, 800);
    }

    musicTrig.addEventListener('click', () => {
        if (audioEl.paused) { audioEl.play(); toggleAudioUI(true); }
        else { audioEl.pause(); toggleAudioUI(false); }
    });

    function toggleAudioUI(isPlaying) {
        if (isPlaying) {
            musicTrig.classList.add('is-playing');
            document.querySelector('.icon-play-state').classList.add('hidden-element');
            document.querySelector('.icon-pause-state').classList.remove('hidden-element');
        } else {
            musicTrig.classList.remove('is-playing');
            document.querySelector('.icon-play-state').classList.remove('hidden-element');
            document.querySelector('.icon-pause-state').classList.add('hidden-element');
        }
    }

    audioEl.addEventListener('timeupdate', () => {
        if (audioEl.duration) {
            const percent = (audioEl.currentTime / audioEl.duration) * 100;
            progArc.setAttribute('stroke-dasharray', `${percent}, 100`);
        }
    });

    /** ========================================================================
     *  SYSTEM 7: SCROLL ENGINE (INTERSECTION OBSERVER & PARALLAX)
     *  ======================================================================== */
    function initScrollEngine() {
        // Observer for reveal animations
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Specific trigger for Final SVG Heart Drawing
                    if (entry.target.id === 'heart-drawing-sequence' && !window.giftRevealedState) {
                        window.giftRevealedState = true;
                        entry.target.classList.add('trigger-heart-draw');
                        setTimeout(() => {
                            const box = document.getElementById('gift-box-trigger');
                            box.classList.remove('hidden-element');
                            setTimeout(() => box.style.opacity = '1', 50);
                        }, 4000); // Wait for SVG draw
                    }
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        revealElements.forEach(el => observer.observe(el));

        // Parallax and Active Nav Logic
        const parallaxEls = document.querySelectorAll('.parallax-element');
        const sections = document.querySelectorAll('.mega-section');
        const dockBtns = document.querySelectorAll('.dock-icon-btn');

        window.addEventListener('scroll', () => {
            let scrollY = window.scrollY;
            
            // Apply Parallax Matrix
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed') || 0.05);
                el.style.transform = `translateY(${-(scrollY * speed)}px)`;
            });

            // Update Dock Nav State
            let currentSectionId = '';
            sections.forEach(sec => {
                if (scrollY >= sec.offsetTop - window.innerHeight / 2.5) {
                    currentSectionId = sec.getAttribute('id');
                }
            });
            dockBtns.forEach(btn => {
                btn.classList.remove('active-dock');
                if (btn.getAttribute('href') === `#${currentSectionId}`) btn.classList.add('active-dock');
            });
        }, { passive: true });

        // Smooth Scroll for Dock
        dockBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector(btn.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /** ========================================================================
     *  SYSTEM 8: WISH TRANSMITTER
     *  ======================================================================== */
    document.getElementById('btn-submit-wish').addEventListener('click', () => {
        const text = document.getElementById('wish-textarea').value.trim();
        if (!text) return;

        const formModule = document.getElementById('wish-form-module');
        const animModule = document.getElementById('wish-animation-module');
        const resultText = document.getElementById('wish-result-text');
        const starEntity = document.getElementById('star-animation-entity');

        formModule.style.opacity = '0';
        setTimeout(() => {
            formModule.classList.add('hidden-element');
            animModule.classList.remove('hidden-element');
            resultText.innerText = `"${text}"`;
            
            setTimeout(() => {
                resultText.style.opacity = '0';
                setTimeout(() => starEntity.classList.add('star-shoot-anim'), 800);
            }, 3000);
        }, 600);
    });

    /** ========================================================================
     *  SYSTEM 9: FINAL GIFT DECRYPTION
     *  ======================================================================== */
    document.getElementById('btn-open-gift').addEventListener('click', () => {
        const triggerModule = document.getElementById('gift-box-trigger');
        const drawingModule = document.getElementById('heart-drawing-sequence');
        const payloadModule = document.getElementById('final-gift-payload');

        triggerModule.style.opacity = '0';
        drawingModule.style.opacity = '0';

        setTimeout(() => {
            triggerModule.classList.add('hidden-element');
            drawingModule.classList.add('hidden-element');
            payloadModule.classList.remove('hidden-element');
            setTimeout(() => payloadModule.style.opacity = '1', 50);
        }, 800);
    });
});
