import { ServerFormData } from '@/types/server';

export interface ServerApiRequest {
  region: string;
  availability_zone: string;
  name: string;
  count: number;
  flavor: string;
  image: string;
  admin_password: string;
  system_disk: {
    type: string;
    size: number;
  };
  data_disks?: Array<{
    type: string;
    size: number;
  }>;
  vpc_id: string;
  subnet_id: string;
  private_ip?: string;
  enable_ipv6: boolean;
  public_ip?: {
    eip_type: string;
    bandwidth_type: string;
    bandwidth_size: number;
  };
  charging_mode: string;
  auto_terminate_time?: string;
  tags?: Array<{
    key: string;
    value: string;
  }>;
}

/**
 * Maps server form data to API request format
 */
export function serverFormToApi(formData: ServerFormData): ServerApiRequest {
  return {
    region: formData.basic.region,
    availability_zone: formData.basic.az,
    name: formData.basic.name,
    count: formData.basic.count,
    flavor: formData.compute.flavor,
    image: formData.compute.image,
    admin_password: formData.compute.adminPassword,
    system_disk: {
      type: formData.storage.systemDisk.type,
      size: formData.storage.systemDisk.size,
    },
    data_disks: formData.storage.dataDisks.length > 0 ? formData.storage.dataDisks : undefined,
    vpc_id: formData.network.vpc,
    subnet_id: formData.network.subnet,
    private_ip: formData.ip.privateIP,
    enable_ipv6: formData.ip.enableIPv6,
    public_ip: formData.ip.publicIP ? {
      eip_type: formData.ip.publicIP.eipType,
      bandwidth_type: formData.ip.publicIP.bandwidthType,
      bandwidth_size: formData.ip.publicIP.bandwidthSize,
    } : undefined,
    charging_mode: formData.billing.chargingMode,
    auto_terminate_time: formData.billing.autoTerminateTime,
    tags: formData.tags.tags.length > 0 ? formData.tags.tags : undefined,
  };
}

