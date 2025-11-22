document.addEventListener('DOMContentLoaded', () => {
    const gradients = [
        ["#667eea", "#764ba2"],
        ["#f093fb", "#f5576c"],
        ["#4facfe", "#00f2fe"],
        ["#43e97b", "#38f9d7"],
        ["#fa709a", "#fee140"],
        ["#a8edea", "#fed6e3"],
        ["#ff9a9e", "#fecfef"],
        ["#ffecd2", "#fcb69f"],
        ["#a1c4fd", "#c2e9fb"],
        ["#d4fc79", "#96e6a1"],
        ["#84fab0", "#8fd3f4"],
        ["#a6c0fe", "#f68084"],
        ["#fccb90", "#d57eeb"]
    ];
    setupGradient(gradients);

    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            const { links } = config;
            setupLinks(links);
        })
        .catch(error => console.error('Error loading config:', error));

    const linksContainer = document.getElementById('links-container');
    const toast = document.getElementById('toast');

    function setupLinks(linksData) {
        linksData.forEach((item, index) => {
            const linkElement = document.createElement('div');
            linkElement.className = 'glass-effect rounded-2xl p-6 card-hover cursor-pointer group relative overflow-hidden';
            
            const iconGradients = [
                'from-blue-500 to-purple-600',
                'from-pink-500 to-rose-600', 
                'from-green-500 to-teal-600',
                'from-orange-500 to-red-600',
                'from-indigo-500 to-blue-600'
            ];
            
            const iconGradient = iconGradients[index % iconGradients.length];
            
            linkElement.innerHTML = `
                <div class="relative z-10">
                    <div class="w-16 h-16 bg-gradient-to-r ${iconGradient} rounded-2xl flex items-center justify-center mb-4 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-white text-center group-hover:text-yellow-300 group-hover:drop-shadow-lg transition-all duration-300">${item.title}</h3>
                </div>
                
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl group-hover:animate-pulse"></div>
            `;

            linkElement.addEventListener('click', (e) => {
                console.log('Card clicked:', item.title, item.link);
                createParticles(e.clientX, e.clientY);
                
                // 尝试现代的clipboard API
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(item.link).then(() => {
                        console.log('Copy successful with Clipboard API:', item.link);
                        showToast('复制成功！', '链接已保存到剪贴板');
                    }).catch(err => {
                        console.error('Clipboard API failed:', err);
                        fallbackCopyTextToClipboard(item.link);
                    });
                } else {
                    // 使用备用方法
                    fallbackCopyTextToClipboard(item.link);
                }
            });

            // 添加备用的复制方法
            function fallbackCopyTextToClipboard(text) {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        console.log('Copy successful with fallback method:', text);
                        showToast('复制成功！', '链接已保存到剪贴板');
                    } else {
                        console.error('Fallback copy failed');
                        showToast('复制失败', '请手动复制链接', 'error');
                    }
                } catch (err) {
                    console.error('Fallback copy error:', err);
                    showToast('复制失败', '请手动复制链接', 'error');
                } finally {
                    document.body.removeChild(textArea);
                }
            }

            linksContainer.appendChild(linkElement);
        });
    }

    function setupGradient(gradients) {
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
        const gradientCss = `linear-gradient(-45deg, ${randomGradient.join(', ')})`;
        
        const body = document.body;
        body.style.background = gradientCss;
        body.style.backgroundSize = '400% 400%';
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes gradient-animation {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            body {
                animation: gradient-animation 30s ease infinite;
            }
        `;
        document.head.appendChild(style);
    }

    function showToast(title = '复制成功！', message = '链接已保存到剪贴板', type = 'success') {
        console.log('showToast called:', title, message, type);
        
        const titleElement = toast.querySelector('.font-semibold');
        const messageElement = toast.querySelector('.text-sm');
        const iconElement = toast.querySelector('svg');
        const iconContainer = iconElement.parentElement;
        
        if (!titleElement || !messageElement || !iconElement) {
            console.error('Toast elements not found');
            return;
        }
        
        titleElement.textContent = title;
        messageElement.textContent = message;
        
        if (type === 'error') {
            iconContainer.className = 'w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0';
            iconElement.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
        } else {
            iconContainer.className = 'w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0';
            iconElement.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>';
        }
        
        // 移除之前的类
        toast.classList.remove('opacity-0', 'translate-x-full', 'toast-enter', 'toast-exit');
        
        // 显示toast
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
        toast.classList.add('toast-enter');
        
        // 3秒后隐藏
        setTimeout(() => {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            
            setTimeout(() => {
                toast.classList.remove('toast-exit');
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
            }, 300);
        }, 3000);
    }

    function createParticles(x, y) {
        const particleCount = 15;
        const colors = ['#60a5fa', '#a78bfa', '#34d399', '#f87171', '#fbbf24'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            document.body.appendChild(particle);

            const size = Math.random() * 6 + 3;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = Math.random() * 120 + 60;
            const translateX = `${Math.cos(angle) * distance}px`;
            const translateY = `${Math.sin(angle) * distance}px`;

            particle.style.setProperty('--x', translateX);
            particle.style.setProperty('--y', translateY);

            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    }
});
