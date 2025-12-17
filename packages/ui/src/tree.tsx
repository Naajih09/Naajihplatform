import * as React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const TreeContext = React.createContext<{
  selected: string[];
  onSelect: (id: string) => void;
}>({
  selected: [],
  onSelect: () => {},
});

interface TreeProps {
  children: React.ReactNode;
  selected?: string[];
  onSelect?: (id: string) => void;
  className?: string;
}

export function Tree({
  children,
  selected = [],
  onSelect = () => {},
  className,
}: TreeProps) {
  return (
    <TreeContext.Provider value={{ selected, onSelect }}>
      <div className={className}>
        <ul role='tree' className='space-y-1'>
          {children}
        </ul>
      </div>
    </TreeContext.Provider>
  );
}

interface TreeItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function TreeItem({ id, children, className }: TreeItemProps) {
  const { selected, onSelect } = React.useContext(TreeContext);
  const isSelected = selected?.includes(id);

  return (
    <li
      role='treeitem'
      aria-selected={isSelected}
      className={className}
      onClick={() => onSelect(id)}
    >
      {children}
    </li>
  );
}

interface TreeItemContentProps {
  children: React.ReactNode;
  className?: string;
}

export function TreeItemContent({ children, className }: TreeItemContentProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>{children}</div>
  );
}

interface TreeItemToggleProps {
  expanded: boolean;
  onExpand: () => void;
  className?: string;
}

export function TreeItemToggle({
  expanded,
  onExpand,
  className,
}: TreeItemToggleProps) {
  return (
    <button
      type='button'
      onClick={(e) => {
        e.stopPropagation();
        onExpand();
      }}
      className={`flex items-center justify-center ${className}`}
    >
      {expanded ? (
        <ChevronDown className='h-4 w-4' />
      ) : (
        <ChevronRight className='h-4 w-4' />
      )}
    </button>
  );
}

export function TreeItemToggleIcon({
  icon: Icon,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return <Icon className={`h-4 w-4 ${className}`} />;
}
