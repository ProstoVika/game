const instructionsButton = document.querySelector('.instructions-button');
const instructionsBox = document.querySelector('.instructions-box');
const instructionsCloseButton = document.querySelector('.instructions-close-button');
const randomQuote = document.querySelector('.random-quote');
const score = document.getElementById('score');
const startGameBtn = document.getElementById('startGameBtn');
const titleButtons = document.querySelectorAll('.title');
const nextButton = document.getElementById('nextButton');
const countdownNumberEl = document.querySelector('.countdown-text');
const questionsAnswersSection = document.querySelector('.questions-answers');

let correctAnswers = 0;
let timer;
let timerSeconds = 20;

instructionsButton.addEventListener('click', () => {
    instructionsBox.classList.remove('hidden');
});

instructionsCloseButton.addEventListener('click', () => {
    instructionsBox.classList.add('hidden');
});

const updateScore = () => {
    score.textContent = `Score: ${correctAnswers}`;
}

const getRandomIndexFromArray = (arr) => {
    return Math.floor(Math.random() * arr.length);
};

const get3uniqueIndexesFromArray = (arr) => {
    let randomIndexArray = [];
    while (randomIndexArray.length < 3) {
        const randomIndex = getRandomIndexFromArray(arr);
        if (!randomIndexArray.includes(randomIndex)) {
            randomIndexArray.push(randomIndex);
        }
    }
    return randomIndexArray;
}

const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
}

nextButton.addEventListener('click', () => {
    titleButtons.forEach(button => {
        button.classList.remove('correct', 'incorrect');
    })
    loadNextQuestion();
});

const loadNextQuestion = () => {
    clearInterval(timer);
    timerSeconds = 20;
    updateTimer();
    updateCircle(1);

    fetch('quotes.json')
        .then(data => data.json())
        .then((result) => {
            let taskArray = result.tasks;
            let uniq3Indexes = get3uniqueIndexesFromArray(taskArray);
            let selectedTask = taskArray[uniq3Indexes[0]];
            randomQuote.textContent = selectedTask.quote;
            let options = selectedTask.options;
            let correctIndex = selectedTask.correctIndex;

            let shuffledIndexes = shuffle([...Array(options.length).keys()]);

            for (let i = 0; i < titleButtons.length; i++) {
                titleButtons[i].textContent = options[shuffledIndexes[i]];
                titleButtons[i].dataset.winner = shuffledIndexes[i] === correctIndex ? 'true' : 'false';
            }
            titleButtons.forEach((button) => {
                button.disabled = false;
            });
            startTimer();
        });
}

titleButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!button.classList.contains('correct') && !button.classList.contains('incorrect')) {
            const isCorrect = button.dataset.winner === 'true';
            button.classList.add(isCorrect ? 'correct' : 'incorrect');
            disableButtons();
            if (isCorrect) {
                correctAnswers++;
                updateScore();
            }
        }
    });
});

const disableButtons = () => {
    titleButtons.forEach(button => {
        button.disabled = true;
    });
}

const resetScore = () => {
    correctAnswers = 0;
    updateScore();
}

const updateCircle = (percentRemaining) => {
    const circle = document.querySelector('.countdown-circle');
    const radius = circle.getAttribute('r');
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference * (1 - percentRemaining);
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = Math.max(0, dashoffset);
};

const stopTimer = () => {
    clearInterval(timer);
    updateCircle(0);
    disableButtons();
};

const updateTimer = () => {
    countdownNumberEl.textContent = timerSeconds;
};


const startTimer = () => {
    timer = setInterval(() => {
        if (timerSeconds <= 0) {
            stopTimer();
        } else {
            timerSeconds--;
            updateTimer();
            updateCircle(timerSeconds / 20);
        }
    }, 1000);
};
startGameBtn.addEventListener('click', () => {
    questionsAnswersSection.classList.remove('hidden');
    loadNextQuestion();
    updateScore();
    resetScore();
    startTimer();
});


