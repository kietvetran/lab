/******************************************************************************
=== CONFIGURATION ===
******************************************************************************/
var CONFIG = {
	'api': {
		'searchphone'   : 'http://reddbarnadev.azurewebsites.net',
    //'authentication': 'http://reddbarnadev.azurewebsites.net',
    'receiver'      : 'http://reddbarnadev.azurewebsites.net',
    
    /*
    'searchphone'   : 'http://localhost:3000',
    'authentication': 'http://localhost:3000',
    'receiver'      : 'http://localhost:3000',
    //*/
    '':''
	},

  'signature':  {
    'penColor': '#000',
    'bgColor': '#fff',
    'dotSize': 2,
    'underline': {
      'lineDash'  : [5,10],
      'lineColor' : '#518197',
      'textColor' : '#000',
      'textFont'  : 'Verdana',
      'textSize'  : 18,
      'textAlign' : 'right', // 'left' as default
      'text'      : '==PLACE==, ==DATE=='
    }
  },

  'month' : ['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'],

	'language' : 'nb', // eq: en,nb,nn

  'personAjaxWait' : 5000, // milliseconds

  /* accordion menu option */
  'menyOpen': false,
  'menyAppending' : 'paging',// scroll, paging, opacity,

  /*
	'acceptText' : 'Jeg vil bidra til Redd Barnas arbeid med et fast trekk '+
		'fra min konto på ==AMOUNT== kr per måned. <strong>Beløpet justeres '+
		'automatisk etter konsumprisindeksen.</strong> Jeg forstår at mitt '+
		'bidrag brukes der det til enhver tid kommer mest til nytte for barna.',
  */

  'acceptText' : 'Jeg vil bidra til Redd Barnas arbeid med et fast trekk '+
    'fra min konto på <strong>==AMOUNT== kr</strong> per måned.',


  /**/
  'children' : [
    {'name': 'Woshene', 'location': 'Nepal' },
    {'name': 'Solochana', 'location': 'Nepal' },
    {'name': 'Rohan', 'location': 'Nepal' },
    {'name': 'Legesu', 'location': 'Nepal' },
    {'name': 'Mayling', 'location': 'Nepal' },
    {'name': 'Meskerem', 'location': 'Nepal' },
    {'name': 'Osmar', 'location': 'Nepal' },
    {'name': 'Hiwot', 'location': 'Nepal' },
    {'name': 'Asmita', 'location': 'Nepal' },
    {'name': 'Ever Josue', 'location': 'Nepal' }
  ],

  /**/
  'overview' : ['date','name','phone','email','contribution'],

  /**/
  'label' : {
    'name'  : {'en':'Name', 'nb':'Navn'},
    'time'  : {'en':'Time', 'nb':'Tid'},
    'date'  : {'en':'Date', 'nb':'Dato'},
    'email' : {'en':'Email', 'nb':'E-post'},
    'phone' : {'en':'Phone', 'nb':'Telefon'},
    'empty' : {'en':'Empty', 'nb':'Tomt'},
    'yes'   : {'en':'Yes', 'nb':'Ja'},
    'no'    : {'en':'No', 'nb':'Nei'},
    'contribution' : {'en':'Contribution','nb':'Bidrag'}
  },

	/**/
  'serverMessage' : {
    'UNMATCHED' : {'en':'Unmatched username or password.', 'nb':'Brukernavn eller passord er feil.'},
    'OFFLINE'   : {'en':'You are offline.', 'nb':'Ingen nettverk tilgjengelig.'},
    'SENDREFER' : {
      'en':'Do you want to send local storage data to server?', 
      'nb':'Ønsker du å send lokal lagret data til server?'
    },
    'RETRYSENDING' : {
      'en':'Failed to send local storage data. Are you offline?', 
      'nb':'Mislykket å send lokal lagret data. Er internett tilgjengelig?'
    }
  },

  /* Specific field validation error message */		
	'validationErrorMSG': {
    'phone': {
      'field_required' : {
        'en' : 'Your phone number is required.',
        'nb' : 'Ditt telefonnummer er påkrevd.'
      }
    },
    'postal': {
      'field_required' : {
        'en' : 'Your postal number is required',
        'nb' : 'Postnummer er påkrevd'
      },
      'invalid_number' : {
        'en' : 'Your postal number is invalid',
        'nb' : 'Postnummer er ugyldig'        
      }
    },
    'city': {
      'field_required' : {
        'en' : 'Your city is required.',
        'nb' : 'Sted navn er påkrevd'
      }
    }
	},

	/* standard validation error message */		
	'validationErrorSTD': {
    'form_contain_several_error' : {
      'nb': 'Skjemaet inneholder flere feil.',
      'en': 'The application\'s form contains several errors.'
    },
    'field_required' : {
      'nb': 'Feltet er påkrevd.',
      'en': 'The field is required.'
    },
    'selection_required' : {
      'nb': 'Valget er påkrevd.',
      'en': 'The selection is required.'
    },
    'required_at_least' : {
      'nb': 'Feltet krever minst #PARAM# tegn.',
      'en': 'The field requires at least #PARAM# characters.'
    },      
    'field_max_character' : {
      'nb': 'Feltet kan ikke ha mer enn #PARAM# tegn.',
      'en': 'The field get max #PARAM# characters.'
    },
    'field_interval_between' : {
      'nb': 'Verdien må være innenfor interval mellom #PARAM1# og #PARAM2#.',
      'en': 'The value has to be between #PARAM1# and #PARAM2#.'
    },
    'field_interval_greater_than' : {
      'nb': 'Verdien må enten være større enn eller lik som #PARAM#.',
      'en': 'The value has to be greater than or equal to #PARAM#.'
    },
    'field_interval_less_than ' : {
      'nb': 'Verdien må enten være mindre enn eller lik som #PARAM#.',
      'en': 'The value has to be less than og equal to #PARAM#.'
    },
    'invalid_email' : {
      'nb': 'Ugyldig epost adresse.',
      'en': 'Invalid email address.'
    },
    'invalid_text' : {
      'nb': 'Ugyldig tekst.',
      'en': 'Invalid text.'
    },
    'invalid_url' : {
      'nb': 'Ugyldig URL.',
      'en': 'Invalid URL.'
    },
    'invalid_number' : {
      'nb': 'Feltet skal kun inneholde tall.',
      'en': 'The field allows only number.'
    },
    'invalid_date' : {
      'nb': 'Dato format er ugyldig. Det skal f.eks være i format som 23.02.2014.',
      'en': 'Invalid, the date\'s pattern has to be 23.02.2014.'
    },
    'invalid_day' : {
      'nb': 'Ugyldig dag.',
      'en': 'Invalid day.'
    },
    'invalid_month' : {
      'nb': 'Ugyldig måned.',
      'en': 'Invalid month.'
    },
    'invalid_post_number' : {
      'nb': 'Ugyldig postnummer.',
      'en': 'Invalid post number.'
    },
    'invalid_phoneprefix' : {
      'nb': 'Ugyldig landskode',
      'en': 'Invalid contry code.'
    },
    'invalid_telephone_number' : {
      'nb': 'Ugyldig telefonnummer',
      'en': 'Invalid phone number.'
    },
    'invalid_telephone_number_length' : {
      'nb': 'Telefonnummer må minst ha 8 siffer',
      'en': 'The phone number has to be at least 8 digits.'
    },
    'invalid_mobile_number' : {
      'nb': 'Ugyldig mobilnummer.',
      'en': 'Invalid mobile number.'
    },
    'invalid_mobile_number_length' : {
      'nb': 'Mobilnummer må minst ha 8 siffer',
      'en': 'The mobile number has to be at least 8 digits.'
    },
    'invalid_person_number' : {
      'nb': 'Ugyldig personnummer.',
      'en': 'Invalid person number.'
    },
    'invalid_person_number_length' : {
      'nb': 'Personnummer må minst være på 11 siffer',
      'en': 'The person number has to be at least 11 digits.'
    },      
    'invalid_account_number' : {
      'nb': 'Ugyldig kontonummer.',
      'en': 'Invalid account number.'
    },
    'invalid_account_number_length' : {
      'nb': 'Kontonummer må minst være på 11 siffer',
      'en': 'The account number has to be at least 11 digits.'
    },      
    'invalid_amount' : {
      'nb': 'Feltet inneholder et ugyldig beløp',
      'en': 'The field contains an invalid amount.'
    },
    'invalid_kidormsg' : {
      'nb': 'Inneholdet et ugyldig.',
      'en': 'The content is invalid amount.'
    },      
    'amount_has_to_be_great_than_zero' : {
      'nb': 'Beløpet må være eller lik null.',
      'en': 'The amount has to be great than or equals zero.'
    },
    'invalid_credit_card_number' : {
      'nb': 'Ugyldig kortnummer.',
      'en': 'Invalid credit card number.'
    },
    'at_least_option_not_meet_requirement' : {
      'nb': 'Vennligst velg minst #PARAM# alternativene.',
      'en': 'Please, select at least #PARAM# options'
    }      
  }
};
