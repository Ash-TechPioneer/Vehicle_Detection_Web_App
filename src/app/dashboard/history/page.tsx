'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllHistory } from '@/lib/vehicles';
import { cn } from '@/lib/utils';
import type { History } from '@/lib/definitions';
import { Loader2 } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      const historyData = await getAllHistory();
      const sortedHistory = [...historyData].sort((a, b) => b.verified_at.getTime() - a.verified_at.getTime());
      setHistory(sortedHistory);
      setIsLoading(false);
    }
    loadHistory();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Scan History</h1>
        <p className="text-muted-foreground">A log of all your vehicle verifications.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Verification Log</CardTitle>
          <CardDescription>
            Showing all vehicles you have verified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.history_id}>
                      <TableCell className="font-mono font-semibold">{item.plate_text}</TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === 'Registered' ? 'default' : 'destructive'}
                          className={cn(item.status === 'Registered' && 'bg-green-600')}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {new Date(item.verified_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
