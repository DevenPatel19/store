"use client"

import { useState, useEffect, useContext } from "react"
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { AuthContext } from "../../context/AuthContext"
import axios from "../../api/axios"
import SortableColumn from "../../components/SortableColumn"
import TaskCard from "../../components/TaskCard"
import { CheckCircle, AlertCircle, X } from "lucide-react"

const Kanban = () => {
  const { user } = useContext(AuthContext)
  const [boardData, setBoardData] = useState({ columns: {}, tasks: {}, columnOrder: [] })
  const [alert, setAlert] = useState({ show: false, variant: "success", message: "" })
  const [isSending, setIsSending] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [activeType, setActiveType] = useState(null)

  const isViewer = user?.roles?.includes("Viewer")

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  const dropAnimationConfig = { ...defaultDropAnimation, dragSourceOpacity: 0.5 }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        }
        const res = await axios.get("/api/tasks")
        const columns = {
          todo: { id: "todo", title: "To Do", taskIds: [] },
          "in-progress": { id: "in-progress", title: "In Progress", taskIds: [] },
          done: { id: "done", title: "Done", taskIds: [] },
        }
        const tasks = {}
        res.data.forEach((task) => {
          const id = task._id
          tasks[id] = { ...task, id }
          columns[task.column].taskIds.push(id)
        })
        setBoardData({ columns, tasks, columnOrder: ["todo", "in-progress", "done"] })
      } catch (error) {
        console.error("Failed to load tasks:", error)
        setAlert({ show: true, variant: "danger", message: "Failed to load tasks" })
      }
    }
    fetchTasks()
  }, [])

  const addTask = async (columnId, content) => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      }
      const res = await axios.post("/api/tasks", { content, column: columnId })
      const task = res.data
      const id = task._id
      setBoardData((prev) => ({
        ...prev,
        tasks: { ...prev.tasks, [id]: { ...task, id } },
        columns: {
          ...prev.columns,
          [columnId]: {
            ...prev.columns[columnId],
            taskIds: [...prev.columns[columnId].taskIds, id],
          },
        },
      }))
    } catch (err) {
      console.error(err)
      setAlert({ show: true, variant: "danger", message: "Failed to add task" })
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      }
      await axios.delete(`/api/tasks/${taskId}`)
      setBoardData((prev) => {
        const newTasks = { ...prev.tasks }
        delete newTasks[taskId]
        const newColumns = {}
        for (const [colId, column] of Object.entries(prev.columns)) {
          newColumns[colId] = {
            ...column,
            taskIds: column.taskIds.filter((id) => id !== taskId),
          }
        }
        return {
          ...prev,
          tasks: newTasks,
          columns: newColumns,
        }
      })
    } catch (err) {
      console.error(err)
      setAlert({ show: true, variant: "danger", message: "Failed to delete task" })
    }
  }

  const handleCompleteDay = async () => {
    try {
      setIsSending(true)
      const token = localStorage.getItem("token")
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      }
      await axios.post("/api/tasks/complete")
      setBoardData((prev) => {
        const newTasks = { ...prev.tasks }
        prev.columns.done.taskIds.forEach((id) => delete newTasks[id])
        return {
          ...prev,
          tasks: newTasks,
          columns: {
            ...prev.columns,
            done: { ...prev.columns.done, taskIds: [] },
          },
        }
      })
      setAlert({ show: true, variant: "success", message: "Done tasks cleared" })
    } catch (err) {
      console.log(err)
      setAlert({ show: true, variant: "danger", message: "Failed to clear done tasks" })
    } finally {
      setIsSending(false)
    }
  }

  const handleDragStart = ({ active }) => {
    if (boardData.columnOrder.includes(active.id)) {
      setActiveType("column")
    } else if (boardData.tasks[active.id]) {
      setActiveType("task")
    } else {
      setActiveType(null)
    }
    setActiveId(active.id)
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over) return
    if (activeType === "column") {
      if (active.id !== over.id) {
        const oldIndex = boardData.columnOrder.indexOf(active.id)
        const newIndex = boardData.columnOrder.indexOf(over.id)
        const newColumnOrder = arrayMove(boardData.columnOrder, oldIndex, newIndex)
        setBoardData((prev) => ({
          ...prev,
          columnOrder: newColumnOrder,
        }))
      }
    }
    if (activeType === "task") {
      const sourceColumn = Object.values(boardData.columns).find((col) => col.taskIds.includes(active.id))
      const destColumn = Object.values(boardData.columns).find(
        (col) => col.taskIds.includes(over.id) || col.id === over.id,
      )
      if (!sourceColumn || !destColumn) return
      if (sourceColumn.id === destColumn.id) {
        const oldIndex = sourceColumn.taskIds.indexOf(active.id)
        const newIndex = destColumn.taskIds.indexOf(over.id)
        if (oldIndex !== newIndex) {
          const newTaskIds = arrayMove(sourceColumn.taskIds, oldIndex, newIndex)
          setBoardData((prev) => ({
            ...prev,
            columns: {
              ...prev.columns,
              [sourceColumn.id]: { ...sourceColumn, taskIds: newTaskIds },
            },
          }))
        }
      } else {
        const newSourceIds = sourceColumn.taskIds.filter((id) => id !== active.id)
        const newDestIds = [...destColumn.taskIds]
        const overIndex = newDestIds.indexOf(over.id)
        newDestIds.splice(overIndex >= 0 ? overIndex : newDestIds.length, 0, active.id)
        setBoardData((prev) => ({
          ...prev,
          columns: {
            ...prev.columns,
            [sourceColumn.id]: { ...sourceColumn, taskIds: newSourceIds },
            [destColumn.id]: { ...destColumn, taskIds: newDestIds },
          },
          tasks: {
            ...prev.tasks,
            [active.id]: { ...prev.tasks[active.id], column: destColumn.id },
          },
        }))
        const token = localStorage.getItem("token")
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        }
        axios.put(`/api/tasks/${active.id}`, { column: destColumn.id }).catch(console.error)
      }
    }
    setActiveId(null)
    setActiveType(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Task Board</h1>
          <p className="text-gray-300">Organize and track your tasks</p>
        </div>

        {/* Alert */}
        {alert.show && (
          <div
            className={`mb-6 backdrop-blur-xl border rounded-xl p-4 flex items-center justify-between ${
              alert.variant === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-300"
                : "bg-red-500/10 border-red-500/20 text-red-300"
            }`}
          >
            <div className="flex items-center">
              {alert.variant === "success" ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span>{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert({ show: false })}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={boardData.columnOrder} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-6 overflow-x-auto pb-4" style={{ minHeight: "70vh" }}>
              {boardData.columnOrder.map((columnId) => {
                const column = boardData.columns[columnId]
                const tasks = column.taskIds.map((id) => ({ ...boardData.tasks[id], id }))
                return (
                  <div key={columnId} className="flex-shrink-0 w-80">
                    <SortableColumn
                      id={columnId}
                      title={column.title}
                      tasks={tasks}
                      isDragging={activeId === columnId}
                      addTask={addTask}
                      deleteTask={deleteTask}
                      onCompleteDay={handleCompleteDay}
                      isSending={isSending}
                      isViewer={isViewer}
                    />
                  </div>
                )
              })}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeType === "task" && boardData.tasks[activeId] ? <TaskCard task={boardData.tasks[activeId]} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

export default Kanban
