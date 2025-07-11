import React from 'react';

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

export default TaskCard;
