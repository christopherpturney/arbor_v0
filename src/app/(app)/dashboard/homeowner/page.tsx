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
    <div className="p-8">
      <div className="space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-base-200 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Active Projects</h3>
            <p className="text-3xl font-medium text-sage">{stats.activeProjects}</p>
          </div>
          <div className="bg-base-200 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Completed Projects</h3>
            <p className="text-3xl font-medium text-sage">{stats.completedProjects}</p>
          </div>
          <div className="bg-base-200 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Total Spent</h3>
            <p className="text-3xl font-medium text-sage">${stats.totalSpent}</p>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">Your Projects</h2>
            <Link href="/projects/new" className="btn btn-primary">
              New Project
            </Link>
          </div>
          <p className="text-base text-charcoal/70 mb-8">
            Manage your design consultation requests
          </p>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-base-200 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">{project.title}</h3>
                <p className="text-charcoal/70 mb-4">{project.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar placeholder">
                    <div className="w-8 rounded-full bg-primary text-primary-content">
                      <span>{project.designer?.name[0]}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{project.designer?.name}</p>
                    <p className="text-xs text-charcoal/70">Designer</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-charcoal/70">
                  <span>Budget: ${project.budget}</span>
                  <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className={`px-3 py-1 bg-${
                    project.status === 'in_progress' ? 'sage' : 
                    project.status === 'completed' ? 'sage' : 
                    'neutral'
                  }/20 text-${
                    project.status === 'in_progress' ? 'sage' : 
                    project.status === 'completed' ? 'sage' : 
                    'neutral'
                  } rounded-full text-sm`}>
                    {project.status.replace(/_/g, ' ')}
                  </span>
                  <Link 
                    href={`/projects/${project.id}`}
                    className="btn btn-ghost btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 