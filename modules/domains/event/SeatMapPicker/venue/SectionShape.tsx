'use client';
import type { SectionNode, SectionMapShape } from '../types';
import { collectSeatIds, countAllSeats, countAvailSeats } from '../tree';
import { getSectionStyle } from '../style';

export function SectionShape({
  shape,
  node,
  selectedIds,
  hovered,
  onHover,
  onClick,
}: {
  shape: SectionMapShape;
  node: SectionNode;
  selectedIds: Set<string>;
  hovered: boolean;
  onHover: (sectionId: string | null) => void;
  onClick: (sectionId: string) => void;
}) {
  const seatIds = collectSeatIds(node);
  const selectedCount = seatIds.filter((id) => selectedIds.has(id)).length;
  const total = countAllSeats(node);
  const avail = countAvailSeats(node);
  const shapeStyle = getSectionStyle(node, selectedCount, hovered);
  const pricingLabel = node.pricing
    ? node.pricing.price === 0
      ? 'Ücretsiz'
      : `₺${node.pricing.price.toLocaleString('tr-TR')}`
    : null;

  const lx = shape.labelX;
  const ly = shape.labelY;
  const rot = shape.labelRotate;
  const rotTransform = (yOffset: number) =>
    rot ? `rotate(${rot}, ${lx}, ${ly + yOffset})` : undefined;

  return (
    <g
      onClick={() => onClick(shape.sectionId)}
      onMouseEnter={() => onHover(shape.sectionId)}
      onMouseLeave={() => onHover(null)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(shape.sectionId)}
      aria-label={`${node.section.label ?? node.section.name}: ${avail}/${total} müsait`}
    >
      {shape.points && (
        <polygon points={shape.points} style={shapeStyle} />
      )}
      {shape.path && (
        <path d={shape.path} style={shapeStyle} />
      )}

      {/* Hover ring glow */}
      {hovered && shape.points && (
        <polygon
          points={shape.points}
          style={{
            fill: 'none',
            stroke: shapeStyle.stroke as string,
            strokeWidth: 5,
            strokeOpacity: 0.2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Section name */}
      <text
        x={lx} y={ly - (pricingLabel ? 12 : 6)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={13}
        style={{ fill: 'var(--text-primary)', fontWeight: 800, pointerEvents: 'none' }}
        transform={rotTransform(-(pricingLabel ? 12 : 6))}
      >
        {node.section.label ?? node.section.name}
      </text>

      {/* Price */}
      {pricingLabel && (
        <text
          x={lx} y={ly + 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          style={{ fill: 'var(--text-secondary)', fontWeight: 600, pointerEvents: 'none' }}
          transform={rotTransform(6)}
        >
          {pricingLabel}
        </text>
      )}

      {/* Availability */}
      <text
        x={lx} y={ly + (pricingLabel ? 22 : 10)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={9}
        style={{ fill: 'var(--text-secondary)', pointerEvents: 'none' }}
        transform={rotTransform(pricingLabel ? 22 : 10)}
      >
        {avail}/{total} müsait
      </text>

      {/* Selected-count badge */}
      {selectedCount > 0 && (
        <g style={{ pointerEvents: 'none' }}>
          <circle
            cx={lx + 36} cy={ly - 26}
            r={12}
            style={{ fill: 'var(--primary)' }}
          />
          <text
            x={lx + 36} y={ly - 26}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            style={{ fill: 'var(--primary-fg)', fontWeight: 800 }}
          >
            {selectedCount}
          </text>
        </g>
      )}
    </g>
  );
}
