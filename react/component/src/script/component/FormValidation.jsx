var React = require('react');
var Addons = require('react-addons');
var FormRow = require('./FormRow.jsx');

var json = [
    /*
	{
		'name' : 'personnumber',
		'label': 'Personnummer',
		'info' : 'personnummer',
		'text' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at efficitur odio',
		'type' : 'tel',
		'required': true,
        'maxlength': 11,
		'validation': {'personnumber':true,'required':true}
	},
    {
        'name' : 'number',
        'label': 'Nummer',
        'info' : 'nummer',
        'text' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at efficitur odio',
        'type' : 'tel',
        'required': true,
        'validation': {'number':true,'required':true}
    },
    {
        'label': 'Kriterie',
        'info' : 'dyr',
        'text' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at efficitur odio',
        'type' : 'checkbox',
        'input': [
            {'name':'accept','value':'accept','label':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at efficitur odio'}
        ],
        'validation': {'required':true}
    },
    {
        'label': 'Velg et dyr',
        'info' : 'dyr',
        'text' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at efficitur odio',
        'type' : 'radio',
        'input': [
            {'name':'dyr','value':'Hund','label':'Hund'},
            {'name':'dyr','value':'Katt','label':'Katt'}
        ],
        'validation': {'required':true}
    },
    {
        'label': 'Velg språk',
        'info' : 'språk',
        'text' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at efficitur odio',
        'type' : 'select',
        'name' : 'language',
        'input': [
            {},
            {'value':'nb','label':'Bokmål'},
            {'value':'nn','label':'Nynorsk'},
            {'value':'en','label':'English'}
        ],
        'validation': {'required':true}
    },
    {
        'label': 'Velg måned',
        'info' : 'måned',
        'text' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at efficitur odio',
        'type' : 'dropdown-menu',
        'value': 'jan',
        'name' : 'month',
        'input': [
            {'value':'jan','label':'Januar'},
            {'value':'feb','label':'Februar'},
            {'value':'mar','label':'Mars'},
            {'value':'apr','label':'April'},
            {'value':'mai','label':'Mai'},
            {'value':'jun','label':'Juni'},
            {'value':'jul','label':'Juli'},
            {'value':'aug','label':'August'},
            {'value':'sep','label':'September'},
            {'value':'okt','label':'Oktober'},
            {'value':'nov','label':'November'},
            {'value':'des','label':'Desember'}
        ],
        'validation': {'required':true}
    },
    */
    {
        'label': 'Velg dag',
        'info' : 'dato',
        'text' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at efficitur odio',
        'type' : 'calendar',
        'value': 'now',
        'name' : 'date',
        'validation': {'required':true}
    }
];

var FormValidation = React.createClass({
	getInitialState: function() {        
		return { 
			'error': '', 'changed': '', 'row': [], 'static' : {
	            'timer': {},
	            'map': {},
	            'method': [
                    'personnumber','number','required'
	            ],
	            'selector': ':text, [type="password"], [type="file"], select, textarea, ' +
	            '[type="number"], [type="search"] ,[type="tel"], [type="url"], ' +
	            '[type="email"], [type="datetime"], [type="date"], [type="month"], ' +
	            '[type="week"], [type="time"], [type="datetime-local"], [type="hidden"],' +
	            '[type="range"], [type="color"], [type="radio"], [type="checkbox"]',
	            'validation': {
	                'email': /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	                'url': /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i,
	                'date': /^(0?[1-9]|[12][0-9]|3[01])([\/\-\.])(0?[1-9]|1[012])([\/\-\.])(\d{4})$/, // DD.MM.YYYY
	                'number': /^(\-|\+)?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
	                'phonenumber': /^\+?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
	                'postnumber': /^\d{4}$/,
	                'personnumber': /^\d{6}(\s+)?\d{5}$/,
	                'accountnumber': /^\d{4}(\s+)?\d{2}(\s+)?\d{5}$/,
	                'countrycode': /^\+\d{2,3}$/,
	                'decimal': /^\d*(,\d{1,2})?$/,
	                'monthCountDay': [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	            },
	            'message': {
	                'invalid-personnumber': 'Ugyldig personnummer',
	                'invalid-personnumber-length': 'Ugyldig personnummer',
	                'invalid-email': 'Ugyldig e-post adresse',
	                'invalid-accountnumber': 'Ugyldig kontonummer',
	                'invalid-accountnumber-length': 'Ugyldig kontonummer',
	                'invalid-mobilenumber': 'Ugyldig mobilnummer',
	                'invalid-mobilenumber-length': 'Ugyldig mobilnummer',
	                'invalid-telephonenumber': 'Ugyldig mobilnummer',
	                'invalid-telephonenumber-length': 'Ugyldig tekst lengde',
	                'invalid-required-field': 'Feltet er påkrevd',
	                'invalid-required-selection': 'Valget er påkrevd',
	                'invalid-creditcardnumber': 'Ugyldig Kortnummer',
	                'invalid-creditcardnumber-length': 'Ugyldig Kortnummer',
	                'invalid-kidnumber': 'Ugyldig kidnummer',
	                'invalid-kidnumber-length': 'Ugyldig kidnummer',
	                'invalid-organizationsnumber': 'Ugyldig organisasjonsnummer',
	                'invalid-organizationsnumber-length': 'Ugyldig organisasjonsnummer',
	                'invalid-number': 'Ugyldig verdi',
	                'invalid-minlength': 'Ugyldig lengde',
	                'invalid-decimal': 'Ugyldig verdi',
	                'invalid-countrycode': 'Ugyldig landskode'
	            }
	        }
		};
	},

    componentWillUnmount: function() {

    },

	verify : function( data, index ) {
		if ( ! data || ! data.event || ! data.validation ) return;
        this._validate( data.event, data.validation );
	},

	generateId : function () {
		return 'a-'+(new Date()).getTime()+'-'+Math.floor((Math.random()*10000)+1);
	},

	render : function() {
		var self = this, cx = Addons.classSet, classes = cx({
            'form-validation': true,
            '-has-error'     : this.state.error ? true : false,
            '-has-changed'   : this.state.changed ? true : false
        });

		var list = json.map(function(data, index){
			var item = <FormRow {...data} key={index} index={index} verify={self.verify}/>; //
			self.state.row.push({'component': item, 'data':data});
			return item;
		});
		
    	return (
            <form method="" name={this.props.name} onSubmit={self.onSubmit} ref="form" className={classes}>
                {list}
                <div className="form-row">
                    <div className="row-content -input-wrapper">
                        <button className="action-btn">Submit</button>
                    </div>
                </div>
            </form>
        );
	},

    componentDidMount : function() {
        var form = this.refs.form;
        if ( ! form ) return;

        form.setAttribute('novalidate', '');
        this.setState
    },

	/*************************************************************************
	=== Validation ===
	*************************************************************************/
    onSubmit : function( e ) {
        e.preventDefault();
        var error = this.validate();
        if ( error.length ) return console.log('stop..');

        console.log( 'send...' );
    },

    validate : function() {
        var form = this.refs.form, error = [];
        if ( ! form ) return error;

        var row = this.state.row || [], length = row.length;
        for ( var i=0; i<length; i++ ) {
            var name = row[i].data.name || ((row[i].data.input || [])[0] || {}).name;
            if ( ! name ) continue;

            //document.getElementsByName( groupName );
            var target = form.querySelector( '[name="'+name+'"]' );

            ///var target = document.getElementsByName( name );
            if ( ! target ) continue;

            var msg = this._validate({
                'target': target, 'type':'blur'
            }, row[i].data.validation, true );

            if ( msg ) error.push( msg );
        }
        return error;
    },

    isRadio: function (input) {
        if ( ! input ) return false;
        return (input.getAttribute('type') || '').match(/radio/i) !== null;
    },

    isClickable: function (input) {
        if ( !input ) return false;
        var type = input.getAttribute('type');
        var tag  = input.nodeName.toLowerCase();
        return (type + ' ' + tag).match(/radio|checkbox|select|option/i) !== null;
    },

    isCheckable: function (input) {
        if ( ! input ) return false;
        return (input.getAttribute('type') || '').match(/radio|checkbox/i) !== null;
    },

    getFormat: function (value, type) {
        var text = (value || '').replace(/\s+/g, ''), out = '';

        if (type === 'accountnumber') {
            out = [text.substring(0, 4), text.substring(4, 6), text.substring(6)]
                .join(' ').replace(/\s+/g, ' ').replace(/\s+$/g, '');
        } else if (type === 'personnumber') {
            out = [text.substring(0, 6), text.substring(6)]
                .join(' ').replace(/\s+/g, ' ').replace(/\s+$/g, '');
        } else if (type === 'organizationsnumber') {
            out = [text.substring(0, 3), text.substring(3, 6), text.substring(6, 9), text.substring(9, 12)]
                .join(' ').replace(/\s+/g, ' ').replace(/\s+$/g, '');
        } else if (type === 'amount') {
            out = this._splitText(text, 3).join(' ');
        } else if (type === 'creditcardnumber') {
            //out = this._splitText( text, 4 ).join(' ');
            out = [text.substring(0, 4), text.substring(4, 8), text.substring(8, 12), text.substring(12, 16)]
                .join(' ').replace(/\s+/g, ' ').replace(/\s+$/g, '');
        } else if (type === 'mobile' || type === 'telephone') {
            var plus = text.match(/^\+/) ? '+' : '', list = [];
            if (plus) {
                text = text.replace(/^\+/, '');
                var splited = text.split('');
                if (splited.length > 2) {
                    plus += splited.shift() + splited.shift() + ' ';
                    text = splited.join('');
                }
            }

            if (type === 'telephone')
                list = this._splitText(text, 2);
            else {
                var a = text.split(''), t = 3, j = 0;
                for (var i = 0; i < a.length; i++) {
                    if (!list[j]) {
                        list[j] = '';
                    }
                    list[j] += (a[i] + '');
                    if (--t === 0) {
                        t = list[j].length === 3 ? 2 : 3;
                        j = j + 1;
                    }
                }
            }
            out = plus + list.join(' ');
        }

        return out || text;
    },

    hasError: function (input) {
        return ! input ? false :
            (input.getAttribute('aria-invalid') ? true : false);
    },

    mod11OfNumberWithControlDigit: function (value) {
        var text = value || '', number = 2, sum = 0, i = text.length - 2;
        for (i; i >= 0; --i) {
            sum += text.charAt(i) * number;
            if (++number > 7) {
                number = 2;
            }
        }
        var result = (11 - sum % 11);
        return result === 11 ? 0 : result;
    },

    luhnChecksumOfNumberWithControlDigit: function (value) {
        var sum = 0, dbl = 0, text = value || '', i = 0;
        for (i = text.length - 2; i >= 0; i -= 2) {
            dbl = (parseInt(text.charAt(i), 10) * 2).toString();
            sum += parseInt(dbl.charAt(0), 10) + parseInt(dbl.charAt(1) || 0, 10);
        }
        for (i = text.length - 3; i >= 0; i -= 2) {
            sum += parseInt(text.charAt(i), 10);
        }
        sum = sum.toString();
        return 10 - parseInt(sum.charAt(sum.length - 1), 10);
    },

	/************************************************************************/	
    _getLength: function (input) {
        var tag = input.nodeName.toLowerCase();        

        if (tag === 'input' && this.isCheckable(input)) {
            var checked = this._getInputByName( input.name, true );
            return (checked ? (checked.value || '') : '').length;
        }
        return (input.value || '').length;
    },

    _getInputByName : function( name, selected ) {
        var list = document.getElementsByName( name ) || [];
        if ( ! selected ) return list;

        for ( var i=0; i<list.length; i++ ) {
            if ( list[i].checked ) return list[i];
        }
        return;
    },

    _trim: function (text, noSpace) {
        var out = (text || '').replace(/^\s+/, '').replace(/\s+$/g, '');
        return noSpace ? out.replace(/\s+/g, '') : out.replace(/\s+/g, ' ');
    },

    _capitaliseFirstLetter: function (text) {
        return text ? (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()) : '';
    },

    _isNoneCharacter: function (e) {
        var code = e ? e.keyCode || 0 : 0;
        if (!code) {
            return true;
        }
        return e.shiftKey || e.ctrlKey || (code >= 16 && code <= 18) || code === 9 || code === 13 || (code >= 35 && code <= 40) ?
            true : false;
    },

    _splitText: function (text, split) {
        var i = (text || '').length % split, list = i ? [text.substr(0, i)] : [];
        for (i; i < text.length; i += split)
            list.push(text.substr(i, split));
        return list;
    },

    /* jshint ignore:start */
    _getCursorPosition: function (input) {
        var position = 0;
        if ( input ) {
            if ('selectionStart' in input)
                position = input.selectionStart;
            else if (document.selection) {
                var sel = document.selection.createRange();
                var selLen = document.selection.createRange().text.length;
                sel.moveStart('character', -input.value.length);
                position = sel.text.length - selLen;
            }
        }
        return position;
    },

    _getSelection: function () {
        var selection = '';
        try {
            selection = window.getSelection().toString();
        } catch (error) { selection = ''; }
        return selection;
    },
    /* jshint ignore:end */

    _selectText: function (start, end, input) {
        var value = input.value || '';
        if ( isNaN(end) ) end = value.length;

        var interval = [isNaN(start) ? 0 : start, isNaN(end) ? 0 : end];
        if (!isNaN(interval[0]) && !isNaN(interval[1])) {
            if (input.setSelectionRange)// Firefox and other gecko based browsers
                input.setSelectionRange(interval[0], interval[1]);
            else if (input.createTextRange) { // Internet Explorer
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', interval[0]);
                range.moveStart('character', interval[1]);
                range.select();
            }
            else if (input.selectionStart) { // Other browsers
                input.selectionStart = interval[0];
                input.selectionEnd = interval[1];
            }
        }
    },

    _getErrorMessage: function (invalid) {
        var msg = this.state.static.message || {};
        return msg[invalid] || invalid;
    },

    _toggleErrorMessage: function (e, force, message) {        
        var self = this, target = e.currentTarget || e.target;
        target.dispatchEvent( new CustomEvent('get-state', {'detail':{
            'callback': function( state ) {
                //if ( force && state.error === message && (e||{}).type !== 'blur' ) return;
                if ( force && state.error === message ) return;

                var list = self._getInputByName( target.name ); 
                var loop = list.length, i = 0;                
                for ( i=0; i<loop; i++ ) {
                    list[i].dispatchEvent( new CustomEvent('change-state', {'detail': {
                        'error': message || ''
                    }}) );                    
                }
                /*
                for ( i=0; i<loop; i++ ) {
                    list[i].dispatchEvent( new CustomEvent('change-state', {'detail': {
                        'error': ''
                    }}) );                    
                }

                if ( ! message ) return;

                setTimeout( function() { 
                    for ( i=0; i<loop; i++ ) {
                        list[i].dispatchEvent( new CustomEvent('change-state', {'detail': {
                            'error': message
                        }}) );
                    }
                }, 50 );
                */

                /*
                target.dispatchEvent( new CustomEvent('change-state', {'detail': {
                    'error': ''
                }}) );

                if ( ! message ) return;
                setTimeout( function() { 
                    target.dispatchEvent( new CustomEvent('change-state', {'detail': {
                        'error': message
                    }}) );
                }, 50 );
                */
            }
        }}) );
    },

    _validate: function (e, validation, required) {
        if ( ! validation ) return '';

        var keyup = e.type === 'keyup', noneCharacter = this._isNoneCharacter(e);
        if (  keyup && noneCharacter ) return '';

        var opt   = this.state.static, method = opt.method || [];
        var input = e.currentTarget || e.target, id = input.getAttribute('id');
        var loop  = method.length, j = 0, i = 0, blur = e.type === 'blur';
        var has = this.hasError(input), option = {'list': []};

        for (i = 0; i < loop; i++) {
            var param = validation[ method[i] ];
            if ( typeof(param) === 'undefined' ) continue; 
            if (!has && method[i] === 'required' && !required) continue;

            var key = '_verify' + this._capitaliseFirstLetter(method[i]);
            if (typeof(this[key]) !== 'function')  continue;

            option.invalid = this[key](e, typeof(param)==='boolean' ? '' : param);
            option.list.push(option.invalid === null ? 'null' : option.invalid);
            if ( ! option.invalid ) continue;

            j = i;
            i = loop + 1;
            option.message = this._getErrorMessage(option.invalid);
        }

        if (i > loop) {
            if (i === loop && option.list.join('').match(/null/i)) return '';

            var force = i > loop || (option.list.join('').match(/invalid/ig) ? true : false);
            this._toggleErrorMessage(e, force, option.message);
        }
        else if (blur || e.type === 'change' || (keyup && has)) {
            this._toggleErrorMessage(e, false, '');
        } else {
        }

        return option.message || '';
    },

    /********************************************************/
    _verifyRequired: function (e, param) {
        var input  = e.currentTarget || e.target;
        var length = 0, type = 'field';

        if (input.nodeName.toLowerCase() === 'select' || this.isCheckable(input)) {
            length = this._getLength(input);
            type = 'selection';
        } else {
            length = this._trim(input.value, true).length;
            //if (!length && param === 'visible' && !input.prop('clientHeight'))
            //    length = 1;
        }
        return length > 0 ? '' : 'invalid-required-' + type;
    },

    _verifyNumber: function (e, param, type) {
        var field = e.currentTarget || e.target, value = field.value || '';
        var text = value.replace(/\s+/g, ''), has = this.hasError(field);
        if (!text) {
            return has ? null : '';
        }

        var keyup = e.type === 'keyup', focus = e.type === 'focus';
        var number = parseFloat(text.replace(/^0+/, ''));

        if (focus || keyup) {
            if (focus && param !== 'noformat') {
                var allSelected = value === this._getSelection();
                field.value = text;
                if ( allSelected ) this._selectText(0,text.length,field);
            }

            if (this._isNoneCharacter(e) || value === this._getSelection())
                return has ? null : '';

            if (focus || (keyup && !has))
                return '';

        } else if (e.type === 'blur' && param !== 'noformat' && !text.match(/\D/)) {
            field.value = this.getFormat(text, 'amount');
        }

        var error = isNaN(number) || (text && text.match(/\D/)) || number < 0 ? 
            (type==='amount' ? 'invalid-amount' : 'invalid-number') : '';                        
        return error;
    },

    _verifyPersonnumber: function (e) {
    	var field = e.currenTarget || e.target, value = field.value || '';
        var text  = value.replace(/\s+/g, ''), has = this.hasError( field );
        if ( ! text ) {
            return has ? null : '';
        }

        var keyup = e.type === 'keyup', focus = e.type === 'focus';
        var opt   = this.state.static;

        if (focus || keyup) {
            //if ( focus ) field.removeAttribute('aria-hidden');

            if (this._isNoneCharacter(e) || value === this._getSelection()) {
                return has ? null : '';
            }

            var pos = this._getCursorPosition(field);
            field.value = this.getFormat(text, 'personnumber');
            //field.setAttribute( 'aria-hidden', 'true');

            if (keyup && pos !== value.length) {
                this._selectText(pos, pos, field);
            }
            if (focus || (keyup && !has)) {
                return '';
            }
        } else if (e.type === 'focusout' || e.type === 'blur') {
            field.value = this.getFormat(text, 'personnumber');
            //field.setAttribute( 'aria-hidden', 'true');
        }

        if (!text.match(opt.validation.number))       return 'invalid-personnumber';
        if (text.length < 11)                         return 'invalid-personnumber-length';
        if (!text.match(opt.validation.personnumber)) return 'invalid-personnumber';


        var sum = function (tNumber, factors) {
            var s = 0, i = 0, l = factors.length;
            for (i; i < l; ++i) {
                s += parseInt(tNumber.charAt(i), 10) * factors[i];
            }
            return s;
        };

        var cSum1 = 11 - (sum(text, [3, 7, 6, 1, 8, 9, 4, 5, 2]) % 11);
        if (cSum1 === 11) {
            cSum1 = 0;
        }

        var cSum2 = 11 - (sum(text, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11);
        if (cSum2 === 11) {
            cSum2 = 0;
        }

        var invalid = !(
            cSum1 === parseInt(text.charAt(9), 10) && cSum2 === parseInt(text.charAt(10), 10)
        );
        return invalid ? 'invalid-personnumber' : '';
    }
});

module.exports = FormValidation;