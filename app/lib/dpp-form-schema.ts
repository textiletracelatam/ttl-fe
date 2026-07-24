/**
 * Shared schema/types for the Product Passport form.
 *
 * NOTE: the original brief named 15 tables but said "16 tables in total".
 * To add the 16th table, add one more entry to TABLE_SCHEMA below —
 * SideNav, TableCard, and the page's validation/payload logic are all
 * generated from this config automatically.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "email"
  | "color"
  | "url";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

export interface TableDef {
  id: string; // table name
  label: string;
  parent?: string; // id of parent table, for nav grouping only
  description?: string;
  fields: FieldDef[];
}

export const TABLE_SCHEMA: TableDef[] = [
  {
    id: "brand",
    label: "Brand",
    description: "The brand that owns or markets the product.",
    fields: [
      { name: "logo_url", label: "Logo URL", type: "url" },
      { name: "name", label: "Brand name", type: "text", required: true },
      { name: "legal_name", label: "Legal name", type: "text", required: true },
      {
        name: "economic_operator_role",
        label: "Economic Operator Role",
        type: "text",
      },
      { name: "country_of_origin", label: "Country of origin", type: "text" },
      { name: "registration_id", label: "Registration ID", type: "text" },
    ],
  },
  {
    id: "manufacturer",
    label: "Manufacturer",
    description: "The facility or company that manufactures the product.",
    fields: [
      { name: "logo_url", label: "Logo URL", type: "url" },
      { name: "name", label: "Brand name", type: "text", required: true },
      { name: "legal_name", label: "Legal name", type: "text", required: true },
      {
        name: "economic_operator_role",
        label: "Economic Operator Role",
        type: "text",
      },
      { name: "country_of_origin", label: "Country of origin", type: "text" },
      { name: "registration_id", label: "Registration ID", type: "text" },
    ],
  },
  {
    id: "material",
    label: "Materials",
    description: "A material used in the product.",
    fields: [
      { name: "name", label: "Material name", type: "text", required: true },
      {
        name: "percentage",
        label: "Composition Percentage",
        type: "number",
      },
      { name: "description", label: "Description", type: "textarea" },
      { name: "color", label: "Color", type: "color" },
      {
        name: "is_main_material",
        label: "Is it a main material?",
        type: "checkbox",
      },
    ],
  },
  {
    id: "material_innovation",
    label: "Material Innovation",
    parent: "material",
    description: "An innovation associated with the material above.",
    fields: [
      { name: "text", label: "Description", type: "textarea" },
      { name: "link_url", label: "Link URL", type: "url" },
      { name: "link_label", label: "Link Label", type: "text" },
      { name: "images", label: "Images", type: "text" },
    ],
  },
  {
    id: "passport",
    label: "Passport",
    description: "The digital product passport record itself.",
    fields: [
      {
        name: "version",
        label: "Version",
        type: "text",
        required: true,
      },
      { name: "valid_from", label: "Valid From", type: "date" },
      { name: "valid_to", label: "Valid To", type: "date" },
      { name: "retention_period", label: "Retention Period", type: "date" },
      { name: "scope_limitation", label: "Scope Limitation", type: "text" },
      {
        name: "validation_status",
        label: "Validation Status",
        type: "select",
        options: ["draft", "active", "revoked"],
      },
      { name: "validated_by", label: "Validated By", type: "text" },
      { name: "language", label: "Language", type: "text" },
      { name: "access_method", label: "Access Method", type: "text" },
    ],
  },
  {
    id: "product",
    label: "Product",
    description: "The core product record.",
    fields: [
      { name: "name", label: "Product name", type: "text", required: true },
      { name: "title", label: "Product title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "made_in", label: "Made In", type: "text" },
      { name: "reference", label: "Reference", type: "text" },
      { name: "sku", label: "SKU", type: "text", required: true },
      { name: "images", label: "Images", type: "text" },
    ],
  },
  {
    id: "product_care",
    label: "Care",
    parent: "product",
    description: "Care and maintenance instructions for the product.",
    fields: [
      { name: "link_url", label: "Link URL", type: "url" },
      { name: "link_label", label: "Link Label", type: "text" },
      { name: "images", label: "Images", type: "text" },
      { name: "sections", label: "Sections", type: "text" },
    ],
  },
  {
    id: "product_certification",
    label: "Certification",
    parent: "product",
    description: "Certifications the product holds.",
    fields: [
      {
        name: "certification_name",
        label: "Certification name",
        type: "text",
        required: true,
      },
      { name: "certifying_body", label: "Certifying body", type: "text" },
      { name: "certificate_number", label: "Certificate number", type: "text" },
      { name: "issue_date", label: "Issue date", type: "date" },
      { name: "expiry_date", label: "Expiry date", type: "date" },
    ],
  },
  {
    id: "product_environmental",
    label: "Environmental",
    parent: "product",
    description: "Environmental impact data.",
    fields: [
      {
        name: "carbon_footprint_kg",
        label: "Carbon footprint (kg CO2e)",
        type: "number",
      },
      {
        name: "water_usage_liters",
        label: "Water usage (liters)",
        type: "number",
      },
      {
        name: "energy_consumption_kwh",
        label: "Energy consumption (kWh)",
        type: "number",
      },
      {
        name: "recyclability_score",
        label: "Recyclability score (0-100)",
        type: "number",
      },
    ],
  },
  {
    id: "product_green",
    label: "Green",
    parent: "product",
    description: "Sustainability labeling and scoring.",
    fields: [
      { name: "eco_label", label: "Eco label", type: "text" },
      {
        name: "sustainability_score",
        label: "Sustainability score (0-100)",
        type: "number",
      },
      {
        name: "renewable_content_pct",
        label: "Renewable content (%)",
        type: "number",
      },
    ],
  },
  {
    id: "product_post",
    label: "Post",
    parent: "product",
    description: "Editorial / blog-style content tied to the product.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "content", label: "Content", type: "textarea" },
      { name: "published_date", label: "Published date", type: "date" },
      { name: "author", label: "Author", type: "text" },
    ],
  },
  {
    id: "product_section",
    label: "Section",
    parent: "product",
    description: "A content section shown on the product's passport page.",
    fields: [
      {
        name: "section_name",
        label: "Section name",
        type: "text",
        required: true,
      },
      { name: "section_content", label: "Section content", type: "textarea" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
  },
  {
    id: "product_social",
    label: "Social",
    parent: "product",
    description: "Social / social-impact links for the product.",
    fields: [
      { name: "platform", label: "Platform", type: "text", required: true },
      { name: "url", label: "URL", type: "url" },
      {
        name: "hashtags",
        label: "Hashtags",
        type: "text",
        placeholder: "#comma #separated",
      },
    ],
  },
  {
    id: "product_supply",
    label: "Supply",
    parent: "product",
    description: "A supplier in the product's supply chain.",
    fields: [
      {
        name: "supplier_name",
        label: "Supplier name",
        type: "text",
        required: true,
      },
      { name: "supplier_location", label: "Supplier location", type: "text" },
      { name: "supply_type", label: "Supply type", type: "text" },
      { name: "lead_time_days", label: "Lead time (days)", type: "number" },
    ],
  },
  {
    id: "product_supply_stage",
    label: "Supply Stage",
    parent: "product_supply",
    description: "A stage within the supplier's process above.",
    fields: [
      { name: "stage_name", label: "Stage name", type: "text", required: true },
      { name: "stage_order", label: "Stage order", type: "number" },
      { name: "location", label: "Location", type: "text" },
      { name: "stage_date", label: "Date", type: "date" },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
];

export const TABLE_SCHEMA_BY_ID: Record<string, TableDef> = Object.fromEntries(
  TABLE_SCHEMA.map((t) => [t.id, t]),
);

/** Nesting depth for a table, derived from its parent chain. Used for nav indentation. */
export function depthOf(
  id: string,
  byId: Record<string, TableDef> = TABLE_SCHEMA_BY_ID,
): number {
  let depth = 0;
  let current = byId[id];
  while (current?.parent) {
    depth += 1;
    current = byId[current.parent];
  }
  return depth;
}

export type FormState = Record<string, Record<string, string | boolean>>;

export function initialFormState(): FormState {
  const state: FormState = {};
  for (const table of TABLE_SCHEMA) {
    state[table.id] = {};
    for (const field of table.fields) {
      state[table.id][field.name] = field.type === "checkbox" ? false : "";
    }
  }
  return state;
}
