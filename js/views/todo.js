var app = app || {};

// Todo項目のビュー

// Todo項目を表すDOM要素
app.TodoView = Backbone.View.extend({

  tagName: 'li',

  template: _.template($('#item-template').html()),

  events: {
    'click .toggle': 'togglecompleted',
    'dblclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  // モデルに対する変化を監視して再描画。TodoとTodoViewは
  // 一対一対応しているため、ここではモデルを直接参照している
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  // 項目のタイトルを描画
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));

    this.$el.toggleClass('completed', this.model.get('completed'));
    this.toggleVisible();

    this.$input = this.$('.edit');
    return this;
  },

  // 項目の表示非表示を切り替える
  toggleVisible: function () {
    this.$el.toggleClass('hidden', this.isHidden());
  },

  // 項目を非表示にすべきか判定
  isHidden: function () {
    var isCompleted = this.model.get('completed');
    return (
      (!isCompleted && app.TodoFilter === 'completed') ||
      (isCompleted && app.TodoFilter === 'active')
    );
  },

  // モデルのCompleted属性をトグル
  togglecompleted: function () {
    this.model.toggle();
  },

  // 編集モードに移行し、入力フィールドを表示
  edit: function () {
    this.$el.addClass('editing');
    this.$input.focus();
  },

  // 編集モードを終了し、Todo項目を保存
  close: function () {
    var value = this.$input.val().trim();

    if (value) {
      this.model.save({ title: value });
    } else {
      this.clear();
    }

    this.$el.removeClass('editing');
  },

  // Enterキーが押されると編集モードを終了
  updateOnEnter: function (event) {
    if (event.which === ENTER_KEY) {
      this.close();
    }
  },

  clear: function () {
    this.model.destroy();
  }
});
