'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  designer?: {
    name: string;
    avatar?: string;
  };
  created_at: string;
  budget: number;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Living Room Redesign',
    description: 'Need help with furniture arrangement and color scheme for my living room.',
    status: 'in_progress',
    designer: {
      name: 'Sarah Johnson',
    },
    created_at: new Date().toISOString(),
    budget: 200
  },
  {
    id: '2',
    title: 'Kitchen Color Scheme',
    description: 'Looking for advice on paint colors and backsplash options.',
    status: 'pending',
    created_at: new Date().toISOString(),
    budget: 150
  },
  {
    id: '3',
    title: 'Bedroom Makeover',
    description: 'Complete bedroom refresh including furniture layout and decor.',
    status: 'completed',
    designer: {
      name: 'Michael Chen',
    },
    created_at: new Date().toISOString(),
    budget: 250
  }
];

export default function HomeownerDashboard() {
  const [projects] = useState<Project[]>(mockProjects);

  const stats = {
    activeProjects: projects.filter(p => p.status === 'in_progress').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalSpent: projects
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.budget, 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card bg-base-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Active Projects</h3>
          <p className="text-2xl font-bold">{stats.activeProjects}</p>
        </div>
        <div className="stat-card bg-base-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Completed Projects</h3>
          <p className="text-2xl font-bold">{stats.completedProjects}</p>
        </div>
        <div className="stat-card bg-base-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Spent</h3>
          <p className="text-2xl font-bold">${stats.totalSpent}</p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <p className="text-base-content/70">Manage your design consultation requests</p>
        </div>
        <Link href="/projects/new" className="btn btn-primary">
          New Project
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">{project.title}</h3>
              <p className="text-base-content/70">{project.description}</p>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Budget:</span>
                  <span className="font-bold">${project.budget}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm">{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {project.designer && (
                <div className="mt-4 flex items-center gap-2 p-2 bg-base-200 rounded-lg">
                  <div className="avatar placeholder">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-content">
                      <span>{project.designer.name[0]}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{project.designer.name}</p>
                    <p className="text-xs text-base-content/70">Designer</p>
                  </div>
                </div>
              )}
              <div className="card-actions justify-end mt-4">
                <span className={`badge ${
                  project.status === 'in_progress' ? 'badge-primary' : 
                  project.status === 'completed' ? 'badge-success' : 
                  'badge-ghost'
                }`}>
                  {project.status.replace(/_/g, ' ')}
                </span>
                <Link 
                  href={`/projects/${project.id}`}
                  className="btn btn-sm btn-ghost"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-base-100 rounded-box">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">No projects yet</h3>
              <p className="text-base-content/70">Create your first design consultation request to get started</p>
              <Link href="/projects/new" className="btn btn-primary">
                Create Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 