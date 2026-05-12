document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.works-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.dataset.tab;
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            const activeSection = document.getElementById(`${tabName}-section`) || document.getElementById('products-section');
            if (activeSection) {
                activeSection.style.display = 'block';
            }
        });
    });

    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.dataset.product;
            alert(`您选择购买：${productName}\n\n请通过以下方式联系购买：\n微信：原形工坊\n或访问闲鱼店铺购买`);
        });
    });

    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(15, 15, 15, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)';
            header.style.backdropFilter = 'none';
        }
    });
});