var ATTR = {
};

function startup() {
	ATTR.main = document.getElementById('main');
	ATTR.header = document.getElementById('header');
	ATTR.menuWrapper = document.getElementById('menu-wrapper');

	addEvent( clickDocument,  document, 'click'          );
	addEvent( changeLocation, window,   'popstate' );

	init();
}
/******************************************************************************
 == locaiton ==
******************************************************************************/
function changeLocation( e ) {
	initMenu();
}

/******************************************************************************
 == click ==
******************************************************************************/
function clickDocument( e ) {
	var handler = getClickHandler(e, [
		// {type: 'class', what: 'main-menu', action: changeSorting},
		// {type: 'class', what: 'verify-btn', action: createTableList}
	]);

	if ( !handler ) { return; }
	handler.action( e, handler.currentTarget );
}
/******************************************************************************
 == init ==
******************************************************************************/
function init() {
	initMenu();
}

function initMenu() {
	if ( !ATTR.menuWrapper || !ATTR.main ) { return; }
	var list = [];
	var query = getURLquery();
	var current = MENU.find( (d) => query[d.id] ) || MENU[0];
	MENU.forEach( (d) => {
		list.push(`<a href="${d.id}" class="menu-item${current.id === d.id ? ' -active' : ''}">${d.name}</a>`);
	});
	ATTR.menuWrapper.innerHTML = list.join('');
	var status = (ATTR.main.getAttribute('class') || '').replace(/(^|\s+)open-panel-[a-z]+/i, '');
	ATTR.main.setAttribute( 'class', `${status} open-panel-${current.id.replace('#', '')}`.trim());
}