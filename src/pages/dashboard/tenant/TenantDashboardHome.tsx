import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  CreditCard,
  Heart,
  Wrench,
  ArrowRight,
  Calendar,
  MapPin,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { useAuth } from '@/contexts/AuthContext';
import { conversationsApi } from '@/lib/api/conversationsApi';
import { leaseApi } from '@/lib/api/leaseApi';
import { paymentApi } from '@/lib/api/paymentApi';
import { getMyMaintenanceRequests } from '@/lib/api/maintenanceApi';
import { savedPropertiesApi } from '@/lib/api/savedPropertiesApi';
import { mockActivityFeed } from '@/data/mockTenant'; // Keeping activity feed mock for now as API is missing

export default function TenantDashboardHome() {
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Fetch Unread Messages
  useEffect(() => {
    conversationsApi.getUnreadCount()
      .then(response => setUnreadMessages(response.unreadCount))
      .catch(err => console.error('Failed to fetch unread count:', err));
  }, []);

  // 1. Fetch Tenant Leases
  const { data: leases, isLoading: isLoadingLeases } = useQuery({
    queryKey: ['tenant-leases'],
    queryFn: () => leaseApi.getMyLeases(),
  });

  // 2. Fetch Upcoming Payments
  const { data: upcomingPayments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['upcoming-rent'],
    queryFn: () => paymentApi.getUpcomingRentDues(),
  });

  // 3. Fetch Maintenance Requests
  const { data: maintenanceRequests, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ['my-maintenance', { status: 'ALL' }],
    queryFn: () => getMyMaintenanceRequests({ size: 100 }),
  });

  // 4. Fetch Saved Properties
  const { data: savedProperties, isLoading: isLoadingSaved } = useQuery({
    queryKey: ['saved-properties'],
    queryFn: () => savedPropertiesApi.getSavedProperties(),
  });

  // Derived State
  const currentRental = leases?.find(l => l.status === 'ACTIVE');
  const pendingPayment = upcomingPayments?.find(p => p.status === 'DUE' || p.status === 'OVERDUE' || p.status === 'UPCOMING');
  
  // Filter for ANY non-completed status for the "Open Tickets" count
  const openMaintenanceCount = maintenanceRequests?.content.filter(
    m => m.status !== 'COMPLETED' && m.status !== 'CANCELLED' && m.status !== 'REJECTED'
  ).length || 0;
  
  const savedCount = savedProperties?.length || 0;

  const daysUntilPayment = pendingPayment
    ? differenceInDays(parseISO(pendingPayment.dueDate), new Date())
    : null;

  const isLoading = isLoadingLeases || isLoadingPayments || isLoadingMaintenance || isLoadingSaved;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.fullName?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your rentals
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Next Payment"
          value={pendingPayment ? `$${pendingPayment.amountDue.toLocaleString()}` : 'None'}
          subtitle={
            pendingPayment 
              ? (daysUntilPayment !== null && daysUntilPayment < 0 
                  ? `Overdue by ${Math.abs(daysUntilPayment)} days` 
                  : `Due in ${daysUntilPayment} days`)
              : 'No payment due'
          }
          icon={CreditCard}
          iconClassName={pendingPayment?.status === 'OVERDUE' ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}
        />
        <StatsCard
          title="Current Rent"
          value={currentRental ? `$${currentRental.rentAmount.toLocaleString()}/mo` : 'N/A'}
          subtitle={currentRental ? 'Monthly' : undefined}
          icon={Building2}
          iconClassName="bg-accent/10 text-accent"
        />
        <StatsCard
          title="Open Tickets"
          value={openMaintenanceCount}
          subtitle="Maintenance requests"
          icon={Wrench}
          iconClassName="bg-warning/10 text-warning"
        />
        <StatsCard
          title="Saved Properties"
          value={savedCount}
          subtitle="In your wishlist"
          icon={Heart}
          iconClassName="bg-destructive/10 text-destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Rental Card */}
        <div className="lg:col-span-2 space-y-6">
          {currentRental ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Current Rental</CardTitle>
                <Link to="/dashboard/rentals">
                  <Button variant="ghost" size="sm">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={currentRental.propertyCoverImageUrl || '/placeholder.svg'}
                    alt={currentRental.propertyTitle}
                    className="w-full sm:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {currentRental.propertyTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {currentRental.propertyAddress}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Lease ends{' '}
                          {format(parseISO(currentRental.endDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                       {/* Landlord details aren't fully populated in LeaseResponseDTO yet typically, but we have names */}
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {currentRental.landlordName?.[0] || 'L'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {currentRental.landlordName}
                        </p>
                        <p className="text-xs text-muted-foreground">Landlord</p>
                      </div>
                      <Link to={`/dashboard/messages/${currentRental.landlordId}`} className="ml-auto">
                        <Button variant="outline" size="sm">
                          Message
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Active Rental</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have an active rental yet
                </p>
                <Link to="/properties">
                  <Button>Browse Properties</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Payment Alert */}
          {pendingPayment && (
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Payment Due</p>
                      <p className="text-sm text-muted-foreground">
                        ${pendingPayment.amountDue.toLocaleString()} due on{' '}
                        {format(parseISO(pendingPayment.dueDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Link to="/dashboard/payments">
                    <Button>Pay Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link to="/dashboard/payments">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Pay Rent</span>
                  </Button>
                </Link>
                <Link to="/dashboard/maintenance">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                    <Wrench className="h-5 w-5" />
                    <span className="text-xs">Maintenance</span>
                  </Button>
                </Link>
                <Link to="/properties">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                    <Building2 className="h-5 w-5" />
                    <span className="text-xs">Browse</span>
                  </Button>
                </Link>
                <Link to="/dashboard/messages">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 relative">
                    {unreadMessages > 0 && (
                      <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {unreadMessages}
                      </Badge>
                    )}
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs">Messages</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card className="h-fit">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>System notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Note: Real activity feed API is not yet available, using mock for visual placeholder */}
            <ActivityFeed activities={mockActivityFeed} maxItems={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

