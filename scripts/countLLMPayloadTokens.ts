/**
 * Report character counts and token estimates for the care-sheet LLM payload.
 *
 * Usage (from admin/):
 *   npx ts-node -P tsconfig.scripts.json scripts/countLLMPayloadTokens.ts
 */
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CARE_SHEET_SYSTEM_PROMPT } from '../src/lib/care-sheet-system-prompt';
import { loadIbdRulebookText } from '../src/lib/load-ibd-rulebook';
import { breakdownCareSheetPayload } from '../src/lib/llm-payload-stats';
import { buildKP3PPrompt } from '../src/lib/kp3p-prompt';
import { sampleKP3PPatient } from './sampleKP3PPatient';

const adminRoot = path.join(__dirname, '..');
dotenv.config({ path: path.join(adminRoot, '.env') });
dotenv.config({ path: path.join(adminRoot, '.env.local'), override: true });

async function geminiTokenCount(
  systemPrompt: string,
  rulebookText: string,
  patientPrompt: string,
): Promise<number | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
  });

  const result = await model.countTokens({
    contents: [
      {
        role: 'user',
        parts: [{ text: rulebookText }, { text: patientPrompt }],
      },
    ],
  });

  return result.totalTokens;
}

async function main(): Promise<void> {
  const rulebookText = await loadIbdRulebookText();
  const patientPrompt = buildKP3PPrompt(sampleKP3PPatient());
  const stats = breakdownCareSheetPayload(
    CARE_SHEET_SYSTEM_PROMPT,
    rulebookText,
    patientPrompt,
  );

  console.log('KP-3P care sheet — LLM input payload\n');
  console.log(`  System prompt:     ${stats.systemPromptChars.toLocaleString()} chars`);
  console.log(`  Rulebook (PDF):    ${stats.rulebookChars.toLocaleString()} chars`);
  console.log(`  Patient prompt:    ${stats.patientPromptChars.toLocaleString()} chars`);
  console.log(`  ─────────────────────────────────`);
  console.log(`  Total characters:  ${stats.totalChars.toLocaleString()}`);
  console.log(`  Estimated tokens:  ~${stats.estimatedTotalTokens.toLocaleString()} (chars ÷ 4)`);

  const geminiTokens = await geminiTokenCount(
    CARE_SHEET_SYSTEM_PROMPT,
    rulebookText,
    patientPrompt,
  );
  if (geminiTokens != null) {
    console.log(`  Gemini countTokens: ${geminiTokens.toLocaleString()} (system + user; gemini-2.5-flash API)`);
  } else {
    console.log('  Gemini countTokens: skipped (GEMINI_API_KEY not set)');
  }
}

main().catch((err: unknown) => {
  console.error('FAIL:', err instanceof Error ? err.message : err);
  process.exit(1);
});
