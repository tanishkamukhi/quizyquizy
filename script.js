// Registration -> Quiz
document.getElementById("registration-form").addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;

  // Google Apps Script Web App URL (replace with your deployed URL)
  let scriptURL = "YOUR_DEPLOYED_WEBAPP_URL";

  fetch(scriptURL, {
    method: "POST",
    body: new URLSearchParams({ "name": name, "email": email })
  })
  .then(res => res.text())
  .then(data => {
    console.log("Success:", data);

    // Hide registration
    document.getElementById("registration-container").style.display = "none";
    // Show quiz
    document.getElementById("quiz-container").style.display = "block";

    startQuiz();
  })
  .catch(error => console.error("Error!", error));
});

// ====================== QUIZ LOGIC ======================

const questions = [
    {
        question: "Which programming language is most popular for AI/ML development?",
        answers: [
            { text: "Java", correct: false },
            { text: "Python", correct: true },
            { text: "C", correct: false },
            { text: "PHP", correct: false }
        ]
    },
    {
        question: "What does NLP stand for in AI?",
        answers: [
            { text: "Neural Learning Process", correct: false },
            { text: "Non-linear Programming", correct: false },
            { text: "Natural Language Processing", correct: true },
            { text: "Neural Logic Processing", correct: false }
        ]
    },
    {
        question: "Which of the following is an example of supervised learning?",
        answers: [
            { text: "K-Means Clustering", correct: false },
            { text: "Apriori Algorithm", correct: false },
            { text: "Linear Regression", correct: true },
            { text: "DBSCAN", correct: false }
        ]
    },
    {
        question: "In Machine Learning, overfitting means:",
        answers: [
            { text: "The model works well on training data but poorly on new data", correct: true },
            { text: "The model works well on both training and new data", correct: false },
            { text: "The model doesn’t work on training data", correct: false },
            { text: "The model ignores features", correct: false }
        ]
    },
    {
        question: "Which of these is an example of a dimensionality reduction technique?",
        answers: [
            { text: "Decision Tree", correct: false },
            { text: "Principal Component Analysis (PCA)", correct: true },
            { text: "Random Forest", correct: false },
            { text: "K-Means", correct: false }
        ]
    },
    {
        question: "Which of these is a loss function commonly used for classification tasks?",
        answers: [
            { text: "Cross-Entropy Loss", correct: true },
            { text: "Hinge Loss", correct: false },
            { text: "L1 Loss", correct: false },
            { text: "Mean Squared Error (MSE)", correct: false }
        ]
    },
    {
        question: "Which algorithm is commonly used for recommendation systems?",
        answers: [
            { text: "Decision Trees", correct: false },
            { text: "Naive Bayes", correct: false },
            { text: "K-Nearest Neighbors (KNN)", correct: true },
            { text: "Apriori", correct: false }
        ]
    },
    {
        question: "In a dataset, removing highly correlated features helps reduce:",
        answers: [
            { text: "Underfitting", correct: false },
            { text: "Overfitting", correct: true },
            { text: "Learning rate", correct: false },
            { text: "Convergence speed", correct: false }
        ]
    },
    {
        question: "In machine learning, regularization helps to:",
        answers: [
            { text: "Increase model complexity", correct: false },
            { text: "Reduce training speed", correct: false },
            { text: "Add more layers to a network", correct: false },
            { text: "Prevent overfitting", correct: true }
        ]
    },
    {
        question: "Which type of learning uses labeled data?",
        answers: [
            { text: "Unsupervised Learning", correct: false },
            { text: "Reinforcement Learning", correct: false },
            { text: "Supervised Learning", correct: true },
            { text: "Semi-supervised Learning", correct: false }
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    userName = document.getElementById("name").value;
    userEmail = document.getElementById("email").value;

    if(userName === "" || userEmail === ""){
        alert("Please enter all details!");
        return;
    }

    document.getElementById("registration-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    
    currentQuestionIndex = 0;
    score = 0;
    shuffleQuestions();
    showQuestion();
}

// Shuffle Questions
function shuffleQuestions() {
    questions.sort(() => Math.random() - 0.5);
}

// Show Question
function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button);
    });
}

// Reset state before new question
function resetState() {
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// Handle answer selection
function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
}

// Show result
function showResult() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";

    document.getElementById("user-info").innerText = 
      `Name: ${userName}, Email: ${userEmail}`;
    document.getElementById("score").innerText = 
      `Your Score: ${score} out of ${questions.length}`;
}

// Next button click
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    } else {
        showResult();
    }
});



// Play again button
function playAgain() {
    document.getElementById("result-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    shuffleQuestions();
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}
function saveToGoogleSheets(formData) {
  fetch("https://script.google.com/macros/s/AKfycbz2SHiFA2MQB_mI7kl_3lYNXU9ygKNfR70UsxNz-PVuL_QsNgGhlgr_c9fWWvJDnSG68Q/exec", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.text())
  .then(data => console.log("Saved:", data))
  .catch(err => console.error("Error:", err));
}
document.getElementById("register-btn").addEventListener("click", () => {
  let formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    age: document.getElementById("age").value
  };
  saveToGoogleSheets(formData);   // Save to Google Sheets
});
// Show result
function showResult() {
  document.getElementById("quiz-container").style.display = "none"; 
  document.getElementById("result-container").style.display = "block"; 

  document.getElementById("user-info").innerText = 
      `Name: ${userName}, Email: ${userEmail}`;
  document.getElementById("score").innerText = 
      `Your Score: ${score} / ${questions.length}`;
}
function playAgain() {

    document.getElementById("result-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("user-name").innerText = "Name: " + userName;
    document.getElementById("user-email").innerText = "Email: " + userEmail;
    document.getElementById("score").innerText = "Your Score: " + score + " / " + questions.length;


  shuffleQuestions();
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}
