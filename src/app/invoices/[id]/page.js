"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGlobalContext } from '../../contexts/GlobalContext.jsx';
import { Button, Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Chip } from '@nextui-org/react';
import { useReactToPrint } from 'react-to-print';

const ViewInvoicePage = () => {
  const { token, isAuthenticated, loading: authLoading } = useGlobalContext();
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id;

  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const componentRef = useRef(); // For react-to-print

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (invoiceId && isAuthenticated && token) {
      setIsLoading(true);
      fetch(`/api/invoices/${invoiceId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(async res => {
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || `Failed to fetch invoice ${invoiceId}`);
          }
          return res.json();
        })
        .then(data => {
          setInvoice(data);
          setError(null);
        })
        .catch(err => {
          setError(err.message);
          setInvoice(null);
        })
        .finally(() => setIsLoading(false));
    }
  }, [invoiceId, token, isAuthenticated, authLoading, router]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice-${invoice?.invoiceNumber || invoiceId}`,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'sent': return 'primary';
      case 'overdue': return 'danger';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  if (authLoading || isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner label="Loading invoice details..." /></div>;
  }
  if (!isAuthenticated) {
     return <div className="text-center py-10">Please login to view this invoice.</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }
  if (!invoice) {
    return <div className="text-center text-gray-500 py-10">Invoice not found.</div>;
  }

  // Safely access nested project details
  const clientName = invoice.projectId?.clientName || 'N/A';
  const projectName = invoice.projectId?.name || 'N/A';

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
          <div className="flex gap-2 items-center">
            <Chip color={getStatusColor(invoice.status)} variant="flat">
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </Chip>
            <Link href={`/invoices/${invoiceId}/edit`}>
              <Button color="secondary" variant="flat">Edit</Button>
            </Link>
            <Button color="primary" onClick={handlePrint}>Print / PDF</Button>
          </div>
        </CardHeader>
      </Card>

      <div ref={componentRef} className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg printable-area">
        {/* Letterhead (if available from project or settings) */}
        {invoice.projectId?.letterhead && (
          <div className="mb-8 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: invoice.projectId.letterhead }} />
        )}
        {!invoice.projectId?.letterhead && invoice.userId?.settings?.defaultLetterhead && (
             <div className="mb-8 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: invoice.userId.settings.defaultLetterhead }} />
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Billed To:</h2>
            <p className="text-gray-600 dark:text-gray-400">{clientName}</p>
            {/* Add more client details if available, e.g., invoice.projectId.clientEmail */}
            <p className="text-gray-600 dark:text-gray-400">Project: {projectName}</p>
          </div>
          <div className="text-left md:text-right">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Invoice Details:</h2>
            <p className="text-gray-600 dark:text-gray-400"><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
            <p className="text-gray-600 dark:text-gray-400"><strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
            {invoice.dueDate && <p className="text-gray-600 dark:text-gray-400"><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Items:</h3>
        <Table removeWrapper aria-label="Invoice items">
          <TableHeader>
            <TableColumn className="bg-gray-100 dark:bg-gray-800">Description</TableColumn>
            <TableColumn className="bg-gray-100 dark:bg-gray-800 text-right">Quantity</TableColumn>
            <TableColumn className="bg-gray-100 dark:bg-gray-800 text-right">Unit Price</TableColumn>
            <TableColumn className="bg-gray-100 dark:bg-gray-800 text-right">Total Price</TableColumn>
          </TableHeader>
          <TableBody items={invoice.items || []}>
            {(item) => (
              <TableRow key={item._id || item.description}>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.unitPrice)}</TableCell>
                <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.totalPrice)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-end mt-8">
          <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax ({ (invoice.taxRate * 100).toFixed(2) }%):</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 mt-2 border-gray-300 dark:border-gray-700">
              <span className="text-xl font-bold text-gray-800 dark:text-gray-100">Total:</span>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.total)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Notes:</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
        
        {/* Footer (if available from project or settings) */}
        {invoice.projectId?.footer && (
          <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: invoice.projectId.footer }} />
        )}
         {!invoice.projectId?.footer && invoice.userId?.settings?.defaultFooter && (
             <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: invoice.userId.settings.defaultFooter }} />
        )}
      </div>
      
      {/* Style for printing: ensures only the 'printable-area' is targeted */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewInvoicePage;
