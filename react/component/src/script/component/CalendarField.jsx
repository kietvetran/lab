var React = require('react');
var Addons = require('react-addons');

var CalendarField = React.createClass({
	/*************************************************************************
	=== Initialization ===
	*************************************************************************/
	opt : {
		'searchTimer':0, 'hideTimer':0, 'reg':null,		
		'aDay' : 24*60*60*1000,
		'pattern' : /^(0?[1-9]|[12][0-9]|3[01])([\/\-\.])(0?[1-9]|1[012])([\/\-\.])(\d{4})$/,
        'month' : ['Januar','Februar','Mars','April','Mai','Juni','Juli','August','September','Oktober','November','Desember'],
        'week'  : ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag']
	},

	initial : function() {
  		//console.log('init..');
	},

	getDefaultProps : function() {
		return {
			'id': 'cf-'+(new Date()).getTime()+'-'+Math.floor((Math.random()*10000)+1)
		};
	},

	getInitialState: function() {
		return { 
			'focus': false,
			'value': this.props.value,
			'interval': [],
			'mode': this.props.mode === 'multiple' ? 'multiple' : 'single',
			'error': ''
		};
	},

	componentWillMount  : function() {
		var self = this, storage = {}, i = 0;
		var value = (self.props.value || '').split(';'), length = value.length;

		/*
		document.body.addEventListener('mousedown', function(){
			if ( self.state.open ) self.hideList();
		});
		*/
	},

	render : function() {
    	var cx = Addons.classSet, classes = cx({
			'calendar-field': true,
			'-has-value' : this.state.value ? true : false,
			'-has-error' : this.state.error ? true : false,
			'-on-focus'  : this.state.focus
		});

		var id = this.props.id, idWrapper = id+'-cf-wrapper';
		var idA = id+'-inputA', idB = id+'-inputB', inputClass = [
			cx({
				'input-field -calendar': true,
				'-has-value' : this.state.value ? true : false,
				'-has-error' : this.state.error ? true : false,
				'-on-focus'  : this.state.focus
			}), cx({
				'input-field -calendar': true,
				'-has-value' : this.state.value ? true : false,
				'-has-error' : this.state.error ? true : false,
				'-on-focus'  : this.state.focus
			})
		];
		var table = this.getCalendar(), input = (
			<div id={idWrapper} className={classes}>
				<input name={this.props.name} type="text" defaultValue=""
					onBlur={this.onBlur} onKeyUp={this.onKeyup} onFocus={this.onFocus} maxlength="10"
					ref="inputA" id={idA} className={inputClass[0]} spellcheck="false" autocomplete="off"/>
				<input name={this.props.name} type="text" defaultValue=""
					onBlur={this.onBlur} onKeyUp={this.onKeyup} onFocus={this.onFocus} maxlength="10"
					ref="inputB" id={idB} className={inputClass[1]} spellcheck="false" autocomplete="off"/> 
				<div className="calendar-field-widget">{table}</div>
			</div> //
		);
		return input;
	},

  	componentDidMount : function() {
  		var self = this, target = self.refs.input;
  		if ( ! target ) return;

  		console.log( target );

  		/*
  		if ( this.props.required ) {
  			target.setAttribute('required','true');
  			target.setAttribute('aria-required','true');
  		}

  		if ( this.props.minlength ) 
  			target.setAttribute('minlength',this.props.minlength);

  		if ( this.props.disalbed ) 
  			target.setAttribute('disabled','true');

  		if ( this.state.error ) 
  			target.setAttribute('aria-invalid','true');

		target.addEventListener('change-state', function(e) {
  			if ( e.detail ) self.setState( e.detail );
		}, false );

		target.addEventListener('get-state', function(e) {
			if ( e.detail && typeof(e.detail.callback) == 'function' )
				e.detail.callback( self.state );
		}, false );
		*/
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
  		var target = this.refs.input;
  		if ( ! target ) return;

  		if ( target ) {
	  		this.state.error ? target.setAttribute('aria-invalid','true') :
	  			target.removeAttribute('aria-invalid');
	  	}

	  	if ( typeof((this.props.calling ||{}).changeState) === 'function' )
	  		this.props.calling.changeState( this.state );
	},

	/*************************************************************************
	=== Other functions ===
	*************************************************************************/

	onBlur: function( e ) {
    	this.setState({value: e.target.value, 'focus':false});
    	this._calling( e );
  	},

	onKeyup: function( e ) {
    	this.setState({value: e.target.value});
    	this._calling( e );
  	},

	onFocus: function( e ) {
    	this.setState({'focus':true});
    	this._calling( e );
  	},

  	getCalendar : function() {
  		var date = new Date(), data = this._getCalendarData( date );
  		return this._getCalendarTable( data );
  	},

    _getCalendarData : function( date ) {
        if ( ! date ) { return ''; }
        var d = this._getDateAsList( date ), c = null, f = new Date(d[0],d[1],1,0,0,0,0);
        var monthTimestamp = f.getTime(), row = [], count = 0, day = this.opt.aDay;
        var current = this.opt.nowTime || 0, i = 0, j = 0;
        var active = this.opt.active || {}, min = this.opt.minTime || -1, max = this.opt.maxTime || -1;
        var focus  = this.opt.focusItem || {};

        if ( f.getDay() ) {
            f.setDate( 1-(f.getDay()-1) );
        } else {
            f.setDate( 1-6 );
        }

        var minStamp = f.getTime()-day-1000;
        var minMode  = min > -1 ? (f.getTime() <= min ? 'disabled' : '') : '';

        for ( i=0; i<6; i++ ) {
            var column = [];
            for ( j=0; j<7; j++ ) {
                c = new Date( f.getTime() );
                c.setDate( c.getDate()+ (count++) );

                var t = c.getTime(), n = this._getDateAsList(c), mode = ''+
                    (max > -1 ? (max<t ? ' disabled': '') : '' ) +
                    (min > -1 ? (min>t ? ' disabled': '') : '' ) +
                    (n[1] === d[1] ? '' : ' out-of-month') +
                    (current>=t && current<(t+day) ? ' is-today' : '') +
                    (active && active[t] ? ' selected' : '')+
                    (focus && focus[t] ? ' focus' : '' ) +
                    ( j===0 || j===6 ? ' end-column' : '' );

                column.push({
                    'row'   : i+1,
                    'aria'  : this._getCalendarDateAriaText( c ),
                    'name'  : c.getDate(),
                    'mode'  : mode,
                    'off'   : mode.match( /out-of-month|disabled/) ? true: false,
                    'stamp' : t,
                    'date'  : this._convertDateToText(c,''),
                    'selected': active && active[t] ? true : false
                });
            }
            row.push({'column':column});
        }

        c.setDate(1);
        if ( c.getMonth() === d[1] ) { c.setMonth(d[1]+1); }

        var maxStamp = c.getTime()+day;
        var maxMode  = max > -1 ? (max<c.getTime() ? 'disabled' : '') : '';

        var loop = this.opt.week.length, week = [];
        for ( i=0; i<loop; i++ ) {
            j = i===0 ? (loop-1) : i-1;
            week[j] = {
                'aria':this.opt.week[i],
                'name':this.opt.week[i].substring(0,2)
            };
        }

        var name  = (this.opt.month[d[1]] + ' ' +d[0]);
        if ( f.getMonth() === d[1] ) { f.setMonth(d[1]-1); }

        var aPrevious = 'Vis '+this._getCalendarDateAriaText( f, true ).toLowerCase();
        var aNext     = 'Vis '+this._getCalendarDateAriaText( c, true ).toLowerCase();

        return {
            'name'      : name,
            'minMode'   : minMode,
            'minStamp'  : minStamp,
            'minAria'   : aPrevious,
            'maxMode'   : maxMode,
            'maxStamp'  : maxStamp,
            'maxAria'   : aNext,
            'week'      : week,
            'row'       : row,
            'monthStamp': monthTimestamp
        };
    },

  	_getCalendarTable : function( data ) {
  		if ( ! data ) return;
  		var week = data.week.map( function(item, i){
  			return (
  				<th role="presentation" key={i+'-h'}>
				    <span className="invisible">{item.aria}</span>
                    <span className="week-name" aria-hidden="true">{item.name}</span>  				
  				</th> //
  			);
		});

		var out = data.row.map( function(row, i){
			var column = row.column.map( function(item, j){
				var type = 'calendar-field-item at-row'+i+ 
					(item.mode ? ' '+item.mode : '') +
					(item.selected ? ' selected' : '');

				return (
					<td key={j+'-c'}>
						<a href="#" className={type} aria-selected={item.selected}>
                            <span className="invisible">{item.aria}</span>
                            <span aria-hidden="true">{item.name}</span>
                        </a>
					</td> //
				);
			});
			return (<tr role="presentation" key={i+'t'}>{column}</tr>);//
		});

		return (
		    <table className="calendar-table" aria-label="Kalender" role="application">
		        <thead><tr class="calendar-table-header calendar-weak" role="presentation">{week}</tr></thead>
		        <tbody>{out}</tbody>
		    </table>//
		);
  	},

    _getDateAsList : function( date ) {
        return [
            date.getFullYear(),date.getMonth(),date.getDate(),
            date.getHours(),date.getMinutes(),date.getSeconds()
        ];
    },

    _getCalendarDateAriaText: function ( date, onlyMonthAndYear ) {
        if ( ! date ) { return ''; }
        var day   = this.opt.week[ date.getDay() ];
        var month = this.opt.month[date.getMonth()];
        return onlyMonthAndYear ? month +' '+date.getFullYear() :
            day + ', '+date.getDate()+'. '+month +' '+date.getFullYear();
    },

    _convertDateToText : function ( date, separator ) {
        var l = [date.getDate(),date.getMonth()+1,date.getFullYear()];
        for ( var i=0; i<l.length; i++ ) {
            if ( l[i] < 10 ) { l[i] = '0'+l[i]; }
        }
        return l.join( typeof(separator)==='undefined' ? '.' : separator );
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

module.exports = CalendarField;