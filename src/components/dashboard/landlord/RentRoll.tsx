import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollText, MoreHorizontal } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RentRollItem {
  leaseId: number;
  propertyTitle: string;
  propertyAddress: string;
  tenantName: string;
  tenantAvatarUrl: string | null;
  rentAmount: number;
  totalPaid: number;
  totalDue: number;
  lastPaymentDate: string | null;
  nextDueDate: string | null;
  status: 'ON_TIME' | 'OVERDUE' | 'LATE' | 'PAID_AHEAD';
}

interface RentRollProps {
  data: RentRollItem[];
  isLoading: boolean;
}

export function RentRoll({ data, isLoading }: RentRollProps) {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-primary" />
          Rent Roll & Tenant Payment History
        </CardTitle>
        <CardDescription>
            Detailed breakdown of productivity for each property
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property / Tenant</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Total Paid (YTD)</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                 <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Loading financial data...
                    </TableCell>
                 </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No active leases found.
                    </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.leaseId}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{item.propertyTitle}</span>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={item.tenantAvatarUrl || ''} />
                                <AvatarFallback className="text-[9px]">{item.tenantName.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{item.tenantName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${item.rentAmount.toLocaleString()}</TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                            <span className="font-medium text-green-600">${item.totalPaid.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground max-w-[80px] truncate" title={`Total Expected: $${item.totalDue.toLocaleString()}`}>
                                of ${item.totalDue.toLocaleString()}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell>
                        {item.lastPaymentDate ? format(parseISO(item.lastPaymentDate), 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                        {item.nextDueDate ? (
                            <div className="flex flex-col">
                                <span className="font-medium">{format(parseISO(item.nextDueDate), 'MMM d, yyyy')}</span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground">None</span>
                        )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === 'ON_TIME' || item.status === 'PAID_AHEAD' ? 'default' : 
                        item.status === 'OVERDUE' ? 'destructive' : 'secondary'
                      } className={item.status === 'ON_TIME' ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
