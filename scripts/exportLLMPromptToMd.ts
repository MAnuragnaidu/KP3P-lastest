/**
 * Writes the exact care-sheet LLM prompt (system + rulebook + patient) to a markdown file.
 *
 * Usage (from admin/):
 *   npx ts-node -P tsconfig.scripts.json scripts/exportLLMPromptToMd.ts
 * Output: ../medical-lit/admin/LLM-Prompt-Export.md (gitignored)
 */
import fs from 'fs';
import path from 'path';
import { CARE_SHEET_SYSTEM_PROMPT } from '../src/lib/care-sheet-system-prompt';
import { loadIbdRulebookText } from '../src/lib/load-ibd-rulebook';
import { breakdownCareSheetPayload } from '../src/lib/llm-payload-stats';
import { buildKP3PPrompt } from '../src/lib/kp3p-prompt';
import { sampleKP3PPatient } from './sampleKP3PPatient';

const OUTPUT_PATH = path.join(__dirname, '..', '..', 'medical-lit', 'admin', 'LLM-Prompt-Export.md');

function fence(text: string): string {
  const tick = '```';
  return `${tick}text\n${text}\n${tick}`;
}

async function main(): Promise<void> {
  const rulebookText = await loadIbdRulebookText();
  const patientPrompt = buildKP3PPrompt(sampleKP3PPatient());
  const stats = breakdownCareSheetPayload(
    CARE_SHEET_SYSTEM_PROMPT,
    rulebookText,
    patientPrompt,
  );

  const md = `# KP-3P Care Sheet — Exact LLM Prompt Export

Generated: ${new Date().toISOString()}

Source: \`POST /api/generate-caresheet\` → \`llmProvider.generateCarePlan()\`

## Message structure (Claude & Gemini)

| Part | Role | Source |
|------|------|--------|
| 1 | **System** | \`CARE_SHEET_SYSTEM_PROMPT\` |
| 2 | **User (first text block)** | \`medical-doc/IBD_Clinical_Rulebook_Final2.pdf\` (extracted text) |
| 3 | **User (second text block)** | \`buildKP3PPrompt(patient)\` |

Gemini maps part 1 to \`systemInstruction\`; parts 2–3 are user \`contents\` in order.
Claude maps part 1 to \`system\`; parts 2–3 are a single user message with two text blocks.

## Payload size (this export)

| Component | Characters | Est. tokens (÷4) |
|-----------|------------|----------------|
| System prompt | ${stats.systemPromptChars.toLocaleString()} | ${Math.ceil(stats.systemPromptChars / 4).toLocaleString()} |
| Rulebook | ${stats.rulebookChars.toLocaleString()} | ${Math.ceil(stats.rulebookChars / 4).toLocaleString()} |
| Patient prompt | ${stats.patientPromptChars.toLocaleString()} | ${Math.ceil(stats.patientPromptChars / 4).toLocaleString()} |
| **Total input** | **${stats.totalChars.toLocaleString()}** | **~${stats.estimatedTotalTokens.toLocaleString()}** |

> **Note:** The patient block below uses sample patient \`ID 42\`. Each real request substitutes that patient's assessment data via \`buildKP3PPrompt\`.

---

## 1. System prompt

${fence(CARE_SHEET_SYSTEM_PROMPT)}

---

## 2. User message — rulebook (\`IBD_Clinical_Rulebook_Final2.pdf\`)

${fence(rulebookText)}

---

## 3. User message — patient KP-3P prompt (sample patient)

${fence(patientPrompt)}
`;

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, md, 'utf8');
  console.log(`Wrote ${OUTPUT_PATH} (${stats.totalChars.toLocaleString()} chars)`);
}

main().catch((err: unknown) => {
  console.error('FAIL:', err instanceof Error ? err.message : err);
  process.exit(1);
});
