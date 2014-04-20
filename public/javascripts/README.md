
# required.js

`*.required.js` files are generated using browserify and contain modules from
npmjs.org that have been packaged for the browser. Modules that are bundled in
to a `*.required.js` can be `require`d in browser JavaScript. As a convention,
do something like this: the vote.required.js file would be for the
vote.html.dust template.

## For Example

After packages are bundled into some-view.required.js and loaded in the browser with a
<script> tag, you can do

```
var foo = require("package-name");
```

to require that module for use in the browser.

Lookup "browserify" for more info.
