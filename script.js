document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const buyButtons = document.querySelectorAll('.btn-buy');
    const paymentCards = document.querySelectorAll('.payment-card');
    const wechatPayment = document.querySelector('.wechat-payment');
    const phoneCard = document.querySelector('.phone-contact');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const productCards = document.querySelectorAll('.product-card');
    const contactButtons = document.querySelectorAll('.btn-contact');

    console.log('网站加载完成！');
    console.log('找到', tabBtns.length, '个分类按钮');
    console.log('找到', productCards.length, '个商品');

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

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            const subject = encodeURIComponent('【原形工坊】需求咨询 - ' + service);
            const body = encodeURIComponent(
                '姓名：' + name + '\n' +
                '电话：' + phone + '\n' +
                '服务类型：' + service + '\n' +
                '需求描述：\n' + message
            );

            const mailtoLink = 'mailto:2249144723@qq.com?subject=' + subject + '&body=' + body;
            window.location.href = mailtoLink;

            setTimeout(() => {
                alert('感谢您的咨询！\n\n您的需求信息已准备发送，我会尽快与您联系。\n\n如有紧急需求，可直接联系：\n📞 电话：16627878630\n📱 微信：li28430132');
                contactForm.reset();
            }, 500);
        });
    }
});
