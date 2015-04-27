/**
 * Dependencies.
 */
var utils = require('../lib/utils');
var _ = require('lodash');

/**
 * Controller.
 */
module.exports = function(app) {

  /**
   * Internal Dependencies.
   */
  var models = app.set('models')
    , User = models.User
    , Activity = models.Activity
    , errors = app.errors
    ;

  /**
   * Public methods.
   */
  return {

    /**
     * Create a user.
     */
    create: function(req, res, next) {
      User
        .create(req.required['user'])
        .then(function(user) {
          res.send(user.info);

          Activity.create({
              type: 'user.created'
            , UserId: user.id
            , data: {user: user.info}
          });
        })
        .catch(next);
    },

    /**
     * Get token.
     */
    getToken: function(req, res, next) {
      res.send({
          access_token: req.user.jwt
        , refresh_token: req.user.refresh_token
      });
    },

    /**
     * Show.
     */
    show: function(req, res, next) {
      if (req.remoteUser.id === req.user.id)
        res.send(req.user.info);
      else
        res.send(req.user.show);
    },

    /**
     * Get a user's groups.
     */
    getGroups: function(req, res, next) {
      req.user
        .getGroups()
        .then(function(groups) {
          res.send(_.map(groups, function(g) { return g.info; }));
        })
        .catch(next);
    },

  }

};
