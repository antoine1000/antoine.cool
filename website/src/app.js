console.log(`It's working !`)


var stickyElements = document.getElementsByClassName('sticky');

for (var i = stickyElements.length - 1; i >= 0; i--) {
    Stickyfill.add(stickyElements[i]);
}

// import flickity module
const Flickity = require('flickity');

const rupture = require('rupture');


// var elem = document.querySelector('.main-carousel');
// var flkty = new Flickity( elem, {
//   // options
//   cellAlign: 'left',
//   contain: true
// });

//const Blazy = require('blazy');


 var bLazy = new Blazy({
        // Options
        selector: 'img',
        offset: 100
    });