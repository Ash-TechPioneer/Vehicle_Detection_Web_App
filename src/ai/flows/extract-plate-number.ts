'use server';

/**
 * @fileOverview This file defines a Genkit flow to extract a license plate number from an image.
 *
 * - extractPlateNumber - An async function that initiates the flow and returns the plate number.
 * - ExtractPlateNumberInput - The input type for the extractPlateNumber function.
 * - ExtractPlateNumberOutput - The return type for the extractPlateNumber function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractPlateNumberInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a vehicle's license plate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractPlateNumberInput = z.infer<
  typeof ExtractPlateNumberInputSchema
>;

const ExtractPlateNumberOutputSchema = z.object({
  plateNumber: z.string().describe('The extracted license plate number.'),
});
export type ExtractPlateNumberOutput = z.infer<
  typeof ExtractPlateNumberOutputSchema
>;

export async function extractPlateNumber(
  input: ExtractPlateNumberInput
): Promise<ExtractPlateNumberOutput> {
  return extractPlateNumberFlow(input);
}

const extractPlateNumberPrompt = ai.definePrompt({
  name: 'extractPlateNumberPrompt',
  input: {schema: ExtractPlateNumberInputSchema},
  output: {schema: ExtractPlateNumberOutputSchema},
  prompt: `You are an expert OCR system. Your task is to extract the license plate number from the provided image.
  
  Image: {{media url=photoDataUri}}
  
  Please return only the license plate number in the specified JSON format.`,
});

const extractPlateNumberFlow = ai.defineFlow(
  {
    name: 'extractPlateNumberFlow',
    inputSchema: ExtractPlateNumberInputSchema,
    outputSchema: ExtractPlateNumberOutputSchema,
  },
  async input => {
    const {output} = await extractPlateNumberPrompt(input);
    return output!;
  }
);
