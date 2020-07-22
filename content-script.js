
(async function() {

	const generators = [];
	// save url on page load
	const current_url = window.location.href;

	async function remove() {
		generators.forEach( (generator) => {
			generator().forEach( (el) => {
				if(typeof el.remove === 'function'){
					el.remove();
					console.log('removed element');
				}
			});
		});
	}

	// get rules from storage
	const res = await browser.storage.local.get('selectors');
	if ( !Array.isArray(res.selectors) ) { return; }

	res.selectors.forEach( (selector) => {

		// check activ state of rule
		if(typeof selector.activ !== 'boolean') { return; } 
		if(selector.activ !== true) { return; }

		// check url regex 
		if(typeof selector.url_regex !== 'string') { return; }
		if(selector.url_regex === ''){ return; }

		const re = new RegExp(selector.url_regex, 'g');

		if(re.test(current_url)){

			if ( typeof selector.code !== 'string' ) { return; }
			if ( selector.code === '' ) { return; }

			try {
				// eval exception are handled 
				gen = eval('(function(){' + selector.code + '}());')
			
				// save generator to rerun when something changes
				generators.push(gen)
			}catch(e){
				console.error('error in generator code, skipping: ', selector.code);
			}

		}
	});

	// only do something when it is necessary
	if( generators.length > 0) {
		console.log('registered persistend-element-remover');
		remove();
		(new MutationObserver(remove)).observe(document.body, { attributes: false, childList: true, subtree: true }); 
	}
})();
