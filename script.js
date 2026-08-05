document.addEventListener('DOMContentLoaded', () => {
    // BRUTAL ENGINE: GLOBAL VARIABLES
    const els = {
        cursorCore: document.getElementById('brutal-cursor-core'),
        cursorAura: document.getElementById('brutal-cursor-aura'),
        neuralCanvas: document.getElementById('neural-bg-canvas'),
        freqCanvas: document.getElementById('frequency-visualizer'),
        audioCore: document.getElementById('core-audio-engine'),
        playBtn: document.getElementById('master-play-btn'),
        lockScreen: document.getElementById('protocol-lock'),
        initScreen: document.getElementById('sequence-init'),
        mainEngine: document.getElementById('brutal-scroll-engine'),
        masterHud: document.getElementById('master-hud'),
        masterDock: document.getElementById('master-dock'),
        gyroMaster: document.getElementById('gyro-master')
    };

    // 1. BRUTAL CURSOR DYNAMICS (SPRING PHYSICS)
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let cx = mx, cy = my, ax = mx, ay = my;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    document.querySelectorAll('button, a, .glass-brutal').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    function renderCursor() {
        cx += (mx - cx) * 0.3; cy += (my - cy) * 0.3; // Fast follow
        ax += (mx - ax) * 0.1; ay += (my - ay) * 0.1; // Spring follow
        if(els.cursorCore) {
            els.cursorCore.style.transform = `translate(${cx}px, ${cy}px)`;
            els.cursorAura.style.transform = `translate(${ax}px, ${ay}px)`;
        }
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // 2. NEURAL NETWORK PARTICLE ENGINE (BACKGROUND PHYSICS)
    const nCtx = els.neuralCanvas.getContext('2d');
    let particles = [];
    function resizeNeural() { els.neuralCanvas.width = window.innerWidth; els.neuralCanvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeNeural); resizeNeural();
    class NeuralNode {
        constructor() {
            this.x = Math.random() * els.neuralCanvas.width;
            this.y = Math.random() * els.neuralCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.r = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if(this.x < 0 || this.x > els.neuralCanvas.width) this.vx *= -1;
            if(this.y < 0 || this.y > els.neuralCanvas.height) this.vy *= -1;
        }
        draw() {
            nCtx.beginPath(); nCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            nCtx.fillStyle = 'rgba(212, 139, 160, 0.3)'; nCtx.fill();
        }
    }
    for(let i=0; i<80; i++) particles.push(new NeuralNode());
    function renderNeural() {
        nCtx.clearRect(0,0,els.neuralCanvas.width,els.neuralCanvas.height);
        for(let i=0; i<particles.length; i++) {
            particles[i].update(); particles[i].draw();
            for(let j=i; j<particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 120) {
                    nCtx.beginPath(); nCtx.strokeStyle = `rgba(212, 139, 160, ${1 - dist/120})`;
                    nCtx.lineWidth = 0.5; nCtx.moveTo(particles[i].x, particles[i].y);
                    nCtx.lineTo(particles[j].x, particles[j].y); nCtx.stroke();
                }
            }
        }
        requestAnimationFrame(renderNeural);
    }
    renderNeural();

    // 3. RIPPLE BLAST ENGINE
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('.ripple-trigger');
        if(!target) return;
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-wave');
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });

    // 4. BATTERY & TIME TELEMETRY
    function initTelemetry() {
        setInterval(() => {
            const d = new Date(); const u = d.getTime() + (d.getTimezoneOffset() * 60000);
            const fmt = (o) => { const td = new Date(u + (3600000*o)); return `${String(td.getHours()).padStart(2,'0')}:${String(td.getMinutes()).padStart(2,'0')}:${String(td.getSeconds()).padStart(2,'0')}`; };
            document.getElementById('sys-wib').innerText = fmt(7);
            document.getElementById('sys-wita').innerText = fmt(8);
            document.getElementById('sys-wit').innerText = fmt(9);
        }, 1000);

        if('getBattery' in navigator) {
            navigator.getBattery().then(b => {
                const up = () => {
                    const l = Math.round(b.level * 100);
                    document.getElementById('batt-percent').innerText = `${l}%`;
                    const f = document.getElementById('batt-fluid');
                    f.style.width = `${l}%`;
                    l <= 20 ? f.classList.add('b-low') : f.classList.remove('b-low');
                }; up(); b.addEventListener('levelchange', up);
            });
        }
    }
    initTelemetry();

    // 5. SECURITY PROTOCOL LOGIC
    const PIN = "090812"; let attempt = "";
    const pNodes = document.querySelectorAll('.pin-node');
    
    function refreshNodes(err=false) {
        pNodes.forEach((n,i) => {
            if(err) n.classList.add('p-error');
            else {
                n.classList.remove('p-error');
                i < attempt.length ? n.classList.add('p-filled') : n.classList.remove('p-filled');
            }
        });
    }
    
    document.querySelectorAll('.kp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.classList.contains('clr')) attempt = "";
            else if(btn.classList.contains('del')) attempt = attempt.slice(0,-1);
            else if(attempt.length < 6) {
                attempt += btn.innerText;
                if(attempt.length === 6) {
                    refreshNodes();
                    if(attempt === PIN) authorize();
                    else {
                        document.querySelector('.lock-chassis').classList.add('error-shake');
                        refreshNodes(true);
                        setTimeout(() => { attempt = ""; refreshNodes(); document.querySelector('.lock-chassis').classList.remove('error-shake'); }, 500);
                    }
                    return;
                }
            }
            refreshNodes();
        });
    });

    function authorize() {
        els.lockScreen.style.opacity = '0';
        setTimeout(() => {
            els.lockScreen.classList.remove('active-overlay');
            els.lockScreen.classList.add('hidden');
            bootSequence();
        }, 800);
    }

    // 6. BOOT SEQUENCE & AUDIO CONTEXT
    let actx, asrc, aanl, adata;
    function bootSequence() {
        els.initScreen.classList.remove('hidden');
        let p = 0; const el = document.getElementById('load-val');
        const logs = ["Memuat memori...", "Mendekripsi rasa...", "Sinkronisasi detak jantung...", "Mengamankan koneksi...", "Sistem Siap."];
        const logEl = document.getElementById('term-output');
        const intv = setInterval(() => {
            p += Math.floor(Math.random() * 12) + 3;
            if(p >= 100) { p = 100; clearInterval(intv); executeMain(); }
            el.innerText = `${p}%`;
            if(p % 25 === 0) logEl.innerText = logs[Math.min(Math.floor(p/25), 4)];
        }, 150);
    }

    function executeMain() {
        els.initScreen.style.opacity = '0';
        setTimeout(() => {
            els.initScreen.classList.add('hidden');
            document.body.classList.add('scroll-unlocked');
            els.masterHud.classList.remove('hidden');
            els.mainEngine.classList.remove('hidden');
            els.masterDock.classList.remove('hidden');
            
            // Audio Web API Logic
            actx = new (window.AudioContext || window.webkitAudioContext)();
            aanl = actx.createAnalyser();
            asrc = actx.createMediaElementSource(els.audioCore);
            asrc.connect(aanl); aanl.connect(actx.destination);
            aanl.fftSize = 64; adata = new Uint8Array(aanl.frequencyBinCount);
            
            const fCtx = els.freqCanvas.getContext('2d');
            function drawFreq() {
                requestAnimationFrame(drawFreq);
                aanl.getByteFrequencyData(adata);
                fCtx.clearRect(0,0, els.freqCanvas.width, els.freqCanvas.height);
                let bw = (els.freqCanvas.width / aanl.frequencyBinCount) * 2;
                let x = 0;
                for(let i=0; i<aanl.frequencyBinCount; i++) {
                    let bh = (adata[i] / 255) * els.freqCanvas.height;
                    fCtx.fillStyle = `rgba(212, 139, 160, ${bh/els.freqCanvas.height + 0.2})`;
                    fCtx.fillRect(x, els.freqCanvas.height - bh, bw, bh);
                    x += bw + 1;
                }
            }
            drawFreq();
            
            els.audioCore.play().then(() => togglePlayUI(true)).catch(()=>{});
            initHardwareSensors();
            initBrutalObserver();
        }, 800);
    }

    els.playBtn.addEventListener('click', () => {
        if(actx && actx.state === 'suspended') actx.resume();
        if(els.audioCore.paused) { els.audioCore.play(); togglePlayUI(true); }
        else { els.audioCore.pause(); togglePlayUI(false); }
    });
    function togglePlayUI(isp) {
        if(isp) { document.querySelector('.svg-play').classList.add('hidden'); document.querySelector('.svg-pause').classList.remove('hidden'); }
        else { document.querySelector('.svg-play').classList.remove('hidden'); document.querySelector('.svg-pause').classList.add('hidden'); }
    }

    // 7. HARDWARE SENSOR PARALLAX (GYRO + MOUSE)
    function initHardwareSensors() {
        if(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(r => { if(r === 'granted') attachGyro(); }).catch(console.error);
        } else attachGyro();
        
        function attachGyro() {
            window.addEventListener('deviceorientation', (e) => {
                let y = e.beta, x = e.gamma;
                if(x > 90) x=90; if(x < -90) x=-90;
                els.gyroMaster.style.transform = `rotateY(${(x/90)*25}deg) rotateX(${(y/90)*-25}deg)`;
            });
        }
        document.getElementById('mod-hero').addEventListener('mousemove', (e) => {
            let xa = (window.innerWidth/2 - e.pageX)/20, ya = (window.innerHeight/2 - e.pageY)/20;
            els.gyroMaster.style.transform = `rotateY(${xa}deg) rotateX(${ya}deg)`;
        });
        document.getElementById('mod-hero').addEventListener('mouseleave', () => els.gyroMaster.style.transform = `rotateY(0deg) rotateX(0deg)`);
    }

    // 8. BRUTAL INTERSECTION OBSERVER & PARALLAX ENGINE
    function initBrutalObserver() {
        // Split text preparation
        const st = document.querySelector('.split-text-anim');
        st.innerHTML = st.textContent.replace(/\S/g, "<span class='char'>$&</span>");
        
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if(e.isIntersecting) {
                    e.target.classList.add('triggered');
                    if(e.target.id === 'heart-decrypt-sequence' && !window.giftTrig) {
                        window.giftTrig = true;
                        e.target.classList.add('draw-heart-anim');
                        setTimeout(() => {
                            const gm = document.getElementById('gift-trigger-module');
                            gm.classList.remove('hidden');
                            setTimeout(() => gm.style.opacity = '1', 50);
                        }, 4000);
                    }
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.fade-up-anim, .split-text-anim').forEach(el => obs.observe(el));

        // Parallax Scroll Engine
        const pMods = document.querySelectorAll('.parallax-module');
        const sections = document.querySelectorAll('.brutal-section');
        const dItems = document.querySelectorAll('.d-item');

        window.addEventListener('scroll', () => {
            let sy = window.scrollY;
            pMods.forEach((pm, i) => pm.style.transform = `translateY(${-(sy * (0.04 + i*0.01))}px)`);
            
            let curr = '';
            sections.forEach(sec => { if(sy >= sec.offsetTop - window.innerHeight/2) curr = sec.getAttribute('id'); });
            dItems.forEach(di => {
                di.classList.remove('active');
                if(di.getAttribute('href') === `#${curr}`) di.classList.add('active');
            });
        }, { passive: true });
        
        dItems.forEach(di => di.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(di.getAttribute('href')).scrollIntoView({behavior: 'smooth'});
        }));
    }

    // 9. WISH TRANSMITTER LOGIC
    document.getElementById('cmd-send-wish').addEventListener('click', () => {
        const val = document.getElementById('wish-input-field').value.trim();
        if(!val) return;
        const term = document.getElementById('wish-terminal');
        const exec = document.getElementById('wish-execution');
        const disp = document.getElementById('wish-display');
        const proj = document.getElementById('star-projectile');
        
        term.style.opacity = '0';
        setTimeout(() => {
            term.classList.add('hidden');
            exec.classList.remove('hidden');
            disp.innerText = `"${val}"`;
            setTimeout(() => {
                disp.style.opacity = '0';
                setTimeout(() => proj.classList.add('projectile-anim'), 1000);
            }, 3000);
        }, 500);
    });

    // 10. GIFT DECRYPTION LOGIC
    document.getElementById('cmd-decrypt-gift').addEventListener('click', () => {
        const gm = document.getElementById('gift-trigger-module');
        const hs = document.getElementById('heart-decrypt-sequence');
        const pld = document.getElementById('final-payload');
        
        gm.style.opacity = '0'; hs.style.opacity = '0';
        setTimeout(() => {
            gm.classList.add('hidden'); hs.classList.add('hidden');
            pld.classList.remove('hidden');
            setTimeout(() => pld.style.opacity = '1', 100);
        }, 800);
    });
});
