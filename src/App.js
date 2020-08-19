/** @format */

import React, { useState, useEffect } from "react";
import "./App.css";

import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

import { createTodo, updateTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";

import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App() {
	const [allTodos, setAlltodos] = useState(null);

	useEffect(() => {
		(async () => {
			const todos = await API.graphql(graphqlOperation(listTodos));
			setAlltodos(todos.data.listTodos.items);
		})();
	}, []);

	const [name, setTodoName] = useState("");

	const changeTodoName = (e) => {
		const {
			target: { value },
		} = e;
		setTodoName(value);
	};

	const submitAddTodo = async (e) => {
		e.preventDefault();
		if (name === "") return alert("Input field cannot be empty");
		setTodoName("");

		const todo = { name, done: false };
		await API.graphql(graphqlOperation(createTodo, { input: todo }));
		if (allTodos === null) {
			setAlltodos([todo]);
		} else {
			setAlltodos([...allTodos, todo]);
		}
	};

	const toggleTodo = async (id) => {
		const todo = allTodos.find(({ id: _id }) => _id === id);
		let newTodo = { id, name: todo.name };
		if (todo.done) {
			newTodo.done = false;
		} else {
			newTodo.done = true;
		}
    await API.graphql(graphqlOperation(updateTodo, { input: newTodo }));
    
	};

	return (
		<div className="App">
			<div className="heading">
				<h1>Amplify Todo</h1>
				<AmplifySignOut />
			</div>
			<form className="add-todo-form" onSubmit={submitAddTodo}>
				<input placeholder="Enter todo title " onChange={changeTodoName} />
				<button type="submit">Create todo</button>
			</form>
			<section className="todo-section">
				<h2>All Todos</h2>
				{allTodos === null ? (
					<p>Loading Todos...</p>
				) : allTodos.length === 0 ? (
					<p>No Todo available</p>
				) : (
					allTodos.reverse().map(({ id, name, done }) => (
						<div className="todo-block" key={id}>
							<input
								onClick={() => toggleTodo(id)}
								type="checkbox"
								value={id}
								key={id}
								defaultChecked={done}
							/>
							<label>{name}</label>
						</div>
					))
				)}
			</section>
		</div>
	);
}

export default withAuthenticator(App);
