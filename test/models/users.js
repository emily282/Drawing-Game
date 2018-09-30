var expect = require('chai').expect;
var User = require('../../models/users');
var uuidv1 = require('uuid/v1');

describe('new User()', function () {
    it('should store its name', function() {

        var name = uuidv1();
        
        var user = new User(name, 0);

        expect(user.name).to.be.equal(name);
    });



    it('should store its id', function() {
        var id = uuidv1();

        var user = new User(null, id);

        expect(user.id).to.be.equal(id);

    });


    it('starting score should be 0', function() {

        var user = new User(null, null);

        expect(user.score).to.be.equal(0);
    });
});        
