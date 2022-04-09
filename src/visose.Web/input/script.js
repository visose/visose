'use strict';

(() => {
    const docStyle = document.documentElement.style;
    docStyle.visibility = 'hidden';
    window.addEventListener('DOMContentLoaded', e => {
        docStyle.visibility = 'visible';
    });
})();