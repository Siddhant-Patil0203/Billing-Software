"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGlobalContext } from '../../../contexts/GlobalContext.jsx';
import { Button, Input, Textarea, Card, CardHeader, CardBody, Spinner } from '@nextui-org/react';

const EditProjectPage = () => {
  const { token, isAuthenticated, loading: authLoading } = useGlobalContext();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [projectData, setProjectData] = useState({
    name: '',
    clientName: '',
    clientEmail: '',
    letterhead: '',
    footer: '',
  });
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [isFetchingProject, setIsFetchingProject] = useState(true); // For initial data load
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (projectId && isAuthenticated && token) {
      setIsFetchingProject(true);
      fetch(`/api/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(async res => {
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || `Failed to fetch project ${projectId}`);
          }
          return res.json();
        })
        .then(data => {
          setProjectData({
            name: data.name || '',
            clientName: data.clientName || '',
            clientEmail: data.clientEmail || '',
            letterhead: data.letterhead || '',
            footer: data.footer || '',
          });
          setFormError(null);
        })
        .catch(err => {
          setFormError(`Error loading project: ${err.message}`);
        })
        .finally(() => setIsFetchingProject(false));
    }
  }, [projectId, token, isAuthenticated, authLoading, router]);

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
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project');
      }
      router.push('/projects'); // Redirect to project list on success
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isFetchingProject) {
    return <div className="flex justify-center items-center h-screen"><Spinner label="Loading project data..." /></div>;
  }
  if (!isAuthenticated) {
     return <div className="text-center py-10">Please login to edit this project.</div>;
  }
  if (formError && isFetchingProject) { // Error during initial fetch
    return <div className="text-center text-red-500 py-10">{formError}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Edit Project: {projectData.name || projectId}</h1>
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

            {formError && !isFetchingProject && <p className="text-red-500 text-center">{formError}</p>}

            <div className="flex justify-end gap-4 mt-8">
              <Button color="danger" variant="flat" onClick={() => router.back()} isDisabled={isLoading}>
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

export default EditProjectPage;
