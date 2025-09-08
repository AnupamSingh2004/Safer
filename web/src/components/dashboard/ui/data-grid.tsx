/**
 * Smart Tourist Safety System - Advanced Data Grid Component
 * Sophisticated table with sorting, filtering, pagination, and export
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Download,
  Settings,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  SortAsc,
  SortDesc,
  Columns,
  RefreshCw,
  X,
  Plus,
  FileText,
  Table,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface DataGridColumn<T = any> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => any;
  cell?: (props: { row: T; value: any }) => React.ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean';
  filterOptions?: Array<{ label: string; value: any }>;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  sticky?: 'left' | 'right';
  visible?: boolean;
}

interface DataGridFilter {
  id: string;
  value: any;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
}

interface DataGridSort {
  id: string;
  direction: 'asc' | 'desc';
}

interface DataGridPagination {
  page: number;
  pageSize: number;
  total: number;
}

interface DataGridSelection {
  selectedRows: Set<string>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

interface DataGridProps<T = any> {
  data: T[];
  columns: DataGridColumn<T>[];
  rowIdAccessor?: keyof T | ((row: T) => string);
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableSelection?: boolean;
  enableColumnResizing?: boolean;
  enableColumnVisibility?: boolean;
  enableExport?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  onRowSelect?: (selectedRows: T[]) => void;
  onSort?: (sort: DataGridSort[]) => void;
  onFilter?: (filters: DataGridFilter[]) => void;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV', icon: FileText },
  { value: 'excel', label: 'Excel', icon: Table },
  { value: 'pdf', label: 'PDF', icon: FileText },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function compareValues(a: any, b: any, direction: 'asc' | 'desc'): number {
  if (a === null || a === undefined) return direction === 'asc' ? 1 : -1;
  if (b === null || b === undefined) return direction === 'asc' ? -1 : 1;
  
  if (typeof a === 'string' && typeof b === 'string') {
    return direction === 'asc' 
      ? a.localeCompare(b) 
      : b.localeCompare(a);
  }
  
  if (typeof a === 'number' && typeof b === 'number') {
    return direction === 'asc' ? a - b : b - a;
  }
  
  if (a instanceof Date && b instanceof Date) {
    return direction === 'asc' 
      ? a.getTime() - b.getTime() 
      : b.getTime() - a.getTime();
  }
  
  return direction === 'asc' 
    ? String(a).localeCompare(String(b))
    : String(b).localeCompare(String(a));
}

function filterData<T>(data: T[], filters: DataGridFilter[], columns: DataGridColumn<T>[]): T[] {
  if (filters.length === 0) return data;
  
  return data.filter(row => {
    return filters.every(filter => {
      const column = columns.find(col => col.id === filter.id);
      if (!column || !filter.value) return true;
      
      let cellValue: any;
      if (column.accessorFn) {
        cellValue = column.accessorFn(row);
      } else if (column.accessorKey) {
        cellValue = getNestedValue(row, column.accessorKey as string);
      }
      
      if (cellValue === null || cellValue === undefined) return false;
      
      switch (filter.type) {
        case 'text':
          return String(cellValue).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'select':
          return cellValue === filter.value;
        case 'number':
          return Number(cellValue) === Number(filter.value);
        case 'boolean':
          return Boolean(cellValue) === Boolean(filter.value);
        case 'date':
          // Simple date filtering - you might want to enhance this
          return new Date(cellValue).toDateString() === new Date(filter.value).toDateString();
        default:
          return true;
      }
    });
  });
}

function sortData<T>(data: T[], sorts: DataGridSort[], columns: DataGridColumn<T>[]): T[] {
  if (sorts.length === 0) return data;
  
  return [...data].sort((a, b) => {
    for (const sort of sorts) {
      const column = columns.find(col => col.id === sort.id);
      if (!column) continue;
      
      let aValue: any;
      let bValue: any;
      
      if (column.accessorFn) {
        aValue = column.accessorFn(a);
        bValue = column.accessorFn(b);
      } else if (column.accessorKey) {
        aValue = getNestedValue(a, column.accessorKey as string);
        bValue = getNestedValue(b, column.accessorKey as string);
      }
      
      const result = compareValues(aValue, bValue, sort.direction);
      if (result !== 0) return result;
    }
    return 0;
  });
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DataGrid<T = any>({
  data,
  columns: initialColumns,
  rowIdAccessor = 'id' as keyof T,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableSelection = false,
  enableColumnResizing = true,
  enableColumnVisibility = true,
  enableExport = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  searchPlaceholder = "Search...",
  emptyMessage = "No data available",
  loadingMessage = "Loading...",
  isLoading = false,
  onRowClick,
  onRowSelect,
  onSort,
  onFilter,
  onExport,
  className,
}: DataGridProps<T>) {
  const { user, hasPermission } = useAuth();

  // State management
  const [columns, setColumns] = useState(initialColumns.map(col => ({ ...col, visible: col.visible ?? true })));
  const [sorts, setSorts] = useState<DataGridSort[]>([]);
  const [filters, setFilters] = useState<DataGridFilter[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<DataGridPagination>({
    page: 0,
    pageSize: initialPageSize,
    total: data.length,
  });
  const [selection, setSelection] = useState<DataGridSelection>({
    selectedRows: new Set(),
    isAllSelected: false,
    isIndeterminate: false,
  });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Get row ID
  const getRowId = useCallback((row: T): string => {
    if (typeof rowIdAccessor === 'function') {
      return rowIdAccessor(row);
    }
    return String(getNestedValue(row, rowIdAccessor as string));
  }, [rowIdAccessor]);

  // Process data with filters and sorting
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply global filter
    if (globalFilter) {
      result = result.filter(row => {
        return columns.some(column => {
          if (!column.visible) return false;
          
          let cellValue: any;
          if (column.accessorFn) {
            cellValue = column.accessorFn(row);
          } else if (column.accessorKey) {
            cellValue = getNestedValue(row, column.accessorKey as string);
          }
          
          return String(cellValue).toLowerCase().includes(globalFilter.toLowerCase());
        });
      });
    }
    
    // Apply column filters
    result = filterData(result, filters, columns);
    
    // Apply sorting
    result = sortData(result, sorts, columns);
    
    return result;
  }, [data, columns, filters, sorts, globalFilter]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!enablePagination) return processedData;
    
    const start = pagination.page * pagination.pageSize;
    const end = start + pagination.pageSize;
    return processedData.slice(start, end);
  }, [processedData, pagination, enablePagination]);

  // Update pagination total when data changes
  React.useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: processedData.length,
      page: Math.min(prev.page, Math.max(0, Math.ceil(processedData.length / prev.pageSize) - 1)),
    }));
  }, [processedData.length, pagination.pageSize]);

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!enableSorting) return;
    
    const newSorts = [...sorts];
    const existingSort = newSorts.find(sort => sort.id === columnId);
    
    if (existingSort) {
      if (existingSort.direction === 'asc') {
        existingSort.direction = 'desc';
      } else {
        // Remove sort
        const index = newSorts.indexOf(existingSort);
        newSorts.splice(index, 1);
      }
    } else {
      newSorts.push({ id: columnId, direction: 'asc' });
    }
    
    setSorts(newSorts);
    onSort?.(newSorts);
  };

  // Handle filtering
  const handleFilter = (columnId: string, value: any) => {
    const column = columns.find(col => col.id === columnId);
    if (!column || !enableFiltering) return;
    
    const newFilters = [...filters];
    const existingFilter = newFilters.find(filter => filter.id === columnId);
    
    if (existingFilter) {
      if (value === '' || value === null || value === undefined) {
        // Remove filter
        const index = newFilters.indexOf(existingFilter);
        newFilters.splice(index, 1);
      } else {
        existingFilter.value = value;
      }
    } else if (value !== '' && value !== null && value !== undefined) {
      newFilters.push({
        id: columnId,
        value,
        type: column.filterType || 'text',
      });
    }
    
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  // Handle selection
  const handleRowSelection = (rowId: string, selected: boolean) => {
    if (!enableSelection) return;
    
    const newSelectedRows = new Set(selection.selectedRows);
    
    if (selected) {
      newSelectedRows.add(rowId);
    } else {
      newSelectedRows.delete(rowId);
    }
    
    const isAllSelected = newSelectedRows.size === paginatedData.length && paginatedData.length > 0;
    const isIndeterminate = newSelectedRows.size > 0 && newSelectedRows.size < paginatedData.length;
    
    const newSelection = {
      selectedRows: newSelectedRows,
      isAllSelected,
      isIndeterminate,
    };
    
    setSelection(newSelection);
    
    // Get selected row objects
    const selectedRowObjects = data.filter(row => newSelectedRows.has(getRowId(row)));
    onRowSelect?.(selectedRowObjects);
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (!enableSelection) return;
    
    const newSelectedRows = new Set(selection.selectedRows);
    
    if (selected) {
      paginatedData.forEach(row => {
        newSelectedRows.add(getRowId(row));
      });
    } else {
      paginatedData.forEach(row => {
        newSelectedRows.delete(getRowId(row));
      });
    }
    
    const newSelection = {
      selectedRows: newSelectedRows,
      isAllSelected: selected && paginatedData.length > 0,
      isIndeterminate: false,
    };
    
    setSelection(newSelection);
    
    const selectedRowObjects = data.filter(row => newSelectedRows.has(getRowId(row)));
    onRowSelect?.(selectedRowObjects);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      page: 0, // Reset to first page
    }));
  };

  // Handle column visibility
  const handleColumnVisibility = (columnId: string, visible: boolean) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, visible } : col
    ));
  };

  // Get visible columns
  const visibleColumns = columns.filter(col => col.visible);

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      {/* Header Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {filters.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filters.length} filter{filters.length !== 1 ? 's' : ''} active
              </span>
              <button
                onClick={() => setFilters([])}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          {enableColumnVisibility && (
            <div className="relative">
              <button
                onClick={() => setShowColumnSettings(!showColumnSettings)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Column Settings"
              >
                <Columns className="h-4 w-4" />
              </button>
              
              {showColumnSettings && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Column Visibility
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {columns.map((column) => (
                        <label key={column.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={column.visible}
                            onChange={(e) => handleColumnVisibility(column.id, e.target.checked)}
                            className="mr-2 rounded border-gray-300 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {column.header}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {enableExport && (
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Export"
              >
                <Download className="h-4 w-4" />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    {EXPORT_FORMATS.map((format) => {
                      const Icon = format.icon;
                      return (
                        <button
                          key={format.value}
                          onClick={() => {
                            onExport?.(format.value as any);
                            setShowExportMenu(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          Export as {format.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {enableSelection && (
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selection.isAllSelected}
                    ref={input => {
                      if (input) input.indeterminate = selection.isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
              )}
              
              {visibleColumns.map((column) => {
                const sort = sorts.find(s => s.id === column.id);
                
                return (
                  <th
                    key={column.id}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      enableSorting && column.enableSorting !== false && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                    onClick={() => enableSorting && column.enableSorting !== false && handleSort(column.id)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {enableSorting && column.enableSorting !== false && (
                        <div className="flex flex-col">
                          {sort ? (
                            sort.direction === 'asc' ? (
                              <SortAsc className="h-3 w-3" />
                            ) : (
                              <SortDesc className="h-3 w-3" />
                            )
                          ) : (
                            <>
                              <ChevronUp className="h-2 w-2 opacity-50" />
                              <ChevronDown className="h-2 w-2 opacity-50" />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
            
            {/* Filter Row */}
            {enableFiltering && (
              <tr>
                {enableSelection && <th className="px-4 py-2"></th>}
                {visibleColumns.map((column) => (
                  <th key={`filter-${column.id}`} className="px-4 py-2">
                    {column.enableFiltering !== false && (
                      <div>
                        {column.filterType === 'select' ? (
                          <select
                            value={filters.find(f => f.id === column.id)?.value || ''}
                            onChange={(e) => handleFilter(column.id, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="">All</option>
                            {column.filterOptions?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={column.filterType === 'number' ? 'number' : column.filterType === 'date' ? 'date' : 'text'}
                            placeholder={`Filter ${column.header}`}
                            value={filters.find(f => f.id === column.id)?.value || ''}
                            onChange={(e) => handleFilter(column.id, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                          />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={visibleColumns.length + (enableSelection ? 1 : 0)} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">{loadingMessage}</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (enableSelection ? 1 : 0)} className="px-4 py-8 text-center">
                  <div className="text-gray-600 dark:text-gray-400">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const rowId = getRowId(row);
                const isSelected = selection.selectedRows.has(rowId);
                
                return (
                  <tr
                    key={rowId}
                    className={cn(
                      'hover:bg-gray-50 dark:hover:bg-gray-800',
                      isSelected && 'bg-blue-50 dark:bg-blue-900/20',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {enableSelection && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelection(rowId, e.target.checked);
                          }}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                    )}
                    
                    {visibleColumns.map((column) => {
                      let cellValue: any;
                      
                      if (column.accessorFn) {
                        cellValue = column.accessorFn(row);
                      } else if (column.accessorKey) {
                        cellValue = getNestedValue(row, column.accessorKey as string);
                      }
                      
                      return (
                        <td
                          key={column.id}
                          className={cn(
                            'px-4 py-3 text-sm text-gray-900 dark:text-white',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {column.cell ? (
                            column.cell({ row, value: cellValue })
                          ) : (
                            <span>{String(cellValue || '')}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {pagination.page * pagination.pageSize + 1} to{' '}
              {Math.min((pagination.page + 1) * pagination.pageSize, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(0)}
              disabled={pagination.page === 0}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.page + 1} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={(pagination.page + 1) * pagination.pageSize >= pagination.total}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => handlePageChange(Math.ceil(pagination.total / pagination.pageSize) - 1)}
              disabled={(pagination.page + 1) * pagination.pageSize >= pagination.total}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataGrid;
