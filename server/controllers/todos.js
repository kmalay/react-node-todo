const models = require('../models/index');
const User = models.User;
const Todo = models.Todo;

exports.getList = function(req, res, next) {
  console.log('UserId = ' + req.get('userId'));
	Todo.findAll({
    where: { UserId: req.get('userId') },
    order: 'id'
  }).then(function(todos) {
		res.json(todos);
	});
}

exports.create = function(req, res, next) {
  models.Todo.create({
    title: req.body.title,
    UserId: req.body.UserId
  })
  .then(function() {
    Todo.findAll({
      where: { UserId: req.body.UserId },
      order: 'id'
    }).then(function(todos) {
      res.json(todos);
    });
  });
}

exports.getTodo = function(req, res, next) {
  models.Todo.find({
    where: {
      id: req.params.id
    }
  }).then(function(todo) {
    res.json(todo);
  });
}

exports.update = function(req, res, next) {
  models.Todo.find({
    where: {
      id: req.params.id
    }
  }).then(function(todo) {
    if(todo){
      todo.updateAttributes({
        title: req.body.title,
        complete: req.body.complete
      }).then(function(todo) {
        Todo.findAll({
          where: { UserId: req.body.UserId },
          order: 'id'
        }).then(function(todos) {
          res.json(todos);
        });
      });
    }
  });
}

exports.delete = function(req, res, next) {
  models.Todo.destroy({
    where: {
      id: req.params.id
    }
  }).then(function() {
    Todo.findAll({
      where: { UserId: req.body.UserId },
      order: 'id'
    }).then(function(todos) {
      res.json(todos);
    });
  });
}

exports.clear = function(req, res, next) {
  Todo.destroy({
    where: {
      UserId: req.body.UserId,
      complete: "true"
    }
  }).then(function() {
    Todo.findAll({
      where: { UserId: req.body.UserId },
      order: 'id'
    }).then(function(todos) {
      res.json(todos);
    });
  });
}
