// Local Types for Board Page

export interface BoardType {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  background: string;
  is_closed: boolean;
  members: Array<JSON>;
  changes: Array<JSON>;
  created_at: string;
  updated_at: string;
}

export interface BoardChangesType {
  label: string;
  description: string;
  timestamp: string;
}
