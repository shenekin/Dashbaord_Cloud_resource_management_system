export interface NetworkFormData {
  vpc: string;
  subnet: string;
  privateIP?: string;
}

export interface NetworkApiRequest {
  vpc_id: string;
  subnet_id: string;
  private_ip?: string;
}

/**
 * Maps network form data to API request format
 */
export function networkFormToApi(networkForm: NetworkFormData): NetworkApiRequest {
  return {
    vpc_id: networkForm.vpc,
    subnet_id: networkForm.subnet,
    private_ip: networkForm.privateIP,
  };
}

