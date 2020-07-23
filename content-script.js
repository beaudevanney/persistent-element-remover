
(async () => {

	const extId = 'PER';
	const generators = [];
	const current_url = window.location.href;

	const log = (level, msg) => { 
		if (['debug', 'info','log','error','warn'].includes(level)){
			console[level](extId + '::' + level + '::' + msg); 
		}else{
			log('error', extId + 'invalued level argument "' + level + '" for function log(level,msg)');
		}
	}

	const remove_elements = (els) => {
		if ( typeof els.forEach !== 'function') { return; }
		els.forEach( (el) => { 
			if(typeof el.remove === 'function'){
				el.remove();
				log('debug','element removed');
			}else{
				log('debug','element not removed (missing remove() function)');
			}
		});
	}

	const onChange = () => {
		log('debug','onChange()'+ generators.length);
		if ( typeof generators.forEach !== 'function') { return; }
		generators.forEach( (gen) => { remove_elements(gen()); });
	}


	try {
		const store = await browser.storage.local.get('selectors');

		if ( typeof store.selectors.forEach !== 'function' ) { throw 'selectors has no forEach'; }

		store.selectors.forEach( (selector) => {

			// check activ
			if(typeof selector.activ !== 'boolean') { return; }
			if(selector.activ !== true) { return; }

			// check url regex 
			if(typeof selector.url_regex !== 'string') { return; }
			if(selector.url_regex === ''){ return; }

			try { 
				const re = new RegExp(selector.url_regex, 'g');
				if(!re.test(current_url)){ return; }
			} catch(e) {
				log('warn', 'invalid url regex : ' + selectors.url_regex);
				return;
			}

			if ( typeof selector.code !== 'string' ) { return; }
			if ( selector.code === '' ) { return; }

			try {
				const gen = new Function(selector.code); // build function
				remove_elements(gen()); // execute function
				generators.push(gen); // store function 
			}catch(e){
				log('warn', 'code execution failed :' + selectors.code);
			}
		});

		if(generators.length > 0){
			log('info', 'registered mutation observer');
			(new MutationObserver(onChange)).observe(document.body, { attributes: false, childList: true, subtree: true }); 
		}else{
			log('debug','no matching rules');
		}

	}catch(e){
		log('error', 'access to local storage failed');
		return;
	}

})();
