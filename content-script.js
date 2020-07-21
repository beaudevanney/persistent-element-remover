
// save url on page load
const current_url = window.location.href;

async function remove() {

	try { 
		const res = await browser.storage.local.get('selectors');

		if ( !Array.isArray(res.selectors) ) { throw 'selectors is not an array'; }

		res.selectors.forEach( (selector) => {
			if(typeof selector.url_regex !== 'string') { return; }
			if (selector.url_regex.trim() === ''){ return; }

			let re = new RegExp(selector.url_regex, 'g');
			if(re.test(current_url)){
				if ( typeof selector.code !== 'string' ) { return; }
				if ( selector.code.trim() === '' ) { return; }

				/* // old stuff
				selector.selectors.split("\n").forEach( (sel) => {
					if (typeof sel !== 'string') { return; }
					if(sel.trim() === '') { return;	}
					document.querySelectorAll(sel).forEach ( (el) => {
						if(typeof el.remove === 'function'){
							el.remove();
							console.log('removed element', current_url , sel);
						}
					});
				});
				*/

				console.log(selector.code);
				// new stuff
				try {
					els = window.eval('(function(){ ' + selector.code + ' })()');
					els.forEach( (el) => {
						if(typeof el.remove === 'function'){
							el.remove();
							console.log('removed element', current_url);
						}
					});
				}catch(e){
					console.error(e, selector.code);
				}
				//

			}
		});
	}catch(e) {
		console.error(e);
	}
}

// run on first page load
remove();

// run each time the document changes (e.g. when posts are dynamically added on scroll down)
(new MutationObserver(remove)).observe(document.body, { attributes: false, childList: true, subtree: true }); 

