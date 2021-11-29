const STORAGE_KEY = 'todo-app-vuejs'
let todoStorage = {
  fetch: function() {
    let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

new Vue({
  el: '#app',

  data: {
    todos: [],
    status: -1,
    options: [
      { value: -1, label: 'すべて' },
      { value: 0, label: '作業中' },
      { value: 1, label: '完了' }
    ],
    comment: ''
  },

  computed: {
    computedTodos: function() {
      return this.todos.filter(function(el) {
        return this.status < 0 ? true : this.status === el.state
      }, this)
    },
    labels() {
      return this.options.reduce(function(a, b) {
        return Object.assign(a, {
          [b.value]: b.label
        })
      }, {})
    }
  },

  watch: {
    todos: {
      handler: function(todos) {
        todoStorage.save(todos)
      },
      deep: true
    }
  },

  created() {
    this.todos = todoStorage.fetch()
  },

  methods: {
    Add: function() {
      let comment = this.comment
      if (!comment.length) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment,
        state: 0
      })
      this.comment = ''
    },

    ChangeState: function(item) {
      item.state = !item.state ? 1 : 0
    },

    Remove: function(item) {
      let index = this.todos.indexOf(item);
      if (confirm("本当に削除しますか?")) {
        this.todos.splice(index, 1);
      }
    }

  }
})
