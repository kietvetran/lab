var BOOKS = [
	{
		id: 'n1',
		image: { src: './image/book/test-book-1.png', alt: 'Lorem ipusum'},
		info: [
			{type: 'name', text: 'Lorem ipsum',},
			{type: 'description', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus porta mauris, quis aliquet nunc fermentum nec.',},
			{type: 'price', text: '$12',},
			{type: 'star', number: 4, rate: 12348 },
			{type: 'link', text: 'Amazone.com', url: 'https://www.amazon.com/Iron-Flame-Empyrean-Rebecca-Yarros/dp/1649374178/ref=zg_sccl_2/133-0985715-9192421?pd_rd_w=CSRTo&content-id=amzn1.sym.193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_p=193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_r=BJQJHWAMCW1ZA1VE583K&pd_rd_wg=SaBN1&pd_rd_r=2462dac4-24ef-433a-ab3d-0f5225333823&pd_rd_i=1649374178&psc=1'},
		],
	/*
	}, {
		id: 'n2',
		image: { src: './image/book/test-book-2.png', alt: 'Lorem ipusum'},
		info: [
			{type: 'name', text: 'I Love You to the Moon and Back',},
			{type: 'description', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus porta mauris, quis aliquet nunc fermentum nec.',},
			{type: 'price', text: '$12',},
			{type: 'star', number: 4, rate: 12348 },			
			{type: 'link', text: 'Amazone.com', url: 'https://www.amazon.com/Iron-Flame-Empyrean-Rebecca-Yarros/dp/1649374178/ref=zg_sccl_2/133-0985715-9192421?pd_rd_w=CSRTo&content-id=amzn1.sym.193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_p=193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_r=BJQJHWAMCW1ZA1VE583K&pd_rd_wg=SaBN1&pd_rd_r=2462dac4-24ef-433a-ab3d-0f5225333823&pd_rd_i=1649374178&psc=1'},
		],
	/*
	}, {
		id: 'n3',
		image: { src: './image/book/test-book-3.png', alt: 'Lorem ipusum'},
		info: [
			{type: 'name', text: 'I Love You to the good tagging Back, Lorem ipsum once erecwe',},
			{type: 'description', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus porta mauris, quis aliquet nunc fermentum nec.',},
			{type: 'price', text: '$12',},
			{type: 'star', number: 4, rate: 12348 },			
			{type: 'link', text: 'Amazone.com', url: 'https://www.amazon.com/Iron-Flame-Empyrean-Rebecca-Yarros/dp/1649374178/ref=zg_sccl_2/133-0985715-9192421?pd_rd_w=CSRTo&content-id=amzn1.sym.193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_p=193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_r=BJQJHWAMCW1ZA1VE583K&pd_rd_wg=SaBN1&pd_rd_r=2462dac4-24ef-433a-ab3d-0f5225333823&pd_rd_i=1649374178&psc=1'},
		],
	}, {
		id: 'n4',
		image: { src: './image/book/test-book-4.png', alt: 'Lorem ipusum'},
		info: [
			{type: 'name', text: 'I Love You to the Moon and Back',},
			{type: 'description', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus porta mauris, quis aliquet nunc fermentum nec.',},
			{type: 'price', text: '$12',},
			{type: 'star', number: 4, rate: 12348 },			
			{type: 'link', text: 'Amazone.com', url: 'https://www.amazon.com/Iron-Flame-Empyrean-Rebecca-Yarros/dp/1649374178/ref=zg_sccl_2/133-0985715-9192421?pd_rd_w=CSRTo&content-id=amzn1.sym.193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_p=193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_r=BJQJHWAMCW1ZA1VE583K&pd_rd_wg=SaBN1&pd_rd_r=2462dac4-24ef-433a-ab3d-0f5225333823&pd_rd_i=1649374178&psc=1'},
		],
	}, {
		id: 'n5',
		image: { src: './image/book/test-book-5.png', alt: 'Lorem ipusum'},
		info: [
			{type: 'name', text: 'I Love You to the Moon and Back',},
			{type: 'description', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus porta mauris, quis aliquet nunc fermentum nec.',},
			{type: 'price', text: '$12',},
			{type: 'star', number: 4, rate: 12348 },			
			{type: 'link', text: 'Amazone.com', url: 'https://www.amazon.com/Iron-Flame-Empyrean-Rebecca-Yarros/dp/1649374178/ref=zg_sccl_2/133-0985715-9192421?pd_rd_w=CSRTo&content-id=amzn1.sym.193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_p=193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_r=BJQJHWAMCW1ZA1VE583K&pd_rd_wg=SaBN1&pd_rd_r=2462dac4-24ef-433a-ab3d-0f5225333823&pd_rd_i=1649374178&psc=1'},
		],
	}, {
		id: 'n6',
		image: { src: './image/book/test-book-6.png', alt: 'Lorem ipusum'},
		info: [
			{type: 'name', text: 'I Love You to the Moon and Back',},
			{type: 'description', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus porta mauris, quis aliquet nunc fermentum nec.',},
			{type: 'price', text: '$12',},
			{type: 'star', number: 4, rate: 12348 },			
			{type: 'link', text: 'Amazone.com', url: 'https://www.amazon.com/Iron-Flame-Empyrean-Rebecca-Yarros/dp/1649374178/ref=zg_sccl_2/133-0985715-9192421?pd_rd_w=CSRTo&content-id=amzn1.sym.193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_p=193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_r=BJQJHWAMCW1ZA1VE583K&pd_rd_wg=SaBN1&pd_rd_r=2462dac4-24ef-433a-ab3d-0f5225333823&pd_rd_i=1649374178&psc=1'},
		],	
	}, {
		id: 'n7',
		image: { src: './image/book/test-book-7.png', alt: 'Lorem ipusum'},
		info: [
			{type: 'name', text: 'I Love You to the Moon and Back',},
			{type: 'description', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus porta mauris, quis aliquet nunc fermentum nec.',},
			{type: 'price', text: '$12',},
			{type: 'star', number: 4, rate: 12348 },			
			{type: 'link', text: 'Amazone.com', url: 'https://www.amazon.com/Iron-Flame-Empyrean-Rebecca-Yarros/dp/1649374178/ref=zg_sccl_2/133-0985715-9192421?pd_rd_w=CSRTo&content-id=amzn1.sym.193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_p=193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_r=BJQJHWAMCW1ZA1VE583K&pd_rd_wg=SaBN1&pd_rd_r=2462dac4-24ef-433a-ab3d-0f5225333823&pd_rd_i=1649374178&psc=1'},
		],
	}, {
		id: 'n8',
		image: { src: './image/book/test-book-8.png', alt: 'Lorem ipusum'},
		info: [
			{type: 'name', text: 'I Love You to the Moon and Back',},
			{type: 'description', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus porta mauris, quis aliquet nunc fermentum nec.',},
			{type: 'price', text: '$12',},
			{type: 'star', number: 4, rate: 12348 },			
			{type: 'link', text: 'Amazone.com', url: 'https://www.amazon.com/Iron-Flame-Empyrean-Rebecca-Yarros/dp/1649374178/ref=zg_sccl_2/133-0985715-9192421?pd_rd_w=CSRTo&content-id=amzn1.sym.193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_p=193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_r=BJQJHWAMCW1ZA1VE583K&pd_rd_wg=SaBN1&pd_rd_r=2462dac4-24ef-433a-ab3d-0f5225333823&pd_rd_i=1649374178&psc=1'},
		],
	}, {
		id: 'n9',
		image: { src: './image/book/test-book-9.png', alt: 'Lorem ipusum'},
		info: [
			{type: 'name', text: 'I Love You to the Moon and Back',},
			{type: 'description', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus porta mauris, quis aliquet nunc fermentum nec.',},
			{type: 'price', text: '$12',},
			{type: 'star', number: 4, rate: 12348 },			
			{type: 'link', text: 'Amazone.com', url: 'https://www.amazon.com/Iron-Flame-Empyrean-Rebecca-Yarros/dp/1649374178/ref=zg_sccl_2/133-0985715-9192421?pd_rd_w=CSRTo&content-id=amzn1.sym.193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_p=193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_r=BJQJHWAMCW1ZA1VE583K&pd_rd_wg=SaBN1&pd_rd_r=2462dac4-24ef-433a-ab3d-0f5225333823&pd_rd_i=1649374178&psc=1'},
		],
	}, {
		id: 'n10',
		image: { src: './image/book/test-book-10.png', alt: 'Lorem ipusum'},
		info: [
			{type: 'name', text: 'I Love You to the Moon and Back',},
			{type: 'description', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus porta mauris, quis aliquet nunc fermentum nec.',},
			{type: 'price', text: '$12',},
			{type: 'star', number: 4, rate: 12348 },			
			{type: 'link', text: 'Amazone.com', url: 'https://www.amazon.com/Iron-Flame-Empyrean-Rebecca-Yarros/dp/1649374178/ref=zg_sccl_2/133-0985715-9192421?pd_rd_w=CSRTo&content-id=amzn1.sym.193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_p=193afb92-0c19-4833-86f8-850b5ba40291&pf_rd_r=BJQJHWAMCW1ZA1VE583K&pd_rd_wg=SaBN1&pd_rd_r=2462dac4-24ef-433a-ab3d-0f5225333823&pd_rd_i=1649374178&psc=1'},
		],
	// */
	}
];