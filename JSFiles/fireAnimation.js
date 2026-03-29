//The code was taken from https://www.subframe.com/tips/css-fire-animation-examples (Zhan, n.d.)

document.addEventListener('DOMContentLoaded', function() {
    // Create flames in header
    const headerFire = document.getElementById('headerFire');
    const flamesToCreate = 50;

    for (let i = 0; i < flamesToCreate; i++) {
        createFlame(headerFire);
    }

    function createFlame(container) {
        const flame = document.createElement('div');
        flame.classList.add('flame');

        // Randomize flame properties
        const size = 10 + Math.random() * 15;
        const leftPos = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = 1.5 + Math.random() * 2;

        // Random colors between orange, yellow and red
        const colors = ['#ff6b35', '#ff9a5a', '#ffd166', '#ffbc42'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        flame.style.width = `${size}px`;
        flame.style.height = `${size * 1.2}px`;
        flame.style.left = `${leftPos}%`;
        flame.style.backgroundColor = randomColor;
        flame.style.animationDelay = `${delay}s`;
        flame.style.animationDuration = `${duration}s`;

        container.appendChild(flame);
    }
})

//Zhan, I. (n.d.). '10 CSS Fire Animation Examples'. Available at:https://www.subframe.com/tips/css-fire-animation-examples
//(Accessed: 29/03/2026).