'use client';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  created_at: string;
  homeowner: {
    name: string;
    initials: string;
  };
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Living Room Layout Help',
    description: 'Need advice on furniture arrangement and color scheme for my living room.',
    budget: 200,
    created_at: '2024-02-17',
    homeowner: {
      name: 'John Doe',
      initials: 'JD'
    }
  },
  {
    id: '2',
    title: 'Kitchen Color Scheme',
    description: 'Looking for advice on paint colors and backsplash options.',
    budget: 150,
    created_at: '2024-02-17',
    homeowner: {
      name: 'Alice Smith',
      initials: 'AS'
    }
  },
  {
    id: '3',
    title: 'Bedroom Makeover',
    description: 'Complete bedroom refresh including furniture layout and decor.',
    budget: 250,
    created_at: '2024-02-17',
    homeowner: {
      name: 'Robert Johnson',
      initials: 'RJ'
    }
  }
];

export default function DesignerDashboard() {
  const stats = {
    activeProjects: 2,
    completedProjects: 12,
    totalEarnings: 2400
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
            <h3 className="text-lg font-medium mb-2">Total Earned</h3>
            <p className="text-3xl font-medium text-sage">${stats.totalEarnings}</p>
          </div>
        </div>

        {/* Available Projects Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">Available Projects</h2>
            <button className="btn btn-primary">Browse All</button>
          </div>
          <p className="text-base text-charcoal/70 mb-8">
            New design consultation requests from homeowners
          </p>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <div key={project.id} className="bg-base-200 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">{project.title}</h3>
                <p className="text-charcoal/70 mb-4">{project.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar placeholder">
                    <div className="w-8 rounded-full bg-primary text-primary-content">
                      <span>{project.homeowner.initials}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{project.homeowner.name}</p>
                    <p className="text-xs text-charcoal/70">Homeowner</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-charcoal/70">
                  <span>Budget: ${project.budget}</span>
                  <span>Posted: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="px-3 py-1 bg-sage/20 text-sage rounded-full text-sm">
                    new request
                  </span>
                  <button className="btn btn-ghost btn-sm">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 