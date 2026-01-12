// Server form data types

export interface BasicInfo {
  region: string;
  az: string;
  name: string;
  count: number;
  dryRun: boolean;
  customer_id?: number;
  vendor_id?: number;
  credential_id?: number;
}

export interface ComputeInfo {
  flavor: string;
  image: string;
  adminPassword: string;
}

export interface StorageInfo {
  systemDisk: {
    type: string;
    size: number;
  };
  dataDisks: Array<{
    type: string;
    size: number;
  }>;
}

export interface NetworkInfo {
  vpc: string;
  subnet: string;
}

export interface IPInfo {
  privateIP?: string;
  enableIPv6: boolean;
  publicIP?: {
    eipType: string;
    bandwidthType: string;
    bandwidthSize: number;
  };
}

export interface BillingInfo {
  chargingMode: string;
  autoTerminateTime?: string;
}

export interface AdvancedInfo {
  tags: Array<{
    key: string;
    value: string;
  }>;
}

export interface ServerFormData {
  basic: BasicInfo;
  compute: ComputeInfo;
  storage: StorageInfo;
  network: NetworkInfo;
  ip: IPInfo;
  billing: BillingInfo;
  tags: AdvancedInfo;
}

