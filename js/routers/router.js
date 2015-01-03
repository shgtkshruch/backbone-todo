// Todo router

var app = app || {};

var Workspace = Backbone.Router.extend({

  routes: {
    '*filter': 'setFilter'
  },

  setFilter: function (param) {
    // 適用するべきフィルタをセット
    app.TodoFilter = param || '';

    // コレクションのfilterイベントを発生させ、
    // Todo項目の表示と非表示を切り替える
    app.Todos.trigger('filter');
  }
});

app.TodoRouter = new Workspace();
Backbone.history.start();
