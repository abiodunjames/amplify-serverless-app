/** @format */

import React, { useState, useEffect } from "react";
import "./App.css";

import { withAuthenticator } from '@aws-amplify/ui-react'

import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";

import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App() {
	const [allTodos, setAlltodos] = useState([]);

	useEffect(() => {
		(async () => {
			const todos = await API.graphql(graphqlOperation(listTodos));
			setAlltodos(todos.data.listTodos.items);
		})();
	}, []);

	const [name, setName] = useState("");
	const [description, setTodoDesc] = useState("");

	const changeTodoName = (e) => {
		const {
			target: { value },
		} = e;
		setName(value);
	};

	const changeTodoDesc = (e) => {
		const {
			target: { value },
		} = e;
		setTodoDesc(value);
	};

	const submitAddTodo = async (e) => {
		e.preventDefault();
		changeTodoName("");
		changeTodoDesc("");
		if (name === "" || description === "")
			return alert("Input fields cannot be empty");

		const todo = { name, description };
		await API.graphql(graphqlOperation(createTodo, { input: todo }));
		setAlltodos([todo, ...allTodos]);
	};

	return (
		<div className="App">
			<h1>Todos with GraphQL</h1>
			<form onSubmit={submitAddTodo}>
				<input placeholder="Enter todo title " onChange={changeTodoName} />
				<input
					placeholder="Enter todo description "
					onChange={changeTodoDesc}
				/>
				<input type="submit" value="Create todo" />
			</form>
			{allTodos.map(({ id, name, description }) => (
				<div key={id}>
					<h2>{name}</h2>
					<p>{description}</p>
				</div>
			))}
		</div>
	);
}

export default withAuthenticator(App);
