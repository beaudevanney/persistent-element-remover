This addon can remove elements (annoyances) which are inserted dynamically after pageload

<b>Q:</b> Why do i need this when i have an Adblocker like uBlock Origin or similar.
<b>A:</b> To my knowledge, no blocker as of yet has the feature to continuously   monitor for and remove elements

<b> Usage  </b>
<ol>
<li> Visit the page you want to create a rule for
</li>
<li>write a matching url_regex for the site, for example  <i>^https:\/\/www\.<domain>\.<ext>.*</i> , replace <domain> and <ext> with fitting values.
   (can be tested via https://regex101.com/ )
</li>
<li>Next, open the "Tools" -> "Web Developer Tools" menu (shortcut: CTRL+SHIFT+I)
</li>
<li>Use the element picker  (at top left corner of the development
   tools window)  to inspect the element you want to remove
</li>
<li>Find a unique identifiert for the elements.
   => This can be difficult but in most cases it will just be a "class" name (for example "promotedlink")
      found inside the html element ("div")
      More infos about css selectors: https://en.wikipedia.org/wiki/CSS
</li>
<li>Add and save the css selector (code)  and the url regex (url_regex) as a rule to via the add-ons preference page.
</li>
<li>Open or Reload the page, and the elements should be removed
</li>
</ol>

<b>EdgeCase: </b>
<b>Q: </b> What can i do if there is no unique css identifier for the elements i want removed?
<b>A: </b> Besides using css selectors, you can also use javascript code to identify the page element. Example: '<i> "return (document.querySelectorAll("div.promotedlink"));"</i>)

<b>Notes:</b>
<ol>
    <li><b>Permissions:</b>
        This add-on tries to use the minimal number of required permissions to successfully fullfill its intended purpose.
        If you think this could be improved please let me know by opening an issue and i will try to look into it.
        More Details on the individual permission can be found here: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions
    </li>
    <li><b>Cost/Payment:</b>
        This Add-on is and forever will be subscription and payment free to use for everyone however they like.
        If you are feeling generous you can send me a tip via my bitcoin address 35WK2GqZHPutywCdbHKa9BQ52GND3Pd6h4
    </li>
    <li><b>Stars/Reviews:</b>
        If you found this add-on useful leave some stars or a review so others have an  easier time finding it.
    </li>
    <li><b>Bugs, Suggestions or Requests:</b>
        If you have any issues (for example a site it does not work but you think it should) or have improvement suggestions or a feature request please open an issue at the Support Site
    </li>
</ol>

