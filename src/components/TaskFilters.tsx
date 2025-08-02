import { Task } from '@/types/Task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TaskFiltersProps {
  activeFilter: string | undefined;
  onFilterChange: (status?: string) => void;
  taskCounts: {
    all: number;
    pending: number;
    'in-progress': number;
    completed: number;
  };
}

const filters = [
  { key: undefined, label: 'All Tasks', variant: 'secondary' as const },
  { key: 'pending', label: 'Pending', variant: 'pending' as const },
  { key: 'in-progress', label: 'In Progress', variant: 'progress' as const },
  { key: 'completed', label: 'Completed', variant: 'completed' as const },
];

export function TaskFilters({ activeFilter, onFilterChange, taskCounts }: TaskFiltersProps) {
  const getCount = (key: string | undefined) => {
    switch (key) {
      case undefined:
        return taskCounts.all;
      case 'pending':
        return taskCounts.pending;
      case 'in-progress':
        return taskCounts['in-progress'];
      case 'completed':
        return taskCounts.completed;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(({ key, label, variant }) => (
        <Button
          key={key || 'all'}
          variant={activeFilter === key ? 'default' : 'outline'}
          onClick={() => onFilterChange(key)}
          className="h-auto py-2 px-4"
        >
          <span className="mr-2">{label}</span>
          <Badge 
            variant={activeFilter === key ? 'secondary' : variant}
            className="ml-1 text-xs"
          >
            {getCount(key)}
          </Badge>
        </Button>
      ))}
    </div>
  );
}