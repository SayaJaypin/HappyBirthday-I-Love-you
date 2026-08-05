/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // --- STATE & ELEMENTS ---
    const PIN_CODE = "090812";
    let enteredPin = "";
    
    // Screens
    const screenPin = document.getElementById('screen-pin');
    const screenLoading = document.getElementById('screen-loading');
    const mainApp = document.getElementById('main-app');
    
    // Navigation & Pages
    const pages = document.querySelectorAll('.page');
    const navItems = document.querySelectorAll('.nav-item');
    const bottomNav = document.querySelector('.bottom-nav');
    
    // UI Elements
    const clocksContainer = document.getElementById('clocks-container');
    const musicPlayer = document.getElementById('music-player');
    
    // --- PIN LOGIC ---
    const dots = document.querySelectorAll('.dot');
    const keys = document.querySelectorAll('.key');

    keys.forEach(key => {
        key.addEventListener('click', () => {
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
            // Success
            setTimeout(() => {
                screenPin.classList.remove('active');
                screenLoading.classList.add('active');
                startLoading();
            }, 300);
        } else {
            // Error
            dots.forEach(dot => dot.classList.add('error'));
            setTimeout(() => {
                enteredPin = "";
                updateDots();
            }, 600);
        }
    }

    // --- LOADING LOGIC ---
    function startLoading() {
        const loadingBar = document.querySelector('.loading-bar');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                loadingBar.style.width = '100%';
                setTimeout(() => initApp(), 800);
            } else {
                loadingBar.style.width = progress + '%';
            }
        }, 200);
    }

    // --- INIT APP ---
    function initApp() {
        screenLoading.classList.remove('active');
        mainApp.classList.add('active');
        
        // Show UI Overlays
        setTimeout(() => {
            bottomNav.classList.add('visible');
            clocksContainer.classList.add('visible');
            musicPlayer.classList.add('visible');
            startClocks();
            createFloatingDecorations();
            startFireworks();
            // Try autoplay music (might be blocked by browser until interaction, but pin pad counts as interaction)
            const bgMusic = document.getElementById('bg-music');
            bgMusic.play().catch(e => console.log("Autoplay blocked, waiting for user toggle."));
            updatePlayPauseIcon(true);
        }, 500);
    }

    // --- NAVIGATION LOGIC ---
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            
            // Update Nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Update Pages
            pages.forEach(page => {
                if (page.id === targetId) {
                    page.classList.add('active');
                    // Trigger scroll animations for new page
                    setTimeout(() => checkScroll(page), 100);
                    // Special check for final page
                    if(targetId === 'page-final' && !window.finalAnimated) {
                        triggerFinalAnimation();
                        window.finalAnimated = true;
                    }
                } else {
                    page.classList.remove('active');
                }
            });
        });
    });

    // --- SCROLL ANIMATIONS (Intersection Observer fallback/manual) ---
    function checkScroll(page) {
        const elements = page.querySelectorAll('.animate-on-scroll');
        const triggerBottom = window.innerHeight * 0.9;
        
        elements.forEach(el => {
            const box = el.getBoundingClientRect();
            if (box.top < triggerBottom) {
                el.classList.add('scrolled');
            }
        });
    }

    pages.forEach(page => {
        page.addEventListener('scroll', () => {
            requestAnimationFrame(() => checkScroll(page));
        });
    });

    // --- REALTIME CLOCKS ---
    function startClocks() {
        setInterval(() => {
            const now = new Date();
            
            // Format time helper
            const format = (date) => {
                const h = String(date.getHours()).padStart(2, '0');
                const m = String(date.getMinutes()).padStart(2, '0');
                const s = String(date.getSeconds()).padStart(2, '0');
                return `${h}:${m}:${s}`;
            };

            // UTC Time
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            
            // WIB (UTC+7)
            const wibDate = new Date(utc + (3600000 * 7));
            document.getElementById('wib-time').innerText = format(wibDate);
            
            // WITA (UTC+8)
            const witaDate = new Date(utc + (3600000 * 8));
            document.getElementById('wita-time').innerText = format(witaDate);
            
            // WIT (UTC+9)
            const witDate = new Date(utc + (3600000 * 9));
            document.getElementById('wit-time').innerText = format(witDate);
            
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
        if (isPlaying) {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        } else {
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        }
    }

    btnPlayPause.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            updatePlayPauseIcon(true);
        } else {
            bgMusic.pause();
            updatePlayPauseIcon(false);
        }
    });

    btnMute.addEventListener('click', () => {
        bgMusic.muted = !bgMusic.muted;
        btnMute.style.opacity = bgMusic.muted ? '0.5' : '1';
    });

    bgMusic.addEventListener('timeupdate', () => {
        if(bgMusic.duration) {
            const progressPercent = (bgMusic.currentTime / bgMusic.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
    });

    // --- FLOATING DECORATIONS ---
    function createFloatingDecorations() {
        const container = document.getElementById('floating-decorations');
        const types = ['decor-flower', 'decor-star', 'decor-leaf'];
        const count = 15;
        
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            const type = types[Math.floor(Math.random() * types.length)];
            el.classList.add('decor-svg', type);
            
            // Random properties
            const left = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = 10 + Math.random() * 15;
            const size = 0.5 + Math.random() * 1;
            
            el.style.left = `${left}vw`;
            el.style.animationDelay = `${delay}s`;
            el.style.animationDuration = `${duration}s`;
            el.style.transform = `scale(${size})`;
            
            container.appendChild(el);
        }
    }

    // --- CANVAS FIREWORKS (Simplified Premium Effect) ---
    function startFireworks() {
        const canvas = document.getElementById('fireworks-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        const colors = ['#ffe6ea', '#d8b4e2', '#FFD700', '#ffffff'];

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3 + 1;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 1.0;
                this.decay = Math.random() * 0.015 + 0.015;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.05; // gravity
                this.life -= this.decay;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.hexToRgb(this.color)}, ${this.life})`;
                ctx.fill();
            }
            hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255,255,255';
            }
        }

        function createExplosion(x, y) {
            for(let i=0; i<30; i++) particles.push(new Particle(x, y));
        }

        // Auto trigger fireworks
        setInterval(() => {
            if(document.getElementById('page-opening').classList.contains('active')) {
                createExplosion(Math.random() * canvas.width, canvas.height * 0.2 + Math.random() * canvas.height * 0.3);
            }
        }, 1500);

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles = particles.filter(p => p.life > 0);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- MAKE A WISH LOGIC ---
    const btnSendWish = document.getElementById('btn-send-wish');
    const wishInput = document.getElementById('wish-input');
    const wishCardContainer = document.getElementById('wish-card-container');
    const wishAnimContainer = document.getElementById('wish-animation-container');
    const wishDisplay = document.getElementById('wish-display');
    const flyingStar = document.getElementById('flying-star');

    btnSendWish.addEventListener('click', () => {
        const text = wishInput.value.trim();
        if(!text) return;
        
        wishCardContainer.style.opacity = '0';
        setTimeout(() => {
            wishCardContainer.classList.add('hidden');
            wishAnimContainer.classList.remove('hidden');
            
            wishDisplay.innerText = `"${text}"`;
            
            // Fade out text after 2s
            setTimeout(() => {
                wishDisplay.style.opacity = '0';
                // Trigger Star
                setTimeout(() => {
                    flyingStar.classList.add('star-fly-anim');
                }, 500);
            }, 2500);
            
        }, 500);
    });

    // --- FINAL PAGE LOGIC ---
    const lovePath = document.querySelector('.love-path');
    const secretBoxContainer = document.getElementById('secret-box-container');
    const btnOpenSecret = document.getElementById('btn-open-secret');
    const finalGiftContainer = document.getElementById('final-gift-container');
    const btnReset = document.getElementById('btn-reset');
    const loveContainer = document.getElementById('love-drawing-container');

    function triggerFinalAnimation() {
        lovePath.classList.add('draw-anim');
        setTimeout(() => {
            secretBoxContainer.classList.remove('hidden');
            setTimeout(() => {
                secretBoxContainer.classList.add('show');
            }, 100);
        }, 4500); // Wait for draw to finish
    }

    btnOpenSecret.addEventListener('click', () => {
        secretBoxContainer.classList.remove('show');
        loveContainer.style.opacity = '0';
        
        setTimeout(() => {
            secretBoxContainer.classList.add('hidden');
            loveContainer.classList.add('hidden');
            
            finalGiftContainer.classList.remove('hidden');
            setTimeout(() => {
                finalGiftContainer.classList.add('show');
            }, 100);
        }, 1000);
    });

    btnReset.addEventListener('click', () => {
        location.reload();
    });

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(registration => {
                console.log('SW registered: ', registration.scope);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
        });
    }
});
