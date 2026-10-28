export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      analytics_events: {
        Row: {
          anon_id: string | null;
          created_at: string;
          id: number;
          name: string;
          props: Json;
          user_id: string | null;
        };
        Insert: {
          anon_id?: string | null;
          created_at?: string;
          id?: never;
          name: string;
          props?: Json;
          user_id?: string | null;
        };
        Update: {
          anon_id?: string | null;
          created_at?: string;
          id?: never;
          name?: string;
          props?: Json;
          user_id?: string | null;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          body: string;
          cover_image_url: string | null;
          created_at: string;
          excerpt: string;
          id: string;
          is_published: boolean;
          published_at: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          body?: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bundle_items: {
        Row: {
          bundle_id: string;
          product_id: string;
        };
        Insert: {
          bundle_id: string;
          product_id: string;
        };
        Update: {
          bundle_id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bundle_items_bundle_id_fkey";
            columns: ["bundle_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bundle_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      entitlements: {
        Row: {
          email: string | null;
          granted_at: string;
          gumroad_sale_id: string | null;
          id: string;
          product_id: string;
          revoked_at: string | null;
          source: string;
          user_id: string | null;
        };
        Insert: {
          email?: string | null;
          granted_at?: string;
          gumroad_sale_id?: string | null;
          id?: string;
          product_id: string;
          revoked_at?: string | null;
          source?: string;
          user_id?: string | null;
        };
        Update: {
          email?: string | null;
          granted_at?: string;
          gumroad_sale_id?: string | null;
          id?: string;
          product_id?: string;
          revoked_at?: string | null;
          source?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "entitlements_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      gumroad_events: {
        Row: {
          dedupe_key: string;
          email: string | null;
          error: string | null;
          gumroad_product_id: string | null;
          id: string;
          is_test: boolean;
          outcome: string | null;
          payload: Json;
          permalink: string | null;
          product_id: string | null;
          received_at: string;
          resource: string;
          sale_id: string | null;
          subscription_id: string | null;
        };
        Insert: {
          dedupe_key: string;
          email?: string | null;
          error?: string | null;
          gumroad_product_id?: string | null;
          id?: string;
          is_test?: boolean;
          outcome?: string | null;
          payload: Json;
          permalink?: string | null;
          product_id?: string | null;
          received_at?: string;
          resource: string;
          sale_id?: string | null;
          subscription_id?: string | null;
        };
        Update: {
          dedupe_key?: string;
          email?: string | null;
          error?: string | null;
          gumroad_product_id?: string | null;
          id?: string;
          is_test?: boolean;
          outcome?: string | null;
          payload?: Json;
          permalink?: string | null;
          product_id?: string | null;
          received_at?: string;
          resource?: string;
          sale_id?: string | null;
          subscription_id?: string | null;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          handled: boolean;
          id: string;
          message: string;
          name: string;
          subject: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          handled?: boolean;
          id?: string;
          message: string;
          name: string;
          subject?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          handled?: boolean;
          id?: string;
          message?: string;
          name?: string;
          subject?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          source: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          source?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          source?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          completed_at: string;
          lesson_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          lesson_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          lesson_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          body: string | null;
          content_url: string | null;
          created_at: string;
          duration_minutes: number | null;
          id: string;
          is_preview: boolean;
          module_id: string;
          position: number;
          title: string;
          type: Database["public"]["Enums"]["lesson_type"];
        };
        Insert: {
          body?: string | null;
          content_url?: string | null;
          created_at?: string;
          duration_minutes?: number | null;
          id?: string;
          is_preview?: boolean;
          module_id: string;
          position?: number;
          title: string;
          type?: Database["public"]["Enums"]["lesson_type"];
        };
        Update: {
          body?: string | null;
          content_url?: string | null;
          created_at?: string;
          duration_minutes?: number | null;
          id?: string;
          is_preview?: boolean;
          module_id?: string;
          position?: number;
          title?: string;
          type?: Database["public"]["Enums"]["lesson_type"];
        };
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "modules";
            referencedColumns: ["id"];
          },
        ];
      };
      modules: {
        Row: {
          course_id: string;
          created_at: string;
          id: string;
          position: number;
          title: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          id?: string;
          position?: number;
          title: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          id?: string;
          position?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          access_tier: Database["public"]["Enums"]["access_tier"];
          audio_path: string | null;
          buy_url: string | null;
          cover_image_url: string | null;
          created_at: string;
          description: string;
          file_path: string | null;
          file_size_label: string | null;
          gallery_urls: string[];
          gumroad_permalink: string | null;
          gumroad_product_id: string | null;
          id: string;
          is_featured: boolean;
          is_free: boolean;
          is_lead_magnet: boolean;
          is_published: boolean;
          length_label: string | null;
          position: number;
          preview_path: string | null;
          price_cents: number;
          slug: string;
          subtitle: string;
          title: string;
          type: Database["public"]["Enums"]["product_type"];
          updated_at: string;
        };
        Insert: {
          access_tier?: Database["public"]["Enums"]["access_tier"];
          audio_path?: string | null;
          buy_url?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string;
          file_path?: string | null;
          file_size_label?: string | null;
          gallery_urls?: string[];
          gumroad_permalink?: string | null;
          gumroad_product_id?: string | null;
          id?: string;
          is_featured?: boolean;
          is_free?: never;
          is_lead_magnet?: boolean;
          is_published?: boolean;
          length_label?: string | null;
          position?: number;
          preview_path?: string | null;
          price_cents?: number;
          slug: string;
          subtitle?: string;
          title: string;
          type?: Database["public"]["Enums"]["product_type"];
          updated_at?: string;
        };
        Update: {
          access_tier?: Database["public"]["Enums"]["access_tier"];
          audio_path?: string | null;
          buy_url?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string;
          file_path?: string | null;
          file_size_label?: string | null;
          gallery_urls?: string[];
          gumroad_permalink?: string | null;
          gumroad_product_id?: string | null;
          id?: string;
          is_featured?: boolean;
          is_free?: never;
          is_lead_magnet?: boolean;
          is_published?: boolean;
          length_label?: string | null;
          position?: number;
          preview_path?: string | null;
          price_cents?: number;
          slug?: string;
          subtitle?: string;
          title?: string;
          type?: Database["public"]["Enums"]["product_type"];
          updated_at?: string;
        };
        Relationships: [];
      };
      podcast_episodes: {
        Row: {
          audio_url: string;
          cover_image_url: string | null;
          created_at: string;
          description: string;
          duration_label: string | null;
          id: string;
          is_published: boolean;
          published_at: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          audio_url: string;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string;
          duration_label?: string | null;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          audio_url?: string;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string;
          duration_label?: string | null;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      memberships: {
        Row: {
          cancelled_at: string | null;
          current_period_end: string | null;
          email: string;
          ended_at: string | null;
          gumroad_product_id: string | null;
          gumroad_subscription_id: string | null;
          id: string;
          manage_url: string | null;
          plan: string;
          source: string;
          started_at: string;
          status: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          cancelled_at?: string | null;
          current_period_end?: string | null;
          email: string;
          ended_at?: string | null;
          gumroad_product_id?: string | null;
          gumroad_subscription_id?: string | null;
          id?: string;
          manage_url?: string | null;
          plan?: string;
          source?: string;
          started_at?: string;
          status?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          cancelled_at?: string | null;
          current_period_end?: string | null;
          email?: string;
          ended_at?: string | null;
          gumroad_product_id?: string | null;
          gumroad_subscription_id?: string | null;
          id?: string;
          manage_url?: string | null;
          plan?: string;
          source?: string;
          started_at?: string;
          status?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: string;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: string;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          created_at: string;
          id: string;
          is_published: boolean;
          location: string | null;
          name: string;
          product_id: string | null;
          quote: string;
          rating: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_published?: boolean;
          location?: string | null;
          name: string;
          product_id?: string | null;
          quote: string;
          rating?: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_published?: boolean;
          location?: string | null;
          name?: string;
          product_id?: string | null;
          quote?: string;
          rating?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "testimonials_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      product_ratings: {
        Row: {
          average: number | null;
          product_id: string | null;
          review_count: number | null;
          stars_1: number | null;
          stars_2: number | null;
          stars_3: number | null;
          stars_4: number | null;
          stars_5: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      course_outline: {
        Args: { _course: string };
        Returns: {
          duration_minutes: number;
          is_preview: boolean;
          lesson_id: string;
          lesson_type: Database["public"]["Enums"]["lesson_type"];
          module_id: string;
          sort_order: number;
          title: string;
        }[];
      };
      has_access: { Args: { _product: string }; Returns: boolean };
      has_membership: { Args: { _user?: string }; Returns: boolean };
      user_email: { Args: { _user: string }; Returns: string };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      access_tier: "free" | "members" | "premium";
      app_role: "admin" | "user";
      lesson_type: "video" | "audio" | "text";
      product_type: "ebook" | "audiobook" | "course" | "bundle";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      lesson_type: ["video", "audio", "text"],
      product_type: ["ebook", "audiobook", "course", "bundle"],
    },
  },
} as const;
