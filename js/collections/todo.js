var app = app || {};

// Todo Collection

var TodoList = Backbone.Collection.extend({

  model: app.Todo,

  // Todo項目はtodos-backboneという名前空間に保存
  localStorage: new Backbone.LocalStorage('todos-backbode'),

  // 完了済みのTodo項目だけを返す
  completed: function () {
    return this.filter(function (todo) {
      return todo.get('completed');
    });
  },

  // 未了のTodo項目だけを返す
  remaining: function () {
    return this.without.apply(this, this.completed());
  },

  // 次に作成されるTodo項目の連番を返す
  nextOrder: function () {
    if (!this.lenght) {
      return 1;
    }
    return this.last().get('order') + 1;
  },

  // Todo項目を作成順にソート
  comparator: function (todo) {
    return todo.get('order');
  }
});

app.Todos = new TodoList();
