
(async function() {

	function log(level, msg) { 
		if (['debug','info','log','error'].includes(level)){
			console[level]('PER::' + level + '::' + msg); 
		}else{
			log('error','invalued argument for log()');
		}
	}

	function remove_elements(els) {
		if ( !Array.isArray(els) ) { return; }
		els.forEach( (el) => { 
			if(typeof el.remove === 'function'){
				el.remove();
				log('debug','el.remove()');
			}
		});
	}

	function remove() {
		generators.forEach( (gen) => {
			try {
				remove_elements(gen());
			}catch(e){
				log('error', 'code execution');
			}
		});
	}

	const extId = 'PER';

	const generators = [];

	const current_url = window.location.href;

	try { 
		const res = await browser.storage.local.get('selectors');

		if ( !Array.isArray(res.selectors) ) { return; }

		res.selectors.forEach( (selector) => {

			// check activ state of rule
			if(typeof selector.activ !== 'boolean') { return; }
			if(selector.activ !== true) { return; }

			// check url regex 
			if(typeof selector.url_regex !== 'string') { return; }
			if(selector.url_regex === ''){ return; }

			// 
			try { 
				let re = new RegExp(selector.url_regex, 'g');
				if(re.test(current_url)){

					if ( typeof selector.code !== 'string' ) { return; }
					if ( selector.code === '' ) { return; }

					try {
						let generator = new Function(selector.code);
						generators.push(generator);
					}catch(e){
						log('error', 'Code error:' + selectors.code);
					}
				}
			} catch(e) {
				log('error', 'regex error: ' + selectors.url_regex);
			}
		});

		if(generators.length > 0){
			remove();
			log('debug', 'registered MutationObserver');
			(new MutationObserver(remove)).observe(document.body, { attributes: false, childList: true, subtree: true }); 
		}else{
			log('debug','no matching rules');
		}

	}catch(e){
		log('error', 'storage access failed');
	}

}());
