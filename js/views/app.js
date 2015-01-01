var app = app || {};

// Application

// AppViewはアプリケーション全体のUIを表します
app.AppView = Backbone.View.extend({

  el: '#todoapp',

  // 画面下端に表示される統計情報のためのテンプレート
  statsTemplate: _.template($('#stats-template').html()),

  // 項目の追加や削除に反応するためにイベントリスナーを登録
  initialize: function () {

    // 今後の処理で必要になる要素を取得
    this.allCheckbox = this.$('#toggle-all');
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);
  },

  // 指定されたTodo項目のためのViewを作成し、<ul>要素の直下に挿入
  addOne: function (todo) {
    var view = new app.TodoView({ model: todo });
    $('#todo-list').append(view.render().el);
  },

  // コレクションに含まれるTodo項目をすべて追加
  addAll: function () {
    this.$('#todo-list').thml('');
    app.Todos.each(this.addOne, this);
  }
});
