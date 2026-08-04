'use client';

import React from 'react';
import type { AssessmentFormState, AssessmentUpdateFn } from '@/types/assessment-form';
import {
  MAYO_ENDOSCOPIC_SCORE_OPTIONS,
  MAYO_FIELD_LABEL,
  UCEIS_FIELDS,
  normalizeUcEndoscopicScoring,
  parseUcEndoscopicScoring,
  serializeUcEndoscopicScoring,
  endoscopicRemission,
  mesInterpretation,
  uceisInterpretation,
  uceisTotal,
  type MayoEndoscopicScore,
  type UceisFieldId,
  type UcEndoscopicScoringData,
} from '@/lib/uc-endoscopic-scoring';

const inter = "'Inter', sans-serif";

const subsectionTitleStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '#475569',
  fontFamily: inter,
  margin: 0,
};

const scoringSelectStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  padding: '5px 8px',
  fontSize: 12,
  lineHeight: 1.25,
  fontWeight: 600,
  fontFamily: inter,
  color: '#0f172a',
  background: '#fff9e6',
  border: '1px solid #1e3a5f',
  borderRadius: 5,
  cursor: 'pointer',
};

const scoringHeaderCell: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#1e3a5f',
  background: '#dbeafe',
  borderBottom: '1px solid #bfdbfe',
  fontFamily: inter,
  textAlign: 'left',
};

const fieldNameCell: React.CSSProperties = {
  padding: '7px 10px',
  fontSize: 12,
  fontWeight: 700,
  color: '#1e3a5f',
  background: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
  verticalAlign: 'middle',
};

const scoreCell: React.CSSProperties = {
  padding: '6px 8px',
  background: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
  borderLeft: '1px solid #e2e8f0',
  verticalAlign: 'middle',
};

const referenceCell: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: 10,
  lineHeight: 1.3,
  color: '#0f172a',
  background: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
  borderLeft: '1px solid #e2e8f0',
  verticalAlign: 'middle',
};

type ScoringOption = { score: number; label: string; helpText: string };

function HelpTextList({
  options,
  selected,
}: {
  options: readonly ScoringOption[];
  selected: number | null;
}) {
  return (
    <>
      {options.map((opt) => {
        const isSelected = selected === opt.score;
        return (
          <div
            key={opt.score}
            style={{
              fontSize: 10,
              fontStyle: 'italic',
              fontWeight: isSelected ? 700 : 400,
              color: isSelected ? '#0e7490' : '#475569',
              lineHeight: 1.3,
            }}
          >
            {opt.helpText}
          </div>
        );
      })}
    </>
  );
}

const uceisSummaryLabelCell: React.CSSProperties = {
  width: '50%',
  padding: '8px 12px',
  fontSize: 11,
  fontWeight: 700,
  color: '#1e3a5f',
  background: '#dbeafe',
  borderBottom: '1px solid #bfdbfe',
  fontFamily: inter,
  verticalAlign: 'middle',
};

const uceisSummaryValueCell: React.CSSProperties = {
  width: '50%',
  padding: '8px 12px',
  textAlign: 'center',
  background: '#ffffff',
  borderBottom: '1px solid #bfdbfe',
  borderLeft: '1px solid #bfdbfe',
  fontFamily: inter,
  verticalAlign: 'middle',
};

function UceisSummaryRows({
  total,
  interpretation,
}: {
  total: number;
  interpretation: ReturnType<typeof uceisInterpretation>;
}) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: inter }}>
      <tbody>
        <tr>
          <td style={uceisSummaryLabelCell}>UCEIS Total Score (0 – 8)</td>
          <td
            style={{
              ...uceisSummaryValueCell,
              border: '1px solid #1e3a5f',
              borderTop: 'none',
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
              {total}
            </span>
          </td>
        </tr>
        <tr>
          <td style={{ ...uceisSummaryLabelCell, borderBottom: 'none' }}>UCEIS Interpretation</td>
          <td
            style={{
              ...uceisSummaryValueCell,
              borderBottom: 'none',
              border: '1px solid #1e3a5f',
              borderTop: '1px solid #bfdbfe',
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: interpretation.color,
              }}
            >
              {interpretation.display}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

const summaryHeaderStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#ffffff',
  background: '#1e3a5f',
  fontFamily: inter,
  textAlign: 'left',
};

const summaryLabelCell: React.CSSProperties = {
  width: '50%',
  padding: '8px 12px',
  fontSize: 11,
  fontWeight: 700,
  color: '#1e3a5f',
  background: '#eff6ff',
  borderBottom: '1px solid #dbeafe',
  fontFamily: inter,
  verticalAlign: 'middle',
};

const summaryValueCell: React.CSSProperties = {
  width: '50%',
  padding: '8px 12px',
  textAlign: 'center',
  background: '#ffffff',
  borderBottom: '1px solid #dbeafe',
  borderLeft: '1px solid #dbeafe',
  fontFamily: inter,
  verticalAlign: 'middle',
};

function UcEndoscopicSummary({
  mesScore,
  mesGrade,
  uceisTotalScore,
  uceisGrade,
  remission,
}: {
  mesScore: MayoEndoscopicScore;
  mesGrade: ReturnType<typeof mesInterpretation>;
  uceisTotalScore: number;
  uceisGrade: ReturnType<typeof uceisInterpretation>;
  remission: ReturnType<typeof endoscopicRemission>;
}) {
  const rows: {
    label: string;
    value: string;
    color?: string;
    valueSize?: number;
    isLast?: boolean;
  }[] = [
    { label: 'MES Score', value: String(mesScore), valueSize: 18 },
    { label: 'MES Grade', value: mesGrade.display, color: mesGrade.color, valueSize: 14 },
    { label: 'UCEIS Total', value: String(uceisTotalScore), valueSize: 18 },
    { label: 'UCEIS Grade', value: uceisGrade.display, color: uceisGrade.color, valueSize: 14 },
    {
      label: 'Endoscopic Remission?',
      value: remission.display,
      color: remission.color,
      valueSize: 12,
      isLast: true,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h5 style={subsectionTitleStyle}>UC Endoscopic Summary</h5>
      <div
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={summaryHeaderStyle}>Summary</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: inter }}>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td
                  style={{
                    ...summaryLabelCell,
                    borderBottom: row.isLast ? 'none' : summaryLabelCell.borderBottom,
                  }}
                >
                  {row.label}
                </td>
                <td
                  style={{
                    ...summaryValueCell,
                    borderBottom: row.isLast ? 'none' : summaryValueCell.borderBottom,
                    border: row.isLast ? '1px solid #1e3a5f' : undefined,
                    borderTop: row.isLast ? '1px solid #dbeafe' : undefined,
                  }}
                >
                  <span
                    style={{
                      fontSize: row.valueSize ?? 18,
                      fontWeight: 800,
                      color: row.color ?? '#0f172a',
                      lineHeight: 1.4,
                    }}
                  >
                    {row.value}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScoringTable({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h5 style={subsectionTitleStyle}>{title}</h5>
      <div
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: inter }}>
          <thead>
            <tr>
              <th style={{ ...scoringHeaderCell, width: '22%' }}>Field</th>
              <th style={{ ...scoringHeaderCell, width: '28%', borderLeft: '1px solid #bfdbfe' }}>
                Score
              </th>
              <th style={{ ...scoringHeaderCell, borderLeft: '1px solid #bfdbfe' }}>Reference</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
        {footer}
      </div>
    </div>
  );
}

type Props = {
  data: AssessmentFormState;
  updateData: AssessmentUpdateFn;
};

export default function UcEndoscopicScoringTool({ data, updateData }: Props) {
  const ucScoring = normalizeUcEndoscopicScoring(
    parseUcEndoscopicScoring((data as Record<string, unknown>).ucEndoscopicScoring),
  );
  const selectedMayo = ucScoring.mayoEndoscopicScore;
  const uceisScores = ucScoring.uceis;

  const updateScoring = (patch: Partial<UcEndoscopicScoringData>) => {
    const next = { ...ucScoring, ...patch };
    updateData({
      ucEndoscopicScoring: serializeUcEndoscopicScoring(normalizeUcEndoscopicScoring(next)),
    });
  };

  const setMayoScore = (raw: string) => {
    updateScoring({
      mayoEndoscopicScore: (raw === '' ? 0 : Number(raw)) as MayoEndoscopicScore,
    });
  };

  const setUceisField = (fieldId: UceisFieldId, raw: string) => {
    updateScoring({
      uceis: {
        ...uceisScores,
        [fieldId]: raw === '' ? 0 : Number(raw),
      },
    });
  };

  const uceisTotalScore = uceisTotal(uceisScores);
  const uceisInterp = uceisInterpretation(uceisTotalScore);
  const mesInterp = mesInterpretation(selectedMayo);
  const remission = endoscopicRemission(selectedMayo, uceisTotalScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ScoringTable title={MAYO_FIELD_LABEL}>
        <tr>
          <td style={fieldNameCell}>{MAYO_FIELD_LABEL}</td>
          <td style={scoreCell}>
            <select
              id="mayoEndoscopicScore"
              style={scoringSelectStyle}
              value={String(selectedMayo)}
              onChange={(e) => setMayoScore(e.target.value)}
            >
              {MAYO_ENDOSCOPIC_SCORE_OPTIONS.map((opt) => (
                <option key={opt.score} value={String(opt.score)}>
                  {opt.label}
                </option>
              ))}
            </select>
          </td>
          <td style={referenceCell}>
            <HelpTextList options={MAYO_ENDOSCOPIC_SCORE_OPTIONS} selected={selectedMayo} />
          </td>
        </tr>
      </ScoringTable>

      <ScoringTable
        title="UC Endoscopic Index of Severity (UCEIS)"
        footer={
          <UceisSummaryRows total={uceisTotalScore} interpretation={uceisInterp} />
        }
      >
        {UCEIS_FIELDS.map((field) => {
          const selected = uceisScores[field.id];
          return (
            <tr key={field.id}>
              <td style={{ ...fieldNameCell, color: '#0f172a' }}>{field.label}</td>
              <td style={scoreCell}>
                <select
                  id={`uceis-${field.id}`}
                  style={scoringSelectStyle}
                  value={String(selected)}
                  onChange={(e) => setUceisField(field.id, e.target.value)}
                >
                  {field.options.map((opt) => (
                    <option key={opt.score} value={String(opt.score)}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
              <td style={referenceCell}>
                <HelpTextList options={field.options} selected={selected} />
              </td>
            </tr>
          );
        })}
      </ScoringTable>

      <UcEndoscopicSummary
        mesScore={selectedMayo}
        mesGrade={mesInterp}
        uceisTotalScore={uceisTotalScore}
        uceisGrade={uceisInterp}
        remission={remission}
      />
    </div>
  );
}
