let instructionsButton = document.querySelector('.instructions-button');
let instructionsBox = document.querySelector('.instructions-box');
let instructionsCloseButton = document.querySelector('.instructions-close-button');
let randomQuote = document.querySelector('.random-quote');

const score = document.getElementById('score');
let correctAnswers = 0;
const startGameBtn = document.getElementById('startGameBtn');
const titleButtons = document.querySelectorAll('.title');
const nextButton = document.getElementById('nextButton');

let timer;
const countdownNumberEl = document.querySelector('.countdown-text');
const questionsAnswersSection = document.querySelector('.questions-answers');

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
    circle.style.strokeDashoffset = dashoffset;
};
const startTimer = () => {
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

// const startTimer = () => {
//     let countdown = 20;
//     timer = setInterval(() => {
//         if (countdown === 0) {
//             clearInterval(timer);
//             disableButtons();
//             return;
//         }
//         countdown--;
//         countdownNumberEl.textContent = countdown;
//         updateCircle(countdown);
//     }, 1000);
// };

//  updateCircle = (countdown) => {
//     const circle = document.querySelector('.countdown-circle');
//     const radius = circle.getAttribute('r');
//     const circumference = 2 * Math.PI * radius;
//     const percentRemaining = countdown / 20;
//     const dashoffset = circumference * (1 - percentRemaining);
//     circle.style.strokeDasharray = `${circumference} ${circumference}`;
//     circle.style.strokeDashoffset = dashoffset;
// }

startGameBtn.addEventListener('click', () => {
    questionsAnswersSection.classList.remove('hidden');

    nextButton.click();
        updateScore();
        resetScore();
        startTimer();

});








 // It's add later just for web dys
/*


/!*!////////////////////blue dots/////////////////////!*!/

const NUM_PARTICLES = 800;
const PARTICLE_SIZE = 0.9;
const SPEED = 20000;
let particles = [];
function normalPool(o){var r=0;do{var a=Math.round(normal({mean:o.mean,dev:o.dev}));if(a<o.pool.length&&a>=0)return o.pool[a];r++}while(r<100)}
function randomNormal(o){if(o=Object.assign({mean:0,dev:1,pool:[]},o),Array.isArray(o.pool)&&o.pool.length>0)return normalPool(o);var r,a,n,e,l=o.mean,t=o.dev;do{r=(a=2*Math.random()-1)*a+(n=2*Math.random()-1)*n}while(r>=1);return e=a*Math.sqrt(-2*Math.log(r)/r),t*e+l}
function rand(low, high) {
    return Math.random() * (high - low) + low;
}
function createParticle(canvas) {
    const colour = {
        r: 191,
        //g: randomNormal({ mean: 226, dev: 255 }),
        g: 226,
        b: 255,
        a: rand(0, 1),
    };
    return {
        x: -2,
        y: -2,
        diameter: Math.max(0, randomNormal({ mean: PARTICLE_SIZE, dev: PARTICLE_SIZE / 2 })),
        duration: randomNormal({ mean: SPEED, dev: SPEED * 0.1 }),
        amplitude: randomNormal({ mean: 16, dev: 2 }),
        offsetY: randomNormal({ mean: 0, dev: 10 }),
        arc: Math.PI * 2,
        startTime: performance.now() - rand(0, SPEED),
        colour: "rgba("+colour.r+", "+colour.g+", "+colour.b+", "+colour.a+")",
    }
}
function moveParticle(particle, canvas, time) {
    const progress = ((time - particle.startTime) % particle.duration) / particle.duration;
    return {
        ...particle,
        x: progress,
        y: ((Math.sin(progress * particle.arc) * particle.amplitude) + particle.offsetY),
    };
}
function drawParticle(particle, canvas, ctx) {
    canvas = document.getElementById('particle-canvas');
    const vh = canvas.height / 100;

    ctx.fillStyle = particle.colour;
    ctx.beginPath();
    ctx.ellipse(
        particle.x * canvas.width,
        particle.y * vh + (canvas.height / 2),
        particle.diameter * vh,
        particle.diameter * vh,
        0,
        0,
        2 * Math.PI
    );
    ctx.fill();
}
function draw(time, canvas, ctx) {
    particles.forEach((particle, index) => {
        particles[index] = moveParticle(particle, canvas, time);
    })
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
        drawParticle(particle, canvas, ctx);
    })
    requestAnimationFrame((time) => draw(time, canvas, ctx));
}
function initializeCanvas() {
    let canvas = document.getElementById('particle-canvas');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    let ctx = canvas.getContext("2d");

    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx = canvas.getContext("2d");
    })
    return [canvas, ctx];
}
function startAnimation() {
    const [canvas, ctx] = initializeCanvas();
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(createParticle(canvas));
    }
    requestAnimationFrame((time) => draw(time, canvas, ctx));
};
(function () {
    if (document.readystate !== 'loading') {
        startAnimation();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            startAnimation();
        })
    }
}());
////////////////////////////////////////////////////////////////////////






/!*
wach*!/
*/
