/**
 * Smart Tourist Safety System - Advanced Data Grid Component
 * Enhanced data display with sorting, filtering, grouping, export, and real-time updates
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Settings,
  Eye,
  EyeOff,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns,
  Group,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  Printer,
  Share2,
  X,
  Check,
  AlertTriangle,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Temporarily using basic dropdown implementation
interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => <div className="relative">{children}</div>;
const DropdownMenuTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => <div>{children}</div>;
const DropdownMenuContent: React.FC<{ align?: string; className?: string; children: React.ReactNode }> = ({ children, className }) => <div className={cn("absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50", className)}>{children}</div>;
const DropdownMenuItem: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => <div onClick={onClick} className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100">{children}</div>;
const DropdownMenuSeparator: React.FC = () => <div className="h-px bg-gray-200 my-1" />;
const DropdownMenuCheckboxItem: React.FC<{ checked?: boolean; onCheckedChange?: (checked: boolean) => void; children: React.ReactNode }> = ({ checked, onCheckedChange, children }) => (
  <div onClick={() => onCheckedChange?.(!checked)} className="flex items-center cursor-pointer px-4 py-2 text-sm hover:bg-gray-100">
    <div className="mr-2 h-4 w-4 border rounded flex items-center justify-center">
      {checked && <Check className="h-3 w-3" />}
    </div>
    {children}
  </div>
);
const DropdownMenuLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">{children}</div>;

// Basic checkbox component
interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onCheckedChange, className }) => (
  <div 
    onClick={() => onCheckedChange?.(!checked)}
    className={cn(
      "h-4 w-4 border-2 rounded flex items-center justify-center cursor-pointer transition-colors",
      checked ? "bg-primary border-primary text-primary-foreground" : "border-gray-300 hover:border-gray-400",
      className
    )}
  >
    {checked && <Check className="h-3 w-3" />}
  </div>
);
import { useTranslation } from '@/hooks/use-translation';

// ============================================================================
// INTERFACES AND TYPES
// ============================================================================

export interface DataGridColumn<T = any> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  filterable?: boolean;
  groupable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  resizable?: boolean;
  hidden?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean';
  filterOptions?: Array<{ label: string; value: any }>;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  priority?: 'high' | 'medium' | 'low'; // For responsive hiding
}

export interface DataGridProps<T = any> {
  data: T[];
  columns: DataGridColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  title?: string;
  subtitle?: string;
  height?: string | number;
  virtualScrolling?: boolean;
  groupBy?: string;
  defaultSort?: { column: string; direction: 'asc' | 'desc' };
  selectable?: boolean;
  multiSelect?: boolean;
  expandable?: boolean;
  exportable?: boolean;
  refreshable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  columnResizing?: boolean;
  columnReordering?: boolean;
  pagination?: boolean;
  pageSize?: number;
  realTimeUpdates?: boolean;
  emergencyMode?: boolean;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  onRefresh?: () => void;
  renderRowDetails?: (row: T) => React.ReactNode;
  rowClassName?: (row: T, index: number) => string;
  className?: string;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  column: string;
  value: any;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'between';
}

export interface GroupConfig {
  column: string;
  expanded: Record<string, boolean>;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const sortData = <T,>(data: T[], sortConfig: SortConfig, columns: DataGridColumn<T>[]): T[] => {
  if (!sortConfig.column) return data;

  const column = columns.find(col => col.id === sortConfig.column);
  if (!column) return data;

  return [...data].sort((a, b) => {
    const aValue = typeof column.accessor === 'function' 
      ? column.accessor(a) 
      : a[column.accessor as keyof T];
    const bValue = typeof column.accessor === 'function' 
      ? column.accessor(b) 
      : b[column.accessor as keyof T];

    let comparison = 0;
    
    if (aValue === null || aValue === undefined) comparison = 1;
    else if (bValue === null || bValue === undefined) comparison = -1;
    else if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortConfig.direction === 'desc' ? -comparison : comparison;
  });
};

const filterData = <T,>(data: T[], filters: FilterConfig[], columns: DataGridColumn<T>[]): T[] => {
  if (filters.length === 0) return data;

  return data.filter(row => {
    return filters.every(filter => {
      const column = columns.find(col => col.id === filter.column);
      if (!column) return true;

      const value = typeof column.accessor === 'function' 
        ? column.accessor(row) 
        : row[column.accessor as keyof T];

      const filterValue = filter.value;
      const stringValue = String(value).toLowerCase();
      const filterStringValue = String(filterValue).toLowerCase();

      switch (filter.operator) {
        case 'equals':
          return value === filterValue;
        case 'contains':
          return stringValue.includes(filterStringValue);
        case 'startsWith':
          return stringValue.startsWith(filterStringValue);
        case 'endsWith':
          return stringValue.endsWith(filterStringValue);
        case 'gt':
          return Number(value) > Number(filterValue);
        case 'lt':
          return Number(value) < Number(filterValue);
        default:
          return true;
      }
    });
  });
};

const groupData = <T,>(data: T[], groupBy: string, columns: DataGridColumn<T>[]): Record<string, T[]> => {
  if (!groupBy) return { all: data };

  const column = columns.find(col => col.id === groupBy);
  if (!column) return { all: data };

  return data.reduce((groups, row) => {
    const value = typeof column.accessor === 'function' 
      ? column.accessor(row) 
      : row[column.accessor as keyof T];
    
    const groupKey = String(value || 'Unknown');
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(row);
    return groups;
  }, {} as Record<string, T[]>);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const DataGrid = <T extends Record<string, any>>({
  data,
  columns: initialColumns,
  loading = false,
  emptyMessage = 'No data available',
  title,
  subtitle,
  height = 'auto',
  virtualScrolling = false,
  groupBy,
  defaultSort,
  selectable = false,
  multiSelect = false,
  expandable = false,
  exportable = true,
  refreshable = true,
  searchable = true,
  filterable = true,
  columnResizing = false,
  columnReordering = false,
  pagination = true,
  pageSize = 50,
  realTimeUpdates = false,
  emergencyMode = false,
  onRowClick,
  onRowDoubleClick,
  onSelectionChange,
  onExport,
  onRefresh,
  renderRowDetails,
  rowClassName,
  className
}: DataGridProps<T>) => {
  const { t } = useTranslation();
  
  // State management
  const [columns, setColumns] = useState(initialColumns);
  const [sortConfig, setSortConfig] = useState<SortConfig>(
    defaultSort || { column: '', direction: 'asc' }
  );
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [groupConfig, setGroupConfig] = useState<GroupConfig>({
    column: groupBy || '',
    expanded: {}
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  // Memoized data processing
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(row =>
        columns.some(column => {
          if (!column.filterable && column.id !== 'search') return false;
          const value = typeof column.accessor === 'function' 
            ? column.accessor(row) 
            : row[column.accessor as keyof T];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    filtered = filterData(filtered, filters, columns);

    // Apply sorting
    filtered = sortData(filtered, sortConfig, columns);

    return filtered;
  }, [data, searchTerm, filters, sortConfig, columns]);

  const groupedData = useMemo(() => {
    return groupData(processedData, groupConfig.column, columns);
  }, [processedData, groupConfig.column, columns]);

  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Event handlers
  const handleSort = useCallback((columnId: string) => {
    setSortConfig(prev => ({
      column: columnId,
      direction: prev.column === columnId && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleFilter = useCallback((columnId: string, value: any, operator: FilterConfig['operator'] = 'contains') => {
    setFilters(prev => {
      const existing = prev.findIndex(f => f.column === columnId);
      if (existing >= 0) {
        if (value === '' || value === null || value === undefined) {
          return prev.filter((_, i) => i !== existing);
        }
        const newFilters = [...prev];
        newFilters[existing] = { column: columnId, value, operator };
        return newFilters;
      } else if (value !== '' && value !== null && value !== undefined) {
        return [...prev, { column: columnId, value, operator }];
      }
      return prev;
    });
  }, []);

  const handleRowSelection = useCallback((index: number, selected: boolean) => {
    if (!selectable) return;

    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (selected) {
        if (multiSelect) {
          newSet.add(index);
        } else {
          newSet.clear();
          newSet.add(index);
        }
      } else {
        newSet.delete(index);
      }
      return newSet;
    });
  }, [selectable, multiSelect]);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (!selectable || !multiSelect) return;

    if (selected) {
      setSelectedRows(new Set(paginatedData.map((_, index) => index)));
    } else {
      setSelectedRows(new Set());
    }
  }, [selectable, multiSelect, paginatedData]);

  const handleExport = useCallback((format: 'csv' | 'excel' | 'pdf') => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export implementation
      console.log(`Exporting ${processedData.length} rows as ${format}`);
    }
  }, [onExport, processedData]);

  const handleRefresh = useCallback(async () => {
    if (!refreshable) return;

    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [refreshable, onRefresh]);

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, hidden: !col.hidden } : col
    ));
  }, []);

  // Effect for selection change callback
  useEffect(() => {
    if (onSelectionChange) {
      const selectedData = Array.from(selectedRows).map(index => paginatedData[index]);
      onSelectionChange(selectedData);
    }
  }, [selectedRows, paginatedData, onSelectionChange]);

  // Visible columns
  const visibleColumns = columns.filter(col => !col.hidden);

  // Render functions
  const renderHeader = () => (
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div>
          {title && <CardTitle className="text-xl font-semibold">{title}</CardTitle>}
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-2">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          )}

          {refreshable && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              {t('common.refresh')}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Columns className="h-4 w-4" />
                {t('common.columns')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('common.toggleColumns')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={!column.hidden}
                  onCheckedChange={() => toggleColumnVisibility(column.id)}
                >
                  {column.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {exportable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  {t('common.export')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <Printer className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Active filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.map((filter, index) => {
            const column = columns.find(col => col.id === filter.column);
            return (
              <Badge key={index} variant="secondary" className="gap-1">
                {column?.header}: {String(filter.value)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilter(filter.column, null)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </CardHeader>
  );

  const renderTableHeader = () => (
    <thead className="bg-muted/50">
      <tr>
        {selectable && (
          <th className="w-12 px-4 py-3">
            {multiSelect && (
              <Checkbox
                checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                onCheckedChange={handleSelectAll}
              />
            )}
          </th>
        )}
        
        {visibleColumns.map(column => (
          <th
            key={column.id}
            className={cn(
              "px-4 py-3 text-left font-medium text-sm",
              column.align === 'center' && "text-center",
              column.align === 'right' && "text-right",
              column.sortable && "cursor-pointer hover:bg-muted/70 select-none"
            )}
            style={{ 
              width: column.width,
              minWidth: column.minWidth,
              maxWidth: column.maxWidth
            }}
            onClick={() => column.sortable && handleSort(column.id)}
          >
            <div className="flex items-center gap-2">
              <span>{column.header}</span>
              
              {column.sortable && (
                <div className="flex flex-col">
                  {sortConfig.column === column.id ? (
                    sortConfig.direction === 'asc' ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                  )}
                </div>
              )}

              {column.filterable && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Filter className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2">
                      <Input
                        placeholder={`Filter ${column.header.toLowerCase()}...`}
                        onChange={(e) => handleFilter(column.id, e.target.value)}
                      />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </th>
        ))}
        
        {(expandable || onRowClick) && (
          <th className="w-12 px-4 py-3"></th>
        )}
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
      <AnimatePresence>
        {paginatedData.map((row, index) => {
          const isSelected = selectedRows.has(index);
          const isExpanded = expandedRows.has(index);
          
          return (
            <React.Fragment key={index}>
              <motion.tr
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className={cn(
                  "border-b hover:bg-muted/50 transition-colors",
                  isSelected && "bg-primary/10",
                  emergencyMode && "text-sm",
                  rowClassName?.(row, index)
                )}
                onClick={() => onRowClick?.(row, index)}
                onDoubleClick={() => onRowDoubleClick?.(row, index)}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked: boolean) => handleRowSelection(index, checked)}
                    />
                  </td>
                )}
                
                {visibleColumns.map(column => {
                  const value = typeof column.accessor === 'function' 
                    ? column.accessor(row) 
                    : row[column.accessor as keyof T];
                  
                  return (
                    <td
                      key={column.id}
                      className={cn(
                        "px-4 py-3",
                        column.align === 'center' && "text-center",
                        column.align === 'right' && "text-right"
                      )}
                    >
                      {column.render ? column.render(value, row, index) : String(value || '')}
                    </td>
                  );
                })}
                
                {(expandable || onRowClick) && (
                  <td className="px-4 py-3">
                    {expandable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedRows(prev => {
                            const newSet = new Set(prev);
                            if (isExpanded) {
                              newSet.delete(index);
                            } else {
                              newSet.add(index);
                            }
                            return newSet;
                          });
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </td>
                )}
              </motion.tr>
              
              {expandable && isExpanded && renderRowDetails && (
                <motion.tr
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-muted/30"
                >
                  <td colSpan={visibleColumns.length + (selectable ? 1 : 0) + 1} className="p-4">
                    {renderRowDetails(row)}
                  </td>
                </motion.tr>
              )}
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </tbody>
  );

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} results
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        {renderHeader()}
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (processedData.length === 0) {
    return (
      <Card className={className}>
        {renderHeader()}
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Data Found</h3>
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {renderHeader()}
      
      <CardContent className="p-0">
        <div 
          ref={gridRef}
          className="overflow-auto"
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
        >
          <table className="w-full">
            {renderTableHeader()}
            {renderTableBody()}
          </table>
        </div>
        
        {renderPagination()}
      </CardContent>
    </Card>
  );
};

export default DataGrid;