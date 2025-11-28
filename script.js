// 应用状态
const state = {
    difficulty: null,
    currentQuestion: null,
    stats: {
        correct: 0,
        wrong: 0,
        total: 0
    },
    answered: false
};

// DOM 元素
const elements = {
    difficultyScreen: document.getElementById('difficulty-screen'),
    practiceScreen: document.getElementById('practice-screen'),
    difficultyButtons: document.querySelectorAll('.difficulty-btn'),
    num1: document.getElementById('num1'),
    num2: document.getElementById('num2'),
    operator: document.getElementById('operator'),
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-btn'),
    newQuestionBtn: document.getElementById('new-question-btn'),
    backBtn: document.getElementById('back-btn'),
    feedback: document.getElementById('feedback'),
    correctCount: document.getElementById('correct-count'),
    wrongCount: document.getElementById('wrong-count'),
    totalCount: document.getElementById('total-count'),
    questionContainer: document.querySelector('.question-container')
};

// 生成随机数
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成题目
function generateQuestion(difficulty) {
    const maxNum = difficulty;
    let num1, num2, operator, answer;
    
    // 随机选择加法或减法
    const isAddition = Math.random() > 0.5;
    
    if (isAddition) {
        // 加法：确保结果不超过难度范围
        num1 = randomInt(1, Math.floor(maxNum / 2));
        num2 = randomInt(1, maxNum - num1);
        operator = '+';
        answer = num1 + num2;
    } else {
        // 减法：确保结果为正数
        num1 = randomInt(1, maxNum);
        num2 = randomInt(1, num1);
        operator = '-';
        answer = num1 - num2;
    }
    
    return { num1, num2, operator, answer };
}

// 显示题目
function displayQuestion(question) {
    elements.num1.textContent = question.num1;
    elements.num2.textContent = question.num2;
    elements.operator.textContent = question.operator;
    elements.answerInput.value = '';
    elements.answerInput.focus();
    elements.feedback.className = 'feedback empty';
    elements.feedback.textContent = '';
    state.answered = false;
    elements.submitBtn.disabled = false;
    elements.newQuestionBtn.style.display = 'none';
}

// 检查答案
function checkAnswer(userAnswer, correctAnswer) {
    return parseInt(userAnswer) === correctAnswer;
}

// 显示反馈
function showFeedback(isCorrect, correctAnswer) {
    elements.feedback.className = 'feedback empty';
    
    setTimeout(() => {
        if (isCorrect) {
            elements.feedback.className = 'feedback correct';
            elements.feedback.textContent = '✓ 答对了！';
            if (elements.questionContainer) {
                elements.questionContainer.classList.add('bounce');
                setTimeout(() => {
                    elements.questionContainer.classList.remove('bounce');
                }, 500);
            }
        } else {
            elements.feedback.className = 'feedback wrong';
            elements.feedback.textContent = `✗ 答错了！正确答案是 ${correctAnswer}`;
            elements.answerInput.classList.add('shake');
            setTimeout(() => {
                elements.answerInput.classList.remove('shake');
            }, 500);
        }
    }, 100);
}

// 更新统计
function updateStats(isCorrect) {
    state.stats.total++;
    if (isCorrect) {
        state.stats.correct++;
    } else {
        state.stats.wrong++;
    }
    
    elements.correctCount.textContent = state.stats.correct;
    elements.wrongCount.textContent = state.stats.wrong;
    elements.totalCount.textContent = state.stats.total;
}

// 开始练习
function startPractice(difficulty) {
    state.difficulty = difficulty;
    state.stats = { correct: 0, wrong: 0, total: 0 };
    updateStatsDisplay();
    elements.difficultyScreen.classList.remove('active');
    elements.practiceScreen.classList.add('active');
    generateNewQuestion();
}

// 生成新题目
function generateNewQuestion() {
    state.currentQuestion = generateQuestion(state.difficulty);
    displayQuestion(state.currentQuestion);
}

// 更新统计显示
function updateStatsDisplay() {
    elements.correctCount.textContent = state.stats.correct;
    elements.wrongCount.textContent = state.stats.wrong;
    elements.totalCount.textContent = state.stats.total;
}

// 返回难度选择
function backToDifficulty() {
    elements.practiceScreen.classList.remove('active');
    elements.difficultyScreen.classList.add('active');
    state.difficulty = null;
    state.currentQuestion = null;
    state.stats = { correct: 0, wrong: 0, total: 0 };
}

// 提交答案
function submitAnswer() {
    if (state.answered) return;
    
    const userAnswer = elements.answerInput.value.trim();
    
    if (userAnswer === '') {
        elements.answerInput.focus();
        return;
    }
    
    const isCorrect = checkAnswer(userAnswer, state.currentQuestion.answer);
    showFeedback(isCorrect, state.currentQuestion.answer);
    updateStats(isCorrect);
    
    state.answered = true;
    elements.submitBtn.disabled = true;
    elements.newQuestionBtn.style.display = 'block';
}

// 事件监听器
elements.difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const difficulty = parseInt(btn.dataset.difficulty);
        startPractice(difficulty);
    });
});

elements.submitBtn.addEventListener('click', submitAnswer);

elements.answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitAnswer();
    }
});

elements.newQuestionBtn.addEventListener('click', () => {
    generateNewQuestion();
});

elements.backBtn.addEventListener('click', () => {
    backToDifficulty();
});

// 初始化：聚焦输入框（当切换到练习界面时）
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (elements.practiceScreen.classList.contains('active')) {
                setTimeout(() => {
                    elements.answerInput.focus();
                }, 100);
            }
        }
    });
});

observer.observe(elements.practiceScreen, {
    attributes: true,
    attributeFilter: ['class']
});

// 防止页面缩放（iPad Safari）
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

document.addEventListener('gesturechange', (e) => {
    e.preventDefault();
});

document.addEventListener('gestureend', (e) => {
    e.preventDefault();
});

