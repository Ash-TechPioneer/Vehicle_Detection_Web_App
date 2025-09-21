import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-xl font-bold text-primary", className)}>
      <ShieldCheck className="h-6 w-6" />
      <h1 className="font-headline">
        scan&K<span className="text-sm font-normal">"no"</span>W
      </h1>
    </div>
  );
}
