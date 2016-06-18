import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../actions';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';

class Todos extends Component {
	componentWillMount() {
		this.props.fetchTodos();
	}

  completeTodo(id, title, complete){
    this.props.completeTodo(id, title, complete);
  }

  clearCompleted() {
    this.props.clearCompleted();
  }

  handleFormSubmit(formProps) {
    const title = formProps.title;
    const userId = localStorage.getItem('userId');
    this.props.createTodo(title, userId);
    this.props.resetForm();
  }

	renderTodos() {
    return this.props.todos.map((todo, i) => {
      if (todo.complete) {
        return (
          <li className="list-group-item" key={todo.id}>
            <del>
              <a href="#" id={todo.id} onClick={this.completeTodo.bind(this, todo.id, todo.title, todo.complete)}>
                <span className="pull-xs-right">
                  <FontAwesome name={todo.complete ? 'check' : 'circle-o'} />
                </span>
                <strong>{todo.title}</strong>
              </a>
            </del>
          </li>
        );
      } else {
        return (
          <li className="list-group-item" key={todo.id}>
            <a href="#" id={todo.id} onClick={this.completeTodo.bind(this, todo.id, todo.title, todo.complete)}>
              <span className="pull-xs-right">
                <FontAwesome name={todo.complete ? 'check' : 'circle-o'} />
              </span>
              <strong>{todo.title}</strong>
            </a>
          </li>
        );
      };
    }, this);
  };

	render() {
    const { 
      handleSubmit,
      fields: { title },
      resetForm
    } = this.props;

		return (
      <div>
  			<div>
          <form className="form-inline" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <fieldset className="form-group">
              <input {...title} className="form-control" placeholder="Add a new task..." />
              <button action="submit" className="btn btn-primary">Submit</button>
            </fieldset>
          </form>
        </div>
        <div>
          <h5>Todos</h5>
          <ul className="list-group">
            {this.renderTodos()}
          </ul>
          <button type="button" onClick={this.clearCompleted.bind(this)} className="btn btn-default pull-xs-right">Clear completed</button>
  			</div>
      </div>
		);
	}
}

Todos.propTypes = {
  resetForm: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return { todos: state.todos.all };
}

export default reduxForm({
  form: 'todo',
  fields: ['title']
}, mapStateToProps, actions)(Todos);
