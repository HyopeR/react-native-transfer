export interface Core {
  id: string;
  url: string;
  path: string;
  headers?: Record<string, any>;
  metadata?: Record<string, any>;
}
