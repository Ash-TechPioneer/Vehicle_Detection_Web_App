import { getVehicleByPlate, addHistory } from '@/lib/vehicles';
import type { Vehicle } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, User, Phone, Car, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

async function getVehicleDetails(plate: string): Promise<Vehicle | null> {
  const vehicle = await getVehicleByPlate(plate);
  
  await addHistory({
    plate_text: plate.toUpperCase(),
    status: vehicle ? 'Registered' : 'Unregistered',
  });
  
  return vehicle || null;
}

export default async function VerifyPage({ params }: { params: { plate: string } }) {
  const plateNumber = decodeURIComponent(params.plate).toUpperCase();
  const vehicle = await getVehicleDetails(plateNumber);

  return (
    <div className="container mx-auto flex items-center justify-center flex-1">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verification Result</CardTitle>
            <CardDescription className="font-mono text-4xl font-bold tracking-widest text-foreground py-4">
              {plateNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vehicle ? (
              <RegisteredVehicleCard vehicle={vehicle} />
            ) : (
              <UnregisteredVehicleCard />
            )}
            <div className="mt-6 text-center">
                <Button asChild>
                    <Link href="/dashboard/scan">Scan Another Vehicle</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RegisteredVehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="border-2 border-green-500 bg-green-50 rounded-lg p-6">
      <div className="flex flex-col items-center text-center text-green-800">
        <CheckCircle className="h-16 w-16 mb-4 text-green-500" />
        <h3 className="text-2xl font-bold">Vehicle Registered</h3>
        <p className="text-green-600">Access granted. Details below.</p>
      </div>
      <div className="mt-6 space-y-4 text-sm">
        <div className="flex items-center">
          <User className="h-5 w-5 mr-3 text-green-700" />
          <div>
            <p className="font-semibold text-gray-500">Owner</p>
            <p className="font-medium text-gray-800">{vehicle.owner_name}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Phone className="h-5 w-5 mr-3 text-green-700" />
          <div>
            <p className="font-semibold text-gray-500">Phone</p>
            <p className="font-medium text-gray-800">{vehicle.phone}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Car className="h-5 w-5 mr-3 text-green-700" />
          <div>
            <p className="font-semibold text-gray-500">Model</p>
            <p className="font-medium text-gray-800">{vehicle.vehicle_model}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UnregisteredVehicleCard() {
    return (
      <div className="border-2 border-destructive bg-red-50 rounded-lg p-6">
        <div className="flex flex-col items-center text-center text-red-800">
          <XCircle className="h-16 w-16 mb-4 text-destructive" />
          <h3 className="text-2xl font-bold">Vehicle Not Registered</h3>
          <div className="mt-4 flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-800 p-3 rounded-md">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <p className="text-left font-medium">
                This vehicle is not authorized for entry. Please follow security protocols.
            </p>
          </div>
        </div>
      </div>
    );
  }
