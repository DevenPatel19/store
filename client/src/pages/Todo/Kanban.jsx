import React, { useState, useEffect, useContext } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaTrash, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthProvider';
import './kanban.css';

// Sortable Column Component
const SortableColumn = ({ id, title, tasks, isDragging, addTask, deleteTask, onCompleteDay, isSending }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [newTaskContent, setNewTaskContent] = useState('');

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      addTask(id, newTaskContent);
      setNewTaskContent('');
    }
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className="mb-3 h-100 d-flex flex-column"
    >
      <Card.Header 
        {...attributes}
        {...listeners}
        className="d-flex justify-content-between align-items-center cursor-grab"
      >
        <h5 className="mb-0">{title}</h5>
        <span className="badge bg-primary rounded-pill">
          {tasks.length}
        </span>
      </Card.Header>
      <Card.Body className="p-2 flex-grow-1 d-flex flex-column">
        <Form className="mb-2 d-flex">
          <Form.Control
            type="text"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            placeholder="Add task..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <Button 
            variant="primary" 
            onClick={handleAddTask}
            className="ms-1"
          >
            <FaPlus />
          </Button>
        </Form>
        
        <div className="task-list flex-grow-1">
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map(task => (
              <SortableTask 
                key={task.id} 
                id={task.id} 
                task={task} 
                onDelete={deleteTask}
              />
            ))}
          </SortableContext>
        </div>
        
        {id === 'done' && tasks.length > 0 && (
          <Button 
            variant="success" 
            className="mt-3 w-100"
            onClick={onCompleteDay}
            disabled={isSending}
          >
            {isSending ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              <>
                <FaCheckCircle className="me-2" />
                Done for the Day
              </>
            )}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

// Sortable Task Component
const SortableTask = ({ id, task, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card mb-2 cursor-grab ${isDragging ? 'border-primary border-2' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="card-body p-2 d-flex justify-content-between">
        <div className="task-content">
          <p className="mb-0">{task.content}</p>
          {task.createdAt && (
            <small className="text-muted">
              {new Date(task.createdAt).toLocaleString()}
            </small>
          )}
        </div>
        <Button 
          variant="link" 
          className="text-danger p-0 align-self-start"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <FaTrash size={16} />
        </Button>
      </div>
    </div>
  );
};

// Task Card Component for Drag Overlay
const TaskCard = ({ task }) => (
  <div className="card mb-2">
    <div className="card-body p-2">
      <p className="mb-0">{task.content}</p>
      {task.createdAt && (
        <small className="text-muted">
          {new Date(task.createdAt).toLocaleString()}
        </small>
      )}
    </div>
  </div>
);

const Kanban = () => {
  const { user } = useContext(AuthContext);
  const [boardData, setBoardData] = useState(() => {
    const savedData = localStorage.getItem('kanbanData');
    if (savedData) return JSON.parse(savedData);
    
    return {
      columns: {
        'todo': {
          id: 'todo',
          title: 'To Do',
          taskIds: []
        },
        'in-progress': {
          id: 'in-progress',
          title: 'In Progress',
          taskIds: []
        },
        'done': {
          id: 'done',
          title: 'Done',
          taskIds: []
        }
      },
      tasks: {},
      columnOrder: ['todo', 'in-progress', 'done']
    };
  });

  const [alert, setAlert] = useState({ show: false, variant: 'success', message: '' });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    localStorage.setItem('kanbanData', JSON.stringify(boardData));
  }, [boardData]);

  const [activeId, setActiveId] = useState(null);
  const [activeType, setActiveType] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const dropAnimationConfig = {
    ...defaultDropAnimation,
    dragSourceOpacity: 0.5,
  };

  const activeTask = activeType === 'task' ? boardData.tasks[activeId] : null;
  const activeColumn = activeType === 'column' ? boardData.columns[activeId] : null;

  const addTask = (columnId, content) => {
    const taskId = `task-${Date.now()}`;
    setBoardData(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: { 
          id: taskId, 
          content,
          createdAt: new Date().toISOString()
        }
      },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          taskIds: [...prev.columns[columnId].taskIds, taskId]
        }
      }
    }));
  };

  // FIXED: Delete task from the board
  const deleteTask = (taskId) => {
    setBoardData(prev => {
      // Create new tasks object without the deleted task
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
      
      // Create new columns with the task removed from any column
      const newColumns = { ...prev.columns };
      Object.keys(newColumns).forEach(columnId => {
        newColumns[columnId] = {
          ...newColumns[columnId],
          taskIds: newColumns[columnId].taskIds.filter(id => id !== taskId)
        };
      });
      
      return {
        ...prev,
        tasks: newTasks,
        columns: newColumns
      };
    });
  };

  const handleCompleteDay = async () => {
    if (!user || !user.email) {
      setAlert({
        show: true,
        variant: 'danger',
        message: 'You must be logged in to complete tasks'
      });
      return;
    }

    const doneTasks = boardData.columns.done.taskIds.map(id => boardData.tasks[id]);
    
    if (doneTasks.length === 0) {
      setAlert({
        show: true,
        variant: 'warning',
        message: 'No tasks in Done column to complete'
      });
      return;
    }

    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear done tasks
      setBoardData(prev => {
        const newTasks = { ...prev.tasks };
        doneTasks.forEach(task => delete newTasks[task.id]);
        
        return {
          ...prev,
          tasks: newTasks,
          columns: {
            ...prev.columns,
            'done': {
              ...prev.columns.done,
              taskIds: []
            }
          }
        };
      });
      
      setAlert({
        show: true,
        variant: 'success',
        message: `Completed tasks have been cleared and sent to ${user.email}`
      });
    } catch (error) {
      console.error('Error:', error);
      setAlert({
        show: true,
        variant: 'danger',
        message: 'Failed to process tasks. Please try again.'
      });
    } finally {
      setIsSending(false);
      setTimeout(() => setAlert({ show: false }), 5000);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    const isTask = !!boardData.tasks[active.id];
    setActiveType(isTask ? 'task' : 'column');
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveType(null);
      return;
    }

    if (activeType === 'column') {
      if (active.id !== over.id) {
        setBoardData(prev => {
          const oldIndex = prev.columnOrder.indexOf(active.id);
          const newIndex = prev.columnOrder.indexOf(over.id);
          return {
            ...prev,
            columnOrder: arrayMove(prev.columnOrder, oldIndex, newIndex),
          };
        });
      }
    }
    else if (activeType === 'task') {
      if (active.id !== over.id) {
        const sourceColumn = Object.values(boardData.columns).find(
          col => col.taskIds.includes(active.id)
        );
        const destColumn = Object.values(boardData.columns).find(
          col => col.taskIds.includes(over.id) || col.id === over.id
        );

        if (sourceColumn && destColumn) {
          setBoardData(prev => {
            const newSourceTaskIds = [...sourceColumn.taskIds];
            const sourceIndex = newSourceTaskIds.indexOf(active.id);
            newSourceTaskIds.splice(sourceIndex, 1);

            const newDestTaskIds = [...destColumn.taskIds];
            const destIndex = over.id in prev.tasks 
              ? newDestTaskIds.indexOf(over.id) 
              : newDestTaskIds.length;
            newDestTaskIds.splice(destIndex, 0, active.id);

            return {
              ...prev,
              columns: {
                ...prev.columns,
                [sourceColumn.id]: {
                  ...sourceColumn,
                  taskIds: newSourceTaskIds,
                },
                [destColumn.id]: {
                  ...destColumn,
                  taskIds: newDestTaskIds,
                },
              },
            };
          });
        }
      }
    }

    setActiveId(null);
    setActiveType(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveType(null);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Task Board</h1>
      
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext 
          items={boardData.columnOrder}
          strategy={horizontalListSortingStrategy}
        >
          <Row className="flex-nowrap overflow-auto pb-3" style={{ minHeight: '70vh' }}>
            {boardData.columnOrder.map(columnId => {
              const column = boardData.columns[columnId];
              const tasks = column.taskIds.map(taskId => ({
                ...boardData.tasks[taskId],
                id: taskId
              }));
              
              return (
                <Col key={column.id} xs={12} md={4} className="d-flex">
                  <SortableColumn 
                    id={column.id}
                    title={column.title}
                    tasks={tasks}
                    isDragging={activeId === column.id}
                    addTask={addTask}
                    deleteTask={deleteTask}
                    onCompleteDay={handleCompleteDay}
                    isSending={isSending}
                  />
                </Col>
              );
            })}
          </Row>
        </SortableContext>

        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeType === 'task' && activeTask ? (
            <TaskCard task={activeTask} />
          ) : activeType === 'column' && activeColumn ? (
            <Card className="mb-3" style={{ width: '18rem' }}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{activeColumn.title}</h5>
                <span className="badge bg-primary rounded-pill">
                  {activeColumn.taskIds.length}
                </span>
              </Card.Header>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Container>
  );
};

export default Kanban;