document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const buyButtons = document.querySelectorAll('.btn-buy');
    const paymentCards = document.querySelectorAll('.payment-card');
    const wechatCard = document.querySelector('.wechat-qr');
    const phoneCard = document.querySelector('.phone-contact');
    const modal = document.getElementById('wechat-modal');
    const closeBtn = document.querySelector('.close');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 如果是锚点链接（以#开头），则平滑滚动
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
            // 如果是页面链接（如 products.html），则允许默认跳转
        });
    });

    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            alert(`已选择：${productName}\n\n请通过以下方式购买：\n1. 点击闲鱼链接购买\n2. 添加微信：原形工坊\n3. 电话联系：16627878630`);
        });
    });

    wechatCard?.addEventListener('click', function() {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });

    phoneCard?.addEventListener('click', function() {
        alert('联系电话：16627878630\n工作时间：9:00-18:00（每周6天）');
    });

    closeBtn?.addEventListener('click', function() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});