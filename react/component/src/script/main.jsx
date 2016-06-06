var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var List = require('./component/List.jsx');
var FormValidation = require('./component/FormValidation.jsx');
var Slider = require('./component/Slider.jsx');

//ReactDOM.render(<List />, document.getElementById('ingredients'));
ReactDOM.render(<FormValidation name="abc"/>, document.getElementById('form-test'));
//ReactDOM.render(<Slider value="10"/>, document.getElementById('standard-slider'));

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
