import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {  Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { paymentApi } from '@/lib/api/paymentApi';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ActionItemsProps {
  overduePayments: any[];
  expiringLeases: any[];
  isLoadingExternal: boolean;
}

export function ActionItems({ overduePayments, expiringLeases, isLoadingExternal }: ActionItemsProps) {
  const navigate = useNavigate();

  // Fetch Upcoming Rent Dues (This might need backend adjustment to support Landlord view correctly)
  const { data: upcomingPropPayments, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['landlord-upcoming-payments'],
    queryFn: () => paymentApi.getUpcomingRentDues(),
    retry: false, 
  });

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1 h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Action Items
        </CardTitle>
        <CardDescription>
          {isLoadingExternal ? "Scanning portfolio..." : "Tasks requiring your attention"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Overdue Alerts */}
        {overduePayments.map((payment, idx) => (
           <div key={`overdue-${idx}`} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-200">Overdue Rent: ${payment.amount}</p>
                <p className="text-xs text-red-700 dark:text-red-300">
                    {payment.property} • Due {payment.dueDate}
                </p>
                <Button variant="link" size="sm" className="h-auto p-0 text-red-600 dark:text-red-400 font-semibold text-xs">
                    View Details
                </Button>
            </div>
           </div>
        ))}

        {/* Expiring Leases */}
        {expiringLeases.map((lease, idx) => (
            <div key={`expiring-${idx}`} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Lease Expiring Soon</p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                    {lease.propertyTitle} • Ends {format(parseISO(lease.endDate), 'MMM d')}
                </p>
                 <Button variant="link" size="sm" className="h-auto p-0 text-amber-600 dark:text-amber-400 font-semibold text-xs">
                    Review Renewal
                </Button>
            </div>
           </div>
        ))}

        {/* Empty State if no urgent actions */}
        {!isLoadingExternal && overduePayments.length === 0 && expiringLeases.length === 0 && (
          <div className="text-center py-2">
             <p className="text-sm text-muted-foreground">No urgent alerts. Good job!</p>
          </div>
        )}

        {/* Upcoming Income (Low priority than alerts) */}
         <div className="pt-2 border-t mt-2">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Upcoming Income
            </h4>
            <div className="space-y-2">
                {isLoadingUpcoming ? (
                    <p className="text-xs text-muted-foreground">Loading...</p>
                ) : upcomingPropPayments && upcomingPropPayments.length > 0 ? (
                    upcomingPropPayments.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm p-2 hover:bg-muted rounded-md transition-colors cursor-default">
                             <div className="flex flex-col">
                                <span className="font-medium">${item.amountDue} Due</span>
                                <span className="text-xs text-muted-foreground">
                                    {format(parseISO(item.dueDate), 'MMM d, yyyy')}
                                </span>
                             </div>
                             <div className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground">
                                {item.status}
                             </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-muted-foreground italic">No upcoming payments found.</p>
                )}
            </div>
         </div>

      </CardContent>
    </Card>
  );
}
