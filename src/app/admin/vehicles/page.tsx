'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, Car, Loader2 } from 'lucide-react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { vehicles as initialVehicles } from '@/lib/data';
import type { Vehicle } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { sleep } from '@/lib/utils';


const vehicleSchema = z.object({
  plate_text: z.string().min(1, 'Plate number is required'),
  owner_name: z.string().min(1, 'Owner name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  vehicle_model: z.string().min(1, 'Vehicle model is required'),
});


function RegisterVehicleForm({ onVehicleAdd }: { onVehicleAdd: (vehicle: Vehicle) => void }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plate_text: '',
      owner_name: '',
      phone: '',
      vehicle_model: '',
    },
  });

  async function onSubmit(values: z.infer<typeof vehicleSchema>) {
    setIsLoading(true);
    await sleep(1000);

    const newVehicle: Vehicle = {
      ...values,
      institute_id: 'INST-001',
    };
    onVehicleAdd(newVehicle);
    toast({
      title: 'Vehicle Registered',
      description: `Vehicle with plate ${values.plate_text} has been successfully registered.`,
    });
    form.reset();
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="plate_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Plate</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ABC-123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="owner_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 555-1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicle_model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Model</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Toyota Camry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register Vehicle
        </Button>
      </form>
    </Form>
  );
}


function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plate Number</TableHead>
          <TableHead>Owner Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Vehicle Model</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow key={vehicle.plate_text}>
            <TableCell className="font-medium">{vehicle.plate_text}</TableCell>
            <TableCell>{vehicle.owner_name}</TableCell>
            <TableCell>{vehicle.phone}</TableCell>
            <TableCell>{vehicle.vehicle_model}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [activeTab, setActiveTab] = useState('list');

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles([vehicle, ...vehicles]);
    setActiveTab('list');
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Vehicle Management</h1>
        <p className="text-muted-foreground">
          Register new vehicles and view all registered vehicles in the system.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-96">
          <TabsTrigger value="list">
            <Car className="mr-2 h-4 w-4" />
            Vehicle List
          </TabsTrigger>
          <TabsTrigger value="register">
            <PlusCircle className="mr-2 h-4 w-4" />
            Register Vehicle
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Registered Vehicles</CardTitle>
              <CardDescription>
                A list of all vehicles registered in the institute's system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VehicleList vehicles={vehicles} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register a New Vehicle</CardTitle>
              <CardDescription>
                Fill out the form below to add a new vehicle to the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterVehicleForm onVehicleAdd={addVehicle} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
