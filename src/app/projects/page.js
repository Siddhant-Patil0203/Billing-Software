"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '../contexts/GlobalContext.jsx';
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, CardHeader, CardBody, Spinner, Tooltip } from '@nextui-org/react';
import { EditIcon } from '../components/EditIcon'; // Assuming you have or will create these
import { DeleteIcon } from '../components/DeleteIcon';
import { EyeIcon } from '../components/EyeIcon'; // For a view project link, if desired

const ProjectListPage = () => {
  const { token, isAuthenticated, loading: authLoading } = useGlobalContext();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data || []);
    } catch (err) {
      setError(err.message);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchProjects();
    }
  }, [authLoading, isAuthenticated, router, fetchProjects]);
  
  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    setIsLoading(true); // Or a specific loading state for delete
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete project');
      }
      // Refetch projects after deletion
      fetchProjects();
    } catch (err) {
      setError(err.message); // Show error to user
      setIsLoading(false);
    }
  };


  if (authLoading || isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner label="Loading projects..." /></div>;
  }
   if (!isAuthenticated) {
     return <div className="text-center py-10">Please login to view projects.</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  const columns = [
    { key: 'name', label: 'Project Name' },
    { key: 'clientName', label: 'Client Name' },
    { key: 'clientEmail', label: 'Client Email' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Link href="/projects/new">
            <Button color="primary">Create New Project</Button>
          </Link>
        </CardHeader>
        <CardBody>
          {projects.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500">No projects found. Get started by creating one!</p>
          ) : (
            <Table aria-label="Projects table">
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={projects} emptyContent={"No projects to display."}>
                {(item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.clientName || 'N/A'}</TableCell>
                    <TableCell>{item.clientEmail || 'N/A'}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="relative flex items-center gap-2">
                        {/* <Tooltip content="View Project">
                          <Link href={`/projects/${item._id}`}>
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                              <EyeIcon />
                            </span>
                          </Link>
                        </Tooltip> */}
                        <Tooltip content="Edit Project">
                          <Link href={`/projects/${item._id}/edit`}>
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                              <EditIcon />
                            </span>
                          </Link>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete Project">
                          <span 
                            className="text-lg text-danger cursor-pointer active:opacity-50"
                            onClick={() => handleDeleteProject(item._id)}
                          >
                            <DeleteIcon />
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
       {/* Simple Icon Components (or import from a library) */}
      <div style={{ display: 'none' }}> {/* Hide these from rendering directly */}
        <svg id="edit-icon-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
        <svg id="delete-icon-svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
        <svg id="eye-icon-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
      </div>
    </div>
  );
};

export default ProjectListPage;
