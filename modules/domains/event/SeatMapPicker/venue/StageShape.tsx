'use client';

export function StageShape({
  stagePoints,
  stagePath,
  stageLabel = 'SAHNE / SAHA',
  stageLabelX,
  stageLabelY,
}: {
  stagePoints?: string;
  stagePath?: string;
  stageLabel?: string;
  stageLabelX?: number;
  stageLabelY?: number;
}) {
  const hasStage = !!(stagePoints || stagePath);
  if (!hasStage) return null;

  return (
    <g>
      {stagePoints && (
        <polygon
          points={stagePoints}
          style={{
            fill: 'var(--surface-overlay)',
            stroke: 'var(--border-strong)',
            strokeWidth: 2,
          }}
        />
      )}
      {stagePath && (
        <path
          d={stagePath}
          style={{
            fill: 'var(--surface-overlay)',
            stroke: 'var(--border-strong)',
            strokeWidth: 2,
          }}
        />
      )}
      {stageLabelX != null && stageLabelY != null && (
        <text
          x={stageLabelX}
          y={stageLabelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          letterSpacing={1.5}
          style={{
            fill: 'var(--text-disabled)',
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          {stageLabel}
        </text>
      )}
    </g>
  );
}
