/******************************************************************************
=== CONFIGURATION ===
******************************************************************************/
var CONFIG = {
  'month' : ['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'],
  'language' : 'no',

  'carouselAutoSwipe': 15*1000, // 15 seconds

  'popupChatWidget': {
    'delay': 10000000000, //15*1000, //  15 seconds
    'message': {
      'no': 'Hva kan jeg hjelpe deg?',
      'en': 'What can i help you?'
    }
  },

	'api': {
    'login' : 'https://simplifai-backend.eu-de.mybluemix.net/login',
    'order' : 'https://simplifai-backend.eu-de.mybluemix.net/subscribe', 
    'contact': 'https://simplifai-backend.eu-de.mybluemix.net/contact'
	},

  'translation' : {
    /*** main ***/
    'main.send': {
      'no': 'Send',
      'en': 'Send'
    },
    'main.edit': {
      'no': 'Rediger',
      'en': 'Edit'
    },
    'main.change': {
      'no': 'Endre',
      'en': 'Change'
    },

    /*** footer ***/
    'footer.follow-us': {
      'no': 'Følg oss på sosialmedia',
      'en': 'Follow us'
    },


    /*** menu ***/
    'main.menu.home': {
      'no': 'Hjem',
      'en': 'Home'
    },

    'main.menu.product-and-service': {
      'no': 'Produkt',
      'en': 'Product'
    },
    'main.menu.blog': {
      'no': 'Blog',
      'en': 'Blog'
    },
    'main.menu.contact-us': {
      'no': 'Kontakt',
      'en': 'Contact'
    },
	'main.menu.be-pilot': {
      'no': 'Bli pilotkunde',
      'en': 'Be a pilot customer'
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
    'main.menu.profile': {
      'no': 'Profil',
      'en': 'Profile'
    },

    /*** contact ***/
    'main.contact.title': {
      'no': 'Bli pilotkunde',
      'en': 'Contact us'
    },
    'main.contact.name': {
      'no': 'Navn',
      'en': 'Name'
    },
    'main.contact.company': {
      'no': 'Bedriftsnavn',
      'en': 'Company name'
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
      'no': 'Fortell oss litt om dine forventninger',
      'en': 'Tell us a bit about your expectations'
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
      'no': 'Gate',
      'en': 'Stret'
    },    
    'main.buyer.address': {
      'no': 'Sted',
      'en': 'Place'
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
    'main.login.system-error': {
      'no': 'System feil har oppstått. Prøv igjen senere.',
      'en': 'System error, please try later.'
    },   
    'main.login.invalid': {
      'no': 'Ugyldig brukernavn eller passord.',
      'en': 'Invalid username or password.'
    },   

    /*** ***/
    'main.profile.title': {
      'no': 'Profil',
      'en': 'Profile'
    },    
  

    /*** ***/
    'product.title': {
      'no': 'Produkt oversikt',
      'en': 'Product overview'
    },
    'product.legend': {
      'no': 'Kvalitet / Produkt',
      'en': 'Quality / Product'
    },
    'product.live': {
      'no': 'Live',
      'en': 'Live'
    },
    'product.support': {
      'no': 'Support',
      'en': 'Support'
    },
    'product.action': {
      'no': 'Kom i gang',
      'en': 'Get started'
    },
    'product.start': {
      'no': 'Start',
      'en': 'Start'
    },
    'product.buy': {
      'no': 'Kjøp',
      'en': 'Buy'
    },
    'product.simplest.contact': {
      'no': 'Kontakt',
      'en': 'Contact'
    },
    'product.contact': {
      'no': 'Kontakt oss',
      'en': 'Contact us'
    },
    'product.simple.title': {
      'no': 'Simple',
      'en': 'Simple'
    },
    'product.simpler.title': {
      'no': 'Simpler',
      'en': 'Simpler'
    },
    'product.simplest.title': {
      'no': 'Simplest',
      'en': 'Simplest'
    },
    'product.language': {
      'no': 'Språk',
      'en': 'Language'
    },
    'product.simple.language': {
      'no': 'Norsk',
      'en': 'English'
    },
    'product.simpler.language': {
      'no': 'Norsk og Engelsk',
      'en': 'English and Norwegian'
    },
    'product.simplest.language': {
      'no': 'Flerspråk støtte',
      'en': 'Multilanguage support'
    },
    'product.channel': {
      'no': 'Tilgjengelige kanal',
      'en': 'Available channels'
    },
    'product.simple.channel': {
      'no': 'FB Messenger, Web',
      'en': 'FB Messenger, Web'
    },
    'product.simpler.channel': {
      'no': 'Messenger, Web, Slack',
      'en': 'Messenger, Web, Slack'
    },
    'product.simplest.channel': {
      'no': 'Flerkanal støtte',
      'en': 'Multichannel support'
    },
    'product.question': {
      'no': 'Antall FAQ spørsmål',
      'en': 'Number of FAQ questions'
    },
    'product.simple.question': {
      'no': '20',
      'en': '20'
    },
    'product.simpler.question': {
      'no': '40',
      'en': '40'
    },
    'product.simplest.question': {
      'no': '150',
      'en': '150'
    },
    'product.history': {
      'no': 'Chat historikk',
      'en': 'Chat history'
    },
    'product.simple.history': {
      'no': '1 måned',
      'en': '1 month'
    },
    'product.simpler.history': {
      'no': '3 måneder',
      'en': '3 months'
    },
    'product.simplest.history': {
      'no': '24 måneder',
      'en': '24 months'
    },
    'product.dashboard': {
      'no': 'Dashboard',
      'en': 'Dashboard'
    },
    'product.simple.dashboard': {
      'no': '',
      'en': ''
    },
    'product.simpler.dashboard': {
      'no': '*check*',
      'en': '*check*'
    },
    'product.simplest.dashboard': {
      'no': '*check*',
      'en': '*check*'
    },
    'product.support': {
      'no': 'Support responstid',
      'en': 'Support responsetime'
    },
    'product.simple.support': {
      'no': '48 timer',
      'en': '48 hours'
    },
    'product.simpler.support': {
      'no': '24 timer',
      'en': '24 hours'
    },
    'product.simplest.support': {
      'no': '12 timer',
      'en': '12 hours'
    },
    'product.chatbot': {
      'no': 'Chatbot trening',
      'en': 'Chatbot trening'
    },
    'product.simple.chatbot': {
      'no': 'Ukentlig',
      'en': 'Weekly'
    },
    'product.simpler.chatbot': {
      'no': 'Hver 2. dag',
      'en': 'Every 2nd day'
    },
    'product.simplest.chatbot': {
      'no': 'Daglig',
      'en': 'Daily'
    },
    'product.fee': {
      'no': 'Oppstart kostnad',
      'en': 'Setup fee'
    },
    'product.simple.fee': {
      'no': '500,-',
      'en': '500,-'
    },
    'product.simpler.fee': {
      'no': '1 500,-',
      'en': '1 500,-'
    },
    'product.simplest.fee': {
      'no': '',
      'en': ''
    },
    'product.month-fee': {
      'no': 'Månedlig kostnad',
      'en': 'Monthly fee'
    },
    'product.simple.month-fee': {
      'no': '150,-',
      'en': '150,-'
    },
    'product.simpler.month-fee': {
      'no': '450,-',
      'en': '450,-'
    },
    'product.simplest.month-fee': {
      'no': '',
      'en': ''
    },
    'product.free-chat': {
      'no': 'Gratis chat inkl. pr mnd',
      'en': 'Free chat included each month'
    },
    'product.simple.free-chat': {
      'no': '100',
      'en': '100'
    },
    'product.simpler.free-chat': {
      'no': '300',
      'en': '300'
    },
    'product.simplest.free-chat': {
      'no': '',
      'en': ''
    },
    'product.fee-chat': {
      'no': 'Pr chat kostnad',
      'en': 'Fee pr chat'
    },
    'product.simple.fee-chat': {
      'no': '0,75,-',
      'en': '0,75,-'
    },
    'product.simpler.fee-chat': {
      'no': '0,50,-',
      'en': '0,50,-'
    },
    'product.simplest.fee-chat': {
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
