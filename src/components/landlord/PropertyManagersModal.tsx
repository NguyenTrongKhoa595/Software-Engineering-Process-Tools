import { useState, useEffect } from 'react';
import { Plus, Trash2, UserPlus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { propertyApi, PropertyLandlord } from '@/lib/api/propertyApi';
import { userApi, UserProfile } from '@/lib/api/userApi';
import { toast } from 'sonner';

interface PropertyManagersModalProps {
  open: boolean;
  onClose: () => void;
  propertyId?: number;
}

export function PropertyManagersModal({ open, onClose, propertyId }: PropertyManagersModalProps) {
  const [manager, setManager] = useState<PropertyLandlord | null>(null);
  const [availableManagers, setAvailableManagers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingManagers, setIsFetchingManagers] = useState(false);
  const [selectedManagerEmail, setSelectedManagerEmail] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && propertyId) {
      fetchData();
    } else {
      // Reset state on close
      setManager(null);
      setSelectedManagerEmail("");
      setIsAdding(false);
    }
  }, [open, propertyId]);

  const fetchData = async () => {
    if (!propertyId) return;
    setIsLoading(true);
    setIsFetchingManagers(true);
    try {
      // Fetch property details and available managers in parallel
      const [propertyData, searchList, myManagers] = await Promise.all([
        propertyApi.getProperty(propertyId),
        userApi.searchUsers({ role: 'PROPERTY_MANAGER' }),
        userApi.getMyManagers().catch(() => []) // Fallback for older backends
      ]);
      
      console.log('Property Manager Modal - Raw Property Data:', propertyData);
      console.log('Property Manager Modal - my-managers List:', myManagers);

      const managersList = [...searchList];
      // Add any from myManagers not already in searchList
      myManagers.forEach(m => {
        if (!managersList.some(sm => sm.id === m.id)) {
          managersList.push(m);
        }
      });

      setAvailableManagers(managersList);

      // Robust identification of current manager
      const mId = propertyData?.managerId || (propertyData as any)?.manager_id || (propertyData?.manager ? propertyData.manager.id : null);
      
      console.log('Property Manager Modal - Identified Manager ID:', mId);

      if (propertyData?.manager && propertyData.manager.id) {
        // Map fields robustly as backend might return different keys (fullName vs name, etc.)
        const raw = propertyData.manager as any;
        setManager({
          id: raw.id,
          name: raw.fullName || raw.name || 'Unknown Manager',
          email: raw.email || '',
          avatar: raw.avatarUrl || raw.avatar || null,
          phone: raw.phoneNumber || raw.phone || '',
          responseRate: raw.responseRate || 0,
          responseTime: raw.responseTime || 'N/A',
          propertiesCount: raw.propertiesCount || 0,
          verified: raw.verified || false
        });
      } else if (mId) {
        const found = managersList.find(m => m.id === mId);
        if (found) {
          setManager({
            id: found.id,
            name: found.fullName || 'Unknown Manager',
            email: found.email || '',
            avatar: found.avatarUrl,
            phone: found.phoneNumber || '',
            responseRate: 0,
            responseTime: 'N/A',
            propertiesCount: 0,
            verified: false
          });
        } else {
          try {
            // Last resort: fetch full profile by ID
            const profile = await userApi.getPublicProfile(Number(mId));
            setManager({
              id: profile.id,
              name: profile.fullName || 'Unknown Manager',
              email: profile.email || '',
              avatar: profile.avatarUrl,
              phone: profile.phoneNumber || '',
              responseRate: 0,
              responseTime: 'N/A',
              propertiesCount: 0,
              verified: false
            });
          } catch (e) {
            console.error('Failed to fetch manager profile by ID:', e);
            setManager(null);
          }
        }
      } else {
        setManager(null);
      }
    } catch (error) {
      console.error('Failed to fetch modal data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
      setIsFetchingManagers(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase();
  };

  const handleAssignManager = async () => {
    if (!propertyId || !selectedManagerEmail) return;

    setIsSubmitting(true);
    try {
      await propertyApi.assignManager(propertyId, selectedManagerEmail);
      await fetchData();
      toast.success('Manager assigned successfully');
      setIsAdding(false);
      setSelectedManagerEmail("");
    } catch (error) {
      console.error('Failed to assign manager:', error);
      toast.error('Failed to assign manager');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveManager = async () => {
    if (!propertyId) return;
    if (!confirm('Are you sure you want to remove this manager?')) return;

    setIsSubmitting(true);
    try {
      await propertyApi.removeManager(propertyId);
      toast.success('Manager removed successfully');
      setManager(null);
    } catch (error) {
      console.error('Failed to remove manager:', error);
      toast.error('Failed to remove manager');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Property Manager</DialogTitle>
          <DialogDescription>
            {manager 
              ? "Current property manager handles tenant requests and maintenance." 
              : "Assign a property manager to handle this property."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading details...</p>
            </div>
          ) : manager ? (
            // Current Manager Display
            <div className="space-y-3">
              <Label>Assigned Manager</Label>
              <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={manager.avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(manager.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{manager.name || 'Unknown Manager'}</p>
                    <p className="text-xs text-muted-foreground">{manager.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={handleRemoveManager}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : (
            // No Manager / Assign Form
            <>
              {!isAdding ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 font-medium">
                    No manager assigned yet
                  </p>
                  <Button variant="outline" onClick={() => setIsAdding(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Manager
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="pm-select">Select Property Manager</Label>
                    <Select 
                      onValueChange={setSelectedManagerEmail} 
                      value={selectedManagerEmail}
                    >
                      <SelectTrigger id="pm-select">
                        <SelectValue placeholder={isFetchingManagers ? "Fetching managers..." : "Select a manager"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableManagers.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No property managers found
                          </div>
                        ) : (
                          availableManagers.map((pm) => (
                            <SelectItem key={pm.id} value={pm.email}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={pm.avatarUrl || undefined} />
                                  <AvatarFallback className="text-[10px]">
                                    {pm.fullName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{pm.fullName} ({pm.email})</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1" 
                      onClick={handleAssignManager}
                      disabled={!selectedManagerEmail || isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Assign Manager
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsAdding(false);
                        setSelectedManagerEmail("");
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="bg-muted/30 -mx-6 -mb-6 p-4 rounded-b-lg border-t mt-4">
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
