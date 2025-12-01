// 应用状态
const state = {
    mode: null, // 'practice' 或 'speed'
    difficulty: null,
    currentQuestion: null,
    stats: {
        correct: 0,
        wrong: 0,
        total: 0
    },
    answered: false,
    answerShown: false,  // 是否已显示答案
    // 竞速模式状态
    speedMode: {
        questions: [], // 题目队列（包含用户答案和状态）
        startTime: null, // 开始时间
        timer: null, // 计时器
        correctCount: 0, // 正确题数
        submitted: false // 是否已提交
    }
};

// DOM 元素
const elements = {
    modeScreen: document.getElementById('mode-screen'),
    difficultyScreen: document.getElementById('difficulty-screen'),
    practiceScreen: document.getElementById('practice-screen'),
    speedDifficultyScreen: document.getElementById('speed-difficulty-screen'),
    speedPracticeScreen: document.getElementById('speed-practice-screen'),
    speedResultScreen: document.getElementById('speed-result-screen'),
    difficultyButtons: document.querySelectorAll('.difficulty-btn'),
    num1: document.getElementById('num1'),
    num2: document.getElementById('num2'),
    operator: document.getElementById('operator'),
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-btn'),
    newQuestionBtn: document.getElementById('new-question-btn'),
    backBtn: document.getElementById('back-btn'),
    backBtnWrong: document.getElementById('back-btn-wrong'),
    retryBtn: document.getElementById('retry-btn'),
    showAnswerBtn: document.getElementById('show-answer-btn'),
    correctActions: document.getElementById('correct-actions'),
    wrongActions: document.getElementById('wrong-actions'),
    feedback: document.getElementById('feedback'),
    correctCount: document.getElementById('correct-count'),
    wrongCount: document.getElementById('wrong-count'),
    totalCount: document.getElementById('total-count'),
    questionContainer: document.querySelector('.question-container'),
    // 竞速模式元素
    speedQuestionsGrid: document.getElementById('speed-questions-grid'),
    speedSubmitBtn: document.getElementById('speed-submit-btn'),
    speedTimer: document.getElementById('speed-timer'),
    speedProgressValue: document.getElementById('speed-progress-value'),
    speedProgressText: document.getElementById('speed-progress-text'),
    speedProgressFill: document.getElementById('speed-progress-fill'),
    speedCorrect: document.getElementById('speed-correct'),
    speedDifficultyBadge: document.getElementById('speed-difficulty-badge'),
    speedHint: document.getElementById('speed-hint'),
    resultTime: document.getElementById('result-time'),
    resultCorrect: document.getElementById('result-correct'),
    resultAccuracy: document.getElementById('result-accuracy'),
    resultEmoji: document.getElementById('result-emoji'),
    resultTitle: document.getElementById('result-title'),
    recordMessage: document.getElementById('record-message'),
    speedViewAnswersBtn: document.getElementById('speed-view-answers-btn'),
    speedReviewSection: document.getElementById('speed-review-section'),
    speedReviewGrid: document.getElementById('speed-review-grid'),
    audioCorrect: document.getElementById('audio-correct'),
    audioWrong: document.getElementById('audio-wrong')
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

const difficultyLabels = {
    20: '20以内',
    100: '100以内',
    1000: '1000以内'
};

function getDifficultyLabel(value) {
    return difficultyLabels[value] || `${value}以内`;
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
    state.answerShown = false;
    elements.submitBtn.disabled = false;
    elements.correctActions.style.display = 'none';
    elements.wrongActions.style.display = 'none';
    elements.answerInput.disabled = false;
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
            const correctMessages = ['🎉 太棒了！答对了！', '✨ 真聪明！', '🌟 做得好！', '💯 完美！', '👏 厉害！'];
            const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
            elements.feedback.textContent = randomMessage;
            playFeedbackAudio(true);
            if (elements.questionContainer) {
                elements.questionContainer.classList.add('bounce');
                setTimeout(() => {
                    elements.questionContainer.classList.remove('bounce');
                }, 600);
            }
            // 显示答对时的操作按钮
            elements.correctActions.style.display = 'flex';
            elements.wrongActions.style.display = 'none';
        } else {
            elements.feedback.className = 'feedback wrong';
            elements.feedback.textContent = `😊 再想想吧！`;
            playFeedbackAudio(false);
            elements.answerInput.classList.add('shake');
            setTimeout(() => {
                elements.answerInput.classList.remove('shake');
            }, 500);
            // 显示答错时的操作按钮
            elements.correctActions.style.display = 'none';
            elements.wrongActions.style.display = 'flex';
        }
    }, 100);
}

// 显示答案
function showAnswer(correctAnswer) {
    elements.feedback.className = 'feedback wrong';
    elements.feedback.textContent = `💡 正确答案是：${correctAnswer}`;
    elements.answerInput.value = correctAnswer;
    elements.answerInput.disabled = true;
    state.answerShown = true;
    state.answered = true;
    
    // 显示下一题按钮
    elements.correctActions.style.display = 'flex';
    elements.wrongActions.style.display = 'none';
    elements.submitBtn.disabled = true;
}

// 重试
function retry() {
    elements.answerInput.value = '';
    elements.answerInput.focus();
    elements.answerInput.disabled = false;
    elements.feedback.className = 'feedback empty';
    elements.feedback.textContent = '';
    elements.correctActions.style.display = 'none';
    elements.wrongActions.style.display = 'none';
    elements.submitBtn.disabled = false;
    state.answered = false;
    state.answerShown = false;
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
    state.mode = 'practice';
    state.difficulty = difficulty;
    state.stats = { correct: 0, wrong: 0, total: 0 };
    updateStatsDisplay();
    elements.difficultyScreen.classList.remove('active');
    elements.practiceScreen.classList.add('active');
    generateNewQuestion();
}

// 开始竞速模式
function startSpeedMode(difficulty) {
    state.mode = 'speed';
    state.difficulty = difficulty;
    
    // 确保只显示竞速练习界面
    elements.speedDifficultyScreen.classList.remove('active');
    elements.speedResultScreen.classList.remove('active');
    elements.modeScreen.classList.remove('active');
    elements.speedPracticeScreen.classList.add('active');
    
    state.speedMode.questions = [];
    state.speedMode.correctCount = 0;
    state.speedMode.submitted = false;
    if (elements.speedProgressFill) {
        elements.speedProgressFill.style.width = '0%';
    }
    if (elements.speedProgressValue) {
        elements.speedProgressValue.textContent = '0/20';
    }
    if (elements.speedProgressText) {
        elements.speedProgressText.textContent = '0/20';
    }
    elements.speedCorrect.textContent = '0';
    
    // 生成20道题目，每个题目添加状态信息
    for (let i = 0; i < 20; i++) {
        const question = generateQuestion(difficulty);
        state.speedMode.questions.push({
            ...question,
            userAnswer: null, // 用户答案
            isCorrect: null,  // 是否正确
            answered: false   // 是否已答
        });
    }
    
    elements.speedSubmitBtn.disabled = false;
    updateSpeedDifficultyUI(difficulty);
    
    // 渲染题目网格
    renderSpeedQuestionsGrid();
    
    // 开始计时
    startSpeedTimer();
    updateSpeedProgress();
}

// 渲染题目网格
function renderSpeedQuestionsGrid() {
    const grid = elements.speedQuestionsGrid;
    grid.innerHTML = '';
    
    state.speedMode.questions.forEach((question, index) => {
        const card = document.createElement('div');
        card.className = 'speed-question-card';
        card.id = `speed-question-${index}`;
        
        card.innerHTML = `
            <span class="speed-question-text">${question.num1} ${question.operator} ${question.num2} =</span>
            <div class="speed-question-input">
                <input type="number" data-index="${index}" value="${question.userAnswer ?? ''}" autocomplete="off" inputmode="numeric" ${state.speedMode.submitted ? 'disabled' : ''}/>
            </div>
            <div class="speed-question-result" id="speed-question-result-${index}">${question.isCorrect === null ? '' : question.isCorrect ? '<span class="correct-check">✔</span>' : `<span class="correct-answer">正确答案：${question.answer}</span>`}</div>
        `;
        
        grid.appendChild(card);
        updateSpeedCardState(card, question);
    });
    
    // 绑定输入事件
    grid.querySelectorAll('input').forEach((input) => {
        input.addEventListener('input', handleSpeedInput);
    });
}

// 处理竞速模式输入
function handleSpeedInput(event) {
    const index = parseInt(event.target.dataset.index, 10);
    if (Number.isNaN(index)) return;
    const value = event.target.value.trim();
    state.speedMode.questions[index].userAnswer = value;
    updateSpeedCardState(document.getElementById(`speed-question-${index}`), state.speedMode.questions[index]);
    updateSpeedProgress();
}

// 更新竞速模式进度
function updateSpeedProgress() {
    const answered = state.speedMode.questions.filter(
        (q) => q.userAnswer !== null && q.userAnswer !== ''
    ).length;
    const total = state.speedMode.questions.length;
    const progressText = `${answered}/${total}`;
    if (elements.speedProgressText) {
        elements.speedProgressText.textContent = progressText;
    }
    if (elements.speedProgressValue) {
        elements.speedProgressValue.textContent = progressText;
    }
    if (elements.speedProgressFill) {
        const percent = total === 0 ? 0 : (answered / total) * 100;
        elements.speedProgressFill.style.width = `${percent}%`;
    }
    elements.speedCorrect.textContent = state.speedMode.correctCount;
}

// 开始计时器
function startSpeedTimer() {
    state.speedMode.startTime = Date.now();
    state.speedMode.timer = setInterval(() => {
        const elapsed = Date.now() - state.speedMode.startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;
        elements.speedTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
    }, 100);
}

// 停止计时器
function stopSpeedTimer() {
    if (state.speedMode.timer) {
        clearInterval(state.speedMode.timer);
        state.speedMode.timer = null;
    }
}

// 格式化时间
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
}

// 提交竞速模式答案
function submitSpeedAnswers() {
    if (state.speedMode.submitted) {
        return;
    }
    
    state.speedMode.correctCount = 0;
    
    state.speedMode.questions.forEach((question, index) => {
        const card = document.getElementById(`speed-question-${index}`);
        const input = card ? card.querySelector('input') : null;
        const resultEl = document.getElementById(`speed-question-result-${index}`);
        
        const value = question.userAnswer;
        const numericValue = value === null || value === '' ? null : parseInt(value, 10);
        const isCorrect = numericValue === question.answer;
        
        question.isCorrect = isCorrect;
        question.answered = true;
        
        if (isCorrect) {
            state.speedMode.correctCount++;
        }
        
        if (card) {
            card.classList.remove('correct', 'wrong', 'blank', 'filled');
            card.classList.add(isCorrect ? 'correct' : 'wrong');
        }
        
        if (input) {
            input.disabled = true;
            if (!isCorrect && numericValue === null) {
                input.value = '';
            }
        }
        
        if (resultEl) {
            resultEl.innerHTML = isCorrect
                ? '<span class="correct-check">✔</span>'
                : `<span class="correct-answer">正确答案：${question.answer}</span>`;
        }
    });
    
    elements.speedCorrect.textContent = state.speedMode.correctCount;
    state.speedMode.submitted = true;
    elements.speedSubmitBtn.disabled = true;
    stopSpeedTimer();
    finishSpeedMode();
}

function updateSpeedCardState(card, question) {
    if (!card) return;
    const input = card.querySelector('input');
    if (state.speedMode.submitted && input) {
        input.disabled = true;
    }
    card.classList.remove('correct', 'wrong', 'blank', 'filled');
    if (question.isCorrect === true) {
        card.classList.add('correct');
        return;
    }
    if (question.isCorrect === false) {
        card.classList.add('wrong');
        return;
    }
    const hasValue = question.userAnswer !== null && question.userAnswer !== '';
    card.classList.add(hasValue ? 'filled' : 'blank');
}

function updateSpeedDifficultyUI(difficulty) {
    const label = getDifficultyLabel(difficulty);
    if (elements.speedDifficultyBadge) {
        elements.speedDifficultyBadge.textContent = label;
        elements.speedDifficultyBadge.dataset.level = difficulty;
    }
    if (elements.speedHint) {
        elements.speedHint.textContent = `完成 ${label} 的 20 道题后点击下方提交按钮`;
    }
}

function playFeedbackAudio(isCorrect) {
    const audio = isCorrect ? elements.audioCorrect : elements.audioWrong;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

function renderSpeedReviewGrid() {
    if (!elements.speedReviewGrid) return;
    elements.speedReviewGrid.innerHTML = '';
    state.speedMode.questions.forEach((question) => {
        const card = document.createElement('div');
        card.className = 'speed-question-card';
        card.classList.add(question.isCorrect ? 'correct' : 'wrong');
        const userAnswer = question.userAnswer === null || question.userAnswer === '' ? '未作答' : question.userAnswer;
        card.innerHTML = `
            <span class="speed-question-text">${question.num1} ${question.operator} ${question.num2} =</span>
            <div class="speed-question-input">
                <input type="text" value="${userAnswer}" disabled />
            </div>
            <div class="speed-question-result">
                ${question.isCorrect ? '<span class="correct-check">✔</span>' : `<span class="correct-answer">正确答案：${question.answer}</span>`}
            </div>
        `;
        elements.speedReviewGrid.appendChild(card);
    });
}

// 完成竞速模式
function finishSpeedMode() {
    stopSpeedTimer();
    
    const totalTime = Date.now() - state.speedMode.startTime;
    const accuracy = Math.round((state.speedMode.correctCount / 20) * 100);
    
    // 显示结果
    elements.resultTime.textContent = formatTime(totalTime);
    elements.resultCorrect.textContent = `${state.speedMode.correctCount}/20`;
    elements.resultAccuracy.textContent = `${accuracy}%`;
    
    // 检查是否打破记录
    const recordKey = `speed_record_${state.difficulty}`;
    const oldRecord = localStorage.getItem(recordKey);
    const recordTime = oldRecord ? parseInt(oldRecord) : null;
    
    const totalQuestions = state.speedMode.questions.length || 20;
    if (state.speedMode.correctCount === totalQuestions && (!recordTime || totalTime < recordTime)) {
        // 打破记录
        localStorage.setItem(recordKey, totalTime.toString());
        elements.resultEmoji.textContent = '🏆';
        elements.resultTitle.textContent = '🎉 恭喜！打破记录！';
        elements.recordMessage.className = 'record-message record-broken';
        elements.recordMessage.textContent = `✨ 新记录：${formatTime(totalTime)}！太厉害了！`;
    } else {
        // 未打破记录
        elements.resultEmoji.textContent = '⭐';
        elements.resultTitle.textContent = '挑战完成！';
        elements.recordMessage.className = 'record-message record-normal';
        if (state.speedMode.correctCount === totalQuestions && recordTime) {
            const timeDiff = totalTime - recordTime;
            const diffText = timeDiff > 0 ? `还差 ${formatTime(timeDiff)}` : '再接再厉！';
            elements.recordMessage.textContent = `💪 继续加油！最快记录：${formatTime(recordTime)}（${diffText}）`;
        } else if (state.speedMode.correctCount !== totalQuestions) {
            elements.recordMessage.textContent = '✅ 想刷新记录需要20题全对，加油！';
        } else {
            elements.recordMessage.textContent = '💪 继续加油，争取下一次打破记录！';
        }
    }
    
    // 切换到结果界面
    elements.speedPracticeScreen.classList.remove('active');
    elements.speedResultScreen.classList.add('active');
    if (elements.speedReviewSection) {
        elements.speedReviewSection.style.display = 'none';
    }
    if (elements.speedViewAnswersBtn) {
        elements.speedViewAnswersBtn.dataset.state = 'hidden';
        elements.speedViewAnswersBtn.disabled = false;
        elements.speedViewAnswersBtn.innerText = '👀 查看答案';
    }
}

// 重新开始竞速模式
function retrySpeedMode() {
    if (!state.difficulty) {
        elements.speedResultScreen.classList.remove('active');
        elements.speedPracticeScreen.classList.remove('active');
        elements.speedDifficultyScreen.classList.add('active');
        return;
    }
    startSpeedMode(state.difficulty);
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

// 返回难度选择（练习模式）
function backToDifficulty() {
    elements.practiceScreen.classList.remove('active');
    elements.difficultyScreen.classList.add('active');
    state.difficulty = null;
    state.currentQuestion = null;
    state.stats = { correct: 0, wrong: 0, total: 0 };
}

// 从难度选择返回模式选择
function backToModeFromDifficulty() {
    elements.difficultyScreen.classList.remove('active');
    elements.modeScreen.classList.add('active');
    state.difficulty = null;
}

// 返回模式选择
function backToMode() {
    // 停止计时器
    if (state.mode === 'speed' && state.speedMode.timer) {
        stopSpeedTimer();
    }
    
    // 隐藏所有界面
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // 显示模式选择界面
    elements.modeScreen.classList.add('active');
    
    // 重置状态
    state.mode = null;
    state.difficulty = null;
    state.currentQuestion = null;
    state.stats = { correct: 0, wrong: 0, total: 0 };
    state.speedMode.questions = [];
    state.speedMode.correctCount = 0;
    state.speedMode.submitted = false;
    if (elements.speedQuestionsGrid) {
        elements.speedQuestionsGrid.innerHTML = '';
    }
}

// 提交答案
function submitAnswer() {
    if (state.answered || state.answerShown) return;
    
    const userAnswer = elements.answerInput.value.trim();
    
    if (userAnswer === '') {
        elements.answerInput.focus();
        return;
    }
    
    const isCorrect = checkAnswer(userAnswer, state.currentQuestion.answer);
    showFeedback(isCorrect, state.currentQuestion.answer);
    updateStats(isCorrect);  // 更新统计
    
    state.answered = true;
    elements.submitBtn.disabled = true;
}

// 事件监听器 - 模式选择
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        elements.modeScreen.classList.remove('active');
        
        if (mode === 'practice') {
            elements.difficultyScreen.classList.add('active');
        } else if (mode === 'speed') {
            elements.speedDifficultyScreen.classList.add('active');
        }
    });
});

// 事件监听器 - 练习模式难度选择
document.querySelectorAll('#difficulty-screen .difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const difficulty = parseInt(btn.dataset.difficulty);
        startPractice(difficulty);
    });
});

// 事件监听器 - 竞速模式难度选择
document.querySelectorAll('.speed-difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const difficulty = parseInt(btn.dataset.difficulty);
        startSpeedMode(difficulty);
    });
});

// 返回按钮
document.getElementById('speed-back-to-mode').addEventListener('click', backToMode);
document.getElementById('speed-back-to-mode-result').addEventListener('click', backToMode);
document.getElementById('practice-back-to-mode').addEventListener('click', backToModeFromDifficulty);
document.getElementById('speed-retry-btn').addEventListener('click', retrySpeedMode);

// 竞速模式提交答案
elements.speedSubmitBtn.addEventListener('click', submitSpeedAnswers);

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

elements.backBtnWrong.addEventListener('click', () => {
    backToDifficulty();
});

elements.retryBtn.addEventListener('click', () => {
    retry();
});

elements.showAnswerBtn.addEventListener('click', () => {
    showAnswer(state.currentQuestion.answer);
    // 查看答案不算错误，但也不算正确，所以不更新统计
});

if (elements.speedViewAnswersBtn) {
    elements.speedViewAnswersBtn.addEventListener('click', () => {
        if (!state.speedMode.submitted || !elements.speedReviewSection) return;
        const isHidden = elements.speedReviewSection.style.display !== 'block';
        if (isHidden) {
            renderSpeedReviewGrid();
            elements.speedReviewSection.style.display = 'block';
            elements.speedViewAnswersBtn.innerText = '🙈 收起答案';
            elements.speedViewAnswersBtn.dataset.state = 'shown';
        } else {
            elements.speedReviewSection.style.display = 'none';
            elements.speedViewAnswersBtn.innerText = '👀 查看答案';
            elements.speedViewAnswersBtn.dataset.state = 'hidden';
        }
    });
}

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

