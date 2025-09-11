/**
 * Smart Tourist Safety System - Table Component
 * Data display table with sorting, filtering capabilities, and responsive design
 */

import * as React from 'react';
import { ChevronUp, ChevronDown, Search, Filter, Download, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TABLE COMPONENT INTERFACES
// ============================================================================

export interface Column<T = any> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T, index: number) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  className?: string;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

// ============================================================================
// BASE TABLE COMPONENTS
// ============================================================================

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// ============================================================================
// ENHANCED DATA TABLE COMPONENT
// ============================================================================

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  sortable = true,
  filterable = true,
  selectable = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onSelectionChange,
  className,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig | null>(null);
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!filterValue) return data;
    
    return data.filter(row =>
      columns.some(column => {
        const value = typeof column.accessor === 'function' 
          ? column.accessor(row)
          : row[column.accessor];
        
        return String(value || '')
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      })
    );
  }, [data, filterValue, columns]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const column = columns.find(col => col.id === sortConfig.column);
      if (!column) return 0;

      const aValue = typeof column.accessor === 'function' 
        ? column.accessor(a)
        : a[column.accessor];
      const bValue = typeof column.accessor === 'function' 
        ? column.accessor(b)
        : b[column.accessor];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, columns]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Calculate pagination info
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, sortedData.length);

  const handleSort = (columnId: string) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.id === columnId);
    if (!column || column.sortable === false) return;

    setSortConfig(current => {
      if (current?.column === columnId) {
        if (current.direction === 'asc') {
          return { column: columnId, direction: 'desc' };
        } else {
          return null; // Remove sorting
        }
      }
      return { column: columnId, direction: 'asc' };
    });
  };

  const handleRowSelection = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
    
    const selectedData = Array.from(newSelected).map(idx => sortedData[idx]);
    onSelectionChange?.(selectedData);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const allIndexes = new Set(paginatedData.map((_, idx) => idx));
      setSelectedRows(allIndexes);
      onSelectionChange?.(paginatedData);
    }
  };

  const getSortIcon = (columnId: string) => {
    if (sortConfig?.column !== columnId) {
      return <div className="w-4 h-4" />; // Placeholder for alignment
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />;
  };

  const renderCellValue = (column: Column<T>, row: T, index: number) => {
    const value = typeof column.accessor === 'function' 
      ? column.accessor(row)
      : row[column.accessor];

    if (column.render) {
      return column.render(value, row, index);
    }

    return String(value || '');
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Table Controls */}
      {(filterable || sortable) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {filterable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  style={{ width: column.width }}
                  className={cn(
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    (sortable && column.sortable !== false) && 'cursor-pointer hover:bg-gray-50'
                  )}
                  onClick={() => handleSort(column.id)}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.header}</span>
                    {(sortable && column.sortable !== false) && getSortIcon(column.id)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-8">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-8 text-gray-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    onRowClick && 'cursor-pointer',
                    selectedRows.has(index) && 'bg-blue-50'
                  )}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {selectable && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={() => handleRowSelection(index)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {renderCellValue(column, row, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startItem} to {endItem} of {sortedData.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "px-3 py-1 border rounded text-sm",
                      isActive 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SPECIALIZED TABLE COMPONENTS
// ============================================================================

// Tourist Table
interface TouristTableProps {
  tourists: Array<{
    id: string;
    name: string;
    nationality: string;
    status: 'safe' | 'alert' | 'emergency';
    location: string;
    lastSeen: string;
    contact: string;
  }>;
  onViewTourist?: (id: string) => void;
  onTrackTourist?: (id: string) => void;
}

function TouristTable({ tourists, onViewTourist, onTrackTourist }: TouristTableProps) {
  const columns: Column<TouristTableProps['tourists'][0]>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {value.split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.nationality}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => {
        const colors = {
          safe: 'bg-green-100 text-green-800',
          alert: 'bg-yellow-100 text-yellow-800',
          emergency: 'bg-red-100 text-red-800',
        };
        
        return (
          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', colors[value as keyof typeof colors])}>
            {(value as string).toUpperCase()}
          </span>
        );
      },
    },
    {
      id: 'location',
      header: 'Location',
      accessor: 'location',
      sortable: true,
    },
    {
      id: 'lastSeen',
      header: 'Last Seen',
      accessor: 'lastSeen',
      sortable: true,
    },
    {
      id: 'contact',
      header: 'Contact',
      accessor: 'contact',
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => null,
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewTourist?.(row.id)}
            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
          >
            View
          </button>
          <button
            onClick={() => onTrackTourist?.(row.id)}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Track
          </button>
        </div>
      ),
    },
  ];

  return <DataTable data={tourists} columns={columns} />;
}

// Alert Table
interface AlertTableProps {
  alerts: Array<{
    id: string;
    type: 'emergency' | 'security' | 'medical' | 'general';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    location: string;
    timestamp: string;
    status: 'open' | 'acknowledged' | 'resolved';
    assignee?: string;
  }>;
  onViewAlert?: (id: string) => void;
  onResolveAlert?: (id: string) => void;
}

function AlertTable({ alerts, onViewAlert, onResolveAlert }: AlertTableProps) {
  const columns: Column<AlertTableProps['alerts'][0]>[] = [
    {
      id: 'severity',
      header: 'Severity',
      accessor: 'severity',
      sortable: true,
      render: (value) => {
        const colors = {
          low: 'bg-blue-100 text-blue-800',
          medium: 'bg-yellow-100 text-yellow-800',
          high: 'bg-orange-100 text-orange-800',
          critical: 'bg-red-100 text-red-800',
        };
        
        return (
          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', colors[value as keyof typeof colors])}>
            {(value as string).toUpperCase()}
          </span>
        );
      },
    },
    {
      id: 'title',
      header: 'Alert',
      accessor: 'title',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500 capitalize">{row.type}</div>
        </div>
      ),
    },
    {
      id: 'location',
      header: 'Location',
      accessor: 'location',
      sortable: true,
    },
    {
      id: 'timestamp',
      header: 'Time',
      accessor: 'timestamp',
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (value) => (
        <span className="capitalize">{value}</span>
      ),
    },
    {
      id: 'assignee',
      header: 'Assignee',
      accessor: 'assignee',
      render: (value) => value || 'Unassigned',
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => null,
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewAlert?.(row.id)}
            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
          >
            View
          </button>
          {row.status !== 'resolved' && (
            <button
              onClick={() => onResolveAlert?.(row.id)}
              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
            >
              Resolve
            </button>
          )}
        </div>
      ),
    },
  ];

  return <DataTable data={alerts} columns={columns} />;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  DataTable,
  TouristTable,
  AlertTable,
};

export type {
  TouristTableProps,
  AlertTableProps,
};