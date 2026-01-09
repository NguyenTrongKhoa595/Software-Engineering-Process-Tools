import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinancialOverviewProps {
  data: {
    totalRevenue: number;
    pendingRevenue: number;
    expenses: number;
    netIncome: number;
  };
  trendData?: { month: string; revenue: number; expenses: number }[];
  isLoading: boolean;
}

export function FinancialOverview({ data, trendData, isLoading }: FinancialOverviewProps) {
  return (
    <Card className="col-span-1 md:col-span-2 shadow-sm border-muted">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Financial Overview (This Month)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="h-20 bg-muted animate-pulse rounded-md" />
               <div className="h-20 bg-muted animate-pulse rounded-md" />
             </div>
             <div className="h-[200px] bg-muted animate-pulse rounded-md" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                  <Badge variant="outline" className="bg-white dark:bg-transparent text-green-700 dark:text-green-400 border-green-200">
                    <TrendingUp className="h-3 w-3 mr-1" /> Real-time
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  ${data.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Verified payments received
                </p>
              </div>

              <div className="p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Pending Revenue</span>
                  <Badge variant="outline" className="bg-white dark:bg-transparent text-orange-700 dark:text-orange-400 border-orange-200">
                    <Wallet className="h-3 w-3 mr-1" /> Due Now
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                  ${data.pendingRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Unpaid invoices this month
                </p>
              </div>
            </div>

            {/* Income Trend Chart */}
            <div className="h-[200px] w-full mt-4">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium">Revenue Trend</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Revenue</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Net Income</div>
                    </div>
                </div>
                {trendData && trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis 
                                dataKey="label" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 10, fill: '#6B7280'}} 
                                dy={10}
                                minTickGap={30}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 10, fill: '#6B7280'}} 
                                tickFormatter={(value) => `$${value/1000}k`}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#16a34a" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                                name="Revenue"
                            />
                            <Area 
                                type="monotone" 
                                dataKey={(data) => data.revenue * 0.9} 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fillOpacity={0} 
                                name="Est. Net Income"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        No data for selected period.
                    </div>
                )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
