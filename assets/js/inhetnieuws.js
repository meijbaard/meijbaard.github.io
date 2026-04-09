document.addEventListener('DOMContentLoaded', function() {
    // Controleer of de juiste elementen aanwezig zijn
    const newsList = document.getElementById('news-list');
    if (!newsList) return;

    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('#news-list .news-item');
    const counter = document.getElementById('article-counter');

    // --- Teller bijwerken ---
    function updateCounter() {
        const total = newsItems.length;
        const visible = document.querySelectorAll('#news-list .news-item:not([style*="display: none"])').length;
        if (counter) {
            counter.textContent = `Totaal ${visible} van de ${total} artikelen getoond.`;
        }
    }

    // --- Filterlogica ---
    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            filterButtons.forEach(function(btn) { btn.classList.remove('active'); });
            this.classList.add('active');

            var sourceFilter = this.dataset.source;

            newsItems.forEach(function(item) {
                if (sourceFilter === 'all' || item.dataset.source === sourceFilter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });

            updateCounter();
        });
    });

    // --- 'Nieuw' badges toevoegen ---
    // Gebruikt ISO-datums direct (zoals opgeslagen door update_news.js)
    function addNewBadges() {
        var twentyFiveHoursAgo = new Date();
        twentyFiveHoursAgo.setHours(twentyFiveHoursAgo.getHours() - 25);

        newsItems.forEach(function(item) {
            var pubDateString = item.dataset.pubdate;
            if (!pubDateString) return;

            try {
                // Ondersteuning voor zowel ISO ("2025-01-15T10:30:00Z") als
                // legacy formaat ("24-08-2025 09:00")
                var pubDate = new Date(pubDateString);

                // Fallback voor legacy "DD-MM-YYYY HH:MM" formaat
                if (isNaN(pubDate.getTime()) && pubDateString.includes('-')) {
                    var parts = pubDateString.split(' ');
                    var dateParts = parts[0].split('-');
                    var time = parts[1] || '00:00';
                    if (dateParts[0].length === 2) {
                        // "24-08-2025" → "2025-08-24"
                        pubDate = new Date(dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0] + 'T' + time + ':00');
                    }
                }

                if (!isNaN(pubDate.getTime()) && pubDate > twentyFiveHoursAgo) {
                    if (item.querySelector('.new-badge')) return;
                    var heading = item.querySelector('h3');
                    if (heading) {
                        var badge = document.createElement('span');
                        badge.textContent = '✨ Nieuw';
                        badge.className = 'new-badge';
                        heading.appendChild(badge);
                    }
                }
            } catch (e) {
                // Ongeldige datum: badge overslaan
            }
        });
    }

    updateCounter();
    addNewBadges();
});
