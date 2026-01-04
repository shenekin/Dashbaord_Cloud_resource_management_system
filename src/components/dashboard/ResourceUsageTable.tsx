'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { ProjectResourceUsage } from '@/types';

interface ResourceUsageTableProps {
  data: ProjectResourceUsage[];
}

const columnHelper = createColumnHelper<ProjectResourceUsage>();

/**
 * Project Resource Usage Table component
 */
export default function ResourceUsageTable({ data }: ResourceUsageTableProps) {
  const columns = [
    columnHelper.accessor('projectName', {
      header: 'Project',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('cpu', {
      header: 'CPU',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${info.getValue()}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{info.getValue()}%</span>
        </div>
      ),
    }),
    columnHelper.accessor('ram', {
      header: 'RAM',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${info.getValue()}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{info.getValue()}%</span>
        </div>
      ),
    }),
    columnHelper.accessor('storage', {
      header: 'Storage',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${info.getValue()}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{info.getValue()}%</span>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Project Resource Usage</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

