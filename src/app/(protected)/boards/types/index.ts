// Local Types for Board Page and Sub Pages
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

export interface BoardDeckType {
  id: string;
  board_id: string;
  user_id: string;
  workspace_id: string;
  name: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CardType {
  id: string;
  deck_id: string;
  user_id: string;
  title: string;
  description: string;
  start_date: string | null;
  due_date: string | null;
  cover_color: string;
  created_at: string;
  updated_at: string;
}
