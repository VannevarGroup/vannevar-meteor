Posts = new Meteor.Collection("posts");

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Posts.find().count() > 0) return;

    for (var i = 0; i < 4; i++) {
      Posts.insert({
        title: "Post " + i
      });
    }
  });

  Meteor.publish("posts", function () {
    return Posts.find();
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("posts");

  Handlebars.registerHelper("navClassFor", function (nav, options) {
      return Meteor.router.navEquals(nav) ? "active" : "";
  });

  function isAuthorized () {
    return Session.get("loggedin");
  }

  function setPost (context) {
    var _id = context.params._id;
    Session.set("post", Posts.findOne(_id));
  }

  function setLayout (context) {
    if (isAuthorized())
      this.layout('loggedInLayout');
    else
        this.layout('layout');
  }

  function authorizeSecret (context, page) {
    if (!Session.get("secret")) {
      context.redirect(Meteor.unauthorizedPath());
    }
  }




  // Main Routing Section

  Meteor.pages({
    '/': { to: 'Index', as: 'root', before: setLayout, nav: 'home' },
    '/contact': {to: 'contact', before: setLayout },
    '/401': { to: 'unauthorized', before: setLayout },
    '*': { to: 'notFound', before: setLayout }
  });




  Template.postIndex.helpers({
    posts: function () {
      return Posts.find();
    }
  });

  Template.postShow.helpers({
    post: function () {
      return Session.get("post");
    }
  });
}