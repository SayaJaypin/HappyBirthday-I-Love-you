document.addEventListener('DOMContentLoaded', () => {
    
    /** ========================================================================
     *  [1] ADVANCED PARTICLE PHYSICS ENGINE (CANVAS)
     *  ======================================================================== */
    class StellarEngine {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if(!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.populate();
            this.render();
        }
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        populate() {
            for (let i = 0; i < 90; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    r: Math.random() * 3 + 0.5,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5 - 0.2,
                    alpha: Math.random() * 0.6 + 0.1
                });
            }
        }
        render() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.y < 0) { p.y = this.canvas.height; p.x = Math.random() * this.canvas.width; }
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(212, 139, 160, ${p.alpha})`;
                this.ctx.fill();
            });
            requestAnimationFrame(() => this.render());
        }
    }
    new StellarEngine('stellar-particle-canvas');

    /** ========================================================================
     *  [2] RIPPLE PHYSICS MICRO-INTERACTION
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
     *  [3] WORLD CLOCK MATRIX
     *  ======================================================================== */
    function syncClocks() {
        const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
        const formatTime = (offset) => {
            const td = new Date(utc + (3600000 * offset));
            return `${String(td.getHours()).padStart(2,'0')}:${String(td.getMinutes()).padStart(2,'0')}`;
        };
        document.getElementById('tz-wib').innerText = formatTime(7);
        document.getElementById('tz-wita').innerText = formatTime(8);
        document.getElementById('tz-wit').innerText = formatTime(9);
    }
    setInterval(syncClocks, 1000); syncClocks();

    /** ========================================================================
     *  [4] BRUTAL PIN SECURITY & AUTHENTICATION (NEUMORPHIC)
     *  ======================================================================== */
    class SecurityAuth {
        constructor() {
            this.targetPin = "090812";
            this.currentInput = "";
            this.dots = document.querySelectorAll('.pin-dot');
            this.authLayer = document.getElementById('auth-layer');
            this.bindKeypad();
        }
        bindKeypad() {
            document.querySelectorAll('.n-key').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.getAttribute('data-key');
                    if (key === 'C') this.currentInput = "";
                    else if (key === 'DEL') this.currentInput = this.currentInput.slice(0, -1);
                    else if (this.currentInput.length < 6) {
                        this.currentInput += key;
                        if (this.currentInput.length === 6) this.processAuth();
                    }
                    this.refreshVisuals();
                });
            });
        }
        refreshVisuals(isError = false) {
            this.dots.forEach((dot, idx) => {
                if (isError) dot.classList.add('is-error');
                else {
                    dot.classList.remove('is-error');
                    idx < this.currentInput.length ? dot.classList.add('is-filled') : dot.classList.remove('is-filled');
                }
            });
        }
        processAuth() {
            if (this.currentInput === this.targetPin) {
                this.authLayer.style.opacity = '0';
                setTimeout(() => {
                    this.authLayer.classList.remove('active-overlay');
                    this.authLayer.classList.add('hidden-element');
                    startStellarBloomLoader();
                }, 800);
            } else {
                document.querySelector('.auth-card').classList.add('shake-err');
                this.refreshVisuals(true);
                setTimeout(() => {
                    this.currentInput = ""; this.refreshVisuals();
                    document.querySelector('.auth-card').classList.remove('shake-err');
                }, 500);
            }
        }
    }
    new SecurityAuth();

    /** ========================================================================
     *  [5] ORBITAL BLOOM LOADING SEQUENCE
     *  ======================================================================== */
    function startStellarBloomLoader() {
        const loader = document.getElementById('loader-layer');
        loader.classList.remove('hidden-element');
        
        let progress = 0;
        const percentTxt = document.getElementById('load-percent');
        const statusTxt = document.getElementById('load-status');
        const fillBar = document.getElementById('load-bar-fill');
        const stages = ["Menyusun piksel memori...", "Menyelaraskan frekuensi hati...", "Mempersiapkan mahakarya..."];
        
        const loaderIntv = setInterval(() => {
            progress += Math.floor(Math.random() * 10) + 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loaderIntv);
                bootMainEngine();
            }
            percentTxt.innerText = `${progress}%`;
            fillBar.style.width = `${progress}%`;
            if (progress % 35 === 0) statusTxt.innerText = stages[Math.min(Math.floor(progress/35), 2)];
        }, 150);
    }

    /** ========================================================================
     *  [6] AUDIO ENGINE & AUDIO VISUALIZER
     *  ======================================================================== */
    const audioCore = document.getElementById('core-audio-bg');
    const musicBtn = document.getElementById('music-controller');
    
    function toggleAudio(play) {
        if(play) {
            musicBtn.classList.add('is-playing');
            document.querySelector('.svg-play').classList.add('hidden-element');
            document.querySelector('.svg-pause').classList.remove('hidden-element');
        } else {
            musicBtn.classList.remove('is-playing');
            document.querySelector('.svg-play').classList.remove('hidden-element');
            document.querySelector('.svg-pause').classList.add('hidden-element');
        }
    }

    musicBtn.addEventListener('click', () => {
        if(audioCore.paused) { audioCore.play(); toggleAudio(true); }
        else { audioCore.pause(); toggleAudio(false); }
    });

    /** ========================================================================
     *  [7] BOOT MAIN ENGINE & INTERSECTION OBSERVER
     *  ======================================================================== */
    function bootMainEngine() {
        const loader = document.getElementById('loader-layer');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.classList.add('hidden-element');
            document.body.classList.remove('system-locked');
            document.body.classList.add('scroll-unlocked');
            
            document.getElementById('master-hud').classList.remove('hidden-element');
            document.getElementById('main-scroll-engine').classList.remove('hidden-element');
            document.getElementById('dock-bar').classList.remove('hidden-element');
            
            initScrollPhysics();
            
            audioCore.play().then(() => { toggleAudio(true); }).catch(()=>{});
        }, 800);
    }

    function initScrollPhysics() {
        // Reveal Animations Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-triggered');
                    
                    // Final Gift Heart Drawing Trigger
                    if (entry.target.id === 'heart-draw-bg' && !window.giftActivated) {
                        window.giftActivated = true;
                        entry.target.classList.add('heart-draw-triggered');
                        setTimeout(() => {
                            const box = document.getElementById('gift-box-interactive');
                            box.classList.remove('hidden-element');
                            setTimeout(() => box.style.opacity = '1', 50);
                        }, 4000); // Wait for SVG draw to complete
                    }
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal-anim').forEach(el => observer.observe(el));

        // Parallax, Reading Progress, & Dock Nav Logic
        const parallaxEls = document.querySelectorAll('.parallax-layer');
        const sections = document.querySelectorAll('.mega-section');
        const dockBtns = document.querySelectorAll('.dock-btn');
        const readProg = document.getElementById('read-progress');

        window.addEventListener('scroll', () => {
            let sy = window.scrollY;
            
            // Reading Progress
            let scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            readProg.style.width = `${(sy / scrollHeight) * 100}%`;

            // Parallax Matrix
            parallaxEls.forEach(el => {
                const spd = parseFloat(el.getAttribute('data-speed'));
                el.style.transform = `translateY(${-(sy * spd)}px)`;
            });

            // Dock Tracking
            let currSec = '';
            sections.forEach(sec => {
                if (sy >= sec.offsetTop - window.innerHeight / 2.5) currSec = sec.getAttribute('id');
            });
            dockBtns.forEach(btn => {
                btn.classList.remove('active-dock');
                if (btn.getAttribute('href') === `#${currSec}`) btn.classList.add('active-dock');
            });
        }, { passive: true });

        dockBtns.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(btn.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        }));
    }

    /** ========================================================================
     *  [8] WISH CONSOLE TRANSMITTER
     *  ======================================================================== */
    document.getElementById('cmd-send-wish').addEventListener('click', () => {
        const text = document.getElementById('wish-text-input').value.trim();
        if (!text) return;

        const formUI = document.getElementById('wish-interface');
        const animUI = document.getElementById('wish-magic-scene');
        const resTxt = document.getElementById('wish-result-text');
        const starVFX = document.getElementById('star-vfx-element');

        formUI.style.opacity = '0';
        setTimeout(() => {
            formUI.classList.add('hidden-element');
            animUI.classList.remove('hidden-element');
            resTxt.innerText = `"${text}"`;
            
            setTimeout(() => {
                resTxt.style.opacity = '0';
                setTimeout(() => starVFX.classList.add('star-shoot-anim'), 800);
            }, 3000);
        }, 600);
    });

    /** ========================================================================
     *  [9] CONFETTI PHYSICS ENGINE FOR GIFT DECRYPTION
     *  ======================================================================== */
    class ConfettiEngine {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.colors = ['#d48ba0', '#f8cdd6', '#FFD700', '#ffffff', '#e6c8d3'];
            this.resize();
            window.addEventListener('resize', () => this.resize());
        }
        resize() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }
        burst() {
            for(let i=0; i<150; i++) {
                this.particles.push({
                    x: this.canvas.width / 2,
                    y: this.canvas.height / 2 + 50,
                    vx: (Math.random() - 0.5) * 20,
                    vy: (Math.random() - 1) * 20 - 5,
                    size: Math.random() * 8 + 4,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    rot: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 10
                });
            }
            this.animate();
        }
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let active = false;
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // Gravity
                p.rot += p.rotSpeed;
                if(p.y < this.canvas.height + 20) active = true;
                
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rot * Math.PI / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                this.ctx.restore();
            });
            if(active) requestAnimationFrame(() => this.animate());
            else this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        }
    }

    /** ========================================================================
     *  [10] PRECISION GIFT DECRYPTION & ANIMATION
     *  ======================================================================== */
    const confettiSys = new ConfettiEngine('confetti-canvas');

    document.getElementById('cmd-open-gift').addEventListener('click', () => {
        const trigBox = document.getElementById('gift-box-interactive');
        const drawBg = document.getElementById('heart-draw-bg');
        const payload = document.getElementById('reward-payload');
        const svgBox = document.getElementById('the-gift-box');

        // Trigger CSS Box Explode Animation
        svgBox.classList.add('open-box-anim');
        
        // Trigger JS Confetti Engine
        document.getElementById('confetti-canvas').classList.remove('hidden-element');
        confettiSys.burst();

        setTimeout(() => {
            trigBox.style.opacity = '0';
            drawBg.style.opacity = '0';

            setTimeout(() => {
                trigBox.classList.add('hidden-element');
                drawBg.classList.add('hidden-element');
                payload.classList.remove('hidden-element');
                setTimeout(() => payload.style.opacity = '1', 100);
            }, 800);
        }, 1500); // Wait for confetti burst to peak
    });

});
