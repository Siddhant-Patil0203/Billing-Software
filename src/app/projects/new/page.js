"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '../../contexts/GlobalContext.jsx';
import { Button, Input, Textarea, Card, CardHeader, CardBody, Spinner } from '@nextui-org/react';

const NewProjectPage = () => {
  const { token, isAuthenticated, loading: authLoading } = useGlobalContext();
  const router = useRouter();

  const [projectData, setProjectData] = useState({
    name: '',
    clientName: '',
    clientEmail: '',
    letterhead: '',
    footer: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      setFormError("Authentication required.");
      return;
    }
    if (!projectData.name.trim()) {
      setFormError("Project name is required.");
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }
      router.push('/projects'); // Redirect to project list on success
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner label="Authenticating..." /></div>;
  }
  if (!isAuthenticated) {
     return <div className="text-center py-10">Please login to create a project.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Create New Project</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Project Name"
              name="name"
              value={projectData.name}
              onChange={handleInputChange}
              isRequired
              variant="bordered"
              errorMessage={!projectData.name.trim() && formError ? "Project name is required" : null}
            />
            <Input
              label="Client Name (Optional)"
              name="clientName"
              value={projectData.clientName}
              onChange={handleInputChange}
              variant="bordered"
            />
            <Input
              type="email"
              label="Client Email (Optional)"
              name="clientEmail"
              value={projectData.clientEmail}
              onChange={handleInputChange}
              variant="bordered"
            />
            <Textarea
              label="Letterhead (Optional)"
              name="letterhead"
              value={projectData.letterhead}
              onChange={handleInputChange}
              placeholder="Enter HTML or text for your invoice letterhead..."
              minRows={5}
              variant="bordered"
            />
            <Textarea
              label="Footer (Optional)"
              name="footer"
              value={projectData.footer}
              onChange={handleInputChange}
              placeholder="Enter HTML or text for your invoice footer..."
              minRows={3}
              variant="bordered"
            />

            {formError && <p className="text-red-500 text-center">{formError}</p>}

            <div className="flex justify-end gap-4 mt-8">
              <Button color="danger" variant="flat" onClick={() => router.back()} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" color="primary" isLoading={isLoading}>
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default NewProjectPage;
