/*global before:true*/
/*global after:true*/
/*global beforeEach:true*/
/*global describe:true*/
/*global it:true*/

var app = require('../server/server.js');
var lt = require('loopback-testing');
var ref = lt.TestDataBuilder.ref;

var chai = require('chai');
var expect = chai.expect;
chai.should();

lt.beforeEach.withApp(app);

// beforeEach(function (done) {
//   new lt.TestDataBuilder()
//     .define('membership', app.models.Membership, {
//       personId: 1,
//       status: 'active',
//       date: '2015-08-17'
//     })
//     .buildTo(this, done);
// });

describe('related items', function() {

  it('saving child only', function(done) {
    app.models.Membership.findById(1, {
      include: 'subscriptions'
    })
      .then(function(membership) {
        var subscriptions = membership.subscriptions();
        expect(subscriptions).to.have.length(3);
        return subscriptions[0].save();
      })
      .then(function(updatedSubscription) {
        return app.models.Membership.findById(1, {
          include: 'subscriptions'
        });
      })
      .then(function(membership) {
        var subscriptions = membership.subscriptions();
        expect(subscriptions).to.have.length(3);
      })
      .then(done)
      .catch(done);
  });

  it('saving parent only', function(done) {
    app.models.Membership.findById(1, {
      include: 'subscriptions'
    })
      .then(function(membership) {
        var subscriptions = membership.subscriptions();
        console.log('Initially we have the 3 subscriptions from sample data:');
        console.log(subscriptions);
        expect(subscriptions).to.have.length(3);

        // This causes the subscrptions that were fetched from the include
        // elationship to be saved directly onto the membership.
        return membership.save();
      })
      .then(function(updatedMembership) {
        // Now, try to load the membership again, along with its subscriptions.
        return app.models.Membership.findById(1, {
          include: 'subscriptions'
        });
      })
      .then(function(membership) {
        // Now, we actaullly have 5 subscriptions instead of the 3 that
        // we should have. Subscriptions 2 and 3 have duplicates.
        var subscriptions = membership.subscriptions();
        console.log('Now we have 5 subscriptions!');
        console.log(subscriptions);
        expect(subscriptions).to.have.length(3);
      })
      .then(done)
      .catch(done);
  });

  // it('saving parent and child at the same time', function(done) {
  //   app.models.Membership.findById(1, {
  //     include: 'subscriptions'
  //   })
  //     .then(function(membership) {
  //       var subscriptions = membership.subscriptions();
  //       expect(subscriptions).to.have.length(3);
  //       return [
  //         membership.save(),
  //         subscriptions[0].save()
  //       ];
  //     })
  //     .spread(function(updatedMembership, updatedSubscription) {
  //       return app.models.Membership.findById(1, {
  //         include: 'subscriptions'
  //       });
  //     })
  //     .then(function(membership) {
  //       var subscriptions = membership.subscriptions();
  //       expect(subscriptions).to.have.length(3);
  //     })
  //     .then(done)
  //     .catch(done);
  // });

});
