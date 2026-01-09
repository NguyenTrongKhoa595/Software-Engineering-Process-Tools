import { useEffect, useState } from 'react';
import { Building2, FileText, ScrollText, MessageSquare, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { managerApi } from '@/lib/api/managerApi';
import { PropertySummaryDTO } from '@/lib/api/propertyApi';
import { LeaseApplicationResponseDTO } from '@/lib/api/leaseApplicationApi';
import { LeaseResponseDTO } from '@/lib/api/leaseApi';
import { conversationsApi } from '@/lib/api/conversationsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}

function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function PropertyManagerDashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<PropertySummaryDTO[]>([]);
  const [applications, setApplications] = useState<LeaseApplicationResponseDTO[]>([]);
  const [leases, setLeases] = useState<LeaseResponseDTO[]>([]);
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const loadDashboardData = async () => {
    // 1. Properties
    try {
      const props = await managerApi.getManagedProperties();
      console.log('PM Properties:', props);
      setProperties(props);
    } catch (error) {
      console.error('Failed to load PM Properties:', error);
    }

    // 2. Applications
    try {
      const apps = await managerApi.getManagedApplications();
      console.log('PM Applications:', apps);
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load PM Applications:', error);
    }

    // 3. Leases
    try {
      const leaseList = await managerApi.getManagedLeases();
      console.log('PM Leases:', leaseList);
      setLeases(leaseList);
    } catch (error) {
      console.error('Failed to load PM Leases:', error);
    }

    // 4. Maintenance
    try {
      const maint = await managerApi.getManagedMaintenance();
      console.log('PM Maintenance:', maint);
      setMaintenanceCount(maint.filter(m => m.status === 'OPEN').length);
    } catch (error) {
      console.error('Failed to load PM Maintenance:', error);
    }
      
    // 5. Unread Messages
    try {
      const msgs = await conversationsApi.getUnreadCount();
      setUnreadMessages(msgs.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const pendingApplications = applications.filter(app => app.status === 'PENDING');
  const activeLeases = leases.filter(lease => lease.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Property Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName?.split(' ')[0]}! Here's an overview of your managed properties.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Managed Properties"
          value={properties.length}
          description="Properties assigned to you"
          icon={Building2}
        />
        <StatsCard
          title="Pending Applications"
          value={pendingApplications.length}
          description="Awaiting review"
          icon={FileText}
        />
        <StatsCard
          title="Active Leases"
          value={activeLeases.length}
          description="Current tenants"
          icon={ScrollText}
        />
        <StatsCard
          title="Open Maintenance"
          value={maintenanceCount}
          description="Requests pending"
          icon={Wrench}
        />
        <StatsCard
          title="Unread Messages"
          value={unreadMessages}
          description="From tenants"
          icon={MessageSquare}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pending Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Applications
            </CardTitle>
            <CardDescription>Applications awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending applications</p>
            ) : (
              <div className="space-y-3">
                {pendingApplications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{app.property.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Applied {new Date(app.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={app.status === 'PENDING' ? 'secondary' : 'outline'}>
                      {app.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
                {pendingApplications.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/dashboard/pm-applications')}
                  >
                    View All Applications
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Managed Properties Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Managed Properties
            </CardTitle>
            <CardDescription>Properties you're assigned to manage</CardDescription>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No properties assigned yet. Contact your landlord to be added as a manager.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {properties.slice(0, 3).map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src={property.coverImageUrl || '/placeholder.svg'} 
                        alt={property.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm truncate max-w-[180px]">{property.title}</p>
                        <p className="text-xs text-muted-foreground">
                          ${property.rentAmount}/mo
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      property.status === 'AVAILABLE' ? 'default' : 
                      property.status === 'RENTED' ? 'secondary' : 'outline'
                    }>
                      {property.status}
                    </Badge>
                  </div>
                ))}
                {properties.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/dashboard/pm-properties')}
                  >
                    View All Properties
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
