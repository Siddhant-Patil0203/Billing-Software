"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGlobalContext } from '../../../contexts/GlobalContext.jsx';
import { Button, Input, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, DatePicker, Card, CardHeader, CardBody, Spinner } from '@nextui-org/react';
import { parseDate } from "@internationalized/date";

const EditInvoicePage = () => {
  const { token, isAuthenticated, loading: authLoading } = useGlobalContext();
  const router = useRouter();
  const params = useParams(); // For getting the invoice ID from URL
  const invoiceId = params.id;

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [isFetchingInvoice, setIsFetchingInvoice] = useState(true); // For initial data load
  const [formError, setFormError] = useState(null);

  const [invoiceData, setInvoiceData] = useState({
    projectId: '',
    issueDate: null,
    dueDate: null,
    items: [{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    taxRate: 0.0,
    notes: '',
    status: 'draft',
  });
  const [calculatedTotals, setCalculatedTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    total: 0,
  });

  // Fetch projects
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [isAuthenticated, token]);

  // Fetch existing invoice data
  useEffect(() => {
    if (!invoiceId || !isAuthenticated || !token) {
        setIsFetchingInvoice(false);
        return;
    }
    setIsFetchingInvoice(true);
    const fetchInvoiceDetails = async () => {
      try {
        const response = await fetch(`/api/invoices/${invoiceId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || `Failed to fetch invoice ${invoiceId}`);
        }
        const data = await response.json();
        setInvoiceData({
          ...data,
          // Ensure dates are in 'YYYY-MM-DD' string format for parseDate if they are not already
          issueDate: data.issueDate ? data.issueDate.split('T')[0] : null,
          dueDate: data.dueDate ? data.dueDate.split('T')[0] : null,
          taxRate: data.taxRate || 0, // Ensure taxRate is a number
          items: data.items.map(item => ({ // Ensure items have totalPrice
            ...item,
            totalPrice: parseFloat((item.quantity * item.unitPrice).toFixed(2))
          }))
        });
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setFormError(`Error loading invoice: ${error.message}`);
      } finally {
        setIsFetchingInvoice(false);
      }
    };
    fetchInvoiceDetails();
  }, [invoiceId, isAuthenticated, token]);
  
  // Recalculate totals
   const calculateAllTotals = useCallback(() => {
    let subtotal = 0;
    invoiceData.items.forEach(item => {
      subtotal += item.totalPrice;
    });
    subtotal = parseFloat(subtotal.toFixed(2));

    let taxAmount = 0;
    if (invoiceData.taxRate > 0) {
      taxAmount = parseFloat((subtotal * invoiceData.taxRate).toFixed(2));
    }
    
    const total = parseFloat((subtotal + taxAmount).toFixed(2));
    setCalculatedTotals({ subtotal, taxAmount, total });
  }, [invoiceData.items, invoiceData.taxRate]);

  useEffect(() => {
    // Only calculate if not fetching, to prevent overriding fetched data with initial state calculations
    if (!isFetchingInvoice) {
      calculateAllTotals();
    }
  }, [invoiceData.items, invoiceData.taxRate, isFetchingInvoice, calculateAllTotals]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (name, dateValue) => {
    setInvoiceData(prev => ({ ...prev, [name]: dateValue ? dateValue.toString() : null }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].totalPrice = parseFloat((quantity * unitPrice).toFixed(2));
    }
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    }));
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      setFormError("Authentication required.");
      return;
    }
    setIsLoading(true);
    setFormError(null);

    if (!invoiceData.issueDate) {
        setFormError("Issue Date is required.");
        setIsLoading(false);
        return;
    }
    if (invoiceData.items.length === 0) {
        setFormError("At least one line item is required.");
        setIsLoading(false);
        return;
    }
     for (const item of invoiceData.items) {
        if (!item.description.trim() || item.quantity <= 0 || item.unitPrice < 0) {
            setFormError("All line items must have a description, quantity > 0, and unit price >= 0.");
            setIsLoading(false);
            return;
        }
    }

    const payload = {
      ...invoiceData,
      issueDate: invoiceData.issueDate ? new Date(invoiceData.issueDate).toISOString() : null,
      dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate).toISOString() : null,
      taxRate: parseFloat(invoiceData.taxRate) || 0,
      items: invoiceData.items.map(item => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.totalPrice)
      }))
    };

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update invoice');
      }
      router.push(`/invoices/${invoiceId}`); // Redirect to view invoice page on success
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || isFetchingInvoice) {
    return <div className="flex justify-center items-center h-screen"><Spinner label="Loading invoice data..." /></div>;
  }
  if (!isAuthenticated) {
    return <div className="text-center py-10">Please login to edit this invoice.</div>;
  }
  if (formError && isFetchingInvoice) { // If error occurred during fetch
    return <div className="text-center text-red-500 py-10">{formError}</div>;
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Edit Invoice #{invoiceData.invoiceNumber || invoiceId}</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Project (Optional)"
                placeholder="Select a project"
                selectedKeys={invoiceData.projectId ? [invoiceData.projectId] : []}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, projectId: e.target.value }))}
                items={projects}
              >
                {(project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                )}
              </Select>
              <DatePicker
                label="Issue Date"
                value={invoiceData.issueDate ? parseDate(invoiceData.issueDate) : null}
                onChange={(date) => handleDateChange('issueDate', date)}
                isRequired
              />
              <DatePicker
                label="Due Date (Optional)"
                value={invoiceData.dueDate ? parseDate(invoiceData.dueDate) : null}
                onChange={(date) => handleDateChange('dueDate', date)}
              />
              <Input
                type="number"
                label="Tax Rate (e.g., 0.05 for 5%)"
                name="taxRate"
                value={invoiceData.taxRate.toString()}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g., 0.05"
                step="0.001"
                min="0"
              />
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-3">Line Items</h2>
            <Table removeWrapper aria-label="Invoice items table">
              <TableHeader>
                <TableColumn>Description</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Unit Price</TableColumn>
                <TableColumn>Total Price</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody items={invoiceData.items}>
                {(item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={invoiceData.items[index].description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        isRequired
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={invoiceData.items[index].quantity.toString()}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        min="0.01" step="0.01" isRequired
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={invoiceData.items[index].unitPrice.toString()}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0" step="0.01" isRequired
                      />
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoiceData.items[index].totalPrice)}
                    </TableCell>
                    <TableCell>
                      <Button color="danger" variant="light" onClick={() => removeItem(index)} size="sm">Remove</Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Button onClick={addItem} color="default" className="mt-2">Add Item</Button>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-end space-x-4 mb-2">
                <p className="text-lg">Subtotal:</p>
                <p className="text-lg font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculatedTotals.subtotal)}</p>
              </div>
              <div className="flex justify-end space-x-4 mb-2">
                <p className="text-lg">Tax Amount ({ (invoiceData.taxRate * 100).toFixed(2) }%):</p>
                <p className="text-lg font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculatedTotals.taxAmount)}</p>
              </div>
              <div className="flex justify-end space-x-4">
                <p className="text-xl">Total:</p>
                <p className="text-xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculatedTotals.total)}</p>
              </div>
            </div>
            
            <Textarea
              label="Notes (Optional)"
              name="notes"
              value={invoiceData.notes}
              onChange={handleInputChange}
            />
            <Select
                label="Status"
                placeholder="Set invoice status"
                selectedKeys={invoiceData.status ? [invoiceData.status] : ['draft']}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, status: e.target.value }))}
                className="max-w-xs"
              >
                <SelectItem key="draft" value="draft">Draft</SelectItem>
                <SelectItem key="sent" value="sent">Sent</SelectItem>
                <SelectItem key="paid" value="paid">Paid</SelectItem>
                <SelectItem key="overdue" value="overdue">Overdue</SelectItem>
            </Select>

            {formError && !isFetchingInvoice && <p className="text-red-500 text-center">{formError}</p>}

            <div className="flex justify-end gap-4 mt-8">
              <Button color="default" variant="flat" onClick={() => router.back()} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" color="primary" isLoading={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditInvoicePage;
