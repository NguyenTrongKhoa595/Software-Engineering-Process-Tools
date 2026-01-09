import { useEffect, useState } from 'react';
import { Building2, FileText, ScrollText, MessageSquare, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { conversationsApi } from '@/lib/api/conversationsApi';
import { propertyApi } from '@/lib/api/propertyApi';
import { leaseApi } from '@/lib/api/leaseApi';
import { leaseApplicationApi } from '@/lib/api/leaseApplicationApi';
import { reportApi } from '@/lib/api/reportApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, subMonths } from 'date-fns';
import { FinancialOverview } from '@/components/dashboard/landlord/FinancialOverview';
import { ActionItems } from '@/components/dashboard/landlord/ActionItems';
import { RentRoll } from '@/components/dashboard/landlord/RentRoll';
import { DashboardFilter } from '@/components/dashboard/landlord/DashboardFilter';
import { DateRange } from 'react-day-picker';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: string;
  isLoading?: boolean;
}

function StatsCard({ title, value, description, icon: Icon, trend, isLoading }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
           <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">
          {description}
          {trend && <span className="text-green-500 ml-1">{trend}</span>}
        </p>
      </CardContent>
    </Card>
  );
}

export default function LandlordDashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Date Filter State (Default: Last 6 Months)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  });

  // Query Params Helper
  const fromDateStr = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '';
  const toDateStr = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '';

  // 1. Fetch Properties & Leases (Basic Stats)
  const { data: properties, isLoading: isLoadingProperties } = useQuery({
    queryKey: ['landlord-properties', user?.id],
    queryFn: () => propertyApi.getPropertiesByLandlord(Number(user?.id)),
    enabled: !!user?.id,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: leases, isLoading: isLoadingLeases } = useQuery({
    queryKey: ['landlord-leases'],
    queryFn: () => leaseApi.getLeasesForLandlord(),
    enabled: !!user?.id,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // 2. Fetch Applications
  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['landlord-applications-aggregated', properties?.map(p => p.id)],
    queryFn: async () => {
      if (!properties || properties.length === 0) return [];
      const promises = properties.map(p => 
        leaseApplicationApi.getApplicationsForProperty(p.id)
          .catch(() => []) 
      );
      const results = await Promise.all(promises);
      return results.flat().sort((a, b) => 
        new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
      );
    },
    enabled: !!properties && properties.length > 0,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // 3. REAL REPORT APIs (Replaces Frontend Calculation)
  
  // Financial Summary
  const { data: financialData, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ['financial-summary', fromDateStr, toDateStr],
    queryFn: () => reportApi.getFinancialSummary(fromDateStr, toDateStr),
    enabled: !!fromDateStr && !!toDateStr,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1, // Don't loop indefinitely on error
  });

  // Financial Trends
  const { data: trendData, isLoading: isLoadingTrends } = useQuery({
    queryKey: ['financial-trends', fromDateStr, toDateStr],
    queryFn: () => reportApi.getFinancialTrends(fromDateStr, toDateStr, 'month'), // Default to month for now
    enabled: !!fromDateStr && !!toDateStr,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Rent Roll
  const { data: rentRollData, isLoading: isLoadingRentRoll } = useQuery({
    queryKey: ['rent-roll'],
    queryFn: () => reportApi.getRentRoll(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Overdue Payments
  const { data: overduePayments, isLoading: isLoadingOverdue } = useQuery({
    queryKey: ['overdue-payments'],
    queryFn: () => reportApi.getOverduePayments(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Expiring Leases
  const { data: expiringLeases, isLoading: isLoadingExpiring } = useQuery({
    queryKey: ['expiring-leases'],
    queryFn: () => reportApi.getExpiringLeases(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });


  useEffect(() => {
     // Fetch unread count
     conversationsApi.getUnreadCount()
       .then(response => setUnreadMessages(response.unreadCount))
       .catch(err => console.error('Failed to fetch unread count:', err));
  }, []);

  const pendingApplications = applications?.filter(app => app.status === 'PENDING') || [];
  const activeLeases = leases?.filter(lease => lease.status === 'ACTIVE') || [];
  const availableProperties = properties?.filter(prop => prop.status === 'AVAILABLE') || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Landlord Dashboard</h1>
            <p className="text-muted-foreground">
            Overview of your properties and financial performance.
            </p>
        </div>
        <DashboardFilter date={dateRange} setDate={setDateRange} />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={properties?.length || 0}
          description={`${availableProperties.length} available`}
          icon={Building2}
          isLoading={isLoadingProperties}
        />
        <StatsCard
          title="Pending Applications"
          value={pendingApplications.length}
          description="Awaiting your review"
          icon={FileText}
          isLoading={isLoadingApplications}
        />
        <StatsCard
          title="Active Leases"
          value={activeLeases.length}
          description="Current tenants"
          icon={ScrollText}
          isLoading={isLoadingLeases}
        />
        <StatsCard
          title="Unread Messages"
          value={unreadMessages}
          description="From tenants"
          icon={MessageSquare}
        />
      </div>

      {/* New Financial & Action Items Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
        <FinancialOverview 
            data={financialData?.summary || { totalRevenue: 0, pendingRevenue: 0, expenses: 0, netIncome: 0 }} 
            trendData={trendData || []}
            isLoading={isLoadingFinancial || isLoadingTrends} 
        />
        <ActionItems 
            overduePayments={overduePayments || []}
            expiringLeases={expiringLeases || []}
            isLoadingExternal={isLoadingOverdue || isLoadingExpiring}
        />
      </div>

      {/* Rent Roll Section - NEW */}
      <div className="grid gap-4">
        <RentRoll 
            data={rentRollData || []} 
            isLoading={isLoadingRentRoll} 
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
            {isLoadingApplications ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
            ) : pendingApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending applications</p>
            ) : (
              <div className="space-y-3">
                {pendingApplications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{app.property.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Applied {format(parseISO(app.applicationDate), 'MMM d, yyyy')}
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
                    onClick={() => navigate('/dashboard/landlord-applications')}
                  >
                    View All Applications
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Properties Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Your Properties
            </CardTitle>
            <CardDescription>Quick overview of your listings</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoadingProperties ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
            ) : !properties || properties.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">No properties listed yet</p>
                <Button onClick={() => navigate('/dashboard/landlord-properties')}>
                  Add Your First Property
                </Button>
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
                    onClick={() => navigate('/dashboard/landlord-properties')}
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
