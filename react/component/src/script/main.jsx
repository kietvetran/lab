var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var List = require('./component/List.jsx');
var ListArticle = require('./component/ListArticle.jsx');
var FormValidation = require('./component/FormValidation.jsx');
var Slider = require('./component/Slider.jsx');
var Timeline = require('./component/Timeline.jsx');

var holder = document.getElementById('ingredients');
if ( holder ) ReactDOM.render(<List />, holder );

holder = document.getElementById('article-list-holder');
if ( holder ) ReactDOM.render(<ListArticle />, holder);

holder = document.getElementById('form-test');
if ( holder ) ReactDOM.render(<FormValidation name="abc"/>, holder);

holder = document.getElementById('standard-slider');
if ( holder ) ReactDOM.render(<Slider value="10"/>, holder);


//ReactDOM.render(<Timeline/>, holder); //
	
/*
var callback = {
	'blur': function() {
		console.log('blur...');
	},
	'keyup': function() {
		console.log('keyup....');
	}
};

ReactDOM.render(<InputField name="personnummer" type="tel" value="" calling={callback}/>, document.getElementById('form-test'));

$( document ).ready(function() {
});
*/
