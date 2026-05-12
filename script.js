document.addEventListener('DOMContentLoaded', function() {
    const workItems = document.querySelectorAll('.work-item');
    const modal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('video-title');
    const modalViews = document.getElementById('video-views');

    workItems.forEach(item => {
        item.addEventListener('click', function() {
            const thumbnail = this.querySelector('.work-thumbnail img');
            const title = this.querySelector('.work-title').textContent;
            const views = this.querySelector('.work-views').textContent;
            
            modalImage.src = thumbnail.src;
            modalTitle.textContent = title;
            modalViews.textContent = `播放量: ${views}`;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

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
            
            const activeSection = document.getElementById(`${tabName}-section`) || document.getElementById('works-section');
            if (activeSection) {
                activeSection.style.display = 'block';
            }
        });
    });

    const followBtn = document.querySelector('.btn-follow');
    followBtn.addEventListener('click', function() {
        if (this.textContent === '+ 关注') {
            this.textContent = '已关注';
            this.style.background = 'rgba(255, 44, 85, 0.2)';
            this.style.borderColor = '#ff2c55';
        } else {
            this.textContent = '+ 关注';
            this.style.background = 'transparent';
            this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }
    });

    const shareBtn = document.querySelector('.btn-share');
    shareBtn.addEventListener('click', function() {
        const shareText = `快来关注 @原形工坊 的抖音主页！专注于嵌入式开发、单片机技术分享`;
        
        if (navigator.share) {
            navigator.share({
                title: '原形工坊 - 抖音',
                text: shareText,
                url: window.location.href
            }).then(() => {
                console.log('分享成功');
            }).catch((err) => {
                console.log('分享取消或失败:', err);
            });
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = shareText + '\n' + window.location.href;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            alert('链接已复制到剪贴板！');
        }
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

    const workThumbnails = document.querySelectorAll('.work-thumbnail img');
    workThumbnails.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});