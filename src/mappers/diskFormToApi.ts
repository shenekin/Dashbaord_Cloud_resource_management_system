export interface DiskFormData {
  type: string;
  size: number;
}

export interface DiskApiRequest {
  type: string;
  size: number;
}

/**
 * Maps disk form data to API request format
 */
export function diskFormToApi(diskForm: DiskFormData): DiskApiRequest {
  return {
    type: diskForm.type,
    size: diskForm.size,
  };
}

