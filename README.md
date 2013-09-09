# connect-preprocessor

A preprocessor middleware for [Connect](http://www.senchalabs.org/connect/)
that dynamically compiles files for development.

## Usage

`preprocessor(compiler, options, compilerOpts)`

#### compiler

A string name of a built-in compiler or a module that has the necessary exports
[as defined below](#compilers). **Required**.

#### options

A hash of options:

- **src** -
The directory base from which the preprocessor will find and compile source
files. Defaults to `./`.

- **opts** -
Specifies additional options to pass on to the compiler. Can be defined in the
options hash or passed as the third argument to the `preprocessor`. Defaults to
`{}`.

- **pattern** -
The regex pattern used to determine whether the compiler should handle the
request. Defaults to `/\<options.compExt>$/`.

- **ext** -
The extension of the source files. Defaults to the `ext` export of the
compiler.

- **compExt** -
The extension of the compiled files. Defaults to the `compExt` export of the
compiler.

- **mime** -
The mime type to send in the `content-type` header of the response. Will
automatically be set for any built-in compilers.

- **index** -
Specifies the default file to use as the directory index. Set to `false` to
disable the feature entirely. Defaults to `index.html`.

#### compilerOpts
Any additional options to pass on to the compiler.

### Example

``` js
var app = require('connect')();
var preprocessor = require('connect-preprocessor');

app.use(preprocessor('jade', { src: 'pages' }));
app.use('/templates', preprocessor('jade', { src: 'templates' }, { client: true }));
app.use('/scripts', preprocessor('coffee', { src: 'scripts' }));

app.listen(3000);
```

## Compilers

- [Jade](http://jade-lang.com/) -
Specified as `jade`.

- [CoffeeScript](http://coffeescript.org/) -
Specified as `coffee`.

- [Less](http://lesscss.org/) -
Specified as `less`.

### Compiler exports

If the compiler you need does not exist, feel free to make a pull request.
Alternatively, you can require a module in the first argument of the
preprocessor:

``` js
var compiler = require('my-compiler');
app.use(preprocessor(compiler));
```

This module **must** export these methods:

- **compile (text, compilerOpts, callback)** -
A function that compiles the string of text. Any errors should be passed to the
first argument of the callback; a successfully compiled string should be sent
as the second argument to the callback: `callback(err, compiled)`.

- **ext (compilerOpts)** -
A string (or function that returns a string) specifying the extension of the
source files.

- **compExt (compilerOpts)** -
A string (or function that returns a string) specifying the extension of the
compiled files.

An example can be seen [here](lib/compilers/jade.js).
