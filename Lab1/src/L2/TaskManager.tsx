import React, { useState, useEffect } from 'react';
import { Button, ListGroup, ListGroupItem, Card, Container, Row, Col } from 'react-bootstrap';
import './TaskManager.css';
import Cookies from "js-cookie";
import axios from "axios";

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');

  

  // Добавление задачи
  const addTask = (taskName: string) => {
    const newTask: Task = {
      id: Date.now(),
      name: taskName,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  // Переключение статуса задачи
  const toggleTaskStatus = (taskId: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Удаление задачи
  const removeTask = (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Фильтрация задач
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  return (
    <Container className="task-manager-container">
      <h1 className="task-manager-title">Журнал задач</h1>

      {/*Форма для добавления задачи */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const taskInput = e.currentTarget.querySelector('input');
          if (taskInput) {
            addTask(taskInput.value.trim());
            taskInput.value = '';
          }
        }}
      >
        <input type="text" placeholder="Название задачи" required />
        <Button type="submit" variant="primary">Добавить задачу</Button>
      </form>

      {/*Кнопки фильтрации */}
      <div className="filter-buttons">
        <Button variant="secondary" onClick={() => setFilter('all')}>Все</Button>
        <Button variant="secondary" onClick={() => setFilter('completed')}>Выполненные</Button>
        <Button variant="secondary" onClick={() => setFilter('active')}>Активные</Button>
      </div>

      {/* Список задач */}
      <ListGroup>
        {filteredTasks.map(task => (
          <ListGroupItem key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <Card>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <Card.Title>{task.name}</Card.Title>
                    <Card.Text>{task.completed ? 'Выполнено' : 'Не выполнено'}</Card.Text>
                  </Col>
                  <Col md={4} className="task-actions">
                    <Button variant="success" onClick={() => toggleTaskStatus(task.id)}>
                      {task.completed ? 'Выполнено' : 'Выполнить'}
                    </Button>
                    <Button variant="danger" onClick={() => removeTask(task.id)}>Удалить</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Container>
  );
}