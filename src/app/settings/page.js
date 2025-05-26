"use client";

import { useState, useEffect, useCallback } from 'react';
import { useGlobalContext } from '../contexts/GlobalContext.jsx';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardBody, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from '@nextui-org/react';
import { DeleteIcon } from '../components/DeleteIcon'; // Assuming you have a DeleteIcon component

const SettingsPage = () => {
  const { token, isAuthenticated, loading: authLoading } = useGlobalContext();
  const router = useRouter();

  const [settings, setSettings] = useState({
    taxRates: [{ name: '', rate: 0 }],
    defaultLetterhead: '',
    defaultFooter: '',
    invoicePrefix: 'INV-',
    invoiceSequence: 0, // Display only, or allow reset
    invoiceNumberFormat: '{PREFIX}{YYYY}-{SEQ}',
  });
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [isFetchingSettings, setIsFetchingSettings] = useState(true);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchSettings = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setIsFetchingSettings(false);
      return;
    }
    setIsFetchingSettings(true);
    try {
      const response = await fetch('/api/settings', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch settings');
      }
      const data = await response.json();
      setSettings({
        taxRates: data.taxRates && data.taxRates.length > 0 ? data.taxRates : [{ name: '', rate: 0 }],
        defaultLetterhead: data.defaultLetterhead || '',
        defaultFooter: data.defaultFooter || '',
        invoicePrefix: data.invoicePrefix || 'INV-',
        invoiceSequence: data.invoiceSequence || 0,
        invoiceNumberFormat: data.invoiceNumberFormat || '{PREFIX}{YYYY}-{SEQ}',
      });
    } catch (error) {
      setFormError(`Error loading settings: ${error.message}`);
    } finally {
      setIsFetchingSettings(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchSettings();
    }
  }, [authLoading, isAuthenticated, router, fetchSettings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleTaxRateChange = (index, field, value) => {
    const newTaxRates = [...settings.taxRates];
    if (field === 'rate') {
      newTaxRates[index][field] = parseFloat(value) || 0;
    } else {
      newTaxRates[index][field] = value;
    }
    setSettings(prev => ({ ...prev, taxRates: newTaxRates }));
  };

  const addTaxRate = () => {
    setSettings(prev => ({
      ...prev,
      taxRates: [...prev.taxRates, { name: '', rate: 0 }],
    }));
  };

  const removeTaxRate = (index) => {
    // Prevent removing the last tax rate row if it's the only one and empty, 
    // or just filter out if there are multiple.
    if (settings.taxRates.length === 1) {
      setSettings(prev => ({ ...prev, taxRates: [{ name: '', rate: 0}] }));
      return;
    }
    const newTaxRates = settings.taxRates.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, taxRates: newTaxRates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      setFormError("Authentication required.");
      return;
    }
    setIsLoading(true);
    setFormError(null);
    setSuccessMessage('');

    // Filter out empty tax rates before sending
    const payloadTaxRates = settings.taxRates.filter(tr => tr.name.trim() !== '' || tr.rate !== 0);
    if (payloadTaxRates.length === 0 && settings.taxRates.length > 0) {
        // If all were empty and user intended to have none, send empty array
        // If user just cleared the default empty row, treat as no tax rates
         if (settings.taxRates.every(tr => tr.name.trim() === '' && tr.rate === 0)) {
            // this is fine, it means they want no tax rates
         } else {
            // This case might be complex, for now, let's assume user must define valid rates or clear all.
         }
    }


    const payload = {
      ...settings,
      taxRates: settings.taxRates.filter(tr => tr.name.trim() !== '' && tr.rate >=0), // Only save valid rates
      invoiceSequence: parseInt(settings.invoiceSequence, 10) // Ensure it's an int
    };
    
    // Do not allow invoiceSequence to be set to a non-number or negative
    if (isNaN(payload.invoiceSequence) || payload.invoiceSequence < 0) {
        setFormError("Invoice starting sequence must be a non-negative number.");
        setIsLoading(false);
        return;
    }


    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update settings');
      }
      setSuccessMessage('Settings updated successfully!');
      // Optionally refetch settings or update state from response
      const updatedSettingsData = await response.json();
       setSettings({
        taxRates: updatedSettingsData.taxRates && updatedSettingsData.taxRates.length > 0 ? updatedSettingsData.taxRates : [{ name: '', rate: 0 }],
        defaultLetterhead: updatedSettingsData.defaultLetterhead || '',
        defaultFooter: updatedSettingsData.defaultFooter || '',
        invoicePrefix: updatedSettingsData.invoicePrefix || 'INV-',
        invoiceSequence: updatedSettingsData.invoiceSequence || 0,
        invoiceNumberFormat: updatedSettingsData.invoiceNumberFormat || '{PREFIX}{YYYY}-{SEQ}',
      });

    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3s
    }
  };

  if (authLoading || isFetchingSettings) {
    return <div className="flex justify-center items-center h-screen"><Spinner label="Loading settings..." /></div>;
  }
  if (!isAuthenticated) {
     return <div className="text-center py-10">Please login to manage settings.</div>;
  }
  if (formError && isFetchingSettings) { // Error during initial fetch
    return <div className="text-center text-red-500 py-10">{formError}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">User Settings</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Invoice Numbering Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Invoice Numbering</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Invoice Prefix"
                  name="invoicePrefix"
                  value={settings.invoicePrefix}
                  onChange={handleInputChange}
                  variant="bordered"
                  placeholder="e.g., INV-"
                />
                <Input
                  type="text" // Use text to allow various formats, validation is key
                  label="Invoice Number Format"
                  name="invoiceNumberFormat"
                  value={settings.invoiceNumberFormat}
                  onChange={handleInputChange}
                  variant="bordered"
                  placeholder="{PREFIX}{YYYY}-{SEQ}"
                  description="Use {PREFIX}, {YYYY}, {YY}, {SEQ}"
                />
                <Input
                  type="number"
                  label="Next Invoice Sequence (Current)"
                  name="invoiceSequence"
                  value={settings.invoiceSequence.toString()} // Display only or allow reset
                  onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setSettings(prev => ({...prev, invoiceSequence: isNaN(val) ? 0 : val }));
                  }}
                  variant="bordered"
                  min="0"
                  step="1"
                  description="Current sequence. To reset, set to 0."
                />
              </div>
            </section>

            {/* Tax Rates Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Tax Rates</h2>
              <Table removeWrapper aria-label="Tax rates table">
                <TableHeader>
                  <TableColumn>Tax Name</TableColumn>
                  <TableColumn>Rate (e.g., 0.05 for 5%)</TableColumn>
                  <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody items={settings.taxRates}>
                  {(item, index) => ( // Ensure index is available if not using items prop directly
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={settings.taxRates[index].name}
                          onChange={(e) => handleTaxRateChange(index, 'name', e.target.value)}
                          placeholder="e.g., VAT"
                          variant="bordered"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={settings.taxRates[index].rate.toString()}
                          onChange={(e) => handleTaxRateChange(index, 'rate', e.target.value)}
                          placeholder="e.g., 0.05"
                          min="0"
                          step="0.001"
                          variant="bordered"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip color="danger" content="Delete Tax Rate">
                            <Button isIconOnly color="danger" variant="light" onClick={() => removeTaxRate(index)}>
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <Button onClick={addTaxRate} color="default" className="mt-4">Add Tax Rate</Button>
            </section>

            {/* Default Letterhead/Footer Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Default Templates</h2>
               <Textarea
                label="Default Letterhead (HTML or Text)"
                name="defaultLetterhead"
                value={settings.defaultLetterhead}
                onChange={handleInputChange}
                placeholder="Enter default HTML or text for invoice letterheads..."
                minRows={5}
                variant="bordered"
              />
              <Textarea
                label="Default Footer (HTML or Text)"
                name="defaultFooter"
                value={settings.defaultFooter}
                onChange={handleInputChange}
                placeholder="Enter default HTML or text for invoice footers..."
                minRows={3}
                variant="bordered"
                className="mt-4"
              />
            </section>

            {formError && <p className="text-red-500 text-center">{formError}</p>}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

            <div className="flex justify-end gap-4 mt-8">
              <Button type="submit" color="primary" isLoading={isLoading}>
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      <div style={{ display: 'none' }}> {/* For DeleteIcon SVG if not globally available */}
        <svg id="delete-icon-svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
      </div>
    </div>
  );
};

export default SettingsPage;
