/**
 * Example store structure
 */
const store = {
  // 5 or more questions are required
  questions: [
    {
      question: 'Looking at current allocations, what worries you the most:',
      answers: [
        'Stocks',
        'Liquid Alts',
        'Bonds',
      ],
      correctAnswer: 2
    },
    {
      question: 'What best describes your portfolio construction philosophy:',
      answers: [
        'Low Cost',
        'Cheap Beta',
        'Blend',
      ],
      correctAnswer: 2
    },
    {
      question: 'When it comes to portfolios, my clients worry most about:',
      answers: [
        'Outperformance',
        'Losing Money',
        'Market volatility impacting their lifestyle',
      ],
      correctAnswer: 2
    },
    {
      question: 'Describe your clients understanding of their portfolios:',
      answers: [
        'They know the ins and outs of our portfolio construction process',
        'They know the basics',
        'There is room for improvement here',
      ],
      correctAnswer: 2
    },
    {
      question: 'What is your primary value add',
      answers: [
        'Portfolio Management',
        'Manager Selection',
        'Planning',
      ],
      correctAnswer: 2
    }
  ],
  quizStarted: false,
  questionNumber: 0,
  score: 0
};

/********** TEMPLATE GENERATION FUNCTIONS **********/

// These functions return HTML templates
function generateStartScreen() {
  // this function will generate the start screen
  console.log('Generate Start Screen Ran');
  return `
    <div class="start-screen">
      <p>This quiz will help us put the most relevant information in front of you.</p>
      <button type="button" class="js-start-button" id="start">Let's Begin</button>
    </div>
  `;
}

function generateBottomStr () {
  return `
          </div>
        <button type="submit" class="js-submit-answer-btn" id="submit-answer-btn">Submit</button>
        <button type="button" class="js-next-question-btn js-hide" id="next-question-btn">Next</button>
      </fieldset>
    </form>
    <div class="tracking-progress">
    <p>Question ${store.questionNumber + 1} of ${store.questions.length}</P>
    <p>Number Correct: ${store.score}</P>
    </div>
  `
}

function generateAnswerStr(question) { // store.questions[questionNumber] this is being passed in
  let answersStr = '';
  question.answers.forEach(function (answer, i) {
    
    answersStr += `
      <div id="option-containter-${i}">
      <input type="radio" name="options" id="option${i + 1}" value=${i} required></input>
      <label for="option${i + 1}">${answer}</label>
      </div>
    `
  }); 
  return answersStr;
}

function generateTopStr(question){
  return `
  <form class="js-form">
  <fieldset>
    <div class="question">
      <legend>${question.question}</legend>
    </div>
    <div class="alert js-hide">This says if you were right or not</div>
    <div class="answers">
  `
}

    
function generateQuestion (question){
  const topStr = generateTopStr(question);
  const answersStr = generateAnswerStr(question);
  const bottomStr = generateBottomStr(question);

  const questionArray = [topStr, answersStr, bottomStr];

  return questionArray.join("");
  
}

function generateEndScreen() {
  // this function will generate the ending screen that gives the user
  // the opportunity to restart the quiz
  console.log('`generateEndScreen` ran');
  return `
    <div class="results">
      <form class="js-restart-quiz">
        <fieldset>
          <div class="row">
            <div class="col-12">
              <legend>You got ${store.score} out of ${store.questions.length} right.</legend>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <button type="button" id="restart">Restart</button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  `
}

/********** RENDER FUNCTION(S) **********/

function renderQuiz() {
  
  //this function will be responsible for rendering the start page or the question
  // it should be dependent on the state of quiz started
  // This function conditionally replaces the contents of the <main> tag based on the state of the store
  if (store.quizStarted === false) {
    const testRender = generateStartScreen();
    $('.js-renderMain').html(testRender);
    store.quizStarted = true;
    console.log(store.questionNumber);
  } else {
    // calling generateQuestion with our data 'store'.questions array  as the parameter
    $('.js-renderMain').html(generateQuestion(store.questions[store.questionNumber]));
  }
}
/********** EVENT HANDLER FUNCTIONS **********/

// These functions handle events (submit, click, etc)
function handleStart() {
  // this function will listen for a click on the start button and begin the quiz
  $('.js-renderMain').on('click', '.js-start-button', event => {
    console.log(`'handleStart' Ran`);
    renderQuiz();
  });
}

function handleEndRestartSubmit() {
  $('.js-renderMain').on('click', '#restart', event => {
    store.quizStarted = false;
    store.score = 0;
    store.questionNumber = 0;
    renderQuiz();
  });
}

function checkAnswer(event) {

  const selectedInput = event.target.querySelector('input[type=radio]:checked');
  const correctAnswer = store.questions[store.questionNumber].correctAnswer;
  if (parseInt(selectedInput.value) === correctAnswer) {
    $('.alert').text('You got it right!');
    store.score += 1;
    console.log(store.score);
  } else {
    $('.alert').text(`Wrong Answer! The right answer was 
    ${store.questions[store.questionNumber].answers[correctAnswer]}.`)
  }
}

function handleSubmit() {
  // this function represents when user clicks submit
  $('.js-renderMain').submit(event => {
    event.preventDefault();
    
    $('.js-submit-answer-btn').toggleClass("js-hide");
    $('.js-next-question-btn').toggleClass("js-hide");

    checkAnswer(event);
    $('.alert').toggleClass('js-hide');   
  });
  // it will check answer and display feedback
  // on the final submit, be sure to reset all variables
  console.log('`handleSubmit` ran')
}

function handleNext() {
  // this function will listen for clicks on next button and 
  // move the user to the next question or the ending page
  console.log('`handleNext` ran')
  $('.js-renderMain').on('click', '.js-next-question-btn', event => {
    store.questionNumber++;
    console.log(store.questionNumber);
    if (store.questionNumber < store.questions.length){
      renderQuiz();
    } else {
      $('.js-renderMain').html(generateEndScreen());
    }
  });
  
}

/***** THIS IS THE FINAL FUNCTION, CALLING ALL OTHER FUNCTIONS.  THE CALLBACK FUNCTION OF OUR APP'S DOCUMENT READY*/
function handleQuizApp () {
  renderQuiz();
  handleStart();
  handleSubmit();
  handleNext();
  handleEndRestartSubmit();
}

// When the page loads, call handleQuizApp
$(handleQuizApp);