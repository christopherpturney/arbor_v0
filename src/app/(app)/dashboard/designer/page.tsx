'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import type { Database } from '@/lib/database.types';
import DashboardNav from '@/components/dashboard/DashboardNav';
import type { User } from '@supabase/auth-helpers-nextjs';

type Project = Database['public']['Tables']['projects']['Row'];

export default function DesignerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0
  });
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (projects) {
        setProjects(projects);
      }
    };

    fetchProjects();
  }, [supabase]);

  useEffect(() => {
    async function loadUserAndProjects() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }

        setUser(user);

        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_role')
          .select('user_role')
          .eq('user_id', user.id)
          .single();

        if (roleError) {
          console.error('Error fetching role:', roleError);
          return;
        }

        if (!roleData || roleData.user_role !== 'designer') {
          router.push('/auth');
          return;
        }

        // Calculate stats
        setStats({
          activeProjects: projects.filter(p => p.status === 'in_progress').length,
          completedProjects: projects.filter(p => p.status === 'completed').length,
          totalEarnings: projects
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.budget, 0)
        });
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }

    loadUserAndProjects();
  }, [projects, supabase]);

  return (
    <div className="min-h-screen bg-base-100">
      <DashboardNav user={user} userRole="designer" />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="stat-card bg-base-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Active Projects</h3>
            <p className="text-2xl font-bold">{stats.activeProjects}</p>
          </div>
          <div className="stat-card bg-base-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Completed Projects</h3>
            <p className="text-2xl font-bold">{stats.completedProjects}</p>
          </div>
          <div className="stat-card bg-base-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Total Earnings</h3>
            <p className="text-2xl font-bold">${stats.totalEarnings}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => router.push('/messages')}
            className="btn btn-outline"
          >
            Messages
          </button>
          <button 
            onClick={() => router.push('/portfolio')}
            className="btn btn-outline"
          >
            View Portfolio
          </button>
          <button 
            onClick={() => router.push('/earnings')}
            className="btn btn-outline"
          >
            Earnings Details
          </button>
        </div>

        {/* Projects List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">{project.title}</h3>
                <p className="text-base-content/70">{project.description}</p>
                <div className="card-actions justify-end mt-4">
                  <span className={`badge ${
                    project.status === 'in_progress' ? 'badge-primary' : 
                    project.status === 'completed' ? 'badge-success' : 
                    'badge-ghost'
                  }`}>
                    {project.status.replace(/_/g, ' ')}
                  </span>
                  <button className="btn btn-sm btn-ghost">View Details</button>
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 bg-base-100 rounded-box">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">No projects available</h3>
                <p className="text-base-content/70">Check back later for new design consultation requests</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 