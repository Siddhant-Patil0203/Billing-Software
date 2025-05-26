"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '../../contexts/GlobalContext.jsx';
import { Button, Input, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, DatePicker, Card, CardHeader, CardBody, Spinner } from '@nextui-org/react';
import { parseDate } from "@internationalized/date"; // For NextUI DatePicker

const NewInvoicePage = () => {
  const { token, isAuthenticated, loading: authLoading } = useGlobalContext();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const [invoiceData, setInvoiceData] = useState({
    projectId: '',
    issueDate: null, // Using null for DatePicker
    dueDate: null,   // Using null for DatePicker
    items: [{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    taxRate: 0.0, // Expecting decimal, e.g., 0.05 for 5%
    notes: '',
    status: 'draft', // Default status
  });
  const [calculatedTotals, setCalculatedTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    total: 0,
  });

  // Fetch projects for the select dropdown
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
        setProjects([]);
      }
    };
    fetchProjects();
  }, [isAuthenticated, token]);
  
  // Recalculate totals whenever items or taxRate change
  const calculateAllTotals = useCallback(() => {
    let subtotal = 0;
    invoiceData.items.forEach(item => {
      subtotal += item.totalPrice;
    });
    subtotal = parseFloat(subtotal.toFixed(2));

    let taxAmount = 0;
    // Ensure taxRate is treated as a decimal for calculation
    if (invoiceData.taxRate > 0) {
      taxAmount = parseFloat((subtotal * invoiceData.taxRate).toFixed(2));
    }
    
    const total = parseFloat((subtotal + taxAmount).toFixed(2));

    setCalculatedTotals({ subtotal, taxAmount, total });
  }, [invoiceData.items, invoiceData.taxRate]);

  useEffect(() => {
    calculateAllTotals();
  }, [calculateAllTotals]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, dateValue) => {
    // Convert NextUI DateValue to ISO string or Date object for backend
    setInvoiceData(prev => ({ ...prev, [name]: dateValue ? dateValue.toString() : null }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;

    // Recalculate totalPrice for the item
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

    // Ensure issueDate is not null
    if (!invoiceData.issueDate) {
        setFormError("Issue Date is required.");
        setIsLoading(false);
        return;
    }
    
    // Ensure at least one item exists and items have required fields
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
      // Convert date strings to Date objects if backend expects that, or ensure ISO format
      issueDate: invoiceData.issueDate ? new Date(invoiceData.issueDate).toISOString() : null,
      dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate).toISOString() : null,
      taxRate: parseFloat(invoiceData.taxRate) || 0, // Ensure taxRate is a number
      items: invoiceData.items.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.totalPrice)
      }))
    };
    
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create invoice');
      }
      // const newInvoice = await response.json();
      router.push('/invoices'); // Redirect to invoice list on success
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

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner label="Authenticating..." /></div>;
  }
   if (!isAuthenticated) {
     // This should ideally be handled by the useEffect redirect, but as a fallback:
    return <div className="text-center py-10">Please login to create an invoice.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Create New Invoice</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Project (Optional)"
                placeholder="Select a project"
                selectedKeys={invoiceData.projectId ? [invoiceData.projectId] : []}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, projectId: e.target.value }))}
              >
                {projects.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </Select>
              <DatePicker
                label="Issue Date"
                value={invoiceData.issueDate ? parseDate(invoiceData.issueDate.split('T')[0]) : null}
                onChange={(date) => handleDateChange('issueDate', date)}
                isRequired
              />
              <DatePicker
                label="Due Date (Optional)"
                value={invoiceData.dueDate ? parseDate(invoiceData.dueDate.split('T')[0]) : null}
                onChange={(date) => handleDateChange('dueDate', date)}
              />
              <Input
                type="number"
                label="Tax Rate (e.g., 0.05 for 5%)"
                name="taxRate"
                value={invoiceData.taxRate.toString()} // Input expects string
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
                {(item, index) => ( // NextUI TableBody expects items prop, but we can use index from map
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={invoiceData.items[index].description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Item description"
                        isRequired
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={invoiceData.items[index].quantity.toString()}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        placeholder="1"
                        min="0.01"
                        step="0.01"
                        isRequired
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={invoiceData.items[index].unitPrice.toString()}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        isRequired
                      />
                    </TableCell>
                    <TableCell>
                      {/* Display calculated item total */}
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoiceData.items[index].totalPrice)}
                    </TableCell>
                    <TableCell>
                      <Button color="danger" variant="light" onClick={() => removeItem(index)} size="sm">
                        Remove
                      </Button>
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
              placeholder="Any additional notes for the client..."
            />

            <Select
                label="Status"
                placeholder="Set invoice status"
                selectedKeys={[invoiceData.status]}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, status: e.target.value }))}
                className="max-w-xs"
              >
                <SelectItem key="draft" value="draft">Draft</SelectItem>
                <SelectItem key="sent" value="sent">Sent</SelectItem>
                {/* Other statuses might be set later, not typically at creation */}
            </Select>

            {formError && <p className="text-red-500 text-center">{formError}</p>}

            <div className="flex justify-end gap-4 mt-8">
              <Button color="danger" variant="flat" onClick={() => router.back()} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" color="primary" isLoading={isLoading}>
                {isLoading ? 'Creating...' : 'Create Invoice'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default NewInvoicePage;
