/**
 * Database types.
 *
 * Hand-written to mirror `supabase/migrations/`. Once a real project exists,
 * regenerate instead of editing by hand:
 *
 *   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
 *
 * Keep this in step with the migrations — a drift here is a silent runtime bug,
 * not a compile error, because Supabase returns whatever the database has.
 */

export type InquiryStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "in_discussion"
  | "proposal"
  | "won"
  | "lost"
  | "archived";

export type StaffRole = "admin" | "editor";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: StaffRole;
  is_active: boolean;
  can_view_inquiries: boolean;
  created_at: string;
  updated_at: string;
};

export type Inquiry = {
  id: string;
  reference: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  project_type: string;
  service_slug: string | null;
  budget: string | null;
  timeline: string | null;
  preferred_contact: string | null;
  message: string;
  status: InquiryStatus;
  assigned_to: string | null;
  source_path: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

export type InquiryNote = {
  id: string;
  inquiry_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
};

export type Notification = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export type AuditLog = {
  id: number;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  detail: Record<string, unknown> | null;
  created_at: string;
};

type Insertable<T, Optional extends keyof T> = Omit<T, Optional> & Partial<Pick<T, Optional>>;

/**
 * `Relationships` is part of postgrest-js's `GenericTable` contract — without
 * it the whole schema degrades to `never` and every query loses its types.
 * Only relationships actually traversed via nested selects need describing;
 * the rest stay empty.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Insertable<
          Profile,
          "created_at" | "updated_at" | "role" | "is_active" | "can_view_inquiries" | "full_name"
        >;
        Update: Partial<Profile>;
        Relationships: [];
      };
      inquiries: {
        Row: Inquiry;
        // `reference` is assigned by a database trigger, never by the client.
        Insert: Omit<
          Inquiry,
          "id" | "reference" | "created_at" | "updated_at" | "status" | "assigned_to"
        > &
          Partial<Pick<Inquiry, "status" | "assigned_to">>;
        Update: Partial<Inquiry>;
        Relationships: [];
      };
      inquiry_notes: {
        Row: InquiryNote;
        Insert: Omit<InquiryNote, "id" | "created_at">;
        Update: Partial<InquiryNote>;
        // Drives `select("*, profiles(...)")` on the inquiry detail page.
        Relationships: [
          {
            foreignKeyName: "inquiry_notes_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, "id" | "created_at" | "read_at"> &
          Partial<Pick<Notification, "read_at">>;
        Update: Partial<Notification>;
        Relationships: [];
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, "id" | "created_at">;
        Update: Partial<AuditLog>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      consume_rate_limit: {
        Args: { p_bucket: string; p_limit: number; p_window_seconds: number };
        Returns: boolean;
      };
    };
    Enums: {
      inquiry_status: InquiryStatus;
      staff_role: StaffRole;
    };
    CompositeTypes: Record<never, never>;
  };
};

/** Statuses in pipeline order, with the labels the admin UI shows. */
export const inquiryStatuses: Array<{ value: InquiryStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "in_discussion", label: "In discussion" },
  { value: "proposal", label: "Proposal" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "archived", label: "Archived" },
];
