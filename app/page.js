"use client";

import { useState, useEffect } from "react";

// Key used to store the todo list in the browser's localStorage.
// localStorage persists across page reloads — no database required.
const STORAGE_KEY = "todo-app.todos";

export default function Home() {
  // `todos` is an array like: [{ id: 1, text: "Buy milk", done: false }, ...]
  // `setTodos` is the function we call to update it. Calling it re-renders the page.
  const [todos, setTodos] = useState([]);

  // `input` holds whatever the user is currently typing in the text box.
  const [input, setInput] = useState("");

  // On first load, read any saved todos out of localStorage.
  // The empty `[]` at the end means "only run this once, on mount".
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Whenever `todos` changes, save the new list back to localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    const text = input.trim();
    if (!text) return; // ignore empty submissions
    const newTodo = { id: Date.now(), text, done: false };
    setTodos([newTodo, ...todos]); // newest on top
    setInput(""); // clear the input box
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-xl px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Todo
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {todos.length === 0
            ? "Nothing yet. Add your first task below."
            : `${remaining} remaining of ${todos.length}`}
        </p>

        {/* Input row */}
        <div className="mt-6 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTodo();
            }}
            placeholder="What needs doing?"
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
          <button
            onClick={addTodo}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Add
          </button>
        </div>

        {/* List */}
        <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 py-3"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4 cursor-pointer"
              />
              <span
                onClick={() => toggleTodo(todo.id)}
                className={`flex-1 cursor-pointer select-none ${
                  todo.done
                    ? "text-zinc-400 line-through dark:text-zinc-600"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete task"
                className="text-zinc-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
