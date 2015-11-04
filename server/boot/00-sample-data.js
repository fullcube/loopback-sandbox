module.exports = function(app) {

  var sampleData = {
    Membership: [{
      id: 1,
      personId: 1,
      status: 'active'
    }],
    Subscription: [{
      id: 1,
      membershipId: 1,
      provider: 'someprovider'
    }, {
      id: 2,
      membershipId: 1,
      provider: 'someprovider'
    }, {
      id: 3,
      membershipId: 1,
      provider: 'someprovider'
    }],
  };

  Object.keys(sampleData).forEach(function(modelName) {

    app.models[modelName].create(sampleData[modelName]).then(function() {
      console.log('Sample data created for model %s', modelName);
    }).catch(function(err) {
      console.log('Sample data not created for model %s', modelName);
      console.log(err);
    });


  });


};
