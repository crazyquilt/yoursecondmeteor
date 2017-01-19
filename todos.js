Todos = new Mongo.Collection('todos');

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    name: 'home',
    template: 'home'
});

Router.route('/register');
Router.route('/login');

if(Meteor.isClient) {
    Template.todos.helpers({
        'todos': function() {
            return Todos.find({}, {sort: {createdAt: -1}});
        }    
    });

    Template.addTodo.events({
        'submit form': function(event) {
            event.preventDefault();
            const todoName = $('[name="todoName"]').val();
            Todos.insert({
                name: todoName,
                completed: false,
                createdAt: new Date()
            });
            $('[name="todoName"]').val('');
        }
    });
    
    Template.todoItem.events({
        'click .delete-todo': function(event) {
            event.preventDefault();
            const documentId = this._id;
            const confirm = window.confirm("Delete this task?");
            if (confirm) {
            Todos.remove({ _id: documentId});
            }
        },
        'keyup [name=todoItem]': function(event) {
            if (event.which ===13 || event.which ===27) {
                $(event.target).blur();
                console.log("You tapped the Return or Escapekey");
            } else {
                const documentId = this._id;
                const todoItem = $(event.target).val();
                Todos.update({ _id: documentId}, {$set: { name: todoItem}});
            }
        },
        'change [type=checkbox]' : function() {
            const documentId  = this._id;
            const isCompleted = this.completed;
            if (isCompleted) {
                Todos.update({ _id: documentId}, {$set: { completed: false}});
                // console.log("Task marked as incomplete.");
            } else {
                Todos.update({ _id: documentId}, {$set: { completed: true}});
                // console.log("Task marked as complete.");
            }
        }
    });
    
    Template.todoItem.helpers({
        'checked': function() {
            const isCompleted = this.completed;
            if (isCompleted) {
                return "checked";
            } else {
                return "";
            }
        }
    });
    
    Template.todosCount.helpers({
        'totalTodos': function() {
            return Todos.find().count();
        },
        'completedTodos': function() {
            return Todos.find({ completed: true}).count();
        }
    });
}

if(Meteor.isServer) {
    
}
