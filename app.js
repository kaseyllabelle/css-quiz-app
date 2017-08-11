var state = {
	quizItems: [
		{
			question: 'Which value of the text-decoration property is used to cross out text?',
			answer: ['text-decoration', 'text-style', 'line-through', 'strike-through'],
			correctAnswer: 2
		},
		{
			question: 'Which property is used to set the boldness of text?',
			answer: ['text-weight', 'font-weight', 'text-style', 'font-style'],
			correctAnswer: 1
		},
		{
			question: 'Which property is used to set the width of a block-level element?',
			answer: ['column-width', 'content-width', 'element-width', 'width'],
			correctAnswer: 3
		},
		{
			question: 'Which property is used to align inline content, like text, in its parent block-level element?',
			answer: ['text-align', 'align-self', 'horizontal-align', 'vertical-align'],
			correctAnswer: 0
		},
		{
			question: 'Which property is used to set the maximum width of an element?',
			answer: ['width', 'maximum-width', 'max-width', 'element-width'],
			correctAnswer: 2
		},
		{
			question: 'Which property is used to specify the type of rendering box to use for an element?',
			answer: ['visibility', 'display', 'position', 'box-sizing'],
			correctAnswer: 1
		},
		{
			question: 'Which property is used to define how the browser distributes space between and around content items along the main horizontal axis of their container?',
			answer: ['justify-content', 'float', 'position', 'shift'],
			correctAnswer: 0
		},
		{
			question: 'How would you horizontally center an element within its container?',
			answer: ['margin: auto;', 'horizontal-align: center;', 'align: middle;', 'float: middle;'],
			correctAnswer: 0
		},
		{
			question: 'Which shorthand property is used to generate space around the content inside of an element?',
			answer: ['margin', 'gutter', 'space', 'padding'],
			correctAnswer: 3
		},
		{
			question: 'Which property is used to set the background color of an element?',
			answer: ['element-color', 'background-color', 'bg-color', 'color'],
			correctAnswer: 1
		},
		{
			question: 'What is the proper way to use shorthand in order to specify all the individual border properties at once?',
		 	answer: [
		 		'border: 1px, solid, white;', 
		 		'border: 1px solid white;', 
		 		'border-style: 1px, solid, white;', 
		 		'border-style: 1px solid white;'
	 		],
			correctAnswer: 1
		},
		{
			question: 'Which shorthand property is used to specify the width, style, and color of a line that is drawn around elements?',
			answer: ['border-style', 'border', 'outline-style', 'outline'],
			correctAnswer: 3
		},
		{
			question: `Which property is used to set the foreground color value of an element's text content and text decorations?`,
			answer: ['color', 'text-color', 'font-color', 'element-color'],
			correctAnswer: 0
		},
		{
			question: 'Which property is used to set the size of the font?',
			answer: ['size', 'text-size', 'font-size', 'type-size'],
			correctAnswer: 2
		},
		{
			question: 'Which property is used to set the font?',
			answer: ['web-font', 'text-font', 'font-style', 'font-family'],
			correctAnswer: 3
		},
		{
			question: 'Which property is used to add rounded corners to an element?',
			answer: ['box-sizing', 'transform-box', 'border-radius', 'border-style'],
			correctAnswer: 2
		}
	],
	currentQuestion: 0,
	progress: 0,
	score: 0,
	appliedStyles: []
};

// State modification functions
var checkAnswer = function(state, selectedAnswer){
	let current = state.quizItems[state.currentQuestion].answer;
	let correct = state.quizItems[state.currentQuestion].correctAnswer;
	if(selectedAnswer === current[correct].replace(/\s/g,'')){
		state.appliedStyles.push('q'+(state.currentQuestion+1));
	}
	renderResult(state);
}

var updateCurrentQuestion = function(state){
	state.currentQuestion++
	console.log(state.currentQuestion);
	renderQuestion(state);
}

var restartQuiz = function(state){
	state.currentQuestion = 0;
	state.progress = 0;
	state.score = 0;
	state.appliedStyles = [];
	renderStartQuestion(state);
}

// Render functions
var renderStartQuestion = function(state){
	for(i=0; i<state.quizItems.length+1; i++){
		$('body').removeClass('q'+i);
	}
	$('section.heading-container img').remove();
	$('body').removeClass('results').addClass('q0');
	$('.main').addClass('quiz').removeClass('main');
	$('.primary, .restart')
		.text('next')
		.addClass('next')
		.removeClass('primary')
		.removeClass('restart')
		.removeAttr('show-results');
	$('.score').text('0% out of 100%');
	$('button.next').off();
	$('button.next').click(function(){
		if($(this).attr('show-results')){
			renderFinalResults(state);
		}
		else if($(this).hasClass('next')){
			updateCurrentQuestion(state);
		}
	});
	renderQuestion(state);
}

var renderQuestion = function(state){
	$('p.heading').text(state.quizItems[state.currentQuestion].question);
	$('section.body-container').html('');
	for(i=0; i<state.quizItems[state.currentQuestion].answer.length; i++){
		$('section.body-container').append(`
			<button class="answer">
				${state.quizItems[state.currentQuestion].answer[i]}
			</button>
		`);
	}
	for(i=0; i<state.appliedStyles.length; i++){
		$('body').addClass(state.appliedStyles[i]);
	}
	$('button.answer').css('pointer-events', 'auto');
	$('button.next').attr('disabled', 'true');
	if(state.currentQuestion+1 === state.quizItems.length){
		$('button.next').text('results').attr('show-results', 'true');
	}
	$('.progress').text(`Question ${state.currentQuestion+1} of ${state.quizItems.length}`);
}

var renderResult = function(state){
	for(i=0; i<state.appliedStyles.length; i++){
		$('body').addClass(state.appliedStyles[i]);
	}
	$('section.body-container button:nth-child('+ 
		(state.quizItems[state.currentQuestion].correctAnswer+1) +')')
		.addClass('correct')
		.append(`
			<span class="correct">&#x2713;</span>
		`)
	;
	if(!$('button[data-guessed]').hasClass('correct')){
		$('button[data-guessed]')
		.addClass('incorrect')
		.append(`
			<span class="incorrect">x</span>
		`)
	};
	$('button.next').removeAttr('disabled');
	let score = Math.round((state.appliedStyles.length/state.quizItems.length)*100);
	$('.score').text(score+'% out of 100%');
}

var renderFinalResults = function(state){
	let score = Math.round((state.appliedStyles.length/state.quizItems.length)*100);
	let resultsText = '';
	if(score > 90){
		resultsText += `<img src="https://media.giphy.com/media/4Apza48qsiljy/giphy.gif" class="gif">
			<p class="heading">You got ${score}% correct. Yaaas, queen.</p>`
	}
	else if(score > 80 && score < 90){
		resultsText += `<img src="https://media.giphy.com/media/3o7TKs5fz3Sw4MQLuw/giphy.gif" class="gif">
			<p class="heading">You got ${score}% correct. You're alright.</p>`
	}
	else if(score > 70 && score < 80){
		resultsText += `<img src="https://media.giphy.com/media/10pR6dUXHBpZSg/giphy.gif" class="gif">
			<p class="heading">You got ${score}% correct. Not terrible.</p>`
	}
	else if(score > 60 && score < 70){
		resultsText += `<img src="https://media.giphy.com/media/26gJy2PnOKrgVfOus/giphy.gif" class="gif">
			<p class="heading">You got ${score}% correct. Could be better.</p>`
	}
	else if(score > 49 && score < 60){
		resultsText += `<img src="https://media.giphy.com/media/xT77XM7ww5KWqVKpdm/giphy.gif" class="gif">
			<p class="heading">You got ${score}% correct. Ehhh. Not great.</p>`
	}
	else{
		resultsText += `<img src="https://media.giphy.com/media/13XW2MJE0XCoM0/giphy.gif" class="gif">
			<p class="heading">You got ${score}% correct. Ouch. This would probably look better in Internet Explorer.</p>`
	}
	$('body').addClass('results');
	$('.heading-container').html(resultsText);
	$('button.next').removeAttr('disabled')
		.text('restart')
		.addClass('restart')
	;
	$('button.restart').off();
	$('button.restart').click(function(){
		restartQuiz(state);
	});
}

// Event listeners
$('section.body-container').on('click', 'button.answer', function(){
	let selectedAnswer = $(this).html().replace(/\s/g,'');
	$(this).attr('data-guessed', 'true');
	$('button.answer').css('pointer-events', 'none');
	checkAnswer(state, selectedAnswer);
});

$('button.primary, button.restart').click(function(){
	restartQuiz(state);
});