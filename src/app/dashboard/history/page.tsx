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
import { history as historyData } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const sortedHistory = [...historyData].sort((a, b) => b.verified_at.getTime() - a.verified_at.getTime());

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.map((item) => (
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
                      {item.verified_at.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
