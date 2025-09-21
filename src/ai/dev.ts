import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-vehicle-registrations.ts';
import '@/ai/flows/summarize-verification-history.ts';
import '@/ai/flows/extract-plate-number.ts';
