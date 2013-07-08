module.exports = function( make ) {
  return function( req, res ) {
    var DEFAULT_TYPE = "tags",
        DEFAULT_QUERY = "webmaker:featured",
        VALID_TYPES = [
          "tags",
          "title",
          "user",
          "description"
        ];

    var type = ( req.query.type || DEFAULT_TYPE ).toString().substring( 0, 512 ),
        query = ( req.query.q || DEFAULT_QUERY ).toString().substring( 0, 512 ),
        sortByField = ( req.query.sortByField || "createdAt" ).toString().substring( 0, 512 ),
        sortByOrder = ( req.query.order || "desc" ).toString().substring( 0, 512 ),
        page = ( req.query.page || 1 ).toString().substring( 0, 512 ),
        options = {};

    if ( VALID_TYPES.indexOf( type ) === -1 ) {
      type = DEFAULT_TYPE;
    }

    if ( type === 'tags' ) {
      var tags = query.split(',');
      options.tags = [];
      if( tags.length === 1 ) { // try splitting with spaces, too
        tags = query.split(' ');
      }
      options.tags[0] = tags.map(function( t ) {
        // check for hashtag, remove
        if ( t[0] === '#' ) {
          return tag.slice(1);
        }
        return t;
      });
    }
    else {
      // check for '@', remove
      if ( query[0] === '@' ) {
        query = query.slice(1);
      }
      options[ type ] = query;
    }

    var limit = 12;

    make.find( options )
    .limit( limit )
    .sortByField( sortByField, sortByOrder )
    .page( page )
    .process( function( err, data, totalHits ) {
      if( err ) {
        return res.send(err);
      }
      // query can be an array of tags sometimes,
      // so force a string so that it's autoescaped
      var query = options[type].toString();
      var showOlder = ( totalHits > page * limit );

      res.render( "search.html", {
        hasQuery: !!req.query.q,
        makes: data || [],
        page: "search",
        pagination: page,
        query: query,
        searchType: type,
        showOlder: showOlder
      });
    });
  };
};
