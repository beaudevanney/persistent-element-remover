
function deleteRow(rowTr) {
	var mainTableBody = document.getElementById('mainTableBody');
	mainTableBody.removeChild(rowTr);
}

function createTableRow(feed) {
	var mainTableBody = document.getElementById('mainTableBody');
	var tr = mainTableBody.insertRow();

	Object.keys(feed).sort().forEach( (key) => {

		if( key === 'code'){
			var input = document.createElement('textarea');
			input.className = key;
			input.placeholder = key;
			input.style.width = '100%';
			input.value = feed[key];
			tr.insertCell().appendChild(input);
		}else
			if( key !== 'action'){
				var input = document.createElement('input');
				input.className = key;
				input.placeholder = key;
				input.style.width = '100%';
				input.value = feed[key];
				tr.insertCell().appendChild(input);
			}
	});

	var button;
	if(feed.action === 'save'){
		button = createButton("Save", "saveButton", function() {}, true );
	}else{
		button = createButton("Delete", "deleteButton", function() { deleteRow(tr); }, false );
	}
	tr.insertCell().appendChild(button);
}

async function saveConfig(config) {
	await browser.storage.local.set(config);
}

function collectConfig() {
	// collect configuration from DOM
	var mainTableBody = document.getElementById('mainTableBody');
	var feeds = [];
	for (var row = 0; row < mainTableBody.rows.length; row++) { 
		try {
			var url_regex = mainTableBody.rows[row].querySelector('.url_regex').value.trim();
			var ses = mainTableBody.rows[row].querySelector('.code').value.trim();
			if(url_regex !== '' && ses !== '') {
				feeds.push({
					'url_regex': url_regex,
					'code': ses
				});
			}
		}catch(e){
			console.error(e);
		}
	}
	return feeds;
}

function createButton(text, id, callback, submit) {
	var span = document.createElement('span');
	var button = document.createElement('button');
	button.id = id;
	button.textContent = text;
	button.className = "browser-style";
	if (submit) {
		button.type = "submit";
	} else {
		button.type = "button";
	}
	button.name = id;
	button.value = id;
	button.addEventListener("click", callback);
	span.appendChild(button);
	return span;
}

async function saveOptions(e) {
	var feeds = collectConfig();
	await browser.storage.local.set({ 'selectors': feeds });
}

async function restoreOptions() {
	var mainTableBody = document.getElementById('mainTableBody');
	createTableRow({
		'code': '' ,
		'url_regex': '',
		'action':'save'
	});
	var res = await browser.storage.local.get('selectors');
	res.selectors.forEach( (selector) => {
		selector.action = 'delete'
		createTableRow(selector);
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

