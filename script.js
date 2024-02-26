const questions = [
    //N1: Câu hỏi đúng/sai
    { type: 'truefalse', question: 'Câu 1: Thầy Khánh đẹp trai.', correctAnswer: true },
    //N2: Câu hỏi chọn 1 trong 4 đáp án
    { type: 'multiplechoice', question: 'Câu 2: Ai là người đẹp trai nhất khoa CNTT1', choices: ['A: Thầy Sơn', 'B: Thầy Tiến', 'C: Thầy Khánh', 'D: Thầy Hiến'], correctAnswer: 2 },
    //N3: Câu hỏi chọn nhiều đáp án
    { type: 'multipleanswers', question: 'Câu 3: Đâu là các thầy cô thuộc khoa CNTT1', choices: ['A: Thầy Khánh', 'B: Cô Ái', 'C: Thầy Sơn', 'D: Cô Hà'], correctAnswer: [0, 2, 3] },
    //N4: Câu hỏi tự luận
    { type: 'fillintheblank', question: 'Câu 4: Thầy ... đẹp trai nhất PTIT', correctAnswer: 'Khánh' },
]
let currentQuestionIndex = 0;
let answers = [];

function startQuiz() {
    document.getElementById('info-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    displayQuestion();
}

function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').innerHTML = currentQuestion.question;

    if (currentQuestion.type === 'truefalse') {
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = `
            <label>
                <input type="radio" name="answer" value="true">
                Đúng
            </label>
            <label>
                <input type="radio" name="answer" value="false">
                Sai
            </label><br>
        `;
    } else if (currentQuestion.type === 'multiplechoice' || currentQuestion.type === 'multipleanswers') {
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';

        currentQuestion.choices.forEach((choice, index) => {
            const inputType = currentQuestion.type === 'multiplechoice' ? 'radio' : 'checkbox';
            choicesContainer.innerHTML += `
                <label>
                    <input type="${inputType}" name="answer" value="${index}">
                    ${choice}
                </label><br>
            `;
        });
    } else if (currentQuestion.type === 'fillintheblank') {
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = `
            <label for="fillin-answer">Điền đáp án vào đây:</label><br>
            <input type="text" id="fillin-answer" name="fillin-answer"><br>
        `;
    }
}

function nextQuestion() {
    const selectedInputs = document.querySelectorAll('input[name="answer"]:checked');
    if (selectedInputs.length > 0) {
        answers.push(Array.from(selectedInputs).map(input => input.value));
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            document.getElementById('question-section').style.display = 'none';
            document.getElementById('result-section').style.display = 'block';
            displayResult();
        }
    } else {
        alert('Vui lòng chọn đáp án.');
    }
}
function submitAnswers() {
    let isAnswered = true;

    if (questions[currentQuestionIndex].type === 'fillintheblank') {
        const answer = document.getElementById(questions[currentQuestionIndex].type === 'essay' ? 'essay-answer' : 'fillin-answer').value.trim();
        if (answer === '') {
            isAnswered = false;
        }
        answers.push([answer]);
    } else {
        const selectedInputs = document.querySelectorAll('input[name="answer"]:checked');
        if (selectedInputs.length > 0) {
            answers.push(Array.from(selectedInputs).map(input => input.value));
        } else {
            isAnswered = false;
        }
    }

    if (!isAnswered) {
        alert('Vui lòng trả lời hết các câu hỏi.');
        return;
    }

    document.getElementById('question-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    displayResult();
}


function displayResult() {
    const resultContainer = document.getElementById('result');
    let correctAnswers = 0;

    questions.forEach((question, index) => {
        const userAnswers = answers[index];
        const isCorrect = checkAnswers(question, userAnswers);
        if (isCorrect) {
            correctAnswers++;
        }

        resultContainer.innerHTML += `
            <p>Câu hỏi ${index + 1}: ${isCorrect ? 'Đúng' : 'Sai'}</p>
        `;
    });

    resultContainer.innerHTML += `<h3>Tổng điểm: ${correctAnswers} / ${questions.length}</h3>`;
}

function checkAnswers(question, userAnswers) {
    if (question.type === 'truefalse' || question.type === 'multiplechoice') {
        return userAnswers[0] === question.correctAnswer.toString();
    } else if (question.type === 'multipleanswers') {
        const correctSet = new Set(question.correctAnswer.map(String));
        const userSet = new Set(userAnswers.map(String));
        return Array.from(correctSet).every(item => userSet.has(item)) &&
            Array.from(userSet).every(item => correctSet.has(item));
    } else if (question.type === 'essay' || question.type === 'fillintheblank') {
        const userAnswer = userAnswers[0].toLowerCase();
        const correctAnswer = question.correctAnswer.toLowerCase();
        return userAnswer === correctAnswer;
    }
}