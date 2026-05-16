const BASE_URL = 'https://liqian2249144723-github-io.onrender.com';

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const buyButtons = document.querySelectorAll('.btn-buy');
    const paymentCards = document.querySelectorAll('.payment-card');
    const wechatPayment = document.querySelector('.wechat-payment');
    const phoneCard = document.querySelector('.phone-contact');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const productCards = document.querySelectorAll('.product-card');
    const contactButtons = document.querySelectorAll('.btn-contact');
    const messageForm = document.querySelector('.message-form');
    const themeToggle = document.getElementById('theme-toggle');

    console.log('网站加载完成！');

    initAPICalls();

    initThemeToggle();

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);

                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });

                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            alert('已选择：' + productName + '\n\n请通过以下方式购买：\n1. 点击闲鱼链接购买\n2. 添加微信：li28430132\n3. 电话联系：16627878630');
        });
    });

    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceName = this.getAttribute('data-service');
            alert('您想咨询「' + serviceName + '」服务\n\n请通过以下方式联系我：\n📞 电话：16627878630\n💬 QQ：2249144723\n📱 微信：li28430132\n\n工作时间：9:00-18:00（周一到周六）');
        });
    });

    wechatPayment?.addEventListener('click', function() {
        alert('微信支付：\n\n扫码添加微信，获取更多优惠！');
    });

    phoneCard?.addEventListener('click', function() {
        alert('联系电话：16627878630\n工作时间：9:00-18:00（周一到周六）');
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            console.log('点击了分类：', tab);

            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            let showCount = 0;
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (tab === 'all' || tab === category) {
                    card.classList.remove('hidden');
                    showCount++;
                } else {
                    card.classList.add('hidden');
                }
            });
            console.log('显示', showCount, '个商品');
        });
    });

    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const text = this.getAttribute('data-copy');
            const label = this.getAttribute('data-label');
            
            navigator.clipboard.writeText(text).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> 已复制！';
                this.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                }, 2000);
            }).catch(err => {
                alert(label + '：' + text + '\n\n已显示在屏幕上，请手动复制');
            });
        });
    });

    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                content: document.getElementById('content').value
            };

            fetch(`${BASE_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                messageForm.reset();
            })
            .catch(error => {
                console.error('发送失败:', error);
                alert('发送失败，请稍后重试');
            });
        });
    }
});

function initAPICalls() {
    fetchStats();
    fetchProducts();
    fetchContact();
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', function() {
        const isLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

function fetchStats() {
    fetch(`${BASE_URL}/api/stats`)
        .then(response => response.json())
        .then(data => {
            const statValues = document.querySelectorAll('.stat-value');
            if (statValues.length >= 4) {
                statValues[0].textContent = data.years + '年';
                statValues[1].textContent = data.videos + '+';
                statValues[2].textContent = data.students + '+';
                statValues[3].textContent = data.projects + '+';
            }
            console.log('获取统计数据成功:', data);
        })
        .catch(error => {
            console.log('获取统计数据失败（可能后端未启动）:', error);
        });
}

function fetchProducts() {
    fetch(`${BASE_URL}/api/products`)
        .then(response => response.json())
        .then(data => {
            console.log('获取商品数据成功:', data);
            updateProductCards(data);
        })
        .catch(error => {
            console.log('获取商品数据失败（可能后端未启动）:', error);
        });
}

function fetchContact() {
    fetch(`${BASE_URL}/api/contact`)
        .then(response => response.json())
        .then(data => {
            console.log('获取联系信息成功:', data);
            updateContactInfo(data);
        })
        .catch(error => {
            console.log('获取联系信息失败（可能后端未启动）:', error);
        });
}

function updateProductCards(products) {
    const container = document.querySelector('.products-grid');
    if (!container) return;

    const cards = container.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        if (products[index]) {
            const title = card.querySelector('.product-title');
            const price = card.querySelector('.product-price');
            const desc = card.querySelector('.product-desc');
            
            if (title) title.textContent = products[index].name;
            if (price) price.textContent = '¥' + products[index].price;
            if (desc) desc.textContent = products[index].description;
        }
    });
}

function updateContactInfo(contact) {
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const icon = item.querySelector('i');
        if (icon) {
            if (icon.classList.contains('fa-phone')) {
                item.querySelector('span').textContent = contact.phone;
            } else if (icon.classList.contains('fa-qq')) {
                item.querySelector('span').textContent = 'QQ：' + contact.qq;
            } else if (icon.classList.contains('fa-weixin')) {
                item.querySelector('span').textContent = '微信：' + contact.wechat;
            } else if (icon.classList.contains('fa-clock')) {
                item.querySelector('span').textContent = '工作时间：' + contact.workTime;
            } else if (icon.classList.contains('fa-map-marker-alt')) {
                item.querySelector('span').textContent = '地点：' + contact.address;
            }
        }
    });

    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        const label = btn.getAttribute('data-label');
        if (label === '微信') btn.setAttribute('data-copy', contact.wechat);
        if (label === 'QQ') btn.setAttribute('data-copy', contact.qq);
        if (label === '电话') btn.setAttribute('data-copy', contact.phone);
    });
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}