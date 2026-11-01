import {
    syllabus,
    allLessons,
    introductorySections,
    studyPlan
} from "./data/syllabus.js";

import {
    configured,
    loginWithGoogle,
    logout,
    observeAuth,
    saveCloudProgress,
    loadCloudProgress
} from "./firebase.js";

// ==========================================
// THALIR APPLICATION
// ==========================================

const main = document.getElementById("mainContent");
const navigation = document.getElementById("navigation");
const menuToggle = document.getElementById("menuToggle");
const loginButton = document.getElementById("loginButton");

let currentUser = null;
let currentLesson = null;
let quizAnswers = {};
let currentQuizSubmitted = false;

const STORAGE_KEY = "thalir_learning_progress";

const defaultProgress = {
    completedLessons: [],
    masteredVocabulary: [],
    masteredKana: [],
    masteredKanji: [],
    xp: 0,
    streak: 0,
    lastActive: null,
    lastLesson: 1,
    quizScores: {},
    activities: []
};

let progress = loadLocalProgress();

// ==========================================
// STORAGE
// ==========================================

function loadLocalProgress() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            return {
                ...defaultProgress,
                ...JSON.parse(saved)
            };
        }
    } catch (error) {
        console.error("Progress loading error:", error);
    }

    return structuredClone(defaultProgress);
}

function saveProgress() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
    );

    if (currentUser && configured) {
        saveCloudProgress(currentUser.uid, progress)
            .catch(error => {
                console.error("Cloud synchronization error:", error);
            });
    }

    updateHeader();
}

async function synchronizeProgress(user) {
    if (!user) return;

    try {
        const cloudProgress = await loadCloudProgress(user.uid);

        if (cloudProgress) {
            progress = {
                ...defaultProgress,
                ...cloudProgress
            };

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(progress)
            );
        } else {
            await saveCloudProgress(user.uid, progress);
        }

        updateHeader();
        renderPage();

    } catch (error) {
        console.error("Progress synchronization failed:", error);
        showToast("Cloud sync unavailable. Local progress is safe.");
    }
}

// ==========================================
// DAILY STREAK
// ==========================================

function updateDailyStreak() {
    const today = new Date().toISOString().split("T")[0];

    if (progress.lastActive === today) return;

    if (!progress.lastActive) {
        progress.streak = 1;
    } else {
        const previous = new Date(progress.lastActive);
        const current = new Date(today);

        const difference = Math.round(
            (current - previous) / 86400000
        );

        if (difference === 1) {
            progress.streak++;
        } else {
            progress.streak = 1;
        }
    }

    progress.lastActive = today;
    saveProgress();
}

// ==========================================
// HEADER
// ==========================================

function updateHeader() {
    document.getElementById("streakCount").textContent =
        progress.streak;

    if (currentUser) {
        loginButton.textContent =
            currentUser.displayName?.split(" ")[0] || "Account";
    } else {
        loginButton.textContent = "Sign in";
    }

    const currentHash = location.hash || "#home";

    document.querySelectorAll(".navigation a").forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === currentHash
        );
    });
}

menuToggle.addEventListener("click", () => {
    navigation.classList.toggle("open");
});

navigation.addEventListener("click", event => {
    if (event.target.tagName === "A") {
        navigation.classList.remove("open");
    }
});

// ==========================================
// AUTHENTICATION
// ==========================================

loginButton.addEventListener("click", async () => {
    if (!configured) {
        showToast("Configure Firebase to enable Google sign-in.");
        return;
    }

    try {
        if (currentUser) {
            await logout();
            showToast("Signed out successfully.");
        } else {
            await loginWithGoogle();
            showToast("Welcome to THALIR!");
        }
    } catch (error) {
        console.error(error);
        showToast("Authentication failed. Please try again.");
    }
});

observeAuth(async user => {
    currentUser = user;

    if (user) {
        await synchronizeProgress(user);
    }

    updateHeader();
});

// ==========================================
// TOAST
// ==========================================

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// ==========================================
// UTILITIES
// ==========================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function getLesson(id) {
    return allLessons.find(lesson => lesson.id === Number(id));
}

function isCompleted(id) {
    return progress.completedLessons.includes(Number(id));
}

function getCompletionPercentage() {
    return Math.round(
        progress.completedLessons.length / 25 * 100
    );
}

function getTotalVocabulary() {
    return allLessons.reduce(
        (total, lesson) => total + (lesson.vocabulary?.length || 0),
        0
    );
}

function recordActivity(message) {
    progress.activities.unshift({
        message,
        date: new Date().toISOString()
    });

    progress.activities = progress.activities.slice(0, 15);
    saveProgress();
}

// ==========================================
// ROUTING
// ==========================================

function renderPage() {
    const hash = location.hash || "#home";
    const parts = hash.replace("#", "").split("/");

    const page = parts[0];

    switch (page) {
        case "home":
            renderHome();
            break;

        case "lessons":
            if (parts[1]) {
                renderLesson(parts[1]);
            } else {
                renderLessons();
            }
            break;

        case "path":
            renderStudyPlan();
            break;

        case "grammar":
            renderGrammar();
            break;

        case "kana":
            renderKana();
            break;

        case "kanji":
            renderKanji();
            break;

        case "vocabulary":
            renderVocabulary();
            break;

        case "practice":
            renderPractice();
            break;

        case "conversations":
            renderConversations();
            break;

        case "exam":
            renderExam();
            break;

        case "progress":
            renderProgress();
            break;

        case "intro":
            renderIntroduction(parts[1]);
            break;

        default:
            renderHome();
    }

    updateHeader();
}

window.addEventListener("hashchange", renderPage);

// ==========================================
// HOMEPAGE
// ==========================================

function renderHome() {
    const percentage = getCompletionPercentage();

    main.innerHTML = `
        <section class="hero">
            <div class="hero-content">

                <span class="hero-label">
                    🌸 YOUR JAPANESE LEARNING JOURNEY STARTS HERE
                </span>

                <h1>
                    Master Japanese Step by Step with THALIR
                </h1>

                <p>
                    Your complete beginner-friendly Japanese learning
                    platform. Explore grammar, vocabulary, Hiragana,
                    Katakana, Kanji and interactive practice.
                </p>

                <div class="hero-actions">
                    <button class="btn btn-white"
                        onclick="location.hash='#lessons'">
                        Start Learning →
                    </button>

                    <button class="btn btn-outline"
                        onclick="location.hash='#grammar'">
                        Explore Grammar
                    </button>
                </div>

            </div>

            <div class="hero-japanese">たら</div>
        </section>

        <div class="container">

            <div class="section-heading">
                <h2>Your Learning Dashboard</h2>
                <p>Every small step brings you closer to your goal.</p>
            </div>

            <div class="stats-grid">

                ${statCard("📚", progress.completedLessons.length,
                    "Lessons Completed")}

                ${statCard("📈", percentage + "%",
                    "Course Progress")}

                ${statCard("🔥", progress.streak,
                    "Day Streak")}

                ${statCard("⭐", progress.xp,
                    "Total XP")}

            </div>

            <div class="section-heading">
                <h2>Continue Learning</h2>
                <p>Pick up where you left off.</p>
            </div>

            <div class="learning-card"
                onclick="location.hash='#lessons/${progress.lastLesson}'">

                <div class="card-icon">📖</div>

                <h3>
                    Lesson ${progress.lastLesson}
                    · ${getLesson(progress.lastLesson)?.title || "Start learning"}
                </h3>

                <p>
                    ${isCompleted(progress.lastLesson)
                        ? "Review your completed lesson."
                        : "Continue your Japanese learning journey."}
                </p>

                <div class="progress-track">
                    <div class="progress-fill"
                        style="width:${percentage}%"></div>
                </div>

                <button class="btn btn-green">Continue Learning →</button>

            </div>

            <br><br>

            <div class="section-heading">
                <h2>Explore Learning Categories</h2>
                <p>Everything you need in one place.</p>
            </div>

            <div class="card-grid">

                ${categoryCard("🗓️", "30-Day Learning Path",
                    "Follow your structured learning schedule.", "#path")}

                ${categoryCard("📘", "Japanese Grammar",
                    "Understand Japanese grammar patterns.", "#grammar")}

                ${categoryCard("あ", "Hiragana & Katakana",
                    "Learn the Japanese writing systems.", "#kana")}

                ${categoryCard("漢", "Kanji",
                    "Study beginner Japanese characters.", "#kanji")}

                ${categoryCard("📚", "Vocabulary",
                    "Build your Japanese vocabulary.", "#vocabulary")}

                ${categoryCard("💬", "Conversations",
                    "Practice everyday Japanese dialogues.", "#conversations")}

                ${categoryCard("✍️", "Practice Drills",
                    "Test your understanding.", "#practice")}

                ${categoryCard("📝", "Mock Examination",
                    "Try original JLPT-style practice questions.", "#exam")}

                ${categoryCard("📊", "My Progress",
                    "Track your learning achievements.", "#progress")}

            </div>

            <br><br>

            <div class="section-heading">
                <h2>Start with the Basics</h2>
                <p>Build your foundation before Lesson 1.</p>
            </div>

            <div class="card-grid">

                ${introductorySections.map(section => `
                    <div class="learning-card"
                        onclick="location.hash='#intro/${section.id}'">

                        <div class="card-icon">🌸</div>

                        <h3>${section.title}</h3>

                        <p class="japanese">
                            ${section.japanese}
                        </p>

                        <p>${section.description}</p>

                    </div>
                `).join("")}

            </div>

        </div>
    `;
}

function statCard(icon, value, label) {
    return `
        <div class="stat-card">
            <div class="stat-icon">${icon}</div>
            <h3>${value}</h3>
            <p>${label}</p>
        </div>
    `;
}

function categoryCard(icon, title, description, route) {
    return `
        <div class="learning-card"
            onclick="location.hash='${route}'">

            <div class="card-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${description}</p>

        </div>
    `;
}

// ==========================================
// LESSON LIST
// ==========================================

function renderLessons() {
    main.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <h2>Japanese Textbook Lessons</h2>
                <p>Follow your original 25-lesson curriculum.</p>
            </div>

            ${Object.values(syllabus).map(section => `
                <br>

                <div class="section-heading">
                    <h2>${section.title}</h2>
                    <p>${section.range}</p>
                </div>

                <div class="lesson-list">

                    ${section.lessons.map(lesson => `
                        <div class="lesson-card"
                            onclick="location.hash='#lessons/${lesson.id}'">

                            <h3>
                                ${isCompleted(lesson.id) ? "✓ " : ""}
                                ${lesson.japanese}
                            </h3>

                            <p>Lesson ${lesson.id}</p>

                            <p>${lesson.title}</p>

                            <p>
                                ${isCompleted(lesson.id)
                                    ? "Completed"
                                    : "Start learning →"}
                            </p>

                        </div>
                    `).join("")}

                </div>
            `).join("")}

        </div>
    `;
}

// ==========================================
// INDIVIDUAL LESSON
// ==========================================

function renderLesson(id) {
    const lesson = getLesson(id);

    if (!lesson) {
        main.innerHTML = `
            <div class="container">
                <div class="empty-state">
                    Lesson not found.
                </div>
            </div>
        `;
        return;
    }

    currentLesson = lesson;
    progress.lastLesson = lesson.id;
    saveProgress();

    quizAnswers = {};
    currentQuizSubmitted = false;

    const questions = lesson.quiz || [];

    main.innerHTML = `
        <div class="container">

            <button class="btn btn-green"
                onclick="location.hash='#lessons'">
                ← All Lessons
            </button>

            <br><br>

            <section class="lesson-header">

                <p>ELEMENTARY JAPANESE</p>

                <h1>
                    ${lesson.japanese} · ${lesson.title}
                </h1>

                <p>Lesson ${lesson.id} of 25</p>

                <p>
                    ${isCompleted(lesson.id)
                        ? "✓ Completed"
                        : "Not completed yet"}
                </p>

            </section>

            <section class="lesson-section">

                <h2>🎯 Learning Objectives</h2>

                ${(lesson.objectives || [
                    "Understand the sentence patterns.",
                    "Learn the grammar points.",
                    "Practice Japanese examples."
                ]).map(item => `
                    <p>✓ ${item}</p>
                `).join("<br>")}

            </section>

            <section class="lesson-section">

                <h2>📘 Sentence Patterns</h2>

                ${(lesson.patterns || []).map(sentence => `
                    <div class="grammar-item">

                        <p class="example-japanese">
                            ${sentence}
                        </p>

                        <button class="btn btn-green"
                            onclick="speakJapanese('${escapeHTML(sentence)}')">
                            🔊 Listen
                        </button>

                    </div>
                `).join("") || "<p>Sentence patterns will be added in the next content update.</p>"}

            </section>

            <section class="lesson-section">

                <h2>🧠 Grammar Points</h2>

                ${(lesson.grammar || []).map((item, index) => `
                    <div class="grammar-item">
                        <strong>${index + 1}. ${item}</strong>
                    </div>
                `).join("")}

            </section>

            <section class="lesson-section">

                <h2>📚 Vocabulary</h2>

                ${(lesson.vocabulary || []).length
                    ? `
                    <table class="vocabulary-table">

                        <thead>
                            <tr>
                                <th>Japanese</th>
                                <th>Romaji</th>
                                <th>English</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${lesson.vocabulary.map(word => `
                                <tr>
                                    <td class="japanese">${word[0]}</td>
                                    <td>${word[1]}</td>
                                    <td>${word[2]}</td>
                                </tr>
                            `).join("")}
                        </tbody>

                    </table>
                    `
                    : "<p>Vocabulary content for this lesson is pending.</p>"
                }

            </section>

            <section class="lesson-section">

                <h2>💬 Conversation</h2>

                <h3 class="japanese">${lesson.conversation || ""}</h3>

                <p>
                    Textbook conversation title.
                </p>

                <p>
                    Full original textbook dialogue is not included
                    unless supplied. Supplementary dialogue content
                    will be clearly identified as THALIR-created.
                </p>

            </section>

            <section class="lesson-section">

                <h2>✍️ Lesson Quiz</h2>

                ${
                    questions.length
                    ? questions.map((question, index) => `
                        <div class="grammar-item">

                            <h3>
                                ${index + 1}. ${question.q}
                            </h3>

                            ${question.options.map((option, optionIndex) => `
                                <label class="quiz-option">

                                    <input type="radio"
                                        name="question${index}"
                                        value="${optionIndex}"
                                        onchange="selectAnswer(${index}, ${optionIndex})">

                                    ${option}

                                </label>
                            `).join("")}

                            <div id="feedback${index}"></div>

                        </div>
                    `).join("")
                    : "<p>Quiz questions for this lesson are being prepared.</p>"
                }

                ${questions.length ? `
                    <button class="btn btn-green"
                        id="submitQuiz"
                        onclick="submitQuiz()">
                        Submit Quiz
                    </button>

                    <div id="quizResult"></div>
                ` : ""}

            </section>

            <section class="lesson-section">

                <h2>🏆 Lesson Completion</h2>

                <p>
                    Complete the lesson quiz to unlock its completion
                    reward.
                </p>

                <br>

                <button class="btn btn-green"
                    id="completeLesson"
                    onclick="completeLesson(${lesson.id})"
                    ${isCompleted(lesson.id) ? "disabled" : "disabled"}>

                    ${isCompleted(lesson.id)
                        ? "✓ Lesson Completed"
                        : "Mark as Completed"}

                </button>

            </section>

            <div style="display:flex;justify-content:space-between;gap:10px;">

                ${lesson.id > 1 ? `
                    <button class="btn btn-green"
                        onclick="location.hash='#lessons/${lesson.id - 1}'">
                        ← Previous
                    </button>
                ` : "<span></span>"}

                ${lesson.id < 25 ? `
                    <button class="btn btn-green"
                        onclick="location.hash='#lessons/${lesson.id + 1}'">
                        Next Lesson →
                    </button>
                ` : `
                    <button class="btn btn-green"
                        onclick="location.hash='#progress'">
                        View Progress →
                    </button>
                `}

            </div>

        </div>
    `;
}

// ==========================================
// QUIZ
// ==========================================

window.selectAnswer = function(questionIndex, optionIndex) {
    if (currentQuizSubmitted) return;

    quizAnswers[questionIndex] = optionIndex;
};

window.submitQuiz = function() {
    if (!currentLesson) return;

    const questions = currentLesson.quiz || [];

    if (Object.keys(quizAnswers).length !== questions.length) {
        showToast("Please answer every question.");
        return;
    }

    currentQuizSubmitted = true;

    let score = 0;

    questions.forEach((question, index) => {
        const selected = quizAnswers[index];
        const correct = selected === question.answer;

        if (correct) score++;

        const feedback = document.getElementById(
            `feedback${index}`
        );

        feedback.innerHTML = `
            <p class="${correct ? "correct" : "incorrect"}">

                ${correct ? "✓ Correct!" : "✗ Incorrect"}

            </p>

            <p>${question.explanation}</p>

            ${!correct
                ? `<p>Correct answer: ${question.options[question.answer]}</p>`
                : ""}
        `;
    });

    const percentage = Math.round(
        score / questions.length * 100
    );

    document.getElementById("quizResult").innerHTML = `
        <div class="grammar-item">

            <h2>Your Result</h2>

            <h1>${score}/${questions.length}</h1>

            <p>${percentage}% correct</p>

            <p>
                ${percentage >= 60
                    ? "Great work! You passed this practice quiz."
                    : "Keep practicing. You can try again after reviewing."}
            </p>

        </div>
    `;

    const previousScore =
        progress.quizScores[currentLesson.id] || 0;

    progress.quizScores[currentLesson.id] = Math.max(
        previousScore,
        percentage
    );

    if (percentage >= 60) {
        const button = document.getElementById("completeLesson");

        if (button && !isCompleted(currentLesson.id)) {
            button.disabled = false;
        }
    }

    recordActivity(
        `Completed Lesson ${currentLesson.id} quiz with ${percentage}%`
    );

    if (percentage >= 60 && previousScore < 60) {
        progress.xp += 10;
    }

    saveProgress();

    document.getElementById("submitQuiz").disabled = true;
};

// ==========================================
// LESSON COMPLETION
// ==========================================

window.completeLesson = function(id) {
    if (isCompleted(id)) {
        showToast("This lesson is already completed.");
        return;
    }

    const score = progress.quizScores[id] || 0;

    if (score < 60) {
        showToast("Score at least 60% to complete this lesson.");
        return;
    }

    progress.completedLessons.push(Number(id));

    progress.xp += 50;

    recordActivity(`Completed Lesson ${id}`);

    saveProgress();

    showToast("Lesson completed! +50 XP 🌟");

    renderLesson(id);
};

// ==========================================
// STUDY PLAN
// ==========================================

function renderStudyPlan() {
    main.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <h2>🗓️ Your 30-Day Japanese Learning Path</h2>

                <p>
                    A suggested schedule based on your original
                    25 textbook lessons.
                </p>
            </div>

            <div class="lesson-list">

                ${studyPlan.map(day => `
                    <div class="lesson-card">

                        <h3>Day ${day.day}</h3>

                        <p>${day.target}</p>

                        <br>

                        <p>${day.task}</p>

                        ${day.lessons.length
                            ? `
                            <button class="btn btn-green"
                                onclick="location.hash='#lessons/${day.lessons[0]}'">
                                Open Lesson →
                            </button>
                            `
                            : `
                            <span>Foundation / Revision</span>
                            `
                        }

                    </div>
                `).join("")}

            </div>

        </div>
    `;
}

// ==========================================
// GRAMMAR LIBRARY
// ==========================================

const grammarLibrary = [
    {
        category: "Particles",
        topics: ["は", "が", "を", "に", "で", "へ", "と", "も", "の", "か", "から", "まで", "より"],
        lessons: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12]
    },
    {
        category: "Basic Grammar",
        topics: ["です", "じゃありません", "でした", "あります", "います"],
        lessons: [1, 10, 12]
    },
    {
        category: "Demonstratives",
        topics: ["これ", "それ", "あれ", "この", "その", "あの", "ここ", "そこ", "あそこ", "どこ"],
        lessons: [2, 3]
    },
    {
        category: "Verbs",
        topics: ["ます", "ません", "ました", "ませんでした", "て-form", "ない-form", "Dictionary form", "Plain forms"],
        lessons: [4, 6, 7, 14, 17, 18, 20]
    },
    {
        category: "Requests and Permission",
        topics: ["てください", "てもいいです", "ないでください", "なければなりません", "なくてもいいです"],
        lessons: [14, 15, 17]
    },
    {
        category: "Adjectives",
        topics: ["い-adjectives", "な-adjectives", "Past adjective forms"],
        lessons: [8, 12, 16]
    },
    {
        category: "Additional Grammar",
        topics: ["たいです", "ませんか", "ましょう", "ています", "ことができます", "たことがあります", "たり", "と思います", "と言います", "Relative clauses", "とき", "と", "たら", "ても"],
        lessons: [6, 13, 14, 18, 19, 21, 22, 23, 25]
    }
];

function renderGrammar() {
    main.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <h2>📘 Core Grammar Library</h2>
                <p>Explore grammar from your textbook.</p>
            </div>

            <input id="grammarSearch"
                class="search-box"
                placeholder="Search Japanese grammar...">

            <div id="grammarResults"></div>

        </div>
    `;

    const search = document.getElementById("grammarSearch");

    function displayGrammar() {
        const query = search.value.toLowerCase();

        document.getElementById("grammarResults").innerHTML =
            grammarLibrary.map(group => {

                const topics = group.topics.filter(topic =>
                    topic.toLowerCase().includes(query)
                );

                if (!topics.length) return "";

                return `
                    <section class="lesson-section">

                        <h2>${group.category}</h2>

                        ${topics.map(topic => `
                            <div class="grammar-item">

                                <h3 class="japanese">${topic}</h3>

                                <p>
                                    Textbook lessons:
                                    ${group.lessons.join(", ")}
                                </p>

                                <button class="btn btn-green"
                                    onclick="openGrammarLesson(${group.lessons[0]})">
                                    Study related lesson →
                                </button>

                            </div>
                        `).join("")}

                    </section>
                `;
            }).join("");
    }

    search.addEventListener("input", displayGrammar);
    displayGrammar();
}

window.openGrammarLesson = function(id) {
    location.hash = `#lessons/${id}`;
};

// ==========================================
// KANA
// ==========================================

const hiragana = [
    ["あ","a"],["い","i"],["う","u"],["え","e"],["お","o"],
    ["か","ka"],["き","ki"],["く","ku"],["け","ke"],["こ","ko"],
    ["さ","sa"],["し","shi"],["す","su"],["せ","se"],["そ","so"],
    ["た","ta"],["ち","chi"],["つ","tsu"],["て","te"],["と","to"],
    ["な","na"],["に","ni"],["ぬ","nu"],["ね","ne"],["の","no"],
    ["は","ha"],["ひ","hi"],["ふ","fu"],["へ","he"],["ほ","ho"],
    ["ま","ma"],["み","mi"],["む","mu"],["め","me"],["も","mo"],
    ["や","ya"],["ゆ","yu"],["よ","yo"],
    ["ら","ra"],["り","ri"],["る","ru"],["れ","re"],["ろ","ro"],
    ["わ","wa"],["を","wo"],["ん","n"]
];

const katakana = [
    ["ア","a"],["イ","i"],["ウ","u"],["エ","e"],["オ","o"],
    ["カ","ka"],["キ","ki"],["ク","ku"],["ケ","ke"],["コ","ko"],
    ["サ","sa"],["シ","shi"],["ス","su"],["セ","se"],["ソ","so"],
    ["タ","ta"],["チ","chi"],["ツ","tsu"],["テ","te"],["ト","to"],
    ["ナ","na"],["ニ","ni"],["ヌ","nu"],["ネ","ne"],["ノ","no"],
    ["ハ","ha"],["ヒ","hi"],["フ","fu"],["ヘ","he"],["ホ","ho"],
    ["マ","ma"],["ミ","mi"],["ム","mu"],["メ","me"],["モ","mo"],
    ["ヤ","ya"],["ユ","yu"],["ヨ","yo"],
    ["ラ","ra"],["リ","ri"],["ル","ru"],["レ","re"],["ロ","ro"],
    ["ワ","wa"],["ヲ","wo"],["ン","n"]
];

function renderKana() {
    main.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <h2>あ Kana Learning</h2>
                <p>Learn the basic Japanese writing systems.</p>
            </div>

            <div style="display:flex;gap:12px;margin-bottom:25px;">

                <button class="btn btn-green"
                    onclick="showKana('hiragana')">
                    Hiragana
                </button>

                <button class="btn btn-green"
                    onclick="showKana('katakana')">
                    Katakana
                </button>

            </div>

            <div id="kanaContent"></div>

            <div class="lesson-section">

                <h2>Random Recognition Practice</h2>

                <div id="kanaQuestion"></div>

                <button class="btn btn-green"
                    onclick="randomKana()">
                    New Question
                </button>

            </div>

        </div>
    `;

    showKana("hiragana");
    randomKana();
}

window.showKana = function(type) {
    const characters = type === "hiragana" ? hiragana : katakana;

    document.getElementById("kanaContent").innerHTML = `
        <div class="section-heading">
            <h2>${type === "hiragana" ? "Hiragana" : "Katakana"}</h2>
            <p>46 basic characters.</p>
        </div>

        <div class="kana-grid">

            ${characters.map((item, index) => `
                <div class="kana-card"
                    onclick="revealKana(${index}, '${type}')">

                    <strong>${item[0]}</strong>
                    <span>${item[1]}</span>

                </div>
            `).join("")}

        </div>

        <br>

        <div id="kanaDetail"></div>
    `;
};

window.revealKana = function(index, type) {
    const characters = type === "hiragana" ? hiragana : katakana;
    const item = characters[index];

    document.getElementById("kanaDetail").innerHTML = `
        <div class="lesson-section">

            <h2 class="japanese example-japanese">${item[0]}</h2>

            <h3>${item[1]}</h3>

            <p>Romanized pronunciation: ${item[1]}</p>

            <button class="btn btn-green"
                onclick="speakJapanese('${item[0]}')">
                🔊 Listen
            </button>

            <button class="btn btn-green"
                onclick="markKanaMastered('${item[0]}')">
                ✓ Mark Mastered
            </button>

        </div>
    `;
};

window.markKanaMastered = function(character) {
    if (!progress.masteredKana.includes(character)) {
        progress.masteredKana.push(character);
        progress.xp += 2;
        saveProgress();
        showToast("Character mastered! +2 XP");
    } else {
        showToast("Already mastered!");
    }
};

window.randomKana = function() {
    const index = Math.floor(Math.random() * hiragana.length);
    const question = hiragana[index];

    document.getElementById("kanaQuestion").innerHTML = `
        <h1 class="japanese example-japanese">${question[0]}</h1>

        <p>What is the pronunciation?</p>

        <div class="hero-actions">

            ${shuffle(["a", "i", "u", "e", "o", "ka", "shi", "tsu"])
                .slice(0, 4)
                .map(option => `
                    <button class="btn btn-green"
                        onclick="checkKana('${option}', '${question[1]}')">
                        ${option}
                    </button>
                `).join("")}

        </div>

        <div id="kanaFeedback"></div>
    `;
};

window.checkKana = function(selected, answer) {
    document.getElementById("kanaFeedback").innerHTML =
        selected === answer
            ? `<p class="correct">✓ Correct!</p>`
            : `<p class="incorrect">Incorrect. Correct answer: ${answer}</p>`;
};

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// ==========================================
// KANJI
// ==========================================

const beginnerKanji = [
    ["一","One","いち","ひと","一つ","ひとつ"],
    ["二","Two","に","ふた","二つ","ふたつ"],
    ["三","Three","さん","みっ","三つ","みっつ"],
    ["四","Four","し","よん","四つ","よっつ"],
    ["五","Five","ご","いつ","五つ","いつつ"],
    ["六","Six","ろく","むっ","六つ","むっつ"],
    ["七","Seven","しち","なな","七つ","ななつ"],
    ["八","Eight","はち","やっ","八つ","やっつ"],
    ["九","Nine","きゅう","ここの","九つ","ここのつ"],
    ["十","Ten","じゅう","とお","十","とお"],
    ["日","Day / Sun","にち","ひ","日本","にほん"],
    ["月","Moon / Month","げつ","つき","月曜日","げつようび"],
    ["火","Fire","か","ひ","火曜日","かようび"],
    ["水","Water","すい","みず","水曜日","すいようび"],
    ["木","Tree","もく","き","木曜日","もくようび"],
    ["金","Gold / Money","きん","かね","金曜日","きんようび"],
    ["土","Earth / Soil","ど","つち","土曜日","どようび"],
    ["人","Person","じん","ひと","日本人","にほんじん"],
    ["大","Big","だい","おお","大学","だいがく"],
    ["小","Small","しょう","ちい","小さい","ちいさい"],
    ["山","Mountain","さん","やま","富士山","ふじさん"],
    ["川","River","せん","かわ","川","かわ"],
    ["田","Rice field","でん","た","田中","たなか"],
    ["口","Mouth","こう","くち","入口","いりぐち"],
    ["目","Eye","もく","め","目","め"],
    ["耳","Ear","じ","みみ","耳","みみ"],
    ["手","Hand","しゅ","て","手紙","てがみ"],
    ["足","Foot","そく","あし","足","あし"],
    ["上","Above","じょう","うえ","上","うえ"],
    ["下","Below","か","した","下","した"]
];

let currentKanjiIndex = 0;
let kanjiRevealed = false;

function renderKanji() {
    currentKanjiIndex = 0;
    kanjiRevealed = false;

    main.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <h2>漢字 Beginner Kanji Deck</h2>

                <p>
                    THALIR beginner Kanji curriculum.
                    This is a selected learning collection,
                    not an official exhaustive JLPT list.
                </p>
            </div>

            <div class="flashcard" id="kanjiCard"
                onclick="flipKanji()">

                <div id="kanjiFace"></div>

                <p>Click to reveal</p>

            </div>

            <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">

                <button class="btn btn-green"
                    onclick="previousKanji()">
                    ← Previous
                </button>

                <button class="btn btn-green"
                    onclick="nextKanji()">
                    Next →
                </button>

                <button class="btn btn-green"
                    onclick="markKanjiMastered()">
                    ✓ Mastered
                </button>

            </div>

            <p id="kanjiCounter"
                style="text-align:center;margin-top:20px;"></p>

        </div>
    `;

    displayKanji();
}

function displayKanji() {
    const kanji = beginnerKanji[currentKanjiIndex];

    document.getElementById("kanjiFace").innerHTML = `
        ${kanjiRevealed
            ? `
                <h1 class="japanese">${kanji[0]}</h1>

                <h3>${kanji[1]}</h3>

                <p>Onyomi: ${kanji[2]}</p>

                <p>Kunyomi: ${kanji[3]}</p>

                <br>

                <p>Example: ${kanji[4]}</p>

                <p>Reading: ${kanji[5]}</p>
            `
            : `
                <h1 class="japanese">${kanji[0]}</h1>
                <p>Think of its meaning.</p>
            `
        }
    `;

    document.getElementById("kanjiCounter").textContent =
        `${currentKanjiIndex + 1} / ${beginnerKanji.length}`;
}

window.flipKanji = function() {
    kanjiRevealed = !kanjiRevealed;
    displayKanji();
};

window.nextKanji = function() {
    currentKanjiIndex =
        (currentKanjiIndex + 1) % beginnerKanji.length;

    kanjiRevealed = false;
    displayKanji();
};

window.previousKanji = function() {
    currentKanjiIndex =
        (currentKanjiIndex - 1 + beginnerKanji.length)
        % beginnerKanji.length;

    kanjiRevealed = false;
    displayKanji();
};

window.markKanjiMastered = function() {
    const kanji = beginnerKanji[currentKanjiIndex][0];

    if (!progress.masteredKanji.includes(kanji)) {
        progress.masteredKanji.push(kanji);
        progress.xp += 5;
        saveProgress();
        showToast("Kanji mastered! +5 XP");
    } else {
        showToast("Already mastered!");
    }

    nextKanji();
};

// ==========================================
// VOCABULARY
// ==========================================

function renderVocabulary() {
    const vocabulary = allLessons.flatMap(lesson =>
        (lesson.vocabulary || []).map(word => ({
            japanese: word[0],
            romaji: word[1],
            meaning: word[2],
            lesson: lesson.id
        }))
    );

    main.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <h2>📚 Vocabulary Library</h2>

                <p>
                    Browse vocabulary currently implemented
                    from your textbook lessons.
                </p>

                <p>Total entries: ${vocabulary.length}</p>
            </div>

            <input id="vocabularySearch"
                class="search-box"
                placeholder="Search Japanese or English...">

            <div id="vocabularyResults"></div>

        </div>
    `;

    const search = document.getElementById("vocabularySearch");

    function displayVocabulary() {
        const query = search.value.toLowerCase();

        const filtered = vocabulary.filter(word =>
            word.japanese.includes(query) ||
            word.romaji.toLowerCase().includes(query) ||
            word.meaning.toLowerCase().includes(query)
        );

        document.getElementById("vocabularyResults").innerHTML =
            filtered.length
            ? `
                <table class="vocabulary-table">

                    <thead>
                        <tr>
                            <th>Japanese</th>
                            <th>Romaji</th>
                            <th>Meaning</th>
                            <th>Lesson</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${filtered.map(word => `
                            <tr>
                                <td class="japanese">${word.japanese}</td>
                                <td>${word.romaji}</td>
                                <td>${word.meaning}</td>
                                <td>
                                    <a href="#lessons/${word.lesson}">
                                        ${word.lesson}
                                    </a>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>

                </table>
            `
            : `<div class="empty-state">No matching vocabulary found.</div>`;
    }

    search.addEventListener("input", displayVocabulary);
    displayVocabulary();
}

// ==========================================
// PRACTICE
// ==========================================

function renderPractice() {
    const questions = [
        {
            q: "Choose the correct particle: わたし ___ 学生です。",
            options: ["を", "は", "で", "に"],
            answer: "は"
        },
        {
            q: "What does ねこ mean?",
            options: ["Dog", "Cat", "Bird", "Fish"],
            answer: "Cat"
        },
        {
            q: "What is the meaning of ありがとう?",
            options: ["Good morning", "Thank you", "Goodbye", "Sorry"],
            answer: "Thank you"
        },
        {
            q: "Which means 'book'?",
            options: ["本", "水", "学校", "人"],
            answer: "本"
        },
        {
            q: "Which is the polite negative form?",
            options: ["です", "でした", "じゃありません", "でしたか"],
            answer: "じゃありません"
        }
    ];

    let current = 0;
    let score = 0;
    let answered = false;

    main.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <h2>✍️ Practice Drills</h2>
                <p>Test your Japanese knowledge.</p>
            </div>

            <div class="lesson-section">

                <div id="practiceQuestion"></div>

                <div id="practiceOptions"></div>

                <div id="practiceFeedback"></div>

                <button id="practiceNext"
                    class="btn btn-green"
                    style="display:none">
                    Next Question →
                </button>

            </div>

        </div>
    `;

    function displayQuestion() {
        answered = false;

        const question = questions[current];

        document.getElementById("practiceQuestion").innerHTML = `
            <p>Question ${current + 1} of ${questions.length}</p>
            <h2>${question.q}</h2>
        `;

        document.getElementById("practiceOptions").innerHTML =
            shuffle(question.options).map(option => `
                <button class="btn btn-green"
                    style="margin:5px"
                    data-option="${escapeHTML(option)}">
                    ${option}
                </button>
            `).join("");

        document.getElementById("practiceFeedback").innerHTML = "";
        document.getElementById("practiceNext").style.display = "none";

        document.querySelectorAll("[data-option]").forEach(button => {
            button.addEventListener("click", () => {
                if (answered) return;

                answered = true;

                const selected = button.dataset.option;

                if (selected === question.answer) {
                    score++;

                    document.getElementById("practiceFeedback").innerHTML =
                        `<p class="correct">✓ Correct!</p>`;
                } else {
                    document.getElementById("practiceFeedback").innerHTML =
                        `<p class="incorrect">Incorrect. Answer: ${question.answer}</p>`;
                }

                document.getElementById("practiceNext").style.display = "block";
            });
        });
    }

    document.getElementById("practiceNext").addEventListener("click", () => {
        current++;

        if (current < questions.length) {
            displayQuestion();
        } else {
            progress.xp += score * 2;

            recordActivity(`Practice completed: ${score}/${questions.length}`);

            main.querySelector(".lesson-section").innerHTML = `
                <h2>Practice Complete!</h2>

                <h1>${score}/${questions.length}</h1>

                <p>Your score: ${Math.round(score / questions.length * 100)}%</p>

                <button class="btn btn-green"
                    onclick="location.hash='#practice'">
                    Try Again
                </button>
            `;
        }
    });

    displayQuestion();
}

// ==========================================
// CONVERSATIONS
// ==========================================

function renderConversations() {
    main.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <h2>💬 Japanese Conversations</h2>
                <p>Explore the original conversation titles from your textbook.</p>
            </div>

            <div class="lesson-list">

                ${allLessons.map(lesson => `
                    <div class="lesson-card">

                        <h3 class="japanese">
                            ${lesson.conversation || "Conversation"}
                        </h3>

                        <p>Lesson ${lesson.id}</p>

                        <p>${lesson.title}</p>

                        <button class="btn btn-green"
                            onclick="location.hash='#lessons/${lesson.id}'">
                            Explore Lesson →
                        </button>

                    </div>
                `).join("")}

            </div>

        </div>
    `;
}

// ==========================================
// INTRODUCTORY SECTIONS
// ==========================================

function renderIntroduction(id) {
    const section = introductorySections.find(item => item.id === id);

    if (!section) {
        main.innerHTML = `
            <div class="container">
                <div class="empty-state">Section not found.</div>
            </div>
        `;
        return;
    }

    const content = {
        pronunciation: [
            ["あ", "a", "Like the 'a' in father."],
            ["い", "i", "Like the 'ee' in see."],
            ["う", "u", "A short Japanese u sound."],
            ["え", "e", "Like the 'e' in bed."],
            ["お", "o", "Like the 'o' in go."]
        ],

        classroom: [
            ["聞いてください", "Kiite kudasai", "Please listen."],
            ["見てください", "Mite kudasai", "Please look."],
            ["読んでください", "Yonde kudasai", "Please read."],
            ["書いてください", "Kaite kudasai", "Please write."],
            ["分かりますか", "Wakarimasu ka", "Do you understand?"]
        ],

        greetings: [
            ["おはようございます", "Ohayou gozaimasu", "Good morning."],
            ["こんにちは", "Konnichiwa", "Hello."],
            ["こんばんは", "Konbanwa", "Good evening."],
            ["ありがとうございます", "Arigatou gozaimasu", "Thank you."],
            ["さようなら", "Sayounara", "Goodbye."]
        ],

        numbers: [
            ["一", "ichi", "One"],
            ["二", "ni", "Two"],
            ["三", "san", "Three"],
            ["四", "yon / shi", "Four"],
            ["五", "go", "Five"],
            ["六", "roku", "Six"],
            ["七", "nana / shichi", "Seven"],
            ["八", "hachi", "Eight"],
            ["九", "kyuu / ku", "Nine"],
            ["十", "juu", "Ten"]
        ]
    };

    const entries = content[id] || [];

    main.innerHTML = `
        <div class="container">

            <button class="btn btn-green"
                onclick="location.hash='#home'">
                ← Home
            </button>

            <br><br>

            <section class="lesson-header">

                <h1>${section.title}</h1>

                <h2 class="japanese">${section.japanese}</h2>

                <p>${section.description}</p>

            </section>

            <section class="lesson-section">

                ${entries.map(entry => `
                    <div class="grammar-item">

                        <h2 class="japanese">${entry[0]}</h2>

                        <p>${entry[1]}</p>

                        <p>${entry[2]}</p>

                        <button class="btn btn-green"
                            onclick="speakJapanese('${escapeHTML(entry[0])}')">
                            🔊 Listen
                        </button>

                    </div>
                `).join("")}

            </section>

        </div>
    `;
}

// ==========================================
// SPEECH SYNTHESIS
// ==========================================

window.speakJapanese = function(text) {
    if (!("speechSynthesis" in window)) {
        showToast("Speech synthesis is not supported by this browser.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "ja-JP";
    utterance.rate = 0.85;

    const voices = speechSynthesis.getVoices();

    const japaneseVoice = voices.find(voice =>
        voice.lang.toLowerCase().startsWith("ja")
    );

    if (japaneseVoice) {
        utterance.voice = japaneseVoice;
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
};

// ==========================================
// MOCK EXAMINATION
// ==========================================

function renderExam() {
    const questions = [
        {
            category: "Vocabulary",
            q: "What does 水 mean?",
            options: ["Fire", "Water", "Mountain", "Person"],
            answer: 1,
            explanation: "水 (mizu) means water."
        },
        {
            category: "Kanji",
            q: "What does 三 mean?",
            options: ["One", "Two", "Three", "Four"],
            answer: 2,
            explanation: "三 means three."
        },
        {
            category: "Grammar",
            q: "Which means 'I am a student'?",
            options: [
                "わたしは学生です。",
                "わたしを学生です。",
                "わたしに学生です。",
                "わたしで学生です。"
            ],
            answer: 0,
            explanation: "は marks the topic and です completes the polite sentence."
        },
        {
            category: "Particles",
            q: "わたし ___ 本を読みます。",
            options: ["は", "を", "に", "で"],
            answer: 0,
            explanation: "は marks the topic."
        },
        {
            category: "Sentence Structure",
            q: "Choose the correct Japanese word for 'book'.",
            options: ["本", "人", "水", "山"],
            answer: 0,
            explanation: "本 means book."
        },
        {
            category: "Reading",
            q: "わたしは学生です。What does this mean?",
            options: [
                "I am a teacher.",
                "I am a student.",
                "I am a doctor.",
                "I am a company employee."
            ],
            answer: 1,
            explanation: "学生 means student."
        }
    ];

    let answers = {};
    let submitted = false;
    let remainingSeconds = 20 * 60;
    let timerInterval = null;

    main.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <h2>📝 JLPT N5 Practice Examination</h2>

                <p>
                    Original THALIR practice questions.
                    Not an official JLPT examination.
                </p>
            </div>

            <div class="lesson-section">

                <p>THALIR practice settings: 20 minutes.</p>

                <h2 id="examTimer">20:00</h2>

                <div class="progress-track">
                    <div id="examProgress"
                        class="progress-fill"
                        style="width:0%">
                    </div>
                </div>

                <div id="examQuestions"></div>

                <button id="submitExam"
                    class="btn btn-green">
                    Submit Examination
                </button>

                <div id="examResult"></div>

            </div>

        </div>
    `;

    const questionContainer = document.getElementById("examQuestions");

    questionContainer.innerHTML = questions.map((question, index) => `
        <div class="grammar-item">

            <p>${question.category}</p>

            <h3>${index + 1}. ${question.q}</h3>

            ${question.options.map((option, optionIndex) => `
                <label class="quiz-option">

                    <input type="radio"
                        name="exam${index}"
                        value="${optionIndex}">

                    ${option}

                </label>
            `).join("")}

        </div>
    `).join("");

    questionContainer.querySelectorAll("input").forEach(input => {
        input.addEventListener("change", event => {
            if (submitted) return;

            const index = Number(event.target.name.replace("exam", ""));

            answers[index] = Number(event.target.value);

            document.getElementById("examProgress").style.width =
                `${Object.keys(answers).length / questions.length * 100}%`;
        });
    });

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function finishExam() {
        if (submitted) return;

        submitted = true;
        stopTimer();

        let score = 0;
        const categories = {};

        questions.forEach((question, index) => {
            const correct = answers[index] === question.answer;

            if (correct) score++;

            if (!categories[question.category]) {
                categories[question.category] = {
                    correct: 0,
                    total: 0
                };
            }

            categories[question.category].total++;

            if (correct) {
                categories[question.category].correct++;
            }
        });

        progress.xp += score * 3;

        recordActivity(`Mock exam completed: ${score}/${questions.length}`);

        document.getElementById("examResult").innerHTML = `
            <br>

            <h2>Examination Results</h2>

            <h1>${score}/${questions.length}</h1>

            <p>
                ${Math.round(score / questions.length * 100)}%
            </p>

            <h3>Category Performance</h3>

            ${Object.entries(categories).map(([name, result]) => `
                <div class="grammar-item">

                    <strong>${name}</strong>

                    <p>
                        ${result.correct}/${result.total}
                    </p>

                </div>
            `).join("")}

            <h3>Answer Review</h3>

            ${questions.map((question, index) => `
                <div class="grammar-item">

                    <p>${index + 1}. ${question.q}</p>

                    <p>
                        Your answer:
                        ${answers[index] !== undefined
                            ? question.options[answers[index]]
                            : "Not answered"}
                    </p>

                    <p>
                        Correct answer:
                        ${question.options[question.answer]}
                    </p>

                    <p>${question.explanation}</p>

                </div>
            `).join("")}

            <button class="btn btn-green"
                onclick="location.hash='#exam'">
                Try Another Exam
            </button>
        `;

        document.getElementById("submitExam").disabled = true;
        showToast("Examination submitted!");
    }

    document.getElementById("submitExam").addEventListener(
        "click",
        finishExam
    );

    timerInterval = setInterval(() => {
        remainingSeconds--;

        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        document.getElementById("examTimer").textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        if (remainingSeconds <= 0) {
            finishExam();
            showToast("Time is up!");
        }
    }, 1000);
}

// ==========================================
// PROGRESS DASHBOARD
// ==========================================

function renderProgress() {
    const percentage = getCompletionPercentage();

    const remaining = 25 - progress.completedLessons.length;

    main.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <h2>📊 My Learning Progress</h2>

                <p>See how far you have travelled.</p>
            </div>

            <div class="stats-grid">

                ${statCard("📚", progress.completedLessons.length, "Completed Lessons")}

                ${statCard("📖", remaining, "Remaining Lessons")}

                ${statCard("⭐", progress.xp, "Total XP")}

                ${statCard("🔥", progress.streak, "Daily Streak")}

                ${statCard("🈁", progress.masteredKana.length, "Mastered Kana")}

                ${statCard("漢", progress.masteredKanji.length, "Mastered Kanji")}

                ${statCard("📚", progress.masteredVocabulary.length, "Mastered Vocabulary")}

                ${statCard("📈", percentage + "%", "Overall Progress")}

            </div>

            <section class="lesson-section">

                <h2>Overall Course Completion</h2>

                <h1>${percentage}%</h1>

                <div class="progress-track">
                    <div class="progress-fill"
                        style="width:${percentage}%">
                    </div>
                </div>

            </section>

            <section class="lesson-section">

                <h2>Lesson Progress</h2>

                <div class="lesson-list">

                    ${allLessons.map(lesson => `
                        <div class="lesson-card"
                            onclick="location.hash='#lessons/${lesson.id}'">

                            <h3>${lesson.japanese}</h3>

                            <p>${lesson.title}</p>

                            <p>
                                ${isCompleted(lesson.id)
                                    ? "✓ Completed"
                                    : "Not completed"}
                            </p>

                        </div>
                    `).join("")}

                </div>

            </section>

            <section class="lesson-section">

                <h2>Recent Activity</h2>

                ${progress.activities.length
                    ? progress.activities.map(activity => `
                        <div class="grammar-item">

                            <p>${escapeHTML(activity.message)}</p>

                            <small>
                                ${new Date(activity.date).toLocaleString()}
                            </small>

                        </div>
                    `).join("")
                    : "<p>No learning activities yet.</p>"
                }

            </section>

            <section class="lesson-section">

                <h2>⚙️ Progress Settings</h2>

                <p>
                    Resetting will permanently clear this browser's
                    THALIR learning progress.
                </p>

                <br>

                <button class="btn btn-green"
                    onclick="resetProgress()">
                    Reset My Progress
                </button>

            </section>

        </div>
    `;
}

// ==========================================
// RESET
// ==========================================

window.resetProgress = function() {
    const confirmed = confirm(
        "Are you sure you want to reset your THALIR progress? This cannot be undone."
    );

    if (!confirmed) return;

    progress = structuredClone(defaultProgress);

    saveProgress();

    showToast("Progress reset successfully.");

    location.hash = "#home";
};

// ==========================================
// INITIALIZATION
// ==========================================

updateDailyStreak();
updateHeader();
renderPage();

console.log("🌱 THALIR initialized successfully.");
console.log("Total textbook lessons:", allLessons.length);
console.log("Firebase configured:", configured);
