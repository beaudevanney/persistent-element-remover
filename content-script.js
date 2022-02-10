
(async () => {

    let timerID;
	let store;
	const extId = 'persistent-element-remover';
	//const generators = [];
	const temporary = browser.runtime.id.endsWith('@temporary-addon'); // debugging?

	const log = (level, msg) => {
		level = level.trim().toLowerCase();
		if (['error','warn'].includes(level)
			|| ( temporary && ['debug','info','log'].includes(level))
		) {
			console[level]('[' + extId + '] [' + level.toUpperCase() + '] ' + msg);
			return;
		}
	}

	const remove_elements = (els) => {
		if ( typeof els.forEach !== 'function') { return; }
		els.forEach( (el) => {
			if(typeof el.remove === 'function'){
				el.remove();
				log('DEBUG','element removed');
			}
		});
	}

	async function onChange () {
		//generators.forEach( (gen) => { remove_elements(gen()); });


	try {
		store = await browser.storage.local.get('selectors');
	}catch(e){
		log('ERROR', 'access to rules storage failed');
		return;
	}

	if ( typeof store.selectors.forEach !== 'function' ) {
		log('ERROR', 'rules selectors not iterable');
		return;
	}

	const isSelectorValid = ((dummyElement) =>
		(selector) => {
			try { dummyElement.querySelectorAll(selector) } catch { return false }
			return true
		})(document.createDocumentFragment());


	store.selectors.forEach( (selector) => {

		// check activ
		if(typeof selector.activ !== 'boolean') { return; }
		if(selector.activ !== true) { return; }

		// check url regex
		if(typeof selector.url_regex !== 'string') { return; }
		selector.url_regex = selector.url_regex.trim();
		if(selector.url_regex === ''){ return; }

        //console.log(window.location.href);
		try {
			if(!(new RegExp(selector.url_regex)).test(window.location.href)){ return; }
		} catch(e) {
			log('WARN', 'invalid url regex : ' + selectors.url_regex);
			return;
		}

		if ( typeof selector.code !== 'string' ) { return; }
		if ( selector.code === '' ) { return; }

		const gen = (() => {
			try {
				return (new Function(selector.code));
			}catch(e){
				log('debug', 'code building failed : "' + selector.code + '"');
				if(isSelectorValid(selector.code)) {
					return function() { return document.querySelectorAll(selector.code); }
				}else {
					log('debug', 'not a valid css selector : "' + selector.code + '"');
				}
				log('error', 'code not recognised as css selector or javacript function code : "' + selector.code + '"');
				return null;
			}
		})();

		if(typeof gen === 'function') {
			//remove_elements(gen()); // execute function
			//generators.push(gen); // store function
            remove_elements(gen());
		}
	});
	}

    // if we have many mution events, wait until the site has settled
    function delayed_onChange(){
        clearTimeout(timerID);
        timerID = setTimeout(onChange, 250);
    }

	//if(generators.length > 0){
		//log('INFO', 'registered mutation observer');
		(new MutationObserver(delayed_onChange)).observe(document.body, { attributes: false, childList: true, subtree: true });
        //onChange();
	//}else{
	//	log('DEBUG','no matching rules');
	//}

})();
