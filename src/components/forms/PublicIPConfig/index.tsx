'use client';

interface PublicIPConfigProps {
  enabled: boolean;
  eipType: string;
  bandwidthType: string;
  bandwidthSize: number;
  onEnabledChange: (enabled: boolean) => void;
  onEIPTypeChange: (type: string) => void;
  onBandwidthTypeChange: (type: string) => void;
  onBandwidthSizeChange: (size: number) => void;
}

export default function PublicIPConfig({
  enabled,
  eipType,
  bandwidthType,
  bandwidthSize,
  onEnabledChange,
  onEIPTypeChange,
  onBandwidthTypeChange,
  onBandwidthSizeChange,
}: PublicIPConfigProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enablePublicIP"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="enablePublicIP" className="ml-2 text-sm text-gray-700">
          Enable Public IP
        </label>
      </div>
      {enabled && (
        <div className="pl-6 space-y-4 border-l-2 border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">EIP Type</label>
            <select
              value={eipType}
              onChange={(e) => onEIPTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select EIP type</option>
              <option value="5_bgp">5_bgp</option>
              <option value="5_sbgp">5_sbgp</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bandwidth Type</label>
            <select
              value={bandwidthType}
              onChange={(e) => onBandwidthTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select bandwidth type</option>
              <option value="PER">PER (Per EIP)</option>
              <option value="WHOLE">WHOLE (Shared)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bandwidth Size (Mbps)</label>
            <input
              type="number"
              min="1"
              max="2000"
              value={bandwidthSize}
              onChange={(e) => onBandwidthSizeChange(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}

