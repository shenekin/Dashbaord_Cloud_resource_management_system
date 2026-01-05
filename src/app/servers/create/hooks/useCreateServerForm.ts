'use client';

import { useState } from 'react';
import { ServerFormData } from '@/types/server';

const initialFormData: ServerFormData = {
  basic: {
    region: '',
    az: '',
    name: '',
    count: 1,
    dryRun: false,
  },
  compute: {
    flavor: '',
    image: '',
    adminPassword: '',
  },
  storage: {
    systemDisk: {
      type: '',
      size: 40,
    },
    dataDisks: [],
  },
  network: {
    vpc: '',
    subnet: '',
  },
  ip: {
    enableIPv6: false,
  },
  billing: {
    chargingMode: 'postPaid',
  },
  tags: {
    tags: [],
  },
};

export function useCreateServerForm() {
  const [formData, setFormData] = useState<ServerFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = <K extends keyof ServerFormData>(
    section: K,
    data: Partial<ServerFormData[K]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.basic.region) newErrors['basic.region'] = 'Region is required';
    if (!formData.basic.az) newErrors['basic.az'] = 'Availability zone is required';
    if (!formData.basic.name) newErrors['basic.name'] = 'Server name is required';
    if (!formData.compute.flavor) newErrors['compute.flavor'] = 'Flavor is required';
    if (!formData.compute.image) newErrors['compute.image'] = 'Image is required';
    if (!formData.compute.adminPassword) newErrors['compute.adminPassword'] = 'Admin password is required';
    if (!formData.network.vpc) newErrors['network.vpc'] = 'VPC is required';
    if (!formData.network.subnet) newErrors['network.subnet'] = 'Subnet is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    errors,
    updateFormData,
    validate,
    reset,
  };
}

