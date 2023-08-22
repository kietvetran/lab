var ATTR = {
};

function startup() {
	ATTR.main = document.getElementById('main');
	ATTR.header = document.getElementById('header');
	ATTR.menuWrapper = document.getElementById('menu-wrapper');
	ATTR.booksWrapper = document.getElementById('books-wrapper');
	ATTR.blogWrapper = document.getElementById('blog-wrapper');
	ATTR.modalWrapper = document.getElementById('modal-wrapper');


	addEvent( clickDocument,  document, 'click'          );
	addEvent( changeLocation, window,   'popstate' );

	init();
}
/******************************************************************************
 == locaiton ==
******************************************************************************/
function changeLocation( e ) {
	initMenu();
	openBookInfo();
}

/******************************************************************************
 == click ==
******************************************************************************/
function clickDocument( e ) {
	var handler = getClickHandler(e, [
		// {type: 'class', what: 'main-menu', action: changeSorting},
		// {type: 'class', what: 'verify-btn', action: createTableList},
		{type: 'class', what: 'modal-closer', action: closeModal}
	]);

	if ( !handler ) { return; }
	handler.action( e, handler.currentTarget );
}

/******************************************************************************
 == modal ==
******************************************************************************/
function toggleModal( html ) {
	if ( !ATTR.modalWrapper ){ return; }

	ATTR.modalWrapper.innerHTML = html ? [
		'<div class="modal-holder top-appending">',
			'<div href="#" class="modal-closer -bg"></div>',
			'<div class="modal-content">',
				'<div class="modal-header">',
					'<a href="#" class="modal-closer icon-btn -cross -no-border"></a>',
				'</div>',
				'<div class="modal-body">',
					html,
				'</div>',
			'</div>',
		'</div>'
	].join('') : '';
}

function closeModal() { 
	window.location.href = window.location.href.replace( /\?.*/g, '' );
	toggleModal(''); 
}

/******************************************************************************
 == init ==
******************************************************************************/
function init() {
	initMenu();
	initBooks();
	openBookInfo();
}

function initBooks() {
	var list = BOOKS.filter( (d) => d && d.id );
	if ( list.length < 3 ) {
		var books = list.map( (d) => {
			return getBookHTML(d);
		});
		ATTR.booksWrapper.innerHTML = `<div class="book-info-wrapper -count-${list.length}">${books.join('')}</div>`;
	} else {
		var books = list.map( (d) => {
			return `<a href="#books?bookId=${d.id}" class="book-link-wrapper">${getBookHTML(d, true)}</a>`;
		});
		ATTR.booksWrapper.innerHTML = `<div class="book-thumb-wrapper">${books.join('')}</div>`;
	}
}

function initMenu() {
	if ( !ATTR.menuWrapper || !ATTR.main ) { return; }
	var list = [];
	var query = getURLquery();
	var current = MENU.find( (d) => d.id === query.sharp ) || MENU[0];
	MENU.forEach( (d) => {
		list.push(`<a href="${d.id}" class="menu-item${current.id === d.id ? ' -active' : ''}">${d.name}</a>`);
	});
	ATTR.menuWrapper.innerHTML = list.join('');
	var status = (ATTR.main.getAttribute('class') || '').replace(/(^|\s+)open-panel-[a-z]+/i, '');
	ATTR.main.setAttribute( 'class', `${status} open-panel-${current.id.replace('#', '')}`.trim());
}

function openBookInfo() {
	var query = getURLquery();
	var found = BOOKS.find( (d) => d.id === query.bookId );
	if ( !found ) { return; }

	toggleModal(`<div class="book-info-wrapper">${getBookHTML(found)}</div>`);
}

/******************************************************************************
 == Get HTML ==
******************************************************************************/
function getBookHTML( data, ignoreLink ) {
	if ( !data || !data.id ) { return; }

	var img = data.image || { src: './image/icon/book/book.svg', alt: '-'};
	var list = ['<div class="book-wrapper">'];

	// image-holder
	list.push(`<div class="image-holder"><img src="${img.src}" alt="${img.alt}"/></div>`);

	// info-holder
	list.push('<div class="info-holder">');
	(data.info || []).forEach( (d) => {
		if ( !d ) { return; }

		if ( /(^|\s)star($|\s)/i.test(d.type) ) {

		} else if ( /(^|\s)link($|\s)/i.test(d.type) && !ignoreLink ) {
			list.push(`<div class="info-item ${d.type || 'basic'}"><a href="${d.url}" target="blank" class="link">${d.text}</a></div>`);
		} else if ( d.text !== undefined ) {
			list.push(`<div class="info-item ${d.type || 'basic'}">${d.text}</div>`)
		}

	});
	list.push('</div>');

	// end book-wrapper
	list.push('</div>');
	return list.join('');
}



