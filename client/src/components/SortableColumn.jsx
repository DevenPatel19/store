"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Plus, CheckCircle, GripVertical } from "lucide-react"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableTask from "./SortableTask"

const SortableColumn = ({ id, title, tasks, isDragging, addTask, deleteTask, onCompleteDay, isSending, isViewer }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const [newTaskContent, setNewTaskContent] = useState("")

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      addTask(id, newTaskContent)
      setNewTaskContent("")
    }
  }

  const handleDelete = (taskId) => {
    deleteTask(taskId)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTask()
    }
  }

  // Column-specific styling
  const getColumnAccent = () => {
    switch (id) {
      case "todo":
        return "from-blue-500 to-cyan-500"
      case "in-progress":
        return "from-yellow-500 to-orange-500"
      case "done":
        return "from-green-500 to-emerald-500"
      default:
        return "from-purple-500 to-pink-500"
    }
  }

  const getColumnBorder = () => {
    switch (id) {
      case "todo":
        return "border-blue-500/20"
      case "in-progress":
        return "border-yellow-500/20"
      case "done":
        return "border-green-500/20"
      default:
        return "border-purple-500/20"
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`backdrop-blur-xl bg-white/10 border ${getColumnBorder()} rounded-2xl shadow-2xl h-full flex flex-col transition-all duration-200 ${
        isDragging ? "scale-105 shadow-3xl" : ""
      }`}
    >
      {/* Column Header */}
      <div
        {...attributes}
        {...listeners}
        className={`bg-gradient-to-r ${getColumnAccent()} p-4 rounded-t-2xl cursor-grab active:cursor-grabbing flex justify-between items-center`}
      >
        <div className="flex items-center">
          <GripVertical className="h-5 w-5 text-white/70 mr-2" />
          <h5 className="text-white font-semibold text-lg mb-0">{title}</h5>
        </div>
        <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm">
          {tasks.length}
        </span>
      </div>

      {/* Column Body */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Add Task Form */}
        {!isViewer && (
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                placeholder="Add task..."
                onKeyDown={handleKeyDown}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-sm"
              />
              <button
                onClick={handleAddTask}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="flex-grow overflow-y-auto">
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {tasks.map((task) => (
                <SortableTask key={task.id} id={task.id} task={task} onDelete={handleDelete} isViewer={isViewer} />
              ))}
            </div>
          </SortableContext>
        </div>

        {/* Complete Day Button */}
        {id === "done" && tasks.length > 0 && (
          <button
            onClick={onCompleteDay}
            disabled={isSending}
            className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <CheckCircle className="h-5 w-5 mr-2" />
            )}
            {isSending ? "Clearing..." : "Done for the Day"}
          </button>
        )}
      </div>

      {/* Decorative Elements */}
      <div
        className={`absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-r ${getColumnAccent()} rounded-full opacity-20 blur-xl`}
      ></div>
      <div
        className={`absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-r ${getColumnAccent()} rounded-full opacity-10 blur-xl`}
      ></div>
    </div>
  )
}

export default SortableColumn
