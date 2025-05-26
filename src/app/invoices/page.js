"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGlobalContext } from '../contexts/GlobalContext.jsx';
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Select, SelectItem, Input, Card, CardHeader, CardBody, Spinner } from '@nextui-org/react';

const InvoiceListPage = () => {
  const { token, isAuthenticated, loading: authLoading } = useGlobalContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInvoices: 0,
  });

  // Filtering and Sorting State
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [projectIdFilter, setProjectIdFilter] = useState(searchParams.get('projectId') || ''); // Assuming we might add this later
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'issueDate');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  
  const [searchTerm, setSearchTerm] = useState(''); // For client-side search on displayed results or could be API if backend supports

  const itemsPerPage = 10;

  const fetchInvoices = useCallback(async (page = 1) => {
    if (!isAuthenticated || !token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    query.append('page', page);
    query.append('limit', itemsPerPage);
    if (statusFilter) query.append('status', statusFilter);
    if (projectIdFilter) query.append('projectId', projectIdFilter); // If project filtering is added
    query.append('sortBy', sortBy);
    query.append('sortOrder', sortOrder);
    // if (searchTerm) query.append('search', searchTerm); // If backend supports search

    try {
      const response = await fetch(`/api/invoices?${query.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch invoices');
      }
      const data = await response.json();
      setInvoices(data.invoices || []);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalInvoices: data.totalInvoices,
      });
    } catch (err) {
      setError(err.message);
      setInvoices([]); // Clear invoices on error
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated, statusFilter, projectIdFilter, sortBy, sortOrder, itemsPerPage]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      const pageFromUrl = parseInt(searchParams.get('page'), 10) || 1;
      fetchInvoices(pageFromUrl);
    }
  }, [authLoading, isAuthenticated, router, fetchInvoices, searchParams]);

  const handlePageChange = (newPage) => {
    router.push(`/invoices?page=${newPage}&status=${statusFilter}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    // fetchInvoices will be called by useEffect due to searchParams change
  };

  const handleFilterChange = () => {
    // Update URL, which will trigger useEffect to refetch
    const query = new URLSearchParams();
    if (statusFilter) query.append('status', statusFilter);
    if (projectIdFilter) query.append('projectId', projectIdFilter);
    query.append('sortBy', sortBy);
    query.append('sortOrder', sortOrder);
    query.append('page', 1); // Reset to page 1 on filter change
    router.push(`/invoices?${query.toString()}`);
  };
  
  const handleSortChange = (newSortBy) => {
    const newSortOrder = (sortBy === newSortBy && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    // Update URL, which will trigger useEffect to refetch
    const query = new URLSearchParams();
    if (statusFilter) query.append('status', statusFilter);
    if (projectIdFilter) query.append('projectId', projectIdFilter);
    query.append('sortBy', newSortBy);
    query.append('sortOrder', newSortOrder);
    query.append('page', 1); // Reset to page 1
    router.push(`/invoices?${query.toString()}`);
  };


  if (authLoading || isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner label="Loading invoices..." /></div>;
  }

  if (!isAuthenticated) {
     return <div className="text-center py-10">Please login to view invoices.</div>;
  }
  
  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
    { key: 'issueDate', label: 'Issue Date', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { key: 'total', label: 'Total', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Link href="/invoices/new">
            <Button color="primary">Create New Invoice</Button>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
            <Input
              placeholder="Search invoices (client-side)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
              isClearable
            />
            <Select
              label="Status"
              placeholder="Filter by status"
              selectedKeys={statusFilter ? [statusFilter] : []}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="max-w-xs"
            >
              <SelectItem key="" value="">All</SelectItem>
              <SelectItem key="draft" value="draft">Draft</SelectItem>
              <SelectItem key="sent" value="sent">Sent</SelectItem>
              <SelectItem key="paid" value="paid">Paid</SelectItem>
              <SelectItem key="overdue" value="overdue">Overdue</SelectItem>
            </Select>
            {/* Placeholder for Project Filter if needed later */}
            {/* <Select label="Project" placeholder="Filter by project" ... /> */}
            <Button onClick={handleFilterChange} color="secondary">Apply Filters</Button>
          </div>

          {invoices.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500">No invoices found.</p>
          ) : (
            <Table 
              aria-label="Invoices table"
              sortDescriptor={{ column: sortBy, direction: sortOrder === 'asc' ? 'ascending' : 'descending' }}
              onSortChange={({column, direction}) => handleSortChange(column)}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key} allowsSorting={column.sortable}>
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={invoices.filter(inv => 
                  inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (inv.projectId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) // Example: if project name is available
                )}
                emptyContent={"No invoices match your current filters."}
              >
                {(item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.invoiceNumber}</TableCell>
                    <TableCell>{new Date(item.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      {/* Assuming currency formatting is needed - this is basic */}
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.total)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${item.status === 'paid' ? 'bg-green-200 text-green-800' :
                          item.status === 'sent' ? 'bg-blue-200 text-blue-800' :
                          item.status === 'overdue' ? 'bg-red-200 text-red-800' :
                          'bg-gray-200 text-gray-800'}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/invoices/${item._id}`}>
                          <Button size="sm" variant="flat" color="primary">View</Button>
                        </Link>
                        <Link href={`/invoices/${item._id}/edit`}>
                          <Button size="sm" variant="flat" color="secondary">Edit</Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                isCompact
                showControls
                total={pagination.totalPages}
                initialPage={pagination.currentPage}
                onChange={handlePageChange}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default InvoiceListPage;
