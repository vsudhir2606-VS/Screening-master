export interface Entity {
  id: string;
  name: string;
  address: string;
  [key: string]: any;
}

export interface Customer extends Entity {}
export interface RPL extends Entity {}
export interface ZymeEntry extends Entity {
  location?: string;
  type?: string;
}

export interface CommentItem {
  id: string;
  category: 'General' | 'APRV';
  text: string; // Used as "Approval" text for APRV
  title?: string; // Used as "Applying for" for APRV
  additionalInfo?: string; // Used as "Additional comments" for APRV
  remarks?: string; // Used as "Remarks" for APRV
}

export interface Country {
  code: string;
  name: string;
  region: 'APJ' | 'EMEA' | 'AMS';
}

export type Region = 'APJ' | 'EMEA' | 'AMS';