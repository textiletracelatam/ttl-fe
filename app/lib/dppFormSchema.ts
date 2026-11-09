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
  | "file"
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
  isCollection?: boolean;
}

export const TABLE_SCHEMA: TableDef[] = [
  // ---------------------------------------------------------------------
  // Top-level entities
  // ---------------------------------------------------------------------
  {
    id: "brands",
    label: "Brand",
    description: "The brand that owns or markets the product.",
    fields: [
      { name: "logo_url", label: "Logo URL", type: "url", required: true },
      { name: "name", label: "Brand name", type: "text", required: true },
      { name: "legal_name", label: "Legal name", type: "text", required: true },
      {
        name: "economic_operator_role",
        label: "Economic Operator Role",
        type: "text",
        required: true,
      },
      {
        name: "establishment_country",
        label: "Establishment Country",
        type: "text",
        required: true,
      },
      {
        name: "registration_id",
        label: "Registration ID",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "manufacturers",
    label: "Manufacturer",
    description: "The facility or company that manufactures the product.",
    fields: [
      { name: "logo_url", label: "Logo URL", type: "url", required: true },
      {
        name: "name",
        label: "Manufacturer name",
        type: "text",
        required: true,
      },
      { name: "legal_name", label: "Legal name", type: "text", required: true },
      {
        name: "economic_operator_role",
        label: "Economic Operator Role",
        type: "text",
        required: true,
      },
      {
        name: "establishment_country",
        label: "Establishment Country",
        type: "text",
        required: true,
      },
      {
        name: "registration_id",
        label: "Registration ID",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "materials",
    label: "Materials",
    description: "A material used in a product.",
    fields: [
      { name: "name", label: "Material name", type: "text", required: true },
      {
        name: "percentage",
        label: "Composition Percentage",
        type: "number",
        helpText: "Whole number percentage (0-100).",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      { name: "color", label: "Color", type: "color", required: true },
      {
        name: "is_main_material",
        label: "Is it a main material?",
        type: "checkbox",
        required: true,
      },
    ],
    isCollection: true,
  },
  {
    id: "passports",
    label: "Passport",
    description: "The digital product passport record itself.",
    fields: [
      { name: "version", label: "Version", type: "text", required: true },
      {
        name: "last_updated_date",
        label: "Last Updated Date",
        type: "date",
        helpText: "Stored as text in the database.",
        required: true,
      },
      {
        name: "valid_from",
        label: "Valid From",
        type: "date",
        helpText: "Stored as text in the database.",
        required: true,
      },
      {
        name: "valid_to",
        label: "Valid To",
        type: "date",
        helpText: "Stored as text in the database.",
        required: true,
      },
      {
        name: "retention_period",
        label: "Retention Period",
        type: "text",
        required: true,
      },
      {
        name: "scope_limitation",
        label: "Scope Limitation",
        type: "text",
        required: true,
      },
      {
        name: "validation_status",
        label: "Validation Status",
        type: "select",
        options: ["draft", "active", "revoked"],
        required: true,
      },
      {
        name: "validated_by",
        label: "Validated By",
        type: "text",
        required: true,
      },
      { name: "language", label: "Language", type: "text", required: true },
      {
        name: "access_method",
        label: "Access Method",
        type: "text",
        required: true,
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Product (root record)
  // ---------------------------------------------------------------------
  {
    id: "products",
    label: "Product",
    description: "The core product record.",
    fields: [
      { name: "name", label: "Product name", type: "text", required: true },
      { name: "title", label: "Product title", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      { name: "made_in", label: "Made In", type: "text", required: true },
      { name: "reference", label: "Reference", type: "text", required: true },
      { name: "sku", label: "SKU", type: "text", required: true },
      {
        name: "images",
        label: "Images",
        type: "file",
        required: true,
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Product children
  // ---------------------------------------------------------------------
  {
    id: "care_instructions",
    label: "Care",
    parent: "products",
    description: "Care and maintenance instructions for the product.",
    fields: [
      { name: "link_url", label: "Link URL", type: "url", required: true },
      { name: "link_label", label: "Link Label", type: "text", required: true },
      {
        name: "images",
        label: "Images",
        type: "file",
        required: true,
      },
      {
        name: "sections",
        label: "Sections",
        type: "textarea",
        helpText: "Enter as JSON.",
        required: true,
      },
    ],
  },
  {
    id: "certifications",
    label: "Certifications",
    parent: "products",
    description: "Certifications the product holds.",
    fields: [
      {
        name: "name",
        label: "Certification name",
        type: "text",
        required: true,
      },
      { name: "issuer", label: "Issuer", type: "text", required: true },
      { name: "scope", label: "Scope", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      {
        name: "valid_until",
        label: "Valid Until",
        type: "date",
        required: true,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "expired", "pending", "revoked"],
        required: true,
      },
    ],
    isCollection: true,
  },
  {
    id: "green_claims",
    label: "Green Claim",
    parent: "products",
    description:
      "Sustainability / environmental claims made about the product.",
    fields: [
      {
        name: "environmental_claims_used",
        label: "Environmental Claims Used",
        type: "textarea",
        required: true,
      },
      {
        name: "claim_validation_status",
        label: "Claim Validation Status",
        type: "select",
        options: ["validated", "pending", "rejected"],
        required: true,
      },
      {
        name: "claim_supporting_evidence",
        label: "Claim Supporting Evidence",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "material_innovations",
    label: "Material Innovation",
    parent: "products",
    description: "An innovation associated with the product.",
    fields: [
      { name: "text", label: "Description", type: "textarea", required: true },
      { name: "link_url", label: "Link URL", type: "url", required: true },
      { name: "link_label", label: "Link Label", type: "text", required: true },
      {
        name: "images",
        label: "Images",
        type: "file",
        required: true,
      },
    ],
  },
  {
    id: "packaging",
    label: "Packaging",
    parent: "products",
    description: "Packaging details for the product.",
    fields: [
      {
        name: "packaging_material",
        label: "Packaging Material",
        type: "text",
        required: true,
      },
      {
        name: "packaging_weight",
        label: "Packaging Weight",
        type: "number",
        required: true,
      },
      {
        name: "is_recyclable",
        label: "Is Recyclable?",
        type: "checkbox",
        required: true,
      },
      {
        name: "is_plastic_single_use",
        label: "Is Single-Use Plastic?",
        type: "checkbox",
        required: true,
      },
    ],
  },
  {
    id: "product_sections",
    label: "Sections",
    parent: "products",
    description: "A content section shown on the product's passport page.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      { name: "image", label: "Image", type: "file", required: true },
      { name: "route", label: "Route", type: "text", required: true },
      {
        name: "completion",
        label: "Completion",
        type: "number",
        helpText: "Whole number, e.g. percentage complete.",
        required: true,
      },
      { name: "impact", label: "Impact", type: "number", required: true },
      {
        name: "post_consumption_plan_exists",
        label: "Post-Consumption Plan Exists?",
        type: "checkbox",
        required: true,
      },
      {
        name: "section_number",
        label: "Section Number",
        type: "number",
        required: true,
      },
    ],
    isCollection: true,
  },
  {
    id: "social_impacts",
    label: "Social Impact",
    parent: "products",
    description: "Social / social-impact information for the product.",
    fields: [
      { name: "text", label: "Description", type: "textarea", required: true },
      { name: "link_url", label: "Link URL", type: "url", required: true },
      { name: "link_label", label: "Link Label", type: "text", required: true },
      {
        name: "images",
        label: "Images",
        type: "file",
        required: true,
      },
      {
        name: "compliance",
        label: "Compliance",
        type: "textarea",
        helpText: "Enter as JSON.",
        required: true,
      },
    ],
  },
  {
    id: "supply_chains",
    label: "Supply Chain",
    parent: "products",
    description: "The supply chain associated with the product.",
    fields: [
      {
        name: "completion",
        label: "Completion",
        type: "number",
        helpText: "Whole number, e.g. percentage complete.",
        required: true,
      },
    ],
  },
  {
    id: "supply_chain_stages",
    label: "Supply Chain Stages",
    parent: "supply_chains",
    description: "A stage within the supply chain above.",
    fields: [
      {
        name: "step_number",
        label: "Step Number",
        type: "number",
        required: true,
      },
      { name: "name", label: "Stage name", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      {
        name: "position",
        label: "Position",
        type: "text",
        placeholder: "e.g. 12.3, 45.6",
        helpText: "Comma-separated array of numbers (e.g. coordinates).",
        required: true,
      },
      {
        name: "images",
        label: "Images",
        type: "file",
        required: true,
      },
    ],
    isCollection: true,
  },

  // ---------------------------------------------------------------------
  // Environmental impact (child of product) and its children
  // ---------------------------------------------------------------------
  {
    id: "environmental_impacts",
    label: "Environmental Impact",
    parent: "products",
    description: "Overall environmental impact record for the product.",
    fields: [
      {
        name: "post_consumption_plan_url",
        label: "Post-Consumption Plan URL",
        type: "url",
        required: true,
      },
      {
        name: "certifications_url",
        label: "Certifications URL",
        type: "url",
        required: true,
      },
      {
        name: "learn_more_url",
        label: "Learn More URL",
        type: "url",
        required: true,
      },
      {
        name: "indicators",
        label: "Indicators",
        type: "textarea",
        helpText: "Enter as JSON.",
        required: true,
      },
      {
        name: "environmental_data_reference_period_start",
        label: "Reference Period Start",
        type: "date",
        required: true,
      },
      {
        name: "environmental_data_reference_period_end",
        label: "Reference Period End",
        type: "date",
        required: true,
      },
      {
        name: "product_environmental_data_type",
        label: "Environmental Data Type",
        type: "text",
        required: true,
      },
      {
        name: "environmental_public_note",
        label: "Public Note",
        type: "textarea",
        required: true,
      },
      {
        name: "has_third_party_verification",
        label: "Has Third-Party Verification?",
        type: "checkbox",
        required: true,
      },
      {
        name: "verifier_name",
        label: "Verifier Name",
        type: "text",
        required: true,
      },
      {
        name: "verification_date",
        label: "Verification Date",
        type: "date",
        required: true,
      },
      {
        name: "lca_reference_document_url",
        label: "LCA Reference Document URL",
        type: "url",
        required: true,
      },
      { name: "pef_score", label: "PEF Score", type: "number", required: true },
    ],
  },
  {
    id: "air_emissions",
    label: "Air Emissions",
    parent: "environmental_impacts",
    fields: [
      {
        name: "air_emissions_compliance",
        label: "Compliance",
        type: "select",
        options: ["compliant", "partially_compliant", "non_compliant"],
        required: true,
      },
      {
        name: "voc_control_system",
        label: "VOC Control System",
        type: "text",
        required: true,
      },
      {
        name: "air_emissions_public_note",
        label: "Public Note",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "carbon_footprints",
    label: "Carbon Footprint",
    parent: "environmental_impacts",
    fields: [
      {
        name: "emissions_level",
        label: "Emissions Level",
        type: "text",
        required: true,
      },
      {
        name: "product_carbon_footprint",
        label: "Product Carbon Footprint",
        type: "number",
        required: true,
      },
      {
        name: "carbon_footprint_methodology",
        label: "Methodology",
        type: "text",
        required: true,
      },
      {
        name: "emissions_value_type",
        label: "Emissions Value Type",
        type: "text",
        required: true,
      },
      {
        name: "scope_one_emissions",
        label: "Scope 1 Emissions",
        type: "number",
        required: true,
      },
      {
        name: "scope_two_emissions",
        label: "Scope 2 Emissions",
        type: "number",
        required: true,
      },
      {
        name: "scope_three_emissions",
        label: "Scope 3 Emissions",
        type: "number",
        required: true,
      },
      {
        name: "carbon_footprint_public_note",
        label: "Public Note",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "chemical_compliance",
    label: "Chemical Compliance",
    parent: "environmental_impacts",
    fields: [
      {
        name: "chemical_compliance",
        label: "Compliance",
        type: "select",
        options: ["compliant", "partially_compliant", "non_compliant"],
        required: true,
      },
      {
        name: "chemical_public_note",
        label: "Public Note",
        type: "textarea",
        required: true,
      },
      {
        name: "svhc_substances_present",
        label: "SVHC Substances Present?",
        type: "checkbox",
        required: true,
      },
      {
        name: "svhc_substance_list",
        label: "SVHC Substance List",
        type: "textarea",
        helpText: "Enter as JSON.",
        required: true,
      },
      {
        name: "restricted_substances_standard",
        label: "Restricted Substances Standard",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "effluents",
    label: "Effluents",
    parent: "environmental_impacts",
    fields: [
      {
        name: "effluents_level",
        label: "Effluents Level",
        type: "text",
        required: true,
      },
      {
        name: "effluents_value_type",
        label: "Effluents Value Type",
        type: "text",
        required: true,
      },
      {
        name: "treated_effluents",
        label: "Treated Effluents",
        type: "number",
        required: true,
      },
      {
        name: "non_treated_effluents",
        label: "Non-Treated Effluents",
        type: "number",
        required: true,
      },
      {
        name: "effluents_public_note",
        label: "Public Note",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "energy_uses",
    label: "Energy Use",
    parent: "environmental_impacts",
    fields: [
      {
        name: "energy_use_public_note",
        label: "Public Note",
        type: "textarea",
        required: true,
      },
      {
        name: "energy_use_level",
        label: "Energy Use Level",
        type: "text",
        required: true,
      },
      {
        name: "energy_use_value",
        label: "Energy Use Value",
        type: "number",
        required: true,
      },
      {
        name: "energy_use_value_type",
        label: "Energy Use Value Type",
        type: "text",
        required: true,
      },
      {
        name: "renewable_energy_pct",
        label: "Renewable Energy (%)",
        type: "number",
        required: true,
      },
    ],
  },
  {
    id: "production_waste",
    label: "Production Waste",
    parent: "environmental_impacts",
    fields: [
      {
        name: "production_waste_level",
        label: "Production Waste Level",
        type: "text",
        required: true,
      },
      {
        name: "waste_value_type",
        label: "Waste Value Type",
        type: "text",
        required: true,
      },
      {
        name: "recoverable_solid_waste",
        label: "Recoverable Solid Waste",
        type: "number",
        required: true,
      },
      {
        name: "non_recoverable_solid_waste",
        label: "Non-Recoverable Solid Waste",
        type: "number",
        required: true,
      },
      {
        name: "production_waste_public_note",
        label: "Public Note",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "recyclability",
    label: "Recyclability",
    parent: "environmental_impacts",
    fields: [
      {
        name: "recyclability_public_note",
        label: "Public Note",
        type: "textarea",
        required: true,
      },
      {
        name: "recyclable_percentage",
        label: "Recyclable Percentage",
        type: "number",
        required: true,
      },
      {
        name: "recycled_content_total_pct",
        label: "Recycled Content Total (%)",
        type: "number",
        required: true,
      },
      {
        name: "post_consumer_recycled_content_pct",
        label: "Post-Consumer Recycled Content (%)",
        type: "number",
        required: true,
      },
      {
        name: "unsold_products_volume",
        label: "Unsold Products Volume",
        type: "number",
        required: true,
      },
      {
        name: "unsold_products_destination",
        label: "Unsold Products Destination",
        type: "text",
        required: true,
      },
      {
        name: "unsold_products_disclosure_status",
        label: "Unsold Products Disclosure Status",
        type: "select",
        options: ["disclosed", "not_disclosed", "partially_disclosed"],
        required: true,
      },
      {
        name: "is_designed_for_disassembly",
        label: "Designed for Disassembly?",
        type: "checkbox",
        required: true,
      },
      {
        name: "microplastics_release_risk",
        label: "Microplastics Release Risk",
        type: "select",
        options: ["low", "medium", "high"],
        required: true,
      },
    ],
  },
  {
    id: "water_uses",
    label: "Water Use",
    parent: "environmental_impacts",
    fields: [
      {
        name: "water_use_level",
        label: "Water Use Level",
        type: "text",
        required: true,
      },
      {
        name: "water_use_value",
        label: "Water Use Value",
        type: "number",
        required: true,
      },
      {
        name: "water_use_value_type",
        label: "Water Use Value Type",
        type: "text",
        required: true,
      },
      {
        name: "water_scarcity_indicator",
        label: "Water Scarcity Indicator",
        type: "number",
        required: true,
      },
      {
        name: "water_use_public_note",
        label: "Public Note",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "epr_post_consumption_plans",
    label: "EPR Post-Consumption Plan",
    parent: "environmental_impacts",
    description:
      "Extended producer responsibility / post-consumption plan for the product.",
    fields: [
      { name: "image", label: "Image", type: "file", required: true },
      {
        name: "recycling_instructions",
        label: "Recycling Instructions",
        type: "textarea",
        required: true,
      },
      {
        name: "post_consumption_plan_url",
        label: "Post-Consumption Plan URL",
        type: "url",
        required: true,
      },
      {
        name: "epr_scheme_participation",
        label: "EPR Scheme Participation",
        type: "text",
        required: true,
      },
      {
        name: "epr_scheme_name",
        label: "EPR Scheme Name",
        type: "text",
        required: true,
      },
      {
        name: "collection_system",
        label: "Collection System",
        type: "text",
        required: true,
      },
      {
        name: "take_back_program",
        label: "Take-Back Program",
        type: "text",
        required: true,
      },
      {
        name: "epr_post_consumption_plan_public_note",
        label: "Public Note",
        type: "textarea",
        required: true,
      },
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

// ---------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------

/** The value of a single field on the form. */
export type FieldValue = string | boolean | File[];

/** One record's worth of field values, keyed by field name. */
export type RecordValues = Record<string, FieldValue>;

/**
 * The whole form's data, keyed by table id.
 * - Regular tables store a single RecordValues object.
 * - Collection tables (isCollection: true) store an array of RecordValues,
 *   one per entry the user has added.
 */
export type FormState = Record<string, RecordValues | RecordValues[]>;

/** Builds one blank record (all fields at their default empty value) for a table. */
export function createEmptyRecord(table: TableDef): RecordValues {
  const record: RecordValues = {};
  for (const field of table.fields) {
    record[field.name] = field.type === "checkbox" ? false : "";
  }
  return record;
}

/** Same as createEmptyRecord, but looked up by table id for convenience. */
export function createEmptyRecordFor(tableId: string): RecordValues {
  const table = TABLE_SCHEMA_BY_ID[tableId];
  if (!table) {
    throw new Error(`Unknown table id: ${tableId}`);
  }
  return createEmptyRecord(table);
}

export function initialFormState(): FormState {
  const state: FormState = {};
  for (const table of TABLE_SCHEMA) {
    // Collections start with a single blank entry so there's always at
    // least one card to fill in; users can add more or remove it.
    state[table.id] = table.isCollection
      ? [createEmptyRecord(table)]
      : createEmptyRecord(table);
  }
  return state;
}

/** Type guard / accessor helpers so callers don't need `as` casts everywhere. */
export function getRows(state: FormState, table: TableDef): RecordValues[] {
  const value = state[table.id];
  return table.isCollection
    ? (value as RecordValues[])
    : [value as RecordValues];
}

// ---------------------------------------------------------------------
// Test-data autofill (dev/testing only — never touches file fields)
// ---------------------------------------------------------------------
//
// Modeled as one coherent, realistic product — a cotton/recycled-polyester
// backpack made in Peru — rather than generic "Test Item N" placeholders,
// so a filled-in form (and the resulting public DPP pages) actually reads
// like a real passport. Keyed by `${tableId}.${fieldName}` so fields that
// share a name across tables (e.g. "name" on brands vs. materials) each
// get their own sensible value.

/** Non-date, non-file field values, one realistic row per table (autofill
 * only ever produces a single row per collection table — see
 * autofillFormState below — so no per-entry variation is needed here). */
const SAMPLE_DATA: Record<string, Record<string, FieldValue>> = {
  brands: {
    logo_url: "https://cdn.textiletracelatam.com/brands/Alpes/logo.svg",
    name: "Alpes Studio",
    legal_name: "Alpes Studio S.A.C.",
    economic_operator_role: "Brand owner",
    establishment_country: "Peru",
    registration_id: "RUC 20601234567",
  },
  manufacturers: {
    logo_url:
      "https://cdn.textiletracelatam.com/manufacturers/andes-textile-mill/logo.svg",
    name: "Andes Textile Mill",
    legal_name: "Andes Textile Mill S.A.C.",
    economic_operator_role: "Manufacturer",
    establishment_country: "Peru",
    registration_id: "RUC 20609876543",
  },
  materials: {
    name: "Organic Cotton",
    percentage: "100",
    description:
      "GOTS-certified organic cotton canvas, hand-picked without synthetic pesticides or fertilizers by a smallholder cooperative in Piura, Peru.",
    color: "#E8DEC8",
    is_main_material: true,
  },
  passports: {
    version: "1.0.0",
    retention_period: "10 years from date of manufacture",
    scope_limitation:
      "Covers raw material sourcing through first point of sale; excludes consumer-phase use and repairs.",
    validation_status: "active",
    validated_by: "Textile Trace LATAM Compliance Team",
    language: "en",
    access_method: "QR code printed on the product's care label",
  },
  products: {
    name: "Alpes Tote Backpack",
    title: "Alpes Tote Backpack — Organic Cotton & Recycled Polyester",
    description:
      "An everyday tote backpack handcrafted in Peru from organic cotton canvas with recycled-polyester webbing, designed for durability and a reduced environmental footprint.",
    made_in: "Peru",
    reference: "YAK-TB-2026",
    sku: "YAK-TB-2026-BLK",
  },
  care_instructions: {
    link_url: "https://textiletracelatam.com/care/Alpes-tote-backpack",
    link_label: "View the full care guide",
    sections: JSON.stringify([
      {
        title: "Washing",
        text: "Spot clean with a damp cloth and mild soap. Do not machine wash.",
      },
      { title: "Drying", text: "Air dry away from direct sunlight." },
      {
        title: "Storage",
        text: "Store unfolded in a cool, dry place to help it keep its shape.",
      },
    ]),
  },
  certifications: {
    name: "GOTS — Global Organic Textile Standard",
    issuer: "Control Union Certifications",
    scope: "Environmental and social criteria across the organic cotton supply chain",
    description:
      "Certifies that the organic cotton used in this product meets GOTS requirements for organic fiber content and responsible processing.",
    status: "active",
  },
  green_claims: {
    environmental_claims_used:
      "Made with GOTS-certified organic cotton and recycled polyester; packaged in FSC-certified recycled cardboard.",
    claim_validation_status: "validated",
    claim_supporting_evidence:
      "GOTS certificate #CU-1234567 and GRS certificate #GRS-9876543 on file with Textile Trace LATAM.",
  },
  material_innovations: {
    text: "Webbing and lining woven from post-consumer recycled PET bottles, cutting virgin polyester use by an estimated 40% versus a conventional equivalent.",
    link_url:
      "https://textiletracelatam.com/innovation/recycled-polyester-webbing",
    link_label: "Learn more about this innovation",
  },
  packaging: {
    packaging_material:
      "FSC-certified recycled cardboard with soy-based ink printing",
    packaging_weight: "85",
    is_recyclable: true,
    is_plastic_single_use: false,
  },
  product_sections: {
    title: "Supply Chain",
    description:
      "Follow this backpack's journey from organic cotton field to finished product.",
    route: "supply-chain",
    completion: "100",
    impact: "18",
    post_consumption_plan_exists: true,
    section_number: "1",
  },
  social_impacts: {
    text: "Manufactured at a SA8000-certified facility that guarantees fair wages, safe working conditions, and no child or forced labor.",
    link_url:
      "https://textiletracelatam.com/social-impact/andes-textile-mill",
    link_label: "View our social impact report",
    compliance: JSON.stringify([
      { name: "SA8000", status: "Compliant" },
      { name: "ILO Core Labour Standards", status: "Compliant" },
    ]),
  },
  supply_chains: {
    completion: "80",
  },
  supply_chain_stages: {
    step_number: "1",
    name: "Raw Material Sourcing",
    description:
      "Organic cotton hand-picked from a smallholder cooperative in Piura, Peru, certified under GOTS.",
    position: "-5.1945, -80.6328",
  },
  environmental_impacts: {
    post_consumption_plan_url:
      "https://textiletracelatam.com/post-consumption/Alpes-tote-backpack",
    certifications_url:
      "https://textiletracelatam.com/certifications/Alpes-tote-backpack",
    learn_more_url: "https://textiletracelatam.com/products/Alpes-tote-backpack",
    indicators: JSON.stringify([
      { name: "Carbon Footprint", value: "4.8 kg CO2e", text: "Per unit, cradle-to-gate." },
      { name: "Water Use", value: "1,850 L", text: "Per unit, cradle-to-gate." },
    ]),
    product_environmental_data_type: "Life Cycle Assessment (cradle-to-gate)",
    environmental_public_note:
      "Data collected from the Piura cotton cooperative and the Lima finishing facility for the 2025 production run.",
    has_third_party_verification: true,
    verifier_name: "Bureau Veritas",
    lca_reference_document_url:
      "https://textiletracelatam.com/lca-reports/Alpes-tote-backpack.pdf",
    pef_score: "0.42",
  },
  air_emissions: {
    air_emissions_compliance: "compliant",
    voc_control_system:
      "Low-VOC, water-based dyes with activated carbon filtration on dye-house exhaust.",
    air_emissions_public_note:
      "VOC emissions measured below regional regulatory thresholds in the 2025 facility audit.",
  },
  carbon_footprints: {
    emissions_level: "Low",
    product_carbon_footprint: "4.8",
    carbon_footprint_methodology: "ISO 14067 cradle-to-gate assessment",
    emissions_value_type: "kg CO2e per unit",
    scope_one_emissions: "0.6",
    scope_two_emissions: "1.1",
    scope_three_emissions: "3.1",
    carbon_footprint_public_note:
      "Scope 3 emissions are dominated by raw cotton cultivation and international freight.",
  },
  chemical_compliance: {
    chemical_compliance: "compliant",
    chemical_public_note:
      "All dyes and finishes are screened against the ZDHC Manufacturing Restricted Substances List.",
    svhc_substances_present: false,
    svhc_substance_list: JSON.stringify([]),
    restricted_substances_standard: "ZDHC MRSL v3.1",
  },
  effluents: {
    effluents_level: "Low",
    effluents_value_type: "liters per kg of fabric processed",
    treated_effluents: "42",
    non_treated_effluents: "0",
    effluents_public_note:
      "All dye-house wastewater passes through an on-site treatment plant before discharge.",
  },
  energy_uses: {
    energy_use_public_note:
      "60% of facility electricity is sourced from a regional solar co-generation program.",
    energy_use_level: "Moderate",
    energy_use_value: "12.4",
    energy_use_value_type: "kWh per unit produced",
    renewable_energy_pct: "60",
  },
  production_waste: {
    production_waste_level: "Low",
    waste_value_type: "kg per 1,000 units produced",
    recoverable_solid_waste: "28",
    non_recoverable_solid_waste: "4",
    production_waste_public_note:
      "Fabric offcuts are collected and sold to a regional rag-recycling partner.",
  },
  recyclability: {
    recyclability_public_note:
      "The main cotton canvas body is compostable; the polyester webbing is mechanically recyclable if separated.",
    recyclable_percentage: "78",
    recycled_content_total_pct: "35",
    post_consumer_recycled_content_pct: "30",
    unsold_products_volume: "12",
    unsold_products_destination: "Donated to a community organization in Lima",
    unsold_products_disclosure_status: "disclosed",
    is_designed_for_disassembly: true,
    microplastics_release_risk: "low",
  },
  water_uses: {
    water_use_level: "Moderate",
    water_use_value: "1850",
    water_use_value_type: "liters per unit",
    water_scarcity_indicator: "0.3",
    water_use_public_note:
      "The dye-house recirculates approximately 50% of its process water.",
  },
  epr_post_consumption_plans: {
    recycling_instructions:
      "Separate the metal hardware and polyester webbing from the cotton canvas body before recycling each component separately.",
    post_consumption_plan_url:
      "https://textiletracelatam.com/post-consumption/Alpes-tote-backpack",
    epr_scheme_participation:
      "Yes — registered under Peru's extended producer responsibility program for textiles",
    epr_scheme_name: "Peru EPR Textile Program",
    collection_system:
      "In-store take-back plus a mail-in recycling label included with every order",
    take_back_program:
      "Return any Alpes product to a partner store for a 15% discount on your next purchase",
    epr_post_consumption_plan_public_note:
      "Collected products are mechanically recycled or donated depending on condition.",
  },
};

/** Date fields, as an offset (in days) from today — so the autofilled
 * passport always looks current instead of stuck on a hardcoded year. */
const SAMPLE_DATE_OFFSET_DAYS: Record<string, number> = {
  "passports.last_updated_date": -10,
  "passports.valid_from": -90,
  "passports.valid_to": 730,
  "certifications.valid_until": 365,
  "environmental_impacts.environmental_data_reference_period_start": -365,
  "environmental_impacts.environmental_data_reference_period_end": -30,
  "environmental_impacts.verification_date": -45,
};

function isoDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function sampleKey(tableId: string, fieldName: string): string {
  return `${tableId}.${fieldName}`;
}

let autofillCounter = 0;

/**
 * Looks up this field's value in the sample product library above first;
 * only fields the library doesn't (yet) cover fall back to generic
 * type-based generation, so the schema can grow without breaking autofill.
 */
function generateFieldValue(table: TableDef, field: FieldDef): FieldValue {
  autofillCounter += 1;
  const n = autofillCounter;

  if (field.type === "file") {
    // Intentionally left blank — files are attached manually.
    return [];
  }

  const dateOffset = SAMPLE_DATE_OFFSET_DAYS[sampleKey(table.id, field.name)];
  if (field.type === "date" && dateOffset !== undefined) {
    return isoDateOffset(dateOffset);
  }

  const sample = SAMPLE_DATA[table.id]?.[field.name];
  if (sample !== undefined) {
    return sample;
  }

  // --- fallbacks for anything the sample library above doesn't cover ---
  if (field.type === "checkbox") {
    return n % 2 === 0;
  }
  if (field.type === "select") {
    const options = field.options ?? [];
    return options.length ? options[n % options.length] : "";
  }
  if (field.type === "date") {
    return isoDateOffset(n);
  }
  if (field.type === "email") {
    return `test.user${n}@example.com`;
  }
  if (field.type === "url") {
    return `https://textiletracelatam.com/test-${field.name}-${n}`;
  }
  if (field.type === "color") {
    const palette = ["#E8DEC8", "#6B4226", "#3B3B3B", "#2E9E2E", "#3994C0"];
    return palette[n % palette.length];
  }
  if (field.type === "number") {
    // Percentage-ish fields stay in 0-100; everything else gets a small int.
    if (/pct|percentage|completion/i.test(field.name)) {
      return String((n * 7) % 101);
    }
    return String((n * 3) % 50);
  }

  return field.placeholder || `Sample ${field.label.toLowerCase()}`;
}

/** Builds a fully-populated FormState for testing, skipping only file fields. */
export function autofillFormState(): FormState {
  autofillCounter = 0;
  const state: FormState = {};
  for (const table of TABLE_SCHEMA) {
    const buildRow = () => {
      const record: RecordValues = {};
      for (const field of table.fields) {
        record[field.name] = generateFieldValue(table, field);
      }
      return record;
    };
    state[table.id] = table.isCollection ? [buildRow()] : buildRow();
  }
  return state;
}
