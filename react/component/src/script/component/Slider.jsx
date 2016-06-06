var React = require('react');
var Addons = require('react-addons');

var Slider = React.createClass({
	/*************************************************************************
	=== Initialization ===
	*************************************************************************/
	option : {
		'timer'      : 0,
		'slider'     : null,
		'touchRender': 0
	},

	initial : function() {
	},

	getDefaultProps : function() {
	},

	getInitialState: function() {
		return { 
			'focus': false,
			'value': this.props.value || 0,
			'max'  : this.props.max   || 100,
			'min'  : this.props.min   || 0,
			'error': ''
		};
	},

	componentWillMount  : function() {
	},

	render : function() {
    	var cx = Addons.classSet, classes = cx({
			'slider-wrapper': true,
			'-has-value'  : this.state.value ? true : false,
			'-has-error'  : this.state.error ? true : false,
			'-on-focus'   : this.state.focus
		});

		return (
			<div role="application" className={classes}>
			    <div class="slider-input-wrapper">
			    	<input type="tel" defaultValue={this.state.value} className="input-field first" ref="input" onKeyUp={this.onKeyup}/>
			    </div>
				<div id="sr1" className="slider-track">
					<a href="" role="slider" className="slider-btn" ref="btn"
						onMouseDown={this.onStart} onTouchStart={this.onStart} onClick={this.onClick}
						aria-valuenow={this.state.value} aria-valuemax={this.state.max} aria-valuemin={this.state.min}
						>
						{this.state.value}
					</a>
					<span className="slider-tail" ref="tail"></span>
				</div>
			</div> 
		); //
	},

  	componentDidMount : function() {
  		var self = this, verify = function( e ) {
  			if ( ! self.option.slider ) return;

			e.preventDefault();

	        if  ( e.type === 'mouseup'   || e.type === 'touchend'   ) {
				self.option.slider = null;
				if ( e.type === 'touchend' ) {
					self.option.touchRender = (opt.touchRender || 0)+1;
					setTimeout( function() { self.option.touchRender = 0; }, 50 );
				}
	        }
	        else if ( e.type === 'mousemove' || e.type === 'touchmove'  ) {
				self._render( e, self.option.slider );
				if ( e.type === 'touchmove' ) { self.option.touchRender = 1; }
	        }
  		};

		document.addEventListener('mouseup',   verify, false );
		document.addEventListener('mousemove', verify, false );
		document.addEventListener('touchend',  verify, false );
		document.addEventListener('touchmove', verify, false );

		self._render( null, self.refs.btn, parseFloat(this.state.value) );
  	},

	/*************************************************************************
	=== State Changes ===
	*************************************************************************/
	shouldComponentUpdate: function(nextProps, nextState){
    	return true; // return a boolean value
    	//console.log('');
	},

	componentWillUpdate: function(nextProps, nextState){
	    // perform any preparations for an upcoming update
    	//console.log('');
	},

	componentDidUpdate: function(prevProps, prevState){
	},

	/*************************************************************************
	=== Other functions ===
	*************************************************************************/
	onStart : function( e ) {
		if ( e ) e.preventDefault();
		this.option.slider = e.currenTarget || e.target;
	},

	onClick : function( e ) {
		if ( e ) e.preventDefault();
		return false;
	},

	onKeyup : function( e ) {
		var self = this, input = e.currenTarget || e.target;
		var text  = (input.value || '0').replace(/\,/g,'.').replace(/\s+/g,'');
		if ( ! text.match( /[0-9\.]/) ) return;

		var value = parseFloat( text );
		if ( isNaN(value) ) return;

		if ( value < self.state.min || value > self.state.max ) return;

		clearTimeout( self.option.timer || 0 );
		self.option.timer = setTimeout( function() {
			self._render( null, self.refs.btn, value, true );
		}, 200 );
	},

	getOffset : function( dom ) {
		var size = [0,0];
		do {
			size[0] += dom.offsetLeft || 0;
			size[1] += dom.offsetTop  || 0;
			dom = dom.offsetParent;
		} while( dom );
		return size;
	},

	/*************************************************************************
	=== Other functions ===
	*************************************************************************/
    _getEventPosition : function( e, touch ) {
		if ( ! e ) { e = window.event; }
		var target = (e.targetTouches || e.changedTouches || [])[0], pos = [
			e.clientX || e.pageX || (touch && target ? target.pageX : 0),  
			e.clientY || e.pageY || (touch && target ? target.pageY : 0)
		];

		if ( pos[0]===0 && pos[1]===0 ) {
			try {
				pos =[e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY];
			} catch(error) { pos = [0,0]; } 
		}
		return pos;
    },

    _getTrackPercent : function( e ) {
		if ( ! e ) return 0;	
		var track  = this.refs.btn.parentNode; 
		var offset = this.getOffset( track ), left = offset[0];
		var where = [left, left+track.clientWidth]; 
		var x     = this._getEventPosition(e, e.type.match(/touch/i) )[0];

		if ( x < where[0] || x > where[1] ) return x < where[0] ? 0 : 100; 
		return parseFloat( (x-where[0])/(where[1]-where[0]) )*100;
    },

    _render : function( e, btn, force, changeFromInput ) {
		if ( ! btn ) return;

		var self = this, percent = 0, size = [self.state.min, self.state.max];
		if ( typeof(force)==='number' ) {
			if ( ! size ) return; 			
			percent = parseFloat((force-size[0]) / (size[1]-size[0]))*100;
		} else if ( e ) {
			percent = self._getTrackPercent( e );
		}

		if ( isNaN(percent) ) { return; }


		var value = ! size ? Math.round(percent) :
			(size[0]+Math.round(parseFloat(percent/100)*size[1]));

		btn.innerHTML  = value;
		btn.style.left = percent+'%';
		btn.setAttribute('aria-valuenow', value);
		btn.setAttribute('data-value', percent);

		if ( self.refs.tail ){
			//if ( opt.btn.size() < 2 )
				self.refs.tail.style.width = percent+'%';
			//else {
				//var a = parseFloat(opt.btn.eq(0).attr('data-value'));
				//var b = parseFloat(opt.btn.eq(1).attr('data-value'));
				//var d = a<b ? [a,b] : [b,a];
				//opt.tail.css({'left':d[0]+'%', 'right':(100-d[1])+'%'});
			//}
		}

		if ( window.getSelection ) { 
			//window.getSelection().removeAllRanges(); 
		} else if ( document.selection ) { 
			document.selection.empty(); 
		}

		if ( changeFromInput || ! self.refs.input ) { return; }

		/*
		if ( opt.input.size() > 1 ) {
			var temp = 0, data = [
				parseInt(opt.btn.eq(0).attr('data-value')),
				parseInt(opt.btn.eq(1).attr('data-value'))
			];

			if ( isNaN(data[0]) || isNaN(data[1]) ) { return; }

			if ( data[0]>data[1] ) {
				temp = data[0];
				data[0] = data[1];
				data[1] = temp;
			}

			setTimeout( function() {       
				opt.input.eq(0).prop('value', data[0] ).trigger('validate');
				opt.input.eq(1).prop('value', data[1] ).trigger('validate');
			}, 20 );
		}
		else {
		*/
			setTimeout( function() {       
				self.refs.input.value = value + '';
			}, 20 );
		//}
    },

	_calling : function( e, callback ) {
		var calling = (this.props.calling || {})[e.type];
		if ( typeof(calling) === 'function' ) {
			calling({
				'event':e, 'component': this, 'callback':callback, 
				'validation': this.props.validation
			});
		}
	}
});

module.exports = Slider;