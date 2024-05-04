let instructionsButton = document.querySelector('.instructions-button');
let instructionsBox = document.querySelector('.instructions-box');
let instructionsCloseButton = document.querySelector('.instructions-close-button');
let randomQuote = document.querySelector('.random-quote');
const score = document.getElementById('score');
const startGameBtn = document.getElementById('startGameBtn');
const titleButtons = document.querySelectorAll('.title');
const nextButton = document.getElementById('nextButton');
const countdownNumberEl = document.querySelector('.countdown-text');
const questionsAnswersSection = document.querySelector('.questions-answers');

let correctAnswers = 0;
let timer;

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
    let randomIndexArray = []
    while (randomIndexArray.length < 3) {
        randomIndexArray.push(getRandomIndexFromArray(arr))
        //remove any duplicates
        randomIndexArray = [...new Set(randomIndexArray)]
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

loadNextQuestion = () => {
    fetch('quotes.json')
        .then(data => data.json())
        .then((result) => {
            let taskArray = result.tasks;
            let uniq3Indexes = get3uniqueIndexesFromArray(taskArray)
            let selectedTask = taskArray[uniq3Indexes[0]]
            randomQuote.textContent = selectedTask.quote;
            let options = selectedTask.options;
            let correctIndex = selectedTask.correctIndex;

            let shuffledIndexes = shuffle([...Array(options.length).keys()]);

            for (let i = 0; i < titleButtons.length; i++) {
                titleButtons[i].textContent = options[shuffledIndexes[i]];
                titleButtons[i].dataset.winner = shuffledIndexes[i] === correctIndex ? 'true' : 'false';
            }
            startTimer();
            titleButtons.forEach((button) => {
                button.disabled = false;
            });
        })
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

 disableButtons = () => {
    titleButtons.forEach(button => {
        button.disabled = true;
    });
    }
 resetScore = () => {
    correctAnswers = 0;
    updateScore();
}

 updateCircle = (percentRemaining) => {
    const circle = document.querySelector('.countdown-circle');
    const radius = circle.getAttribute('r');
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference * (1 - percentRemaining);
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = dashoffset;
};
 startTimer = () => {
    let startTime;
    const duration = 20 * 1000;
    const animate = (timestamp) => {
        if (!startTime) {
            startTime = timestamp;
        }
        const elapsedTime = timestamp - startTime;
        const remainingTime = duration - elapsedTime;
        const percentRemaining = remainingTime / duration;

        if (remainingTime <= 0) {
            disableButtons();
            clearInterval(timer);
            return;
        }

        countdownNumberEl.textContent = Math.ceil(remainingTime / 1000);
        updateCircle(percentRemaining);
        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
};

startGameBtn.addEventListener('click', () => {
    questionsAnswersSection.classList.remove('hidden');
    nextButton.click();
        updateScore();
        resetScore();
        startTimer();
});


