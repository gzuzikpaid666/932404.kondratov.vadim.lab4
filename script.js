const HIGH_PROGRESS_LIMIT = 50;
const LOW_PROGRESS_LIMIT = 10;
const GOOD_AVERAGE_LIMIT = 30;

const wordsPerDay = [12, 55, 8, 63, 30, 5, 72];

function findMax(numbers) {
    let max = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > max) {
            max = numbers[i];
        }
    }
    return max;
}

function filterAbove(numbers, limit) {
    const result = [];
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] > limit) {
            result.push(numbers[i]);
        }
    }
    return result;
}

function sumArray(numbers) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum;
}

function getLevel(words) {
    if (words > HIGH_PROGRESS_LIMIT) {
        return 'high';
    }
    if (words <= LOW_PROGRESS_LIMIT) {
        return 'low';
    }
    return 'normal';
}

const LEVEL_NAMES = {
    high: 'высокий',
    normal: 'средний',
    low: 'малый'
};

function setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}

function renderChart(numbers, max) {
    const chart = document.getElementById('days-chart');
    if (!chart) {
        return;
    }
    chart.textContent = '';
    for (let i = 0; i < numbers.length; i++) {
        const level = getLevel(numbers[i]);

        const row = createElement('li', 'day-row');
        row.appendChild(createElement('span', 'day-label', 'День ' + (i + 1)));

        const track = createElement('div', 'day-track');
        const bar = createElement('div', 'day-bar ' + level);
        bar.style.width = (numbers[i] / max * 100) + '%';
        track.appendChild(bar);
        row.appendChild(track);

        const value = createElement('span', 'day-value', numbers[i] + ' слов');
        value.appendChild(createElement('span', 'day-tag ' + level, LEVEL_NAMES[level]));
        row.appendChild(value);

        chart.appendChild(row);
    }
}

function run() {
    let userName = prompt('Как вас зовут?');
    if (userName === null || userName.trim() === '') {
        userName = 'Гость';
    }
    alert('Привет, ' + userName + '! Давайте посмотрим на ваш прогресс в изучении слов.');

    const totalWords = sumArray(wordsPerDay);
    const highDays = filterAbove(wordsPerDay, HIGH_PROGRESS_LIMIT);
    const bestDay = findMax(wordsPerDay);
    const average = totalWords / wordsPerDay.length;

    const lowDays = [];
    for (let i = 0; i < wordsPerDay.length; i++) {
        if (wordsPerDay[i] <= LOW_PROGRESS_LIMIT) {
            lowDays.push(i + 1);
        }
    }
    const lowPercent = (lowDays.length / wordsPerDay.length) * 100;

    alert('Всего выучено ' + totalWords + ' слов, в ' + highDays.length + ' днях прогресс был высоким');

    console.log('%cПрогресс изучения слов: ' + userName, 'color: #0e7490; font-size: 16px; font-weight: bold;');
    console.table(wordsPerDay.map(function (words, index) {
        return { 'День': index + 1, 'Слов': words, 'Прогресс': LEVEL_NAMES[getLevel(words)] };
    }));
    console.log('Лучший день: ' + bestDay + ' слов');
    console.log('Дни с высоким прогрессом (> ' + HIGH_PROGRESS_LIMIT + '): ' + highDays.join(', '));
    console.log('Дней с малым прогрессом (≤ ' + LOW_PROGRESS_LIMIT + '): ' + lowDays.length + ' (дни: ' + lowDays.join(', ') + ')');
    console.log('Процент дней с малым прогрессом: ' + lowPercent.toFixed(1) + '%');
    console.log('Среднее за день: ' + Math.round(average) + ' слов');

    const goodTempo = average > GOOD_AVERAGE_LIMIT;
    if (goodTempo) {
        console.log('%cОтличный темп изучения языка!', 'color: #166534; font-weight: bold;');
    }

    setText('greeting', 'Привет, ' + userName + '! Вот ваш прогресс за ' + wordsPerDay.length + ' дней.');
    setText('stat-total', totalWords);
    setText('stat-high', highDays.length);
    setText('stat-low', lowDays.length + ' (' + lowPercent.toFixed(1) + '%)');
    setText('stat-average', Math.round(average));
    renderChart(wordsPerDay, bestDay);

    const note = document.getElementById('tempo-note');
    if (note) {
        note.hidden = !goodTempo;
    }
}

window.addEventListener('load', function () {
    setTimeout(run, 100);
});