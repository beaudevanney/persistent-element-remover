

(async function() {

	function log(level, msg) { 
		console[level](msg); 
	}

	function remove() {
		log('debug','remove()');
		generators.forEach( (gen) => {
			gen().forEach( (el) => { 
				if(typeof el.remove === 'function'){
					el.remove();
					log('debug','el.remove()');
				}
			});
		});
	}

	const extId = 'persistent-element-remover';

	const generators = [];

	const current_url = window.location.href;

	const res = await browser.storage.local.get('selectors');

	if ( !Array.isArray(res.selectors) ) { return; }

	res.selectors.forEach( (selector) => {

		// check activ state of rule
		if(typeof selector.activ !== 'boolean') { return; }
		if(selector.activ !== true) { return; }

		// check url regex 
		if(typeof selector.url_regex !== 'string') { return; }
		if(selector.url_regex === ''){ return; }

		let re = new RegExp(selector.url_regex, 'g');

		if(re.test(current_url)){

			if ( typeof selector.code !== 'string' ) { return; }
			if ( selector.code === '' ) { return; }

			try {
				let generator = new Function(selector.code);
				generators.push(generator);

			}catch(e){
				log('error', selector.code);
			}
		}
	});

	if(generators.length > 0){
		remove();
		log('debug', 'registered MutationObserver');
		(new MutationObserver(remove)).observe(document.body, { attributes: false, childList: true, subtree: true }); 
	}else{
		log('debug','no matching rules');
	}

}());
