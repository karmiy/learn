jQuery('#foo');
jQuery(function() {});
const settings: jQuery.AjaxSettings = {
    method: 'POST',
    data: {
        name: 'foo'
    }
};
jQuery.ajax('/api/getUser', settings);
console.log(jQuery.version);
new jQuery.Event();
jQuery.fn.extend({
    check() {},
});

/* import foo, { name, getName, Animal, Direct, Option, bar } from '../utils/foo';

console.log(name);
getName();
const animal = new Animal('q');
const directions = [Direct.Up, Direct.Down, Direct.Left, Direct.Right];
const option: Option = {
    data: {
        id: 1,
        name: 'k',
    }
}
bar.baz();
foo.init(); */

// const foo = require('../utils/foo');
// const bar = require('../utils/foo').bar;

// import * as foo from '../utils/foo';
// import { bar } from '../utils/foo';

// import foo = require('../utils/foo')
// import bar = foo.bar;

// import foo from '../utils/foo';
// foo.bar;
// import foo from '../utils/foo';



import foo from '../utils/foo';
// foo.bar;

['foo'].prepend()