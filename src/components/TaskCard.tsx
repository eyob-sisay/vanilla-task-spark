import { Task } from '@/types/Task';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const getStatusVariant = (status: Task['status']) => {
  switch (status) {
    case 'pending':
      return 'pending' as const;
    case 'in-progress':
      return 'progress' as const;
    case 'completed':
      return 'completed' as const;
    default:
      return 'secondary' as const;
  }
};

const getStatusLabel = (status: Task['status']) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in-progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getStatusVariant(task.status)}>
                {getStatusLabel(task.status)}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(task.created_at)}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="pt-0">
          <CardDescription className="text-sm leading-relaxed">
            {task.description}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  );
}