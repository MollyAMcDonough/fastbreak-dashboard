import React from 'react';

interface StatsTableProps {
  data: Array<Record<string, any>>;
  columns: Array<{ key: string; label: string }>;
  title?: string;
}

const StatsTable: React.FC<StatsTableProps> = ({ data, columns, title }) => {
  return (
    <div className="mb-8">
      {title && <h3 className="mb-2 text-xl font-semibold">{title}</h3>}
      <div className="overflow-x-auto overflow-y-auto max-h-[400px] border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={row.id || row.name || idx}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-2 text-sm font-medium text-gray-500 whitespace-nowrap"
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTable;
