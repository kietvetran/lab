var ATTR = {
	map: {
		books: ['p13n-sc-uncoverable-faceout'],
		fields: ['image', 'title', 'author', '', 'type'],
	},
	table: {
		order: [
			{ field: 'row',       name: '#',       unsortable: true},
			{ field: 'price',     name: 'Price'       },
			{ field: 'stars',     name: 'Stars'        },
			{ field: 'ratings',   name: 'Ratings'},
			{ field: 'title',     name: 'Book'        }, 
			{ field: 'type',      name: 'Type'    }
		],
		sort: { field: '-', decreasing: true },
		// list: []
		// list: [{"image":"https://images-na.ssl-images-amazon.com/images/I/91ffIhmatHL._AC_UL900_SR900,600_.jpg","title":"Fixer-Upper (The Russo Sisters Book 3)","author":"Linda Seed","stars":52,"rate":4.5,"rateText":"4.5 out of 5 stars 52","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81Rw-nxoN4S._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"All Work and No Slay: A Paranormal Cozy Mystery (Witches of Devil's Orchard Book 1)","author":"Skye Sullivan","stars":587,"rate":4.3,"rateText":"4.3 out of 5 stars 587","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81otyMGl06L._AC_UL900_SR900,600_.jpg","title":"Duke Looks Like a Groomsman (The Footmen's Club Book 2)","author":"Valerie Bowman","stars":533,"rate":4.5,"rateText":"4.5 out of 5 stars 533","type":"Kindle Edition","price":0}]
		// list: [{"image":"https://images-na.ssl-images-amazon.com/images/I/91ffIhmatHL._AC_UL900_SR900,600_.jpg","title":"Fixer-Upper (The Russo Sisters Book 3)","author":"Linda Seed","stars":52,"rate":4.5,"rateText":"4.5 out of 5 stars 52","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81Rw-nxoN4S._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"All Work and No Slay: A Paranormal Cozy Mystery (Witches of Devil's Orchard Book 1)","author":"Skye Sullivan","stars":587,"rate":4.3,"rateText":"4.3 out of 5 stars 587","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81otyMGl06L._AC_UL900_SR900,600_.jpg","title":"Duke Looks Like a Groomsman (The Footmen's Club Book 2)","author":"Valerie Bowman","stars":533,"rate":4.5,"rateText":"4.5 out of 5 stars 533","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81Op4nvEPSL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"The Ice Maiden (Doug Bateman Mystery Book 1)","author":"B.D. Smith","stars":81,"rate":4.3,"rateText":"4.3 out of 5 stars 5,081","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/91yd1O1EMWL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"Becoming a Family","author":"Annie Boone","stars":271,"rate":4.5,"rateText":"4.5 out of 5 stars 271","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81kFHE9YAuL._AC_UL900_SR900,600_.jpg","title":"The Matchmaker's Secret (Make Me A Match Book 3)","author":"Kay Lyons","stars":38,"rate":4.7,"rateText":"4.7 out of 5 stars 38","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/61mMC3uu3sL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"Kings of Vengeance MC: Books 1-4","author":"Winter Travers","stars":10,"rate":4.6,"rateText":"4.6 out of 5 stars 10","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/71htGoXSuiL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"The Neighbor Renovation: A Sweet Romantic Comedy (Renovation Romance Sweet RomCom Series Book 1)","author":"Grace Worthington","stars":223,"rate":4.6,"rateText":"4.6 out of 5 stars 223","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81r2rZThz8L._AC_UL900_SR900,600_.jpg","title":"The Gift: A Sweet Small Town Romance (Montana Promises Book 2)","author":"Leeanna Morgan","stars":521,"rate":4.6,"rateText":"4.6 out of 5 stars 521","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/71yh0eM36wL._AC_UL900_SR900,600_.jpg","title":"The Roommate Risk","author":"Talia Hibbert","stars":366,"rate":4.3,"rateText":"4.3 out of 5 stars 1,366","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81hxcYtqXpL._AC_UL900_SR900,600_.jpg","title":"The Daddy Dilemma (A Hot Single Dad Romance Book 3)","author":"Angel Devlin","stars":71,"rate":4.4,"rateText":"4.4 out of 5 stars 71","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/91cYPAbLaXL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"No Second Chance for a Cowboy (Escape to Cowboy Crossing Book 3)","author":"Alexa Verde","stars":499,"rate":4.6,"rateText":"4.6 out of 5 stars 499","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81ewhXte3DL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"That's Why the Lady is a Tramp (The Unsuitable Brides Book 1)","author":"Merry Farmer","stars":432,"rate":4.3,"rateText":"4.3 out of 5 stars 432","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/91siZRGCYNL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"Wither Thorn (The Crest of Blackthorn Book 1)","author":"Joy Lewis","stars":54,"rate":4.3,"rateText":"4.3 out of 5 stars 54","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81ITWrcrvJL._AC_UL900_SR900,600_.jpg","title":"Vicious Promise: A Dark Mafia Arranged Marriage Romance (Dark Promises Book 1)","author":"M. James","stars":86,"rate":4.4,"rateText":"4.4 out of 5 stars 2,086","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81i2+oRcbjL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"The Spark of Resistance: Women Spies in WWII","author":"Kit Sergeant","stars":494,"rate":4.4,"rateText":"4.4 out of 5 stars 2,494","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81XkSB-hASL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"Grumpy Billionaire Stepdaddy: Best Friend’s Stepdad: Off-Limits Older Man Younger Woman Age-Gap Romance (Forbidden Daddy Steamy Novels Book 7)","author":"Kathilee Riley","stars":15,"rate":4.1,"rateText":"4.1 out of 5 stars 15","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/811LeNBk-7L._AC_UL900_SR900,600_.jpg","title":"Royally Complicated: (A Stand-alone Royal Forbidden Romance) (The Crowned Hearts Series Book 1)","author":"Gwyn McNamee","stars":246,"rate":4.3,"rateText":"4.3 out of 5 stars 246","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/8149+CguZXL._AC_UL900_SR900,600_.jpg","title":"The Girl from Silent Lake: A totally gripping and heart-pounding crime thriller (Detective Kay Sharp Book 1)","author":"Leslie Wolfe","stars":547,"rate":4.5,"rateText":"4.5 out of 5 stars 11,547","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/71RvIJs60RL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"Surviving Absolution: A Mafia Romance Box Set","author":"Nikki Belaire","stars":12,"rate":4.3,"rateText":"4.3 out of 5 stars 12","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81eFM-mGJiL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"A Duke Won't Do (Dueling for Dukes Book 1)","author":"Jessie Clever","stars":93,"rate":4.4,"rateText":"4.4 out of 5 stars 93","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81TWo-M8OyL._AC_UL900_SR900,600_.jpg","title":"The Prophecy: A Scottish Historical Time Travel Romance (Highland Lairds of the Crest Book 1)","author":"Kim Sakwa","stars":411,"rate":4.4,"rateText":"4.4 out of 5 stars 2,411","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/71hql7oCv0L._AC_UL900_SR900,600_.jpg","title":"The Serial Killer's Wife","author":"Robert Swartwood","stars":992,"rate":4.1,"rateText":"4.1 out of 5 stars 2,992","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81yVGseQyMS._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"Unforgettable (Vino and Veritas)","author":"Marley Valentine","stars":865,"rate":4.5,"rateText":"4.5 out of 5 stars 865","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/71MXt0P8LiL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"Joyride: (Beautiful Biker MC Romance Series)","author":"DD Prince","stars":599,"rate":4.4,"rateText":"4.4 out of 5 stars 599","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/71TuJQ5mimL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"IRL: In Real Life (After Oscar Book 1)","author":"Lucy Lennox","stars":370,"rate":4.5,"rateText":"4.5 out of 5 stars 3,370","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81qhJ64mihL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"The Sunny Side (The Model Agency Book 1)","author":"Lily  Morton","stars":191,"rate":4.7,"rateText":"4.7 out of 5 stars 2,191","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81B1M4du4eL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"The Loner (The Vers Podcast Book 1)","author":"Riley Hart","stars":126,"rate":4.5,"rateText":"4.5 out of 5 stars 2,126","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/71j705G811L._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"Rule Number One: An Opposites Attract Romantic Comedy (Door Peninsula Passions)","author":"Katherine Hastings","stars":135,"rate":4.3,"rateText":"4.3 out of 5 stars 135","type":"Kindle Edition","price":0},{"image":"https://images-na.ssl-images-amazon.com/images/I/81TgWurzQnL._UX300__PJku-sticker-v7,TopRight,0,-50_AC_UL900_SR900,600_.jpg","title":"One Spring at Tilladrum: A second-chance romance feel-good short story to cosy up with in 2023 (Primrose Island Short Novellas) (Primrose Island Novellas)","author":"Holly Wyld","stars":189,"rate":4.4,"rateText":"4.4 out of 5 stars 189","type":"Kindle Edition","price":0}]
	}
};

function startup() {
	ATTR.textarea = document.getElementById('input-textarea');
	ATTR.result = document.getElementById('tool-result');
	addEvent( clickHandler, document, 'click' );
}

function clickHandler( e ) {
	var handler = getClickHandler(e, [
		{type: 'class', what: 'sortable-item', action: changeSorting},
		{type: 'class', what: 'verify-btn', action: createTableList}
	]);

	if ( !handler ) { return; }
	handler.action( e, handler.currentTarget );
}

function createTableList() {
	if ( !ATTR.textarea || !ATTR.result ) { return; }

	var value = ATTR.textarea.value;
	if ( !value ) { return; }

	ATTR.result.innerHTML = value;
	ATTR.table.list = [];
	for (var i=0; i<ATTR.map.books.length; i++) {
		var books = ATTR.result.getElementsByClassName(ATTR.map.books[i]);
		for (var j=0; j<books.length; j++ ){
			// if ( j > 2 ) { continue; }

			var data = getDataByBookNode( books[j] );
			ATTR.table.list.push(data);
		}
	}

	crateTaleResult();	
}

function crateTaleResult() {
	if ( !ATTR.result ) { return; }

	const sort = ATTR.table.sort;
	const isNumber = /price|rate|stars/i.test( sort.field );
	const list = sortList(JSON.parse(JSON.stringify(ATTR.table.list)), sort.field, sort.decreasing, isNumber );

	ATTR.table.html = ['<ul class="result-list">'];
	ATTR.table.html.push('<li class="result-row -header">');
	for ( var j=0; j<ATTR.table.order.length; j++ ){
		var order = ATTR.table.order[j];
		ATTR.table.html.push('<div class="result-cell -'+order.field+'">');
		if ( order.unsortable ) {
			ATTR.table.html.push('<span class="unsortable-item">'+order.name+'</span>');
		} else {
			ATTR.table.html.push('<a href="#" data="'+order.field+'" class="sortable-item'+(order.field === sort.field ? (sort.decreasing ? ' -decrease' : ' -increase') : '')+'" >'+order.name+'</a>');
		}
		ATTR.table.html.push('</div>');	
	}
	ATTR.table.html.push('</li>');

	for ( var i=0; i<list.length; i++ ){
		list[i].row = i+1;
		ATTR.table.html.push('<li class="result-row">');
		for ( var j=0; j<ATTR.table.order.length; j++ ){
			var order = ATTR.table.order[j];
			var text = list[i][order.field];

			if ( order.field === 'title' && list[i].image  ) {
				text = '<div class="relative"><div class="image-thumb">'+text+'</div><div class="image-holder"><img src="'+list[i].image+'"/></div></div>';
			}

			ATTR.table.html.push('<div class="result-cell -'+order.field+'">'+text+'</div>');	
		}
		ATTR.table.html.push('</li>');
	}

	ATTR.table.html.push('</ul>');
	ATTR.result.innerHTML = ATTR.table.html.join('');
}

function changeSorting ( e, currentTarget ) {
	var target = currentTarget || (e ? e.target : null);
	if ( !target ) { return; }

	var field = target.getAttribute('data');	
	if ( !field ) { return; }

	var decreasing = true;
	if ( ATTR.table.sort.field === field ) {
		if (  ATTR.table.sort.decreasing === false ) {
			field = '-';
		} else {
			decreasing = !ATTR.table.sort.decreasing;
		}
	}

	// var decreasing = ATTR.table.sort.field === field ? !ATTR.table.sort.decreasing : true;
	ATTR.table.sort = { field: field, decreasing: decreasing};
	crateTaleResult();
}


function getDataByBookNode( node ) {
	var data = {price: 0, ratings: 0, stars: 0, type: '-', author: '-', title: '-'};
	var children = node ? node.children : [];

	for (var k=0; k<children.length; k++ ){
		var value = (children[k].textContent || '').trim();
		var field = ATTR.map.fields[k];

		if ( field === 'image' ) {
			var img = children[k].getElementsByTagName('img');
			if ( img && img[0] ) { value = img[0].getAttribute('src'); }
		} 

		if ( /\d(\s+)?stars/i.test(value) ) {
			data.ratings = parseFloat( (value.replace( /.*stars(\s)?/, '') || '0').trim().replace(',', '') );
			data.stars = parseFloat( ((value.match(/^([\d..]+)/) || [])[1] || 0) );
		} 

		if ( /\$[\d.]+/i.test(value) ) {
			data.price = parseFloat( ((value.match( /([\d.]+)/ ) || [])[1] || '0') );
		}

		if ( field ){ data[[field]] = value; }
	}

	return data;
}

/*
function _getDataByBookNode( node ) {
	var data = {};
	var children = node ? node.children : [];
	for (var k=0; k<children.length; k++ ){
		var value = (children[k].textContent || '').trim();
		var field = ATTR.map.fields[k];

		if ( field === 'image' ) {
			var img = children[k].getElementsByTagName('img');
			if ( img && img[0] ) { value = img[0].getAttribute('src'); }
		} else if ( field === 'rateText' ) {
			data.stars = parseFloat( ((value.match(/(\d+)$/) || [])[1] || 0) );
			data.rate = parseFloat( ((value.match(/^([\d.]+)/) || [])[1] || 0) );
		} else if ( field === 'price' ) {
			value = parseFloat( ((value.match( /([\d.]+)/ ) || [])[1] || '0') );
		}

		data[[field]] = value;
	}
	return data;
}
*/

