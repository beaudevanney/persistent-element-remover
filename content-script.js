
async function remove_elements() {
	let res = await browser.storage.local.get('selectors');
	if ( !Array.isArray(res.selectors) ) { return; }
	res.selectors.forEach( (selector) => {
		if(typeof selector.url_regex !== 'string') { return; }
		if (selector.url_regex.trim() === ''){ return; }
		let re = new RegExp(selector.url_regex, 'g');
		let current_url = window.location.href;
		if(re.test(current_url)){
			//console.log('current url matches regex', selector.url_regex, current_url);
			if ( typeof selector.selectors !== 'string' ) { return; }
			selector.selectors.split("\n").forEach( (sel) => {
				if (typeof sel !== 'string') { return; }
				if(sel.trim() === '') { return;	}
				document.querySelectorAll(sel).forEach ( (el) => {
					if(typeof el.remove === 'function'){
						//console.log('removed element', sel);
						el.remove();
					}
				});

			});
		}
	});
}

// run on first page load
remove_elements();

// run each time the document changes (e.g. when posts are dynamically added on scroll down)
var observer = new MutationObserver(remove_elements);
observer.observe(document, { attributes: false, childList: true, subtree: true }); 
