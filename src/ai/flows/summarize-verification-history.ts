// Summarizes vehicle verification history within a specified period for admin overview.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeVerificationHistoryInputSchema = z.object({
  startTime: z.string().describe('The start date and time for the history summary period in ISO format.'),
  endTime: z.string().describe('The end date and time for the history summary period in ISO format.'),
  instituteId: z.string().describe('The ID of the institute for which to summarize the history.'),
});

export type SummarizeVerificationHistoryInput = z.infer<typeof SummarizeVerificationHistoryInputSchema>;

const SummarizeVerificationHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the vehicle verification history for the specified period.'),
});

export type SummarizeVerificationHistoryOutput = z.infer<typeof SummarizeVerificationHistoryOutputSchema>;

export async function summarizeVerificationHistory(
  input: SummarizeVerificationHistoryInput
): Promise<SummarizeVerificationHistoryOutput> {
  return summarizeVerificationHistoryFlow(input);
}

const summarizeVerificationHistoryPrompt = ai.definePrompt({
  name: 'summarizeVerificationHistoryPrompt',
  input: {
    schema: SummarizeVerificationHistoryInputSchema,
  },
  output: {
    schema: SummarizeVerificationHistoryOutputSchema,
  },
  prompt: `You are an administrative assistant tasked with summarizing vehicle verification logs for institutes.

  Summarize the vehicle verification history between {{startTime}} and {{endTime}} for institute ID {{instituteId}}.
  Focus on identifying trends such as peak entry times, frequently verified vehicles, and any anomalies.
  Provide a concise summary that highlights key insights from the data, useful for security and resource allocation.
`,
});

const summarizeVerificationHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeVerificationHistoryFlow',
    inputSchema: SummarizeVerificationHistoryInputSchema,
    outputSchema: SummarizeVerificationHistoryOutputSchema,
  },
  async input => {
    const {output} = await summarizeVerificationHistoryPrompt(input);
    return output!;
  }
);
