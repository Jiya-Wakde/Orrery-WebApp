document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const hintElement = document.getElementById('hint');
    const nextButton = document.getElementById('next-btn');
    const scoreElement = document.getElementById('score');
    const submitButton = document.getElementById('submit-btn');

    let currentQuestionIndex = 0;
    let score = 0;

    const questions = [
        {
            "question": "Which planet is known as the Red Planet?",
            "options": ["Earth", "Mars", "Jupiter", "Venus"],
            "answer": "Mars",
            "hint": "images/mars.jpg"
        },
        {
            "question": "What is the largest planet in our solar system?",
            "options": ["Earth", "Jupiter", "Saturn", "Mars"],
            "answer": "Jupiter",
            "hint": "The planet has a big red spot."
        },
        {
            "question": "What celestial body is the closest to Earth?",
            "options": ["Moon", "Mars", "Venus", "Mercury"],
            "answer": "Moon",
            "hint": "images/moon.jpg"
        },
        {
            "question":" Which planet has the highest number of moons?", 
            "options":["Saturn", "Jupiter", " Venus", "Mercury"], 
            "answer":"Saturn",
        },
        {
            "question":"Which planet is known as the earth's twin or the hottest planet?",
            "options":["Neptune", "Uranus", "Venus", "Mars"],
            "answer":"Venus",
        },
        {
            "question":"Which is the primary component of the sun?",
            "options":["Hydrogen", "Helium","Oxygen","Carbon"],
            "answer":"Hydrogen",
        },
        {
            "question":"What is diameter of uranus?",
            "options":["12104km", "4880km","50724km","55890km"],
            "answer":"50724km",
        },
        {
            "question": "16 hours is the rotation period of?",
            "options": ["Neptune", "Mars", "Venus", "Mercury"],
            "answer": " Neptune",
 
        }
    ];

    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;

        optionsContainer.innerHTML = '';
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', (event) => checkAnswer(option, currentQuestion.answer, event));
            optionsContainer.appendChild(button);
        });

        hintElement.textContent = currentQuestion.hint;
        nextButton.disabled = true;
        submitButton.disabled = false; // Enable the Submit button
    }

    function checkAnswer(selectedAnswer, correctAnswer, event) {
        if (selectedAnswer === correctAnswer) {
            score++;
            scoreElement.textContent = score;
            alert('Correct!');
        } else {
            alert('Incorrect. The correct answer is: ' + correctAnswer);
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            // Redirect to the result page with the score
            window.location.href = `/result/${score}`;
        }
    }

    displayQuestion();
});