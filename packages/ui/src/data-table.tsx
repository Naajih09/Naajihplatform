import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';

interface CustomTableProps<T> {
  data: T[];
  columns: {
    accessor: string;
    title: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
    titleClassName?: string;
  }[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  defaultSort?: { columnAccessor: string; direction: 'asc' | 'desc' };
  loading?: boolean;
  noRecordsText?: string;
  className?: string;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSortChange?: (sortStatus: DataTableSortStatus) => void;
  currentPage?: number;
  currentPageSize?: number;
  currentSort?: DataTableSortStatus;
}

const CustomTable = <T extends Record<string, any>>({
  data,
  columns,
  pageSizeOptions = [10, 20, 30, 50, 100],
  defaultPageSize = 10,
  defaultSort = { columnAccessor: 'id', direction: 'asc' },
  loading = false,
  noRecordsText = 'No records found',
  className = '',
  totalRecords = 0,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  currentPage = 1,
  currentPageSize,
  currentSort,
}: CustomTableProps<T>) => {
  const [internalPage, setInternalPage] = useState(currentPage || 1);
  const [internalPageSize, setInternalPageSize] = useState(
    currentPageSize || defaultPageSize
  );
  const [internalSortStatus, setInternalSortStatus] =
    useState<DataTableSortStatus>(currentSort || defaultSort);
  const [isMounted, setIsMounted] = useState(false);

  // Determine if we're using controlled or uncontrolled state
  const isControlled = onPageChange !== undefined;
  const page = isControlled ? currentPage : internalPage;
  const pageSize =
    isControlled && currentPageSize !== undefined
      ? currentPageSize
      : internalPageSize;
  const sortStatus =
    isControlled && currentSort ? currentSort : internalSortStatus;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (isControlled) {
      onPageChange?.(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (isControlled) {
      onPageSizeChange?.(newSize);
    } else {
      setInternalPageSize(newSize);
    }
    handlePageChange(1); // Reset to first page when page size changes
  };

  const handleSortChange = (newSortStatus: DataTableSortStatus) => {
    if (isControlled) {
      onSortChange?.(newSortStatus);
    } else {
      setInternalSortStatus(newSortStatus);
    }
    handlePageChange(1); // Reset to first page when sort changes
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`datatables ${className}`}>
      <DataTable
        noRecordsText={noRecordsText}
        highlightOnHover
        className='table-hover whitespace-nowrap'
        records={data}
        columns={columns.map((col) => ({
          accessor: col.accessor,
          title: col.title,
          sortable: col.sortable,
          render: col.render,
          titleClassName: col.titleClassName,
        }))}
        totalRecords={totalRecords}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={handlePageChange}
        recordsPerPageOptions={pageSizeOptions}
        onRecordsPerPageChange={handlePageSizeChange}
        sortStatus={sortStatus}
        onSortStatusChange={handleSortChange}
        minHeight={200}
        paginationText={({ from, to, totalRecords }) =>
          `Showing ${from} to ${to} of ${totalRecords} entries`
        }
        fetching={loading}
      />
    </div>
  );
};

export default CustomTable;
