'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, CameraOff, Loader2, ScanLine } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vehicles } from '@/lib/data';
import { sleep } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
          setError(null);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access the camera. Please check permissions and try again.');
        toast({
          variant: 'destructive',
          title: 'Camera Error',
          description: 'Could not access the camera. Please ensure permissions are granted.',
        });
        setIsCameraOn(false);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScan = async () => {
    if (!isCameraOn) {
        toast({
          variant: 'destructive',
          title: 'Camera is off',
          description: 'Please turn on the camera to start scanning.',
        });
        return;
    }
    setIsScanning(true);

    // Simulate OCR processing time
    await sleep(2000);

    // Simulate OCR result: 70% chance of a known vehicle, 30% of an unknown one
    const isKnown = Math.random() < 0.7;
    let plate = '';
    if (isKnown) {
      plate = vehicles[Math.floor(Math.random() * vehicles.length)].plate_text;
    } else {
      plate = `NEW-${Math.floor(Math.random() * 900) + 100}`;
    }

    toast({
      title: 'Scan Complete',
      description: `Detected plate: ${plate}`,
    });

    setIsScanning(false);
    stopCamera();
    router.push(`/dashboard/verify/${plate}`);
  };

  return (
    <div className="container mx-auto">
       <div className="mb-8">
        <h1 className="text-3xl font-bold">Live Vehicle Scanner</h1>
        <p className="text-muted-foreground">Point the camera at a license plate and start the scan.</p>
      </div>
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`} />
            {!isCameraOn && (
              <div className="text-center text-muted-foreground">
                <CameraOff className="mx-auto h-12 w-12" />
                <p className="mt-2">{error || 'Camera is off or not available.'}</p>
              </div>
            )}
             {isScanning && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="text-lg font-semibold">Scanning for license plate...</p>
              </div>
            )}
            <div className="absolute top-4 left-4 right-4 h-2/3 border-4 border-dashed border-accent/70 rounded-lg opacity-50" />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button onClick={handleScan} className="w-full sm:w-auto flex-grow bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isScanning}>
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <ScanLine className="mr-2 h-4 w-4" />
                  Start Scan
                </>
              )}
            </Button>
            <Button onClick={isCameraOn ? stopCamera : startCamera} variant="outline" className="w-full sm:w-auto">
              {isCameraOn ? <CameraOff className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
              {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
