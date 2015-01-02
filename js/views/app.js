var app = app || {};

// Application

// AppViewはアプリケーション全体のUIを表します
app.AppView = Backbone.View.extend({

  el: '#todoapp',

  // 画面下端に表示される統計情報のためのテンプレート
  statsTemplate: _.template($('#stats-template').html()),

  // 項目の新規作成と完了した項目の消去に対応するイベント
  events: {
    'keypress #new-todo': 'creteOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  // 項目の追加や削除に反応するためにイベントリスナーを登録
  initialize: function () {

    // 今後の処理で必要になる要素を取得
    this.allCheckbox = this.$('#toggle-all');
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);

    this.listenTo(app.Todos, 'change:completed', this.filterOne);
    this.listenTo(app.Todos, 'filter', this.filterAll);
    this.listenTo(app.Todos, 'all', this.render);

    app.Todos.fetch();
  },

  // 下端に表示される統計情報を更新
  render: function () {
    var completed = app.Todos.completed().length;
    var remaining = app.Todos.remaining().length;

    if (app.Todos.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + (app.TodoFilter || '') + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
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
  },

  filterOne: function (todo) {
    todo.trigger('visible');
  },

  filterAll: function () {
    app.Todos.each(this.filterOne, this);
  },

  // 新規作成されるTodo項目のために、属性のリストを作成
  newAttributes: function () {
    return {
      title: this.$input.val().trim(),
      order: app.Todos.nextOrder(),
      completed: false
    };
  },

  // 入力フィールドでEnterキーが押されると、Todoのモデルを作成して
  // localStorageに永続化
  createOnEnter: function (event) {
    if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
      return;
    }

    app.Todos.create(this.newAttributes());
    this.$input.val('');
  },

  // 完了したTodo項目をすべて削除し、モデルを破棄
  clearCompleted: function () {
    _.invoke(app.Todos.completed(), 'destroy');
    return false;
  },

  toggleAllComplete: function () {
    var completed = this.allCheckbox.checked;

    app.Todos.each(function (todo) {
      todo.save({ 'completed': completed });
    });
  }
});
