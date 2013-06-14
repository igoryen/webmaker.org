requirejs.config({
  baseUrl: '/js',
  paths: {
    'text':             '/ext/js/text',
    'jquery':           '/ext/js/jquery-1.9.1',
    'jquery.carousel':  '/ext/js/jquery.carouFredSel-6.2.1',
    'moment':           '/ext/js/moment',
    'social':           '/ext/js/socialmedia',
    'uri':              '/ext/js/uri',
    'tabzilla': 'https://www.mozilla.org/tabzilla/media/js/tabzilla',
    // XXX: window.__loginAPI gets templated in server-side in layout.html
    'sso-ux':            window.__loginAPI + '/js/sso-ux'
  },
  shim: {
    'tabzilla': ['jquery'],
    'jquery.carousel': ['jquery'],
    'sso-ux': ['jquery']
  }
});

require(['jquery','base/carousel', 'base/privacy', 'tabzilla', 'sso-ux' ],
  function ( $, carousel, privacy ) {
    "use strict";

    // set up CSRF handling
    var csrfToken = $("meta[name='X-CSRF-Token']").attr("content");
    $.ajaxSetup({
      beforeSend: function(request) {
       request.setRequestHeader("X-CSRF-Token", csrfToken);
      }
    });

    //Footer
    $("#bottom-search-btn").on("click", function (e) {
      document.getElementById("webmaker-nav").scrollIntoView();
    });
    carousel.attachToCTA();
    carousel.attachToPartners();
    privacy.attach();
});
