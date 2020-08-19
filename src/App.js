/** @format */

import React, { useState, useEffect } from "react";
import "./App.css";

import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

import { createTodo } from "./graphql/mutations";
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
	const [description, setTodoDesc] = useState("");

	const changeTodoName = (e) => {
		const {
			target: { value },
		} = e;
		setTodoName(value);
	};

	const changeTodoDesc = (e) => {
		const {
			target: { value },
		} = e;
		setTodoDesc(value);
	};

	const submitAddTodo = async (e) => {
		e.preventDefault();
		if (name === "" || description === "")
			return alert("Input fields cannot be empty");
		setTodoName("");
		setTodoDesc("");

		const todo = { name, description };
		await API.graphql(graphqlOperation(createTodo, { input: todo }));
		if (allTodos === null) {
			setAlltodos([todo]);
		} else {
			setAlltodos([...allTodos, todo]);
		}
	};

	return (
		<div className="App">
			<div className="heading">
				<h1>Amplify Todo</h1>
        <AmplifySignOut />
			</div>
			<form className="add-todo-form" onSubmit={submitAddTodo}>
				<input placeholder="Enter todo title " onChange={changeTodoName} />
				<textarea
					placeholder="Enter todo description "
					onChange={changeTodoDesc}
				/>
				<button type="submit">Create todo</button>
			</form>
			<section className="todo-section">
				<h2>All Todos</h2>
				{allTodos === null ? (
					<p>Loading Todos...</p>
				) : allTodos.length === 0 ? (
					<p>No Todo available</p>
				) : (
					allTodos.reverse().map(({ id, name, description }) => (
						<div className="todo-block" key={id}>
							<h3>{name}</h3>
							<p>{description}</p>
						</div>
					))
				)}
			</section>
		</div>
	);
}

export default withAuthenticator(App);
