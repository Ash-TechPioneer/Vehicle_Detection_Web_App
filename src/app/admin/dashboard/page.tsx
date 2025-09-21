'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Mail, User } from 'lucide-react';
import { users } from '@/lib/data';
import type { User as UserType } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const [userList, setUserList] = useState<UserType[]>(users);
  const { toast } = useToast();

  const handleApproval = (userId: number, newStatus: 'approved' | 'pending') => {
    setUserList(
      userList.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    toast({
      title: `User ${newStatus === 'approved' ? 'Approved' : 'Action Reverted'}`,
      description: `The user's status has been updated.`,
    });
  };

  const pendingUsers = userList.filter((user) => user.status === 'pending');

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage user approvals and system settings.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending User Approvals</CardTitle>
          <CardDescription>
            Review and approve or deny new member registration requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length > 0 ? (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-secondary rounded-full">
                       <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant="outline">Pending</Badge>
                     <Button variant="ghost" size="icon" onClick={() => handleApproval(user.id, 'approved')}>
                       <CheckCircle className="h-5 w-5 text-green-500" />
                       <span className="sr-only">Approve</span>
                     </Button>
                     <Button variant="ghost" size="icon">
                       <XCircle className="h-5 w-5 text-red-500" />
                       <span className="sr-only">Deny</span>
                     </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No pending user approvals.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
