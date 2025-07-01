
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  title: string;
  data: any[];
  columns: Column[];
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  onExport?: (row: any) => void;
  searchPlaceholder?: string;
  allowAdd?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  customActions?: Array<{
    label: string;
    action: (row: any) => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
    condition?: (row: any) => boolean;
  }>;
  itemsPerPage?: number;
  // Server-side pagination props
  currentPage?: number;
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const DataTable = ({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onExport,
  searchPlaceholder = "Search...",
  allowAdd = true,
  allowEdit = true,
  allowDelete = true,
  customActions = [],
  itemsPerPage = 10,
  currentPage = 1,
  totalItems = 0,
  totalPages = 1,
  onPageChange,
  onItemsPerPageChange
}: DataTableProps) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Use server-side pagination if props are provided, otherwise use client-side
  const isServerSidePagination = Boolean(onPageChange && totalItems);
  
  // Client-side pagination logic (fallback)
  const filteredData = isServerSidePagination ? data : data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const clientTotalPages = isServerSidePagination ? totalPages : Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = isServerSidePagination ? ((currentPage - 1) * itemsPerPage) : ((currentPage - 1) * itemsPerPage);
  const paginatedData = isServerSidePagination ? data : filteredData.slice(startIndex, startIndex + itemsPerPage);
  const displayTotalItems = isServerSidePagination ? totalItems : filteredData.length;
  const displayTotalPages = isServerSidePagination ? totalPages : clientTotalPages;

  const canAdd = allowAdd && (user?.role === 'SystemAdmin' || user?.role === 'InstituteAdmin');
  const canEdit = allowEdit && (user?.role !== 'Student');
  const canDelete = allowDelete && (user?.role === 'SystemAdmin' || user?.role === 'InstituteAdmin');

  const hasActions = canEdit || canDelete || onView || onExport || customActions.length > 0;

  const goToFirstPage = () => {
    if (onPageChange) {
      onPageChange(1);
    }
  };
  
  const goToLastPage = () => {
    if (onPageChange) {
      onPageChange(displayTotalPages);
    }
  };
  
  const goToNextPage = () => {
    if (onPageChange) {
      onPageChange(Math.min(currentPage + 1, displayTotalPages));
    }
  };
  
  const goToPrevPage = () => {
    if (onPageChange) {
      onPageChange(Math.max(currentPage - 1, 1));
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{title}</h2>
        {canAdd && onAdd && (
          <Button 
            onClick={onAdd} 
            className="bg-blue-600 hover:bg-blue-700 shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        )}
      </div>

      {/* Search - Only show for client-side pagination */}
      {!isServerSidePagination && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Table Container - Fixed Height with Scrollbars */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <div className="h-[600px] overflow-auto">
          <table className="w-full min-w-[800px]">
            {/* Sticky Header */}
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 last:border-r-0 min-w-[120px]"
                  >
                    {column.header}
                  </th>
                ))}
                {hasActions && (
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[150px] border-l border-gray-200 dark:border-gray-600">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {columns.map((column) => (
                      <td 
                        key={column.key} 
                        className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-700 last:border-r-0 min-w-[120px]"
                      >
                        <div className="max-w-[200px] truncate" title={String(row[column.key] || '-')}>
                          {column.render ? column.render(row[column.key], row) : (
                            <span>{row[column.key] || '-'}</span>
                          )}
                        </div>
                      </td>
                    ))}
                    {hasActions && (
                      <td className="px-2 py-3 text-center min-w-[150px] border-l border-gray-200 dark:border-gray-700">
                        <div className="flex justify-center items-center gap-1 flex-wrap">
                          {onView && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onView(row)}
                              title="View"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          {canEdit && onEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(row)}
                              title="Edit"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                          {onExport && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onExport(row)}
                              title="Export"
                              className="h-8 px-2 text-xs"
                            >
                              Export
                            </Button>
                          )}
                          {customActions
                            .filter(action => !action.condition || action.condition(row))
                            .map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              variant={action.variant || "outline"}
                              size="sm"
                              onClick={() => action.action(row)}
                              title={action.label}
                              className="h-8 px-2 text-xs"
                            >
                              {action.icon || action.label}
                            </Button>
                          ))}
                          {canDelete && onDelete && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDelete(row)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={columns.length + (hasActions ? 1 : 0)} 
                    className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Search className="h-8 w-8 text-gray-300" />
                      <p className="text-lg">No data found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span>
                Showing {displayTotalItems > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, displayTotalItems)} of {displayTotalItems} results
              </span>
            </div>
            
            {/* Items per page selector */}
            {onItemsPerPageChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Show:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {displayTotalPages > 1 && (
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-1 mx-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {displayTotalPages}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === displayTotalPages}
                className="h-8 w-8 p-0"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToLastPage}
                disabled={currentPage === displayTotalPages}
                className="h-8 w-8 p-0"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
