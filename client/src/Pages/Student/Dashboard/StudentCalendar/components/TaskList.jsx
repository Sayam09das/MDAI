import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { useCalendar } from '../../../../../context/CalendarContext';

const PRIORITY_CONFIG = {
  low: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', icon: 'text-green-500' },
  medium: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-500' },
  high: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: 'text-red-500' },
};

const TaskItem = ({ task, onToggle, onClick }) => {
  const config = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
        task.completed 
          ? 'bg-gray-50 border-gray-200 opacity-75' 
          : config.bg + ' ' + config.text.replace('text-', 'border-')
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`flex-shrink-0 mt-0.5 transition-all ${
            task.completed 
              ? 'text-green-500 scale-110' 
              : `${config.icon} hover:scale-110`
          }`}
        >
          {task.completed ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              task.completed ? 'bg-gray-200 text-gray-600' : config.bg
            }`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            {task.reminder && (
              <AlertCircle className="w-3 h-3 text-blue-500" />
            )}
          </div>
          
          <h4 className={`font-medium truncate ${
            task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            {task.title}
          </h4>
          
          {task.description && (
            <p className={`text-sm mt-1 line-clamp-2 ${
              task.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            {/* Date */}
            <div className={`flex items-center gap-1 text-xs ${
              task.completed ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Clock className="w-3 h-3" />
              <span>
                {new Date(task.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  ...(!task.allDay && { hour: '2-digit', minute: '2-digit' })
                })}
              </span>
            </div>

            {/* Time remaining for incomplete tasks */}
            {!task.completed && task.reminder && (
              <span className={`text-xs ${
                new Date(task.date) < new Date() 
                  ? 'text-red-500 font-medium' 
                  : 'text-gray-400'
              }`}>
                {new Date(task.date) < new Date() 
                  ? 'Overdue' 
                  : 'Has reminder'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      {!task.completed && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent overflow-hidden rounded-b-xl">
          <div 
            className={`h-full transition-all duration-500 ${
              task.priority === 'high' 
                ? 'bg-red-400' 
                : task.priority === 'medium' 
                  ? 'bg-yellow-400' 
                  : 'bg-green-400'
            }`}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </motion.div>
  );
};

const TaskList = ({ tasks = [], onTaskToggle, onTaskClick }) => {
  const { getPendingTasks } = useCalendar();
  
  // If no tasks prop provided, get from context
  const displayTasks = tasks.length > 0 ? tasks : getPendingTasks();

  if (displayTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <CheckCircle className="w-7 h-7 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">All Caught Up!</h3>
        <p className="text-xs text-gray-500">No pending tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Pending Tasks ({displayTasks.length})
        </h3>
      </div>
      
      <div className="space-y-2">
        {displayTasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onTaskToggle?.(task.id)}
            onClick={() => onTaskClick?.(task)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;

