// assets/js/newsdashboard.js
document.addEventListener('DOMContentLoaded', function() {
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('.news-item');
    const counter = document.getElementById('article-counter');

    function updateCounter() {
        const visibleItems = document.querySelectorAll('.news-item:not([style*="display: none"])').length;
        counter.textContent = `Totaal ${visibleItems} van de ${newsItems.length} artikelen getoond.`;
    }

    // Filter functionaliteit
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

    // Nieuw badges toevoegen
    function addNewBadges() {
        const twentyFiveHoursAgo = new Date();
        twentyFiveHoursAgo.setHours(twentyFiveHoursAgo.getHours() - 25);
        
        newsItems.forEach(item => {
            const pubDateString = item.dataset.pubdate;
            if (pubDateString) {
                const pubDate = new Date(pubDateString);
                if (!isNaN(pubDate) && pubDate > twentyFiveHoursAgo) {
                    const heading = item.querySelector('h3');
                    if (heading && !item.querySelector('.new-badge')) {
                        const newBadge = document.createElement('span');
                        newBadge.textContent = '✨ Nieuw';
                        newBadge.className = 'new-badge';
                        newBadge.style.cssText = 'background-color: #28a745; color: white; padding: 3px 8px; margin-left: 10px; border-radius: 5px; font-size: 0.8em; font-weight: bold;';
                        heading.appendChild(newBadge);
                    }
                }
            }
        });
    }

    addNewBadges();
});
