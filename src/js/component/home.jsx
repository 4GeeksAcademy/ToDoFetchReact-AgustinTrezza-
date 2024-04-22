import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUser, faEdit } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editTodoLabel, setEditTodoLabel] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch('https://playground.4geeks.com/todo/users/AgustinTrezza')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.todos)) {
          setTodos(data.todos);
        } else {
          console.error('Error fetching todos: La respuesta no es un array', data);
        }
      })
      .catch(error => console.error('Error fetching todos:', error));
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = { label: inputValue };
      fetch('https://playground.4geeks.com/todo/todos/AgustinTrezza', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      })
      .then(response => response.json())
      .then(data => {
        setTodos([...todos, data]);
        setInputValue('');
      })
      .catch(error => console.error('Error adding todo:', error));
    }
    
  };

  const handleDeleteTodo = (index) => {
    const todoToDelete = todos[index];
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  
    fetch(`https://playground.4geeks.com/todo/todos/${todoToDelete.id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
    })
    .catch(error => console.error('Error deleting todo:', error));
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handleAddTodo();
    }
  };

  const openEditModal = (index) => {
    const todoToEdit = todos[index];
    setEditingIndex(index);
    setEditTodoLabel(todoToEdit.label);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingIndex(null);
    setEditTodoLabel('');
    setIsModalOpen(false);
  };

  const handleUpdateTodo = () => {
    const todoToUpdate = todos[editingIndex];
    const updatedTodo = { label: editTodoLabel };
    fetch(`https://playground.4geeks.com/todo/todos/${todoToUpdate.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTodo)
    })
    .then(response => response.json())
    .then(data => {
      const updatedTodos = [...todos];
      updatedTodos[editingIndex] = data;
      setTodos(updatedTodos);
      closeModal();
    })
    .catch(error => console.error('Error updating todo:', error));
  };

  return (
    <div>
      <h1 className="project-title">ToDoFetchReact - Agustin Trezza - 4Geeks</h1>
      <div className="d-flex justify-content-center align-items-center vh-100 container-custom">
        <div className="title-container">
          <h1 className="title">¡Creá tus tareas!</h1>
        </div>
        <div className="todo-input">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleEnterPress}
            placeholder="Ingresá un toDo"
            className="form-control"
          />
        </div>

        <div className="todo-container">
          <ul className="list-group todo-item">
            {todos.map((todo, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                 <div>
                    <FontAwesomeIcon className="user-icon" icon={faUser} />     
                 </div>
                    {todo.label} - ID:{todo.id}
                  <div>
                    <button onClick={() => openEditModal(index)} className="btn btn-primary btn-edit me-2 btn-delete">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDeleteTodo(index)} className="btn btn-danger btn-delete delete-symbol">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                
              </li>
            ))}
            <div className="container-tareas">
              {todos.length > 0 ? (
                <div>
                  <p className="ms-2 tareas-message">Cantidad de Tareas: {todos.length}</p>
                </div>
              ) : (
                <p className="ms-2 tareas-message">Aún no hay tareas agregadas</p>
              )}
            </div>
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar To-Do</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={editTodoLabel}
                  onChange={(event) => setEditTodoLabel(event.target.value)}
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateTodo}>Guardar cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
