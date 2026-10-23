document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const enterBtn = document.getElementById('enterBtn');
    const mainContent = document.getElementById('main-content');
    const windAudio = document.getElementById('windAudio');
    
    let isTransitioning = false;

    // GIAI ĐOẠN 1 & TRÌNH TỰ XUẤT HIỆN: Kích hoạt hiệu ứng sau khi tải trang
    window.setTimeout(() => {
        introScreen.classList.add('loaded');
    }, 200);

    // Xử lý phát âm thanh gió an toàn sau thao tác đầu tiên của người dùng (tránh policy chặn của trình duyệt)
    const playWindAudio = () => {
        if (windAudio) {
            windAudio.volume = 0;
            windAudio.play().then(() => {
                // Tăng âm lượng dần (Fade-in)
                let vol = 0;
                const fadeInterval = setInterval(() => {
                    if (vol < 0.4) {
                        vol += 0.05;
                        windAudio.volume = Math.min(vol, 0.4);
                    } else {
                        clearInterval(fadeInterval);
                    }
                }, 200);
            }).catch(err => {
                // Trình duyệt từ chối hoặc không tìm thấy file audio -> Bỏ qua an toàn, không làm hỏng trang
                console.log("Audio autoplay restricted or file missing:", err);
            });
        }
        // Gỡ bỏ sự kiện sau lần chạm/click đầu tiên
        window.removeEventListener('click', playWindAudio);
        window.removeEventListener('keydown', playWindAudio);
    };

    window.addEventListener('click', playWindAudio);
    window.addEventListener('keydown', playWindAudio);

    // ANIMATION CHUYỂN TỪ INTRO VÀO WEBSITE KHI NHẤN ENTER
    enterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isTransitioning) return;
        isTransitioning = true;

        // 1. Phản hồi trực quan nút
        enterBtn.style.transform = 'scale(0.95)';

        // 2. Giảm âm lượng tiếng gió dần dần (Fade-out)
        if (windAudio && !windAudio.paused) {
            let currentVol = windAudio.volume;
            const fadeOutInterval = setInterval(() => {
                if (currentVol > 0.05) {
                    currentVol -= 0.05;
                    windAudio.volume = Math.max(currentVol, 0);
                } else {
                    clearInterval(fadeOutInterval);
                    windAudio.pause();
                    windAudio.currentTime = 0;
                }
            }, 100);
        }

        // 3. Kích hoạt hiệu ứng chuyển cảnh (Tiến vào khung hình + Sương tuyết phủ)
        introScreen.classList.add('transitioning');

        // 4. Hoàn tất chuyển cảnh sau khoảng 1.8 - 2 giây
        setTimeout(() => {
            introScreen.classList.add('hidden');
            mainContent.classList.add('visible');
            mainContent.setAttribute('aria-hidden', 'false');
        }, 1800);
    });
});
