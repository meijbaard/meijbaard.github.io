document.addEventListener('DOMContentLoaded', function() {
    // Check of we op de juiste pagina zijn
    if (!document.getElementById('news-list')) {
        return;
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('#news-list .news-item');
    const counter = document.getElementById('article-counter');

    function updateCounter() {
        const visibleItems = document.querySelectorAll('#news-list .news-item:not([style*="display: none"])').length;
        counter.textContent = `Totaal ${visibleItems} van de ${newsItems.length} artikelen getoond.`;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const sourceFilter = this.dataset.source;
            
            newsItems.forEach(item => {
                if (sourceFilter === 'all' || item.dataset.source === sourceFilter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            
            updateCounter();
        });
    });

    function addNewBadges() {
        const twentyFiveHoursAgo = new Date();
        twentyFiveHoursAgo.setHours(twentyFiveHoursAgo.getHours() - 25);
        
        newsItems.forEach(item => {
            const pubDateString = item.dataset.pubdate;
            if (pubDateString) {
                // Converteer de datumstring naar een formaat dat de Date constructor begrijpt
                // "24-08-2025 09:00" -> "2025-08-24T09:00:00"
                const parts = pubDateString.split(' ');
                const dateParts = parts[0].split('-');
                const timeParts = parts[1].split(':');
                const isoString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}:00`;
                const pubDate = new Date(isoString);

                if (pubDate > twentyFiveHoursAgo) {
                    if (item.querySelector('.new-badge')) return;
                    
                    const newBadge = document.createElement('span');
                    newBadge.textContent = '✨ Nieuw';
                    newBadge.className = 'new-badge';
                    item.querySelector('h3').appendChild(newBadge);
                }
            }
        });
    }

    updateCounter();
    addNewBadges();
});