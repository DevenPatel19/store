"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2, GripVertical } from "lucide-react"

const SortableTask = ({ id, task, onDelete, isViewer }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    pointerEvents: isDragging ? "none" : "auto",
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:bg-white/10 hover:border-white/20 ${
        isDragging ? "border-purple-500/50 shadow-lg scale-105" : ""
      }`}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Task Content */}
        <div className="flex-1 min-w-0" {...listeners}>
          <div className="flex items-start gap-2">
            <GripVertical className="h-4 w-4 text-gray-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex-1">
              <p className="text-white text-sm leading-relaxed mb-1 break-words">{task.content}</p>
              {task.createdAt && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></div>
                  <small className="text-gray-400 text-xs">{formatDate(task.createdAt)}</small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Button - Always Visible */}
        {!isViewer && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(id)
            }}
            style={{ pointerEvents: isDragging ? "none" : "auto" }}
            className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
    </div>
  )
}

export default SortableTask
