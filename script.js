/* script.js - Brutal Premium Interactive Logic */
document.addEventListener('DOMContentLoaded', () => {
    const PIN_CODE = "090812";
    let enteredPin = "";
    
    // Screens
    const screenPin = document.getElementById('screen-pin');
    const screenLoading = document.getElementById('screen-loading');
    const mainApp = document.getElementById('main-app');
    
    // UI Elements
    const clocksContainer = document.getElementById('clocks-container');
    const musicPlayer = document.getElementById('music-player');
    const bottomNav = document.querySelector('.bottom-nav');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.scroll-section');

    // --- PIN LOGIC ---
    const dots = document.querySelectorAll('.dot');
    const keys = document.querySelectorAll('.key');

    keys.forEach(key => {
        key.addEventListener('click', () => {
            // Optional click sound / vibration
            if(navigator.vibrate) navigator.vibrate(20);
            
            const val = key.innerText;
            if (val === 'C') {
                enteredPin = "";
                updateDots();
            } else if (val === '←') {
                enteredPin = enteredPin.slice(0, -1);
                updateDots();
            } else {
                if (enteredPin.length < 6) {
                    enteredPin += val;
                    updateDots();
                    if (enteredPin.length === 6) checkPin();
                }
            }
        });
    });

    function updateDots() {
        dots.forEach((dot, index) => {
            if (index < enteredPin.length) dot.classList.add('filled');
            else dot.classList.remove('filled', 'error');
        });
    }

    function checkPin() {
        if (enteredPin === PIN_CODE) {
            setTimeout(() => {
                screenPin.classList.remove('active');
                screenLoading.classList.add('active');
                startLoading();
            }, 300);
        } else {
            if(navigator.vibrate) navigator.vibrate([100, 50, 100]); // Error vibration
            dots.forEach(dot => dot.classList.add('error'));
            setTimeout(() => {
                enteredPin = "";
                updateDots();
            }, 500);
        }
    }

    // --- LOADING LOGIC ---
    function startLoading() {
        const loadingBar = document.querySelector('.loading-bar');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 12) + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                loadingBar.style.width = '100%';
                setTimeout(() => initApp(), 900);
            } else {
                loadingBar.style.width = progress + '%';
            }
        }, 150);
    }

    // --- INIT APP ---
    function initApp() {
        screenLoading.classList.remove('active');
        mainApp.style.display = 'block'; // Unhide scrollable content
        
        setTimeout(() => {
            bottomNav.classList.add('visible');
            clocksContainer.classList.add('visible');
            musicPlayer.classList.add('visible');
            startClocks();
            createFloatingDecorations();
            startFireworks();
            initScrollAnimations();
            
            // Autoplay attempt
            const bgMusic = document.getElementById('bg-music');
            bgMusic.play().then(() => {
                updatePlayPauseIcon(true);
            }).catch(() => console.log("Autoplay blocked."));
        }, 100);
    }

    // --- SCROLL OBSERVER (BRUTAL SMOOTH SCROLL) ---
    function initScrollAnimations() {
        // 1. Animate elements on scroll
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scrolled');
                    
                    // Trigger final animation if final page is visible
                    if(entry.target.id === 'page-final' && !window.finalAnimated) {
                        triggerFinalAnimation();
                        window.finalAnimated = true;
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll, #page-final').forEach(el => observer.observe(el));

        // 2. Active Nav Item Sync with Scroll
        const sectionObserverOptions = { root: null, rootMargin: '-40% 0px -60% 0px', threshold: 0 };
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navItems.forEach(nav => {
                        nav.classList.remove('active');
                        if (nav.getAttribute('href') === `#${id}`) {
                            nav.classList.add('active');
                        }
                    });
                }
            });
        }, sectionObserverOptions);

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    // Smooth Scroll for Nav Links
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            document.querySelectorAll('.parallax-item').forEach((el, index) => {
                const speed = (index % 2 === 0) ? 0.05 : -0.03;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    });

    // --- REALTIME CLOCKS ---
    function startClocks() {
        setInterval(() => {
            const now = new Date();
            const format = (date) => {
                const h = String(date.getHours()).padStart(2, '0');
                const m = String(date.getMinutes()).padStart(2, '0');
                const s = String(date.getSeconds()).padStart(2, '0');
                return `${h}:${m}:${s}`;
            };
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            
            document.getElementById('wib-time').innerText = format(new Date(utc + (3600000 * 7)));
            document.getElementById('wita-time').innerText = format(new Date(utc + (3600000 * 8)));
            document.getElementById('wit-time').innerText = format(new Date(utc + (3600000 * 9)));
        }, 1000);
    }

    // --- MUSIC CONTROLS ---
    const bgMusic = document.getElementById('bg-music');
    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnMute = document.getElementById('btn-mute');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const progressBar = document.getElementById('music-progress');

    function updatePlayPauseIcon(isPlaying) {
        if (isPlaying) { iconPlay.style.display = 'none'; iconPause.style.display = 'block'; }
        else { iconPlay.style.display = 'block'; iconPause.style.display = 'none'; }
    }

    btnPlayPause.addEventListener('click', () => {
        if (bgMusic.paused) { bgMusic.play(); updatePlayPauseIcon(true); }
        else { bgMusic.pause(); updatePlayPauseIcon(false); }
    });

    btnMute.addEventListener('click', () => {
        bgMusic.muted = !bgMusic.muted;
        btnMute.style.opacity = bgMusic.muted ? '0.4' : '1';
    });

    bgMusic.addEventListener('timeupdate', () => {
        if(bgMusic.duration) {
            progressBar.style.width = `${(bgMusic.currentTime / bgMusic.duration) * 100}%`;
        }
    });

    // --- FLOATING DECORATIONS ---
    function createFloatingDecorations() {
        const container = document.getElementById('floating-decorations');
        const types = ['decor-flower', 'decor-star', 'decor-leaf'];
        for (let i = 0; i < 20; i++) {
            const el = document.createElement('div');
            el.classList.add('decor-svg', types[Math.floor(Math.random() * types.length)]);
            el.style.left = `${Math.random() * 100}vw`;
            el.style.animationDelay = `${Math.random() * 10}s`;
            el.style.animationDuration = `${12 + Math.random() * 15}s`;
            el.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
            container.appendChild(el);
        }
    }

    // --- CANVAS FIREWORKS (PREMIUM PERFORMANCE) ---
    function startFireworks() {
        const canvas = document.getElementById('fireworks-canvas');
        const ctx = canvas.getContext('2d');
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        resize();

        let particles = [];
        const colors = ['#ff8da1', '#d8b4e2', '#FFD700', '#ffffff', '#a575ff'];

        class Particle {
            constructor(x, y) {
                this.x = x; this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 1.0;
                this.decay = Math.random() * 0.01 + 0.015;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.size = Math.random() * 3 + 1.5;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                this.vy += 0.04; // Gravity
                this.life -= this.decay;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.hexToRgb(this.color)}, ${this.life})`;
                ctx.fill();
                // Glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
            }
            hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255,255,255';
            }
        }

        setInterval(() => {
            // Only fire if scroll is near top
            if(window.scrollY < window.innerHeight) {
                const x = Math.random() * canvas.width;
                const y = canvas.height * 0.1 + Math.random() * canvas.height * 0.4;
                for(let i=0; i<40; i++) particles.push(new Particle(x, y));
            }
        }, 1200);

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles = particles.filter(p => p.life > 0);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- MAKE A WISH ---
    const btnSendWish = document.getElementById('btn-send-wish');
    const wishInput = document.getElementById('wish-input');
    const wishCardContainer = document.getElementById('wish-card-container');
    const wishAnimContainer = document.getElementById('wish-animation-container');
    const wishDisplay = document.getElementById('wish-display');
    const flyingStar = document.getElementById('flying-star');

    btnSendWish.addEventListener('click', () => {
        const text = wishInput.value.trim();
        if(!text) return;
        
        if(navigator.vibrate) navigator.vibrate(50);
        wishCardContainer.style.opacity = '0';
        wishCardContainer.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            wishCardContainer.classList.add('hidden');
            wishAnimContainer.classList.remove('hidden');
            wishDisplay.innerText = `"${text}"`;
            
            setTimeout(() => {
                wishDisplay.style.opacity = '0';
                setTimeout(() => { flyingStar.classList.add('star-fly-anim'); }, 600);
            }, 3000);
        }, 500);
    });

    // --- FINAL PAGE ---
    const lovePath = document.querySelector('.love-path');
    const secretBoxContainer = document.getElementById('secret-box-container');
    const btnOpenSecret = document.getElementById('btn-open-secret');
    const finalGiftContainer = document.getElementById('final-gift-container');
    const loveContainer = document.getElementById('love-drawing-container');

    function triggerFinalAnimation() {
        lovePath.classList.add('draw-anim');
        setTimeout(() => {
            secretBoxContainer.classList.remove('hidden');
            setTimeout(() => secretBoxContainer.classList.add('show'), 100);
        }, 3500);
    }

    btnOpenSecret.addEventListener('click', () => {
        if(navigator.vibrate) navigator.vibrate([50, 100, 50]);
        secretBoxContainer.classList.remove('show');
        loveContainer.style.opacity = '0';
        
        setTimeout(() => {
            secretBoxContainer.classList.add('hidden');
            loveContainer.classList.add('hidden');
            
            finalGiftContainer.classList.remove('hidden');
            setTimeout(() => finalGiftContainer.classList.add('show'), 100);
        }, 800);
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
        window.scrollTo(0,0);
        location.reload();
    });

});
