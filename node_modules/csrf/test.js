/*global describe, it, after, before, beforeEach, afterEach*/

var
  csrf = require('./index'),
  assert = require('assert');


describe('getting and setting csrf tokens', function(){

  beforeEach(function(){
    this.csrf = csrf(false, { log: false });
    this.req = {
      session: {},
      headers: [],
      connection: {
        remoteAddress: ''
      }
    };
  });

  ['GET','HEAD','OPTIONS'].forEach(function( type ){

    it('should append a csrf token for '+ type +' requests', function( done ){
      var self = this;
      this.req.method = type;
      this.csrf( this.req, {}, function(){
        assert.equal( self.req.session._csrf.length, 24 );
        done();
      });
    });

  });

  ['body','query','headers'].forEach(function( type ){

    it('req.'+ type +': should retrieve a csrf token', function( done ){
      var token = this.req.session._csrf = '12345';
      this.req.method = 'POST';

      if( type === 'headers' ){
        this.req.headers['x-csrf-token'] = token;
      } else {
        this.req[ type ] = {
          _csrf: token
        };
      }

      this.csrf( this.req, {}, function(){
        done();
      });
    });

    it( 'req.'+ type +': should reject an invalid token', function( done ){
      this.req.session._csrf = '12345';

      if( type == 'headers' ){
        this.req.headers['x-csrf-token'] = '54321';
      } else {
        this.req[ type ] = {
          _csrf: '54321'
        };
      }

      var res = {
        end: function(msg){
          assert.equal( 401, res.statusCode );
          done();
        }
      };

      this.csrf( this.req, res, function(){});
    });

  });


});

describe('enforcing IP address restrictions', function(){

  beforeEach(function(){
    this.csrf = csrf([ '127.0.0.1' ], { log: false });
    this.req = {
      session: {},
      headers: [],
      connection: {
        remoteAddress: ''
      }
    };
  });

  it('should allow all whitelisted ips', function( done ){
    this.req.connection.remoteAddress = '127.0.0.1';
    this.csrf( this.req, {}, function(){
      done();
    });
  });

  it('should allow all forwarded ips', function( done ){
    this.req.headers['x-forwarded-for'] = '127.0.0.1';
    this.csrf( this.req, {}, function(){
      done();
    });
  });

  it('should reject all other ips', function( done ){
    this.req.connection.remoteAddress = '0.0.0.0';
    var res = {
      end: function(msg){
        assert.equal( 401, res.statusCode );
        done();
      }
    };

    this.csrf( this.req, res, function(){});
  });

  it('should reject all bad forwarded ips', function( done ){
    this.req.headers['x-forwarded-for'] = '0.0.0.0';
    var res = {
      end: function(msg){
        assert.equal( 401, res.statusCode );
        done();
      }
    };

    this.csrf( this.req, res, function(){});
  });

});
