import { Button } from '@/components/ui/Button';

type TableBulkActionsProps = {
  selectedCount: number;
  onClearSelection: () => void;
  onAction: () => void;
  actionLabel: string;
};

export default function TableBulkActions({
  selectedCount,
  onClearSelection,
  onAction,
  actionLabel,
}: TableBulkActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-stroke bg-panel p-3 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-foreground">
        {selectedCount} row{selectedCount > 1 ? 's' : ''} selected
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" variant="outline" size="sm" onClick={onClearSelection}>
          Clear Selection
        </Button>
        <Button type="button" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
