/******************************************************************************
=== CONFIGURATION ===
******************************************************************************/
var CONFIG = {
  'month' : ['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'],
  'language' : 'no',

  'carouselAutoSwipe': 15*1000, // 15 seconds

  'popupChatWidget': {
    'delay': 15*1000, //  15 seconds
    'message': {
      'no': 'Hva kan jeg hjelpe deg?',
      'en': 'What can i help you?'
    }
  },

	'api': {
    'login' : 'https://simplifai-backend.eu-de.mybluemix.net/login',
    'order' : 'https://simplifai-backend.eu-de.mybluemix.net/subscribe', 
    'concat': 'https://simplifai-backend.eu-de.mybluemix.net/contact'
	},

  'translation' : {
    /*** main ***/
    'main.send': {
      'no': 'Send',
      'en': 'Send'
    },

    /*** menu ***/
    'main.menu.product-and-service': {
      'no': 'Produkt',
      'en': 'Product'
    },
    'main.menu.contact-us': {
      'no': 'Kontakt oss',
      'en': 'Contact us'
    },
    'main.menu.about-us': {
      'no': 'Om oss',
      'en': 'About us'
    },
    'main.menu.sign-up': {
      'no': 'Meld på',
      'en': 'Sign up'
    },
    'main.menu.log-in': {
      'no': 'Logg inn',
      'en': 'Log in'
    },

    /*** contact ***/
    'main.contact.title': {
      'no': 'Kontakt oss',
      'en': 'Contact us'
    },
    'main.contact.company': {
      'no': 'Firma',
      'en': 'Company'
    },
    'main.contact.email': {
      'no': 'E-post',
      'en': 'Email'
    },
    'main.contact.phone': {
      'no': 'Tlf. nummer',
      'en': 'Phone'
    },
    'main.contact.request': {
      'no': 'Forspørsel',
      'en': 'Type of request'
    },
    'main.contact.request-account': {
      'no': 'Konto',
      'en': 'Account'
    },
    'main.contact.request-billing': {
      'no': 'Faktura',
      'en': 'Billing'
    },
    'main.contact.request-upgrade': {
      'no': 'Produkt oppgradering',
      'en': 'Product upgrade'
    },
    'main.contact.request-sales': {
      'no': 'Salg',
      'en': 'Sales'
    },
    'main.contact.request-support': {
      'no': 'Brukerstøtte',
      'en': 'Support'
    },
    'main.contact.request-other': {
      'no': 'Andre',
      'en': 'Other'
    },
    'main.contact.description': {
      'no': 'Beskrivelse',
      'en': 'Description'
    },
    'main.contact.success': {
      'no': 'Din forspørsel er sendt.',
      'en': 'Your request is send.'
    },

    /*** contact ***/
    'main.buyer.title': {
      'no': 'Start opp',
      'en': 'Get start'
    },
    'main.buyer.company': {
      'no': 'Firma',
      'en': 'Company'
    },
    'main.buyer.name': {
      'no': 'Navn',
      'en': 'Name'
    },
    'main.buyer.email': {
      'no': 'E-post',
      'en': 'Email'
    },
    'main.buyer.phone': {
      'no': 'Tlf. nummer',
      'en': 'Phone'
    },
    'main.buyer.product': {
      'no': 'Produkt',
      'en': 'Product'
    },
    'main.buyer.payment': {
      'no': 'Betalemåte',
      'en': 'Payment'
    },
    'main.buyer.visa': {
      'no': 'Visa',
      'en': 'Visa'
    },
    'main.buyer.billing': {
      'no': 'Faktura',
      'en': 'Billing'
    },
    'main.buyer.credit-card': {
      'no': 'Kredittkort',
      'en': 'Credit card'
    },    
    'main.buyer.expired-date': {
      'no': 'Exp. date / CSV',
      'en': 'Exp. date / CSV'
    },    
    'main.buyer.expired-date-placeholder': {
      'no': 'MM/ÅÅ',
      'en': 'MM/YY'
    },    
    'main.buyer.expired-date-placeholder': {
      'no': 'MM/ÅÅ',
      'en': 'MM/YY'
    },    
    'main.buyer.csv': {
      'no': 'CSV',
      'en': 'CSV'
    },    
    'main.buyer.street': {
      'no': 'Gate adresse',
      'en': ''
    },    
    'main.buyer.billing-street': {
      'no': 'Gate (Faktura)',
      'en': 'Street (billing)'
    },    
    'main.buyer.billing-place': {
      'no': 'Sted (Faktura)',
      'en': 'Place (billing)'
    },    
    'main.buyer.postal': {
      'no': 'Postnummer',
      'en': 'Postal'
    },    
    'main.buyer.city': {
      'no': 'Post sted',
      'en': 'City'
    },    
    'main.buyer.success': {
      'no': 'Din forspørsel er sendt.',
      'en': 'Your request is send.'
    },    
    'main.buyer.password': {
      'no': 'Passord',
      'en': 'Password'
    },    
    'main.buyer.repeat-password': {
      'no': 'Repeter passord',
      'en': 'Re-password'
    },    

    /*** ***/
    'main.login.title': {
      'no': 'Logg inn',
      'en': 'Login'
    },    
    'main.login.username': {
      'no': 'Brukernavn',
      'en': 'Username'
    },    
    'main.login.password': {
      'no': 'Passord',
      'en': 'Password'
    },    
    'main.login.submit': {
      'no': 'Logg inn',
      'en': 'Login'
    },    
    'main.login.create-account': {
      'no': 'Du kan opprette en konto her.',
      'en': 'You may to create a account here.'
    },   

    /*** ***/
    'main.contact': {
      'no': '',
      'en': ''
    },
    'main.contact': {
      'no': '',
      'en': ''
    },
    '': ''
  }, 

  /* Specific field validation error message */		
	'validationErrorMSG': {
    'phone': {
      'field_required' : {
        'en' : 'Your phone number is required.',
        'no' : 'Ditt telefonnummer er påkrevd.'
      }
    },
    'postal': {
      'field_required' : {
        'en' : 'Your postal number is required',
        'no' : 'Postnummer er påkrevd'
      },
      'invalid_number' : {
        'en' : 'Your postal number is invalid',
        'no' : 'Postnummer er ugyldig'        
      }
    },
    'city': {
      'field_required' : {
        'en' : 'Your city is required.',
        'no' : 'Sted navn er påkrevd'
      }
    }
	},

	/* standard validation error message */		
	'validationErrorSTD': {
    'form_contain_several_error' : {
      'no': 'Skjemaet inneholder flere feil.',
      'en': 'The application\'s form contains several errors.'
    },
    'field_required' : {
      'no': 'Feltet er påkrevd.',
      'en': 'The field is required.'
    },
    'selection_required' : {
      'no': 'Valget er påkrevd.',
      'en': 'The selection is required.'
    },
    'required_at_least' : {
      'no': 'Feltet krever minst #PARAM# tegn.',
      'en': 'The field requires at least #PARAM# characters.'
    },      
    'field_max_character' : {
      'no': 'Feltet kan ikke ha mer enn #PARAM# tegn.',
      'en': 'The field get max #PARAM# characters.'
    },
    'field_interval_between' : {
      'no': 'Verdien må være innenfor interval mellom #PARAM1# og #PARAM2#.',
      'en': 'The value has to be between #PARAM1# and #PARAM2#.'
    },
    'field_interval_greater_than' : {
      'no': 'Verdien må enten være større enn eller lik som #PARAM#.',
      'en': 'The value has to be greater than or equal to #PARAM#.'
    },
    'field_interval_less_than ' : {
      'no': 'Verdien må enten være mindre enn eller lik som #PARAM#.',
      'en': 'The value has to be less than og equal to #PARAM#.'
    },
    'invalid_email' : {
      'no': 'Ugyldig epost adresse.',
      'en': 'Invalid email address.'
    },
    'invalid_text' : {
      'no': 'Ugyldig tekst.',
      'en': 'Invalid text.'
    },
    'invalid_url' : {
      'no': 'Ugyldig URL.',
      'en': 'Invalid URL.'
    },
    'invalid_number' : {
      'no': 'Feltet skal kun inneholde tall.',
      'en': 'The field allows only number.'
    },
    'invalid_date' : {
      'no': 'Dato format er ugyldig. Det skal f.eks være i format som 23.02.2014.',
      'en': 'Invalid, the date\'s pattern has to be 23.02.2014.'
    },
    'invalid_day' : {
      'no': 'Ugyldig dag.',
      'en': 'Invalid day.'
    },
    'invalid_month' : {
      'no': 'Ugyldig måned.',
      'en': 'Invalid month.'
    },
    'invalid_post_number' : {
      'no': 'Ugyldig postnummer.',
      'en': 'Invalid post number.'
    },
    'invalid_phoneprefix' : {
      'no': 'Ugyldig landskode',
      'en': 'Invalid contry code.'
    },
    'invalid_telephone_number' : {
      'no': 'Ugyldig telefonnummer',
      'en': 'Invalid phone number.'
    },
    'invalid_telephone_number_length' : {
      'no': 'Telefonnummer må minst ha 8 siffer',
      'en': 'The phone number has to be at least 8 digits.'
    },
    'invalid_mobile_number' : {
      'no': 'Ugyldig mobilnummer.',
      'en': 'Invalid mobile number.'
    },
    'invalid_mobile_number_length' : {
      'no': 'Mobilnummer må minst ha 8 siffer',
      'en': 'The mobile number has to be at least 8 digits.'
    },
    'invalid_person_number' : {
      'no': 'Ugyldig personnummer.',
      'en': 'Invalid person number.'
    },
    'invalid_person_number_length' : {
      'no': 'Personnummer må minst være på 11 siffer',
      'en': 'The person number has to be at least 11 digits.'
    },      
    'invalid_account_number' : {
      'no': 'Ugyldig kontonummer.',
      'en': 'Invalid account number.'
    },
    'invalid_account_number_length' : {
      'no': 'Kontonummer må minst være på 11 siffer',
      'en': 'The account number has to be at least 11 digits.'
    },      
    'invalid_amount' : {
      'no': 'Feltet inneholder et ugyldig beløp',
      'en': 'The field contains an invalid amount.'
    },
    'invalid_kidormsg' : {
      'no': 'Inneholdet et ugyldig.',
      'en': 'The content is invalid amount.'
    },      
    'amount_has_to_be_great_than_zero' : {
      'no': 'Beløpet må være eller lik null.',
      'en': 'The amount has to be great than or equals zero.'
    },
    'invalid_credit_card_number' : {
      'no': 'Ugyldig kortnummer.',
      'en': 'Invalid credit card number.'
    },
    'at_least_option_not_meet_requirement' : {
      'no': 'Vennligst velg minst #PARAM# alternativene.',
      'en': 'Please, select at least #PARAM# options'
    }      
  }
};
