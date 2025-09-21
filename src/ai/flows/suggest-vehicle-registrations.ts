// src/ai/flows/suggest-vehicle-registrations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest potentially unregistered vehicles based on scan history patterns.
 *
 * - suggestVehicleRegistrations - An async function that initiates the flow and returns suggestions.
 * - SuggestVehicleRegistrationsInput - The input type for the suggestVehicleRegistrations function.
 * - SuggestVehicleRegistrationsOutput - The return type for the suggestVehicleRegistrations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestVehicleRegistrationsInputSchema = z.object({
  scanHistory: z
    .string()
    .describe(
      'A string containing the scan history data, including plate numbers and timestamps.'
    ),
  knownVehiclePlateNumbers: z
    .array(z.string())
    .describe(
      'An array of strings representing the plate numbers of already registered vehicles.'
    ),
});
export type SuggestVehicleRegistrationsInput = z.infer<
  typeof SuggestVehicleRegistrationsInputSchema
>;

const SuggestVehicleRegistrationsOutputSchema = z.object({
  suggestedPlateNumbers: z
    .array(z.string())
    .describe(
      'An array of strings representing the suggested plate numbers to register.'
    ),
  reasoning: z
    .string()
    .describe(
      'A string explaining the reasoning behind the suggested plate numbers.'
    ),
});
export type SuggestVehicleRegistrationsOutput = z.infer<
  typeof SuggestVehicleRegistrationsOutputSchema
>;

export async function suggestVehicleRegistrations(
  input: SuggestVehicleRegistrationsInput
): Promise<SuggestVehicleRegistrationsOutput> {
  return suggestVehicleRegistrationsFlow(input);
}

const suggestVehicleRegistrationsPrompt = ai.definePrompt({
  name: 'suggestVehicleRegistrationsPrompt',
  input: {schema: SuggestVehicleRegistrationsInputSchema},
  output: {schema: SuggestVehicleRegistrationsOutputSchema},
  prompt: `You are an expert system designed to analyze vehicle scan history and suggest potentially unregistered vehicles for an institute. You are provided with the scan history data and a list of already registered vehicle plate numbers.

  Scan History:
  {{scanHistory}}

  Registered Vehicle Plate Numbers:
  {{knownVehiclePlateNumbers}}

  Based on the scan history, identify patterns or frequently scanned plate numbers that are NOT in the list of registered vehicles. Provide a list of suggested plate numbers to register and explain your reasoning for each suggestion.

  Output in JSON format:
  {
    "suggestedPlateNumbers": ["plate1", "plate2", ...],
    "reasoning": "Explanation for each suggested plate number..."
  }`,
});

const suggestVehicleRegistrationsFlow = ai.defineFlow(
  {
    name: 'suggestVehicleRegistrationsFlow',
    inputSchema: SuggestVehicleRegistrationsInputSchema,
    outputSchema: SuggestVehicleRegistrationsOutputSchema,
  },
  async input => {
    const {output} = await suggestVehicleRegistrationsPrompt(input);
    return output!;
  }
);
