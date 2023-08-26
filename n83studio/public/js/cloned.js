var ATTR = {
};

function startup() {
	ATTR.query = getURLquery( undefined, {sharp: MENU[0].id});
	ATTR.app = document.getElementById('app');
	ATTR.main = document.getElementById('main');
	ATTR.header = document.getElementById('header');
	ATTR.menuWrapper = document.getElementById('menu-wrapper');
	ATTR.booksWrapper = document.getElementById('books-wrapper');
	ATTR.blogWrapper = document.getElementById('blog-wrapper');
	ATTR.modalWrapper = document.getElementById('modal-wrapper');

	addEvent( clickDocument,  document, 'click'    );
	addEvent( changeLocation, window,   'popstate' );

	init();
}
/******************************************************************************
 == locaiton ==
******************************************************************************/
function changeLocation( e ) {
	ATTR.query = getURLquery( undefined, {sharp: MENU[0].id});
	initMenu();
	openBookInfo();
	scrollBodyTop();
}

/******************************************************************************
 == click ==
******************************************************************************/
function clickDocument( e ) {
	var handler = getClickHandler(e, [
		// {type: 'class', what: 'main-menu', action: changeSorting},
		// {type: 'class', what: 'verify-btn', action: createTableList},
		{type: 'class', what: 'carousel-bullet-btn', action: changeCarouselViewIndex},
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
	window.location.href = window.location.href.replace( /(\?|&)modal[\w]+=[\w]+(&|$)/g, '' );
	toggleModal(''); 
}

function changeCarouselViewIndex( e, currentTarget ) {
	if ( !currentTarget ) { currentTarget = e.currentTarget; }
	var index = parseInt(`${currentTarget.getAttribute('data-index') || 0}`, 10);
	var wrapper = document.getElementById( currentTarget.getAttribute('data-wrapper') );
	var slider = document.getElementById( currentTarget.getAttribute('data-slider') );

	if ( !wrapper || !slider ) { return; }

	var width = slider.children.length ? slider.children[0].clientWidth : (wrapper.clientWidth || 0);

	slider.scrollLeft = width * index;
	var style = wrapper.getAttribute('class').replace(/-index-\d+/i, `-index-${index}`);
	wrapper.setAttribute( 'class', style );
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
	if ( list.length === 1 ) {
		var books = list.map( (d) => {
			return getBookHTML(d);
		});
		ATTR.booksWrapper.innerHTML = `<div class="book-info-wrapper -count-${list.length}">${books.join('')}</div>`;
	} else if ( list.length > 1 && list.length < 50 ){
		var books = list.map( (d, i) => {
			// return `<div style="height: 100px">#${i}</div>`;
			return `<div class="book-info-wrapper">${getBookHTML(d)}</div>`;
		});
		var id = generateId('carousel');
		ATTR.booksWrapper.innerHTML = getCarouselHTML(books, id );
		bindCarousel( id );
	} else {
		var books = list.map( (d) => {
			return `<a href="${ATTR.query.sharp}?modalBookId=${d.id}" class="book-link-wrapper">${getBookHTML(d, true)}</a>`;
		});
		ATTR.booksWrapper.innerHTML = `<div class="book-thumb-wrapper">${books.join('')}</div>`;
	}
}

function initMenu() {
	if ( !ATTR.menuWrapper || !ATTR.main ) { return; }
	var list = [];
	var current = MENU.find( (d) => d.id === ATTR.query.sharp ) || MENU[0];
	MENU.forEach( (d) => {
		list.push(`<a href="${d.id}" class="menu-item${current.id === d.id ? ' -active' : ''}">${d.name}</a>`);
	});
	ATTR.menuWrapper.innerHTML = list.join('');
	var status = (ATTR.main.getAttribute('class') || '').replace(/(^|\s+)open-panel-[a-z]+/i, '');
	ATTR.main.setAttribute( 'class', `${status} open-panel-${current.id.replace('#', '')}`.trim());
}

function openBookInfo() {
	var found = BOOKS.find( (d) => d.id === ATTR.query.modalBookId );
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
	list.push('<div class="info-holder"><div class="info-content">');
	(data.info || []).forEach( (d) => {
		if ( !d ) { return; }

		if ( /(^|\s)star($|\s)/i.test(d.type) ) {

		} else if ( /(^|\s)category($|\s)/i.test(d.type) && !ignoreLink ) {

		} else if ( /(^|\s)link($|\s)/i.test(d.type) && !ignoreLink ) {
			list.push(`<div class="info-item ${d.type || 'basic'}">`);
			list.push(`<a href="${d.url}" target="blank" class="link">${d.text}</a>`); 
			list.push('</div>');
		} else if ( d.text !== undefined ) {
			list.push(`<div class="info-item ${d.type || 'basic'}">${d.text}</div>`)
		}

	});
	list.push('</div></div>');

	// end book-wrapper
	list.push('</div>');
	return list.join('');
}

/******************************************************************************
 == carousel ==
******************************************************************************/
function getCarouselHTML( html, id ) {
	var list = (html instanceof Array ? html : [html]).filter( (d) => !!d );
	if ( !id || list.length === 0 ) { return ''; }

	return [
		`<div id="${id}-wrapper" class="carousel-wrapper -display-index-${0}">`,
			'<div class="carousel-content">',
				`<ul class="gallery" id=${id} role="slider">`,
					list.map( (t) => `<li role="presentation">${t}</li>` ).join(''),
				'</ul>',
			'</div>',
			'<div class="carousel-tool">',
				'<div class="bullet-holder">',
					list.map( (t,i) => `<a href="#" role="button" data-index="${i}" data-slider="${id}" data-wrapper="${id}-wrapper" class="carousel-bullet-btn icon-btn -index-${i}">Carousel index ${i}</a>` ).join(''),
				'</div>',
			'</div>',
		'</div>',
	].join('');
}

function bindCarousel( id ) {
	if ( !id ) { return; }

	var state = { 
		wrapper: document.getElementById(`${id}-wrapper`),
		slider: document.getElementById(id),
		storage: {
	        isDown: false,
	        startX: 0,
	        moved: 0,
	        scrollLeft: 0,
	        speed: 3,
	    }
	};

    if ( !state.slider || !state.wrapper ){ return; }

	const touchEnd = () => {
	    if ( !state.storage || !state.storage.isDown ){ return; }
	    if ( !state.slider ){ return; }
	    state.storage.isDown = false;

		var width = state.slider.children.length ? 
			state.slider.children[0].clientWidth : (state.wrapper.clientWidth || 0);
   		var index = parseInt( `${(state.slider.scrollLeft + 10) / width}`, 10 );
   		var moved = Math.abs(state.storage.moved);
   		if ( isNaN(moved) || moved < 20 ) { return; }

   		var next = index + (state.storage.moved > 0 ? -1 : 1);
   		if ( next < 0 || next >= state.slider.children.length ){ return; }

		state.slider.scrollLeft = width * next;
		var style = state.wrapper.getAttribute('class').replace(/-index-\d+/i, `-index-${next}`);
		state.wrapper.setAttribute( 'class', style );
	};

	const touchStart = ( e ) => {
	    if ( !state.storage || state.storage.isDown ){ return; }
	    if ( !state.slider ){ return; }

	    state.storage.isDown = true;
	    state.storage.startX = e.pageX;
	    state.storage.moved  = 0;
	};

	const touchMove = ( e ) => {
	    if ( !state.storage || !state.storage.isDown ){ return; }
	    if ( !state.slider ){ return; }

	    e.preventDefault();
	    state.storage.moved = e.pageX - state.storage.startX;
	};


    /*
	const touchEnd = () => {
	    if ( !state.storage || !state.storage.isDown ){ return; }
	    if ( !state.slider ){ return; }
	    state.storage.isDown = false;
	    state.slider.classList.remove('active');

	   	setTimeout(function() {
	   		var width = state.wrapper.clientWidth;
	   		var index = parseInt( `${(state.slider.scrollLeft + 10) / width}`, 10 );
   			var style = state.wrapper.getAttribute('class').replace(/-index-\d+/i, `-index-${index}`);
			state.wrapper.setAttribute( 'class', style );
	   	}, 50);
	};

	const touchStart = ( e ) => {
	    if ( !state.storage || state.storage.isDown ){ return; }
	    if ( !state.slider ){ return; }

	    state.storage.isDown = true;
	    state.storage.startX = e.pageX - state.slider.offsetLeft;
	    state.storage.scrollLeft = state.slider.scrollLeft;
	    state.slider.classList.add('active');
	};

	const touchMove = ( e ) => {
	    if ( !state.storage || !state.storage.isDown ){ return; }
	    if ( !state.slider ){ return; }

	    e.preventDefault();
	    const x = e.pageX - state.slider.offsetLeft;
	    const walk = (x - state.storage.startX) * state.storage.speed;
	    state.slider.scrollLeft = state.storage.scrollLeft - walk;
	};
	*/

	addEvent( touchEnd,   state.slider, 'touchend'   );
	addEvent( touchStart, state.slider, 'touchstart' );
	addEvent( touchMove,  state.slider, 'mousemove'  );
	addEvent( touchEnd,   state.slider, 'mouseup'    );
	addEvent( touchEnd,   state.slider, 'mouseleave' );
	addEvent( touchStart, state.slider, 'mousedown'  );
}



