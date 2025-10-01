// 🚀 СОВРЕМЕННЫЙ JavaScript ДЛЯ УЛЬТРА-СТИЛЬНОГО САЙТА

document.addEventListener('DOMContentLoaded', function () {
    // ПРИНУДИТЕЛЬНО УСТАНАВЛИВАЕМ БЕЛЫЙ ЦВЕТ ДЛЯ СТАТИСТИКИ
    setTimeout(() => {
        const statNumbers = document.querySelectorAll('.hero-stats div:first-child');
        const statLabels = document.querySelectorAll('.hero-stats div:last-child');

        statNumbers.forEach(el => {
            el.style.color = '#ffffff !important';
            el.style.fontWeight = '900 !important';
        });

        statLabels.forEach(el => {
            el.style.color = '#ffffff !important';
            el.style.fontWeight = '500 !important';
        });
    }, 100);

    // Инициализация всех компонентов
    initPreloader();
    initScrollAnimations();
    initHeader();
    initMobileMenu();
    initModals();
    initForms();
    initSmoothScroll();
    initPhoneFormatting();
    initParallax();
    initModernFeatures();
    initAnimatedBorders();
    initModernInteractions();
    initPerformanceOptimizations();

    // Обработка якорей при загрузке страницы
    handlePageAnchor();

    // Плавная загрузка страницы с улучшенными эффектами
    setTimeout(() => {
        document.body.classList.add('loaded');
        initPageLoadAnimations();
    }, 150);

    // Современная оптимизация производительности
    initIntersectionObserver();

    console.log('🎨 Современный дизайн загружен успешно!');
});

// Обработка якорей при загрузке страницы
function handlePageAnchor() {
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 500); // Небольшая задержка для загрузки контента
    }
}

// Прелоадер
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Скрываем прелоадер сразу, если страница уже загружена
        if (document.readyState === 'complete') {
            preloader.style.display = 'none';
            return;
        }

        // Показываем прелоадер только при первой загрузке
        window.addEventListener('load', function () {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 300);
            }, 500); // Уменьшили время показа
        });
    }
}

// Анимации при скролле
function initScrollAnimations() {
    // Проверяем поддержку Intersection Observer
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target._scrollAnimationStarted) {
                    entry.target._scrollAnimationStarted = true;
                    entry.target.classList.add('animate');

                    // Добавляем задержку для каскадной анимации
                    const delay = entry.target.dataset.delay || 0;
                    entry.target.style.animationDelay = delay + 'ms';
                }
            });
        }, observerOptions);

        // Наблюдаем за элементами для анимации
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        // Наблюдаем за карточками услуг
        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.dataset.delay = index * 200;
            observer.observe(card);
        });

        // Наблюдаем за фотографиями
        document.querySelectorAll('.photo-item').forEach((photo, index) => {
            photo.classList.add('animate-on-scroll');
            photo.dataset.delay = index * 150;
            observer.observe(photo);
        });

        // Наблюдаем за карточками услуг современного дизайна
        document.querySelectorAll('.service-card-modern').forEach((card, index) => {
            if (!card.classList.contains('animate-on-scroll')) {
                card.classList.add('animate-on-scroll');
                card.dataset.delay = index * 100;
                observer.observe(card);
            }
        });
    }
}

// Управление шапкой при скролле
function initHeader() {
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    let headerHidden = false;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Добавляем класс при скролле
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Скрываем шапку при скролле вниз
        if (currentScrollY > lastScrollY && currentScrollY > 10) {
            header.style.transform = 'translateY(-100%)';
            headerHidden = true;
        }
        // Показываем шапку только при скролле вверх
        else if (currentScrollY < lastScrollY && currentScrollY > 10) {
            header.style.transform = 'translateY(0)';
            headerHidden = false;
        }
        // Показываем шапку в самом верху страницы
        else if (currentScrollY <= 10) {
            header.style.transform = 'translateY(0)';
            headerHidden = false;
        }

        lastScrollY = currentScrollY;
    });
}

// Мобильное меню
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!mobileMenuToggle || !mobileMenu) return;

    // Открытие/закрытие мобильного меню
    mobileMenuToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Закрытие меню при клике на фон
    mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });

    // Закрытие меню при клике на ссылку
    const mobileNavItems = mobileMenu.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function () {
            closeMobileMenu();
        });
    });

    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Анимация кнопки гамбургера
        mobileMenuToggle.classList.add('active');
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';

        // Возвращаем кнопку гамбургера в исходное состояние
        mobileMenuToggle.classList.remove('active');
    }
}


// Модальные окна
function initModals() {
    // Приглашение в тендер
    const tenderBtn = document.getElementById('tenderBtn');
    const tenderModal = document.getElementById('tenderModal');
    const tenderModalClose = document.getElementById('tenderModalClose');

    if (tenderBtn && tenderModal) {
        tenderBtn.addEventListener('click', () => openModal(tenderModal));
    }
    if (tenderModalClose) {
        tenderModalClose.addEventListener('click', () => closeModal(tenderModal));
    }

    // Заявка на услугу
    const serviceModal = document.getElementById('serviceModal');
    const serviceModalClose = document.getElementById('serviceModalClose');

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-service-application') ||
            e.target.classList.contains('btn-call-specialist')) {
            const serviceType = e.target.dataset.service;
            if (serviceType) {
                document.getElementById('serviceType').value = serviceType;
                openModal(serviceModal);
            }
        }
    });

    if (serviceModalClose) {
        serviceModalClose.addEventListener('click', () => closeModal(serviceModal));
    }

    // Звонок
    const callModal = document.getElementById('callModal');
    const callModalClose = document.getElementById('callModalClose');

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-call') || e.target.classList.contains('btn-call-specialist')) {
            openModal(callModal);
        }
    });

    if (callModalClose) {
        callModalClose.addEventListener('click', () => closeModal(callModal));
    }

    // Закрытие модалов по клику на фон
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Закрытие модалов по Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                closeModal(modal);
            });
        }
    });
}

// Функции для работы с модалами
function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Фокус на первое поле ввода
    const firstInput = modal.querySelector('input:not([type="hidden"])');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
    }
}

function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';

    // Очищаем формы
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
        // Убираем состояние загрузки с кнопок
        const submitBtn = form.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || submitBtn.textContent;
        }
    }
}

// Обработка форм
function initForms() {
    // Форма приглашения в тендер
    const tenderForm = document.getElementById('tenderForm');
    if (tenderForm) {
        tenderForm.addEventListener('submit', handleTenderSubmit);
    }

    // Форма заявки на услугу
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', handleServiceSubmit);
    }

    // Обработка загрузки файлов
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function () {
            const label = this.parentElement.querySelector('.file-upload-label span');
            if (label && this.files.length > 0) {
                label.textContent = this.files[0].name;
            }
        });
    });
}

// Обработка формы приглашения в тендер
async function handleTenderSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;

    // Показываем состояние загрузки
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    submitBtn.dataset.originalText = originalText;

    try {
        const formData = new FormData(form);

        const response = await fetch('/ajax/tender-invitation/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCSRFToken()
            }
        });

        const data = await response.json();

        if (data.success) {
            showNotification(data.message, 'success');
            closeModal(document.getElementById('tenderModal'));
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Произошла ошибка при отправке. Попробуйте еще раз.', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Обработка формы заявки на услугу
async function handleServiceSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    submitBtn.dataset.originalText = originalText;

    try {
        const formData = new FormData(form);
        const data = {
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            service_type: formData.get('service_type')
        };

        const response = await fetch('/ajax/service-application/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            }
        });

        const result = await response.json();

        if (result.success) {
            showNotification(result.message, 'success');
            closeModal(document.getElementById('serviceModal'));
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        showNotification('Произошла ошибка при отправке. Попробуйте еще раз.', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Получение CSRF токена
function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }

    // Fallback: попробуем найти токен в мета-теге
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : '';
}

// Система уведомлений
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

    notification.innerHTML = `
        <div class="icon">${icon}</div>
        <div class="message">${message}</div>
        <button class="close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(notification);

    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'fadeInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Плавный скролл для якорных ссылок
function initSmoothScroll() {
    // Обрабатываем все ссылки с якорями
    document.querySelectorAll('a[href*="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            console.log('Clicked link with href:', href);

            // Если это ссылка на главную страницу с якорем
            if (href.includes('#contacts')) {
                console.log('Redirecting to contacts section');
                // Не предотвращаем стандартное поведение для ссылки на контакты
                return;
            }

            // Если это якорь на текущей странице
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                console.log('Looking for element with ID:', targetId, 'Found:', targetElement);

                if (targetElement) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Форматирование телефонных номеров
function initPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]:not(#quotePhone)');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.startsWith('8')) {
                value = '7' + value.substring(1);
            }

            if (value.startsWith('7') && value.length <= 11) {
                let formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.substring(1, 4);
                }
                if (value.length > 4) {
                    formatted += ') ' + value.substring(4, 7);
                }
                if (value.length > 7) {
                    formatted += '-' + value.substring(7, 9);
                }
                if (value.length > 9) {
                    formatted += '-' + value.substring(9, 11);
                }

                e.target.value = formatted;
            }
        });

        input.addEventListener('keydown', function (e) {
            // Разрешаем: backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey) ||
                (e.keyCode === 67 && e.ctrlKey) ||
                (e.keyCode === 86 && e.ctrlKey) ||
                (e.keyCode === 88 && e.ctrlKey) ||
                // Разрешаем: стрелки
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                return;
            }

            // Запрещаем все, кроме цифр
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    });
}

// Параллакс эффекты
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return;

    function updateParallax() {
        const scrollTop = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Используем requestAnimationFrame для плавности
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Дополнительные утилиты

// Дебаунс функция
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;

        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Проверка видимости элемента
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Анимация чисел (счетчики)
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    // ПРИНУДИТЕЛЬНО УСТАНАВЛИВАЕМ БЕЛЫЙ ЦВЕТ
    element.style.color = '#ffffff !important';
    element.style.fontWeight = '900 !important';

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.floor(start + (range * progress));
        element.textContent = current.toLocaleString();

        // ПРИНУДИТЕЛЬНО УСТАНАВЛИВАЕМ БЕЛЫЙ ЦВЕТ НА КАЖДОМ КАДРЕ
        element.style.color = '#ffffff !important';
        element.style.fontWeight = '900 !important';

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
}

// Ленивая загрузка изображений
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback для старых браузеров
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Инициализация ленивой загрузки
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Современные функции для нового дизайна
function initModernFeatures() {

    // Кнопка "Заказать звонок" в hero
    const heroCallBtn = document.getElementById('heroCallBtn');
    console.log('Hero call button:', heroCallBtn);
    if (heroCallBtn) {
        heroCallBtn.addEventListener('click', function () {
            console.log('Hero call button clicked!');
            const callModal = document.getElementById('callModal');
            console.log('Call modal:', callModal);
            openModal(callModal);
        });
    }

    // Кнопка "Заказать звонок" под картой
    const mapCallBtn = document.querySelector('.btn-call-modern[data-service="call"]');
    console.log('Map call button:', mapCallBtn);
    if (mapCallBtn) {
        mapCallBtn.addEventListener('click', function () {
            console.log('Map call button clicked!');
            const callModal = document.getElementById('callModal');
            console.log('Call modal:', callModal);
            openModal(callModal);
        });
    }

    // Форма заказа звонка
    const callForm = document.getElementById('callForm');
    if (callForm) {
        callForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = {
                full_name: formData.get('full_name'),
                phone: formData.get('phone'),
                service_type: 'Заказ звонка'
            };

            fetch('/ajax/service-application/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                        closeModal(document.getElementById('callModal'));
                        callForm.reset();
                    } else {
                        showNotification(data.message || 'Произошла ошибка', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showNotification('Произошла ошибка при отправке', 'error');
                });
        });
    }

    // Кнопка отмены в форме звонка
    const callModalCancel = document.getElementById('callModalCancel');
    if (callModalCancel) {
        callModalCancel.addEventListener('click', function () {
            closeModal(document.getElementById('callModal'));
        });
    }

    // Анимация счетчиков в hero
    animateCounters();

    // Инициализация выпадающего меню
    initDropdownMenu();

    // Инициализация кнопок услуг
    initServiceButtons();
}

// Обработка кнопок услуг
function initServiceButtons() {
    const serviceButtons = document.querySelectorAll('.service-button[data-service]');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function () {
            const service = this.dataset.service;
            const action = this.dataset.action;

            if (action.includes('звонок')) {
                openModal(document.getElementById('callModal'));
            } else {
                showNotification('Функция в разработке. Используйте кнопку "Заказать звонок".', 'info');
            }
        });
    });

    // Универсальный обработчик для всех кнопок "Заказать звонок"
    document.addEventListener('click', function (e) {
        // Обработка кнопок с data-service="call"
        if (e.target.closest('[data-service="call"]')) {
            e.preventDefault();
            const callModal = document.getElementById('callModal');
            if (callModal) {
                openModal(callModal);
            }
        }
    });
}

// Функция для прокрутки к услугам
function scrollToServices() {
    console.log('scrollToServices called!');
    const servicesSection = document.getElementById('services');
    console.log('Services section:', servicesSection);
    if (servicesSection) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = servicesSection.offsetTop - headerHeight - 20;
        console.log('Scrolling to position:', targetPosition);

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Анимация счетчиков
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateNumber(counter, 0, target, 2000);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Выпадающее меню в навигации
function initDropdownMenu() {
    const dropdown = document.querySelector('.nav-dropdown');
    if (dropdown) {
        const btn = dropdown.querySelector('.nav-dropdown-btn');
        const menu = dropdown.querySelector('.nav-dropdown-menu');

        let timeout;

        dropdown.addEventListener('mouseenter', function () {
            clearTimeout(timeout);
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateX(-50%) translateY(0)';
        });

        dropdown.addEventListener('mouseleave', function () {
            timeout = setTimeout(() => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateX(-50%) translateY(-10px)';
            }, 150);
        });
    }
}

// Обработка ошибок JavaScript
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    // Здесь можно отправить ошибку на сервер для логирования
});

// Проверка поддержки современных функций браузера
function checkBrowserSupport() {
    const features = {
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid'),
        intersectionObserver: 'IntersectionObserver' in window,
        fetch: 'fetch' in window
    };

    // Добавляем классы для условного CSS
    Object.keys(features).forEach(feature => {
        if (features[feature]) {
            document.documentElement.classList.add('supports-' + feature);
        } else {
            document.documentElement.classList.add('no-' + feature);
        }
    });
}

// Инициализация проверки браузера
checkBrowserSupport();

// Функция для динамического вычисления отступа под шапку
function adjustBodyPadding() {
    const header = document.getElementById('header');
    if (header) {
        // Ждем полной загрузки изображений
        setTimeout(() => {
            const headerHeight = header.offsetHeight;
            const padding = headerHeight + 10; // Добавляем 10px запас
            document.body.style.paddingTop = padding + 'px';
            console.log('Header height:', headerHeight, 'Body padding-top:', padding);
        }, 100);
    }
}

// Пересчитываем отступ при изменении размера окна
window.addEventListener('resize', debounce(adjustBodyPadding, 250));

// Функция для создания анимированных рамок с Intersection Observer
function initAnimatedBorders() {
    const serviceCards = document.querySelectorAll('.service-card-modern');
    const featureCards = document.querySelectorAll('.feature-card-animated');


    // Современные цвета для анимации
    const colors = ['#3d5ba5', '#6366f1', '#8b5cf6', '#1e1a6b'];

    function animateBorder(element) {
        let colorIndex = 0;
        let direction = 1;

        const animationInterval = setInterval(() => {
            const currentColor = colors[colorIndex];
            element.style.borderColor = currentColor;
            element.style.boxShadow = `0 0 25px ${currentColor}40`;

            colorIndex += direction;
            if (colorIndex >= colors.length - 1) {
                direction = -1;
            } else if (colorIndex <= 0) {
                direction = 1;
            }
        }, 1000);

        // Сохраняем ссылку на интервал для очистки
        element._animationInterval = animationInterval;

        // Очистка при уходе элемента из видимости
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && element._animationInterval) {
                    clearInterval(element._animationInterval);
                    element._animationInterval = null;
                }
            });
        });

        observer.observe(element);
    }

    // Intersection Observer для карточек услуг
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target._animationStarted) {
                entry.target._animationStarted = true;
                // Небольшая задержка для плавного появления
                setTimeout(() => {
                    animateBorder(entry.target);
                }, 200);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Наблюдаем за карточками услуг
    serviceCards.forEach(card => {
        serviceObserver.observe(card);
    });

    // Intersection Observer для блоков преимуществ
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target._animationStarted) {
                entry.target._animationStarted = true;
                setTimeout(() => {
                    animateBorder(entry.target);
                }, 300);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Наблюдаем за блоками преимуществ
    featureCards.forEach(card => {
        featureObserver.observe(card);
    });

    // ПРИНУДИТЕЛЬНЫЙ ЗАПУСК АНИМАЦИИ НА ВСЕХ КАРТОЧКАХ ЧЕРЕЗ 2 СЕКУНДЫ
    setTimeout(() => {
        serviceCards.forEach((card, index) => {
            if (!card._animationStarted) {
                card._animationStarted = true;
                setTimeout(() => {
                    animateBorder(card);
                }, index * 200);
            }
        });
    }, 2000);

    // ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА ПРИ ПРОКРУТКЕ
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            serviceCards.forEach((card, index) => {
                if (!card._animationStarted && isElementInViewport(card)) {
                    card._animationStarted = true;
                    setTimeout(() => {
                        animateBorder(card);
                    }, index * 100);
                }
            });
        }, 100);
    });
}

// 🎨 СОВРЕМЕННЫЕ ИНТЕРАКТИВНЫЕ ЭФФЕКТЫ
function initModernInteractions() {
    // Параллакс мыши для карточек - ОТКЛЮЧЕНО
    // initMouseParallax();

    // Магнитные эффекты для кнопок
    initMagneticButtons();

    // Плавные переходы при загрузке
    initStaggeredAnimations();

    // Интерактивные частицы
    initInteractiveParticles();
}

// Параллакс мыши для карточек - ОТКЛЮЧЕНО
function initMouseParallax() {
    // УБРАНО: ебанутый параллакс который двигает карточки за курсором
}

// Магнитные эффекты для кнопок
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.btn-cta-primary, .btn-cta-secondary, .btn-tender');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

// Поэтапные анимации с Intersection Observer
function initStaggeredAnimations() {
    const elements = document.querySelectorAll('.service-card-modern');

    // Intersection Observer для поэтапных анимаций
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target._staggerAnimationStarted) {
                entry.target._staggerAnimationStarted = true;
                entry.target.classList.add('animate');

                // Добавляем задержку для каскадного эффекта
                const index = Array.from(elements).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    elements.forEach(el => {
        el.classList.add('animate-on-scroll');
        staggerObserver.observe(el);
    });
}

// Интерактивные частицы
function initInteractiveParticles() {
    const hero = document.querySelector('.hero-simple');
    if (!hero) return;

    // Создаем canvas для частиц
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';

    hero.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];

    // Создаем частицы
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// Анимации при загрузке страницы
function initPageLoadAnimations() {
    // Анимация счетчиков
    animateCounters();

    // Анимация появления элементов
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate');
        }, index * 100);
    });
}

// Оптимизация производительности
function initPerformanceOptimizations() {
    // Throttle для ресайза
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Пересчет позиций элементов
            adjustBodyPadding();
        }, 250);
    });

    // Preload критичных изображений
    const criticalImages = document.querySelectorAll('.logo-img, .hero-simple img');
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
}

// Современный Intersection Observer
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target._intersectionAnimationStarted) {
                entry.target._intersectionAnimationStarted = true;
                entry.target.classList.add('animate');

                // Дополнительные эффекты для разных типов элементов
                if (entry.target.classList.contains('service-card-modern')) {
                    // УБРАНО: принудительное назначение transform чтобы CSS hover работал
                    entry.target.style.transform = '';
                }

                if (entry.target.classList.contains('stat-number')) {
                    // ПРИНУДИТЕЛЬНО УСТАНАВЛИВАЕМ БЕЛЫЙ ЦВЕТ И ЗАПУСКАЕМ АНИМАЦИЮ
                    entry.target.style.color = '#ffffff !important';
                    entry.target.style.fontWeight = '900 !important';

                    const target = parseInt(entry.target.dataset.count);
                    animateNumber(entry.target, 0, target, 2000);
                }
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми анимируемыми элементами
    document.querySelectorAll('.animate-on-scroll, .service-card-modern, .stat-number').forEach(el => {
        observer.observe(el);
    });

    // Дополнительная проверка для карточек услуг - принудительный запуск анимации
    setTimeout(() => {
        const serviceCards = document.querySelectorAll('.service-card-modern');
        serviceCards.forEach(card => {
            if (!card._intersectionAnimationStarted && isElementInViewport(card)) {
                card._intersectionAnimationStarted = true;
                card.classList.add('animate');
            }
        });
    }, 1000);
}
