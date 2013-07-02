module.exports = function( make ) {
  return function( req, res ) {
    var type = req.param( "type" ) || "tags",
    query = req.param( "q" ) || "webmaker:featured",
    makeSize = req.param( "size" ),
    sortByField = req.param( "sortByField" ) || "createdAt",
    sortByOrder = req.param( "order" ) || "desc",
    page = req.param( "page" ) || 1,
    username = req.session.username,
    options = {};

    if ( type === 'tags' ) {
      var tags = query.substring(0,511).split(',');
      options.tags = [];
      if( tags.length === 1 ) { // try splitting with spaces, too
        tags = query.split(' ');
      }
      for (var i = 0, l = tags.length; i < l; i ++) {
        var tag = tags[i];
        // check for hashtag, remove
        if ( tag.charAt(0) === '#' ) {
          tag = tag.slice(1);
        }
        options.tags.push(tag);
      }
    }
    else {
      // check for '@', remove
      if ( query.charAt(0) === '@' ) {
        query = query.slice(1);
      }
      options[ type ] = query;
    }

    make.find( options )
    .limit( 12 )
    .sortByField( sortByField, sortByOrder )
    .page( page )
    .process( function( err, data ) {
      // query can be an array of tags sometimes,
      // so force a string so that it's autoescaped
      var query = options[type].toString();

      res.render( "search.html", {
        currentUser: username,
        hasQuery: req.param( "q" ),
        makes: data || [],
        makeSize: makeSize,
        page: "search",
        pagination: page,
        query: query,
        searchType: type
      });
    });
  };
};
