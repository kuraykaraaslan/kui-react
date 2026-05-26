'use client';
import { Spinner } from '../../Spinner';

// Loading / Empty / Error single-row state for the table body.

export function StateRow({
  state,
  colSpan,
  message,
}: {
  state: 'empty' | 'loading' | 'error';
  colSpan: number;
  message: string;
}) {
  if (state === 'loading') {
    return (
      <tr>
        <td
          colSpan={colSpan}
          className="px-4 py-10 text-center text-sm text-text-secondary"
        >
          <span className="inline-flex items-center gap-2">
            <Spinner size="sm" />
            {message}
          </span>
        </td>
      </tr>
    );
  }
  if (state === 'error') {
    return (
      <tr>
        <td
          colSpan={colSpan}
          className="px-4 py-10 text-center text-sm text-error-fg bg-error-subtle"
        >
          {message}
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-10 text-center text-sm text-text-secondary"
      >
        {message}
      </td>
    </tr>
  );
}
