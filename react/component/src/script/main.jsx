var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var List = require('./component/List.jsx');
var FormValidation = require('./component/FormValidation.jsx');
var Slider = require('./component/Slider.jsx');
var Timeline = require('./component/Timeline.jsx');

var timedata = [ 
	{
		'date': '1.6.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	},
	{
		'date': '1.5.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	},
	{
		'date': '1.5.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	},
	{
		'date': '1.5.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	},
	{
		'date': '1.5.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	},
	{
		'date': '1.5.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	},
	{
		'date': '1.5.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	},
	{
		'date': '1.5.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	},
	{
		'date': '1.5.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	},
	{
		'date': '1.5.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	},
	{
		'date': '1.5.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	},
	{
		'date': '3.6.2016',
		'title': 'Lorem ipsum',
		'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum vulputate risus. Integer eget ipsum accumsan, venenatis enim in, interdum leo.' 
	}
];

/*
ReactDOM.render(<List />, document.getElementById('ingredients'));
ReactDOM.render(<FormValidation name="abc"/>, document.getElementById('form-test'));
ReactDOM.render(<Slider value="10"/>, document.getElementById('standard-slider'));
*/
ReactDOM.render(<Timeline list={timedata} />, document.getElementById('timeline-test')); //
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
