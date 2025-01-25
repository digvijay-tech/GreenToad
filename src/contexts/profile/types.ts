// Types for Profile Context

// Profile Type
export interface UserProfileType {
  id: string;
  default_workspace_id: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

// Workspace Type
export interface WorkspaceType {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
