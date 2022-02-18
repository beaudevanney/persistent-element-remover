
let timerID;
const extId = 'PER';
const temporary = browser.runtime.id.endsWith('@temporary-addon');

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

    let store;
    try {
        store = await browser.storage.local.get('selectors');
    }catch(e){
        log('ERROR', 'access to rules storage failed');
        return;
    }

    if(typeof store === 'undefined') {
        log('ERROR', 'rules store is undefined');
    }

    if(typeof store.selectors === 'undefined') {
        log('ERROR', 'selectors are undefined');
    }

    if ( typeof store.selectors.forEach !== 'function' ) {
        log('ERROR', 'selectors not iterable');
        return;
    }

    const isSelectorValid = ((dummyElement) =>
        (selector) => {
            try { dummyElement.querySelectorAll(selector) } catch { return false }
            return true
        })(document.createDocumentFragment());


    store.selectors.forEach( (selector) => {

        // check if enabled
        if(typeof selector.enabled !== 'boolean') { return; }
        if(selector.enabled !== true) { return; }

        // check url regex
        if(typeof selector.urlregex !== 'string') { return; }
        selector.urlregex = selector.urlregex.trim();
        if(selector.urlregex === ''){ return; }

        try {
            if(!(new RegExp(selector.urlregex)).test(window.location.href)){ return; }
        } catch(e) {
            log('WARN', 'invalid url regex : ' + selectors.urlregex);
            return;
        }

        // check code
        if ( typeof selector.code !== 'string' ) { return; }
        if ( selector.code === '' ) { return; }

        const gen = (() => {
            try {
                return (new Function(selector.code));
            }catch(e){
                log('DEBUG', 'code building failed : "' + selector.code + '"');
                if(isSelectorValid(selector.code)) {
                    return function() { return document.querySelectorAll(selector.code); }
                }else {
                    log('DEBUG', 'not a valid css selector : "' + selector.code + '"');
                }
                log('ERROR', 'code not recognised as css selector or javacript function code : "' + selector.code + '"');
                return null;
            }
        })();

        if(typeof gen === 'function') {
            remove_elements(gen());
        }
    });
}

// if we have many mution events, wait until the site has settled
function delayed_onChange(){
    clearTimeout(timerID);
    timerID = setTimeout(onChange, 500); // todo: maybe there is a better way to determine if the site is settled
}

function init() {
    // start observer
    (new MutationObserver(delayed_onChange)).observe(document.body, { attributes: false, childList: true, subtree: true });
    delayed_onChange();
}

setTimeout(init, 500); // adding delays ... makes stuff better
