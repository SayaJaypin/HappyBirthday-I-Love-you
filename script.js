document.addEventListener('DOMContentLoaded', () => {
    
    const PIN_CODE = "090812";
    let currentPin = "";
    
    // Screens & Layers
    const screenLock = document.getElementById('screen-lock');
    const screenLoading = document.getElementById('screen-loading');
    const mainInterface = document.getElementById('main-interface');
    const globalHeader = document.getElementById('global-header');
    const dockNav = document.querySelector('.dock-nav');
    
    // Views
    const views = document.querySelectorAll('.view-section');
    const dockItems = document.querySelectorAll('.dock-item');
    
    // --- PARTICLE BACKGROUND (Aesthetic Floating Dust) ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * -0.5 - 0.1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 40; i++) particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    initParticles();
    animateParticles();

    // --- PIN LOGIC ---
    const pinDots = document.querySelectorAll('.pin-dot');
    const numKeys = document.querySelectorAll('.num-key');
    
    function updatePinDisplay(isError = false) {
        pinDots.forEach((dot, idx) => {
            if (isError) {
                dot.classList.add('error');
            } else {
                dot.classList.remove('error');
                if (idx < currentPin.length) dot.classList.add('filled');
                else dot.classList.remove('filled');
            }
        });
    }
    
    numKeys.forEach(key => {
        key.addEventListener('click', () => {
            const val = key.getAttribute('data-val');
            const act = key.getAttribute('data-act');
            
            if (act === 'clear') {
                currentPin = "";
                updatePinDisplay();
            } else if (act === 'del') {
                currentPin = currentPin.slice(0, -1);
                updatePinDisplay();
            } else if (val && currentPin.length < 6) {
                currentPin += val;
                updatePinDisplay();
                if (currentPin.length === 6) verifyPin();
            }
        });
    });
    
    function verifyPin() {
        if (currentPin === PIN_CODE) {
            setTimeout(() => {
                screenLock.classList.remove('active');
                screenLoading.classList.add('active');
                simulateLoading();
            }, 300);
        } else {
            updatePinDisplay(true);
            setTimeout(() => {
                currentPin = "";
                updatePinDisplay();
            }, 500);
        }
    }

    // --- LOADING LOGIC ---
    function simulateLoading() {
        setTimeout(() => {
            screenLoading.classList.remove('active');
            mainInterface.classList.remove('hidden');
            
            // Trigger entry animations
            setTimeout(() => {
                globalHeader.classList.remove('hidden');
                dockNav.classList.remove('hidden');
                document.getElementById('view-home').classList.add('active');
                triggerScrollAnimations(document.getElementById('view-home'));
                startClocks();
                playMusic();
            }, 100);
        }, 2000);
    }

    // --- NAVIGATION LOGIC ---
    let giftAnimated = false;

    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            
            // Update active state in dock
            dockItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Switch views
            views.forEach(view => {
                if (view.id === targetId) {
                    view.classList.add('active');
                    setTimeout(() => triggerScrollAnimations(view), 50);
                    
                    if(targetId === 'view-gift' && !giftAnimated) {
                        giftAnimated = true;
                        runGiftAnimationSequence();
                    }
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });

    // --- INTERSECTION OBSERVER FOR FADE-UP ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    function triggerScrollAnimations(view) {
        const fadeElements = view.querySelectorAll('.fade-up:not(.visible)');
        fadeElements.forEach(el => observer.observe(el));
    }
    
    views.forEach(view => {
        view.addEventListener('scroll', () => triggerScrollAnimations(view), { passive: true });
    });

    // --- CLOCKS ---
    function startClocks() {
        const elWib = document.getElementById('time-wib');
        const elWita = document.getElementById('time-wita');
        const elWit = document.getElementById('time-wit');
        
        setInterval(() => {
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            
            const formatTime = (offset) => {
                const d = new Date(utc + (3600000 * offset));
                const h = String(d.getHours()).padStart(2, '0');
                const m = String(d.getMinutes()).padStart(2, '0');
                return `${h}:${m}`;
            };
            
            elWib.innerText = formatTime(7);
            elWita.innerText = formatTime(8);
            elWit.innerText = formatTime(9);
        }, 1000);
    }

    // --- MUSIC PLAYER ---
    const bgm = document.getElementById('bgm');
    const toggleMusicBtn = document.getElementById('toggle-music');
    const iconPlay = document.querySelector('.icon-play');
    const iconPause = document.querySelector('.icon-pause');
    const progressFill = document.getElementById('music-progress');

    function playMusic() {
        bgm.play().then(() => {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        }).catch(() => {
            // Autoplay blocked
            console.log("Interaction required for audio");
        });
    }

    toggleMusicBtn.addEventListener('click', () => {
        if (bgm.paused) {
            bgm.play();
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        } else {
            bgm.pause();
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        }
    });

    bgm.addEventListener('timeupdate', () => {
        if (bgm.duration) {
            const p = (bgm.currentTime / bgm.duration) * 100;
            progressFill.style.width = `${p}%`;
        }
    });

    // --- WISH LOGIC ---
    const btnWish = document.getElementById('btn-send-wish');
    const inputWish = document.getElementById('wish-input');
    const wishBox = document.getElementById('wish-box');
    const wishAnimLayer = document.getElementById('wish-animation-layer');
    const wishDisplay = document.getElementById('wish-display');
    const wishStar = document.getElementById('wish-star');

    btnWish.addEventListener('click', () => {
        const text = inputWish.value.trim();
        if(!text) return;
        
        wishBox.style.opacity = '0';
        setTimeout(() => {
            wishBox.classList.add('hidden');
            wishAnimLayer.classList.remove('hidden');
            wishDisplay.innerText = `"${text}"`;
            
            setTimeout(() => {
                wishDisplay.style.opacity = '0';
                setTimeout(() => {
                    wishStar.classList.add('star-fly');
                }, 800);
            }, 2500);
        }, 500);
    });

    // --- GIFT LOGIC ---
    const lovePath = document.getElementById('love-path');
    const svgContainer = document.getElementById('love-svg-container');
    const secretTrigger = document.getElementById('secret-box-trigger');
    const btnOpenGift = document.getElementById('btn-open-gift');
    const finalReward = document.getElementById('final-reward');
    const btnRestart = document.getElementById('btn-restart');

    function runGiftAnimationSequence() {
        setTimeout(() => {
            lovePath.classList.add('draw-active');
            setTimeout(() => {
                secretTrigger.classList.remove('hidden');
                setTimeout(() => secretTrigger.classList.add('visible'), 50);
            }, 4000);
        }, 500);
    }

    btnOpenGift.addEventListener('click', () => {
        secretTrigger.style.opacity = '0';
        svgContainer.style.opacity = '0';
        
        setTimeout(() => {
            secretTrigger.classList.add('hidden');
            svgContainer.classList.add('hidden');
            
            finalReward.classList.remove('hidden');
            setTimeout(() => finalReward.classList.add('visible'), 100);
        }, 600);
    });

    btnRestart.addEventListener('click', () => {
        location.reload();
    });

});
