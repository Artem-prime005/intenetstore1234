document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                // Если ссылки пустые (#), отменяем переход по умолчанию
                if(button.getAttribute('href') === '#') {
                    e.preventDefault();
                }
                
                const platform = button.getAttribute('data-platform');
                console.log(`Користувач переходить на: ${platform}`);
                      });
        });

        const startButton = document.getElementById('start-conversion-btn');

// Перевіряємо, чи кнопка існує на сторінці, щоб уникнути помилок
if (startButton) {
    startButton.addEventListener('click', function() {
        // Надсилаємо кастомну подію в Google Analytics
        gtag('event', 'click_start_btn', {
            'event_category': 'engagement',
            'event_label': 'Start Button Click'
        });
        
        console.log('Подія click_start_btn успішно відправлена!');
    });
}
