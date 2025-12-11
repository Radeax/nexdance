export interface NavigationGroup {
  id: string;
  name: string;
  danceStyleIds: string[];
  flatten: boolean;
  order: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TabProfile {
  id: string;
  name: string;
  visibleGroupIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
