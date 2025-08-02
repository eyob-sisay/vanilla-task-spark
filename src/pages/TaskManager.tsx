import { useState, useEffect } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '@/types/Task';
import { getTasks, createTask, updateTask } from '@/utils/api';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, RefreshCw } from 'lucide-react';

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, [activeFilter]);

  useEffect(() => {
    // Filter tasks based on active filter
    if (activeFilter) {
      setFilteredTasks(tasks.filter(task => task.status === activeFilter));
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, activeFilter]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await getTasks(activeFilter);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please check if the API server is running.",
        variant: "destructive",
      });
      // Set mock data for demo purposes when API is not available
      setTasks([
        {
          id: 1,
          title: "Design user interface",
          description: "Create wireframes and mockups for the task manager application",
          status: "in-progress",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          title: "Implement REST API",
          description: "Build PHP backend with SQLite database",
          status: "completed",
          created_at: "2024-01-14T09:00:00Z",
          updated_at: "2024-01-14T09:00:00Z"
        },
        {
          id: 3,
          title: "Write documentation",
          description: "Create comprehensive README with setup instructions",
          status: "pending",
          created_at: "2024-01-16T08:00:00Z",
          updated_at: "2024-01-16T08:00:00Z"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      setIsSubmitting(true);
      const newTask = await createTask(data);
      setTasks(prev => [newTask, ...prev]);
      setShowForm(false);
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: UpdateTaskData) => {
    if (!editingTask) return;
    
    try {
      setIsSubmitting(true);
      const updatedTask = await updateTask(editingTask.id, data);
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ));
      setEditingTask(undefined);
      toast({
        title: "Success",
        description: "Task updated successfully!",
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  const getTaskCounts = () => {
    const allTasks = tasks;
    return {
      all: allTasks.length,
      pending: allTasks.filter(t => t.status === 'pending').length,
      'in-progress': allTasks.filter(t => t.status === 'in-progress').length,
      completed: allTasks.filter(t => t.status === 'completed').length,
    };
  };

  if (showForm || editingTask) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={handleCancelForm}
              className="mb-4"
            >
              ← Back to Tasks
            </Button>
          </div>
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCancelForm}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
              <p className="text-muted-foreground mt-1">
                Organize and track your tasks efficiently
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={loadTasks}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter Tasks</h2>
          <TaskFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            taskCounts={getTaskCounts()}
          />
        </div>

        {/* Tasks */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {activeFilter ? `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Tasks` : 'All Tasks'}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading tasks...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {activeFilter 
                  ? `No ${activeFilter} tasks at the moment.`
                  : 'Get started by creating your first task!'
                }
              </p>
              {!activeFilter && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Task
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}