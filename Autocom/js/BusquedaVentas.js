document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('search-input').value.toLowerCase();
        filterCards(query);
    });
});

function filterCards(query) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const name = card.querySelector('.card-title').textContent.toLowerCase();
        if (name.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}