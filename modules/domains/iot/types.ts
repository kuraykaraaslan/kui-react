import { z } from 'zod';
import { IdSchema } from '../common/types';

/* =========================================================
   ENUMS
========================================================= */

export const DeviceTypeEnum = z.enum(['INTERNAL', 'INTEGRATION', 'EXTERNAL']);
export const DeviceStatusEnum = z.enum(['ONLINE', 'OFFLINE', 'ERROR', 'MAINTENANCE']);
export const DeviceRoleEnum = z.enum(['DEVICE', 'GATEWAY']);

export const TelemetryTopicEnum = z.enum([
  'DEVICE_TELEMETRY',
  'DEVICE_ATTRIBUTES',
  'GATEWAY_TELEMETRY',
  'GATEWAY_ATTRIBUTES',
]);

export const CloudStatusEnum = z.enum(['ACTIVE', 'SUSPENDED', 'PENDING']);
export const CloudPlanEnum = z.enum(['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE']);
export const CloudRoleEnum = z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']);

export const AlertSeverityEnum = z.enum(['INFO', 'WARNING', 'CRITICAL']);
export const AlertStatusEnum = z.enum(['OPEN', 'ACKNOWLEDGED', 'RESOLVED']);

/* =========================================================
   DEVICE
========================================================= */

export const DeviceLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  label: z.string().optional(),
});

export const DeviceSchema = z.object({
  deviceId: IdSchema,
  name: z.string(),
  slug: z.string(),
  type: DeviceTypeEnum,
  role: DeviceRoleEnum,
  status: DeviceStatusEnum,
  cloudId: IdSchema,
  location: DeviceLocationSchema.optional(),
  firmware: z.string().optional(),
  model: z.string().optional(),
  tags: z.array(z.string()).default([]),
  lastSeenAt: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date().optional(),
});

/* =========================================================
   TELEMETRY
========================================================= */

export const TelemetryReadingSchema = z.object({
  readingId: IdSchema,
  topic: TelemetryTopicEnum,
  deviceId: IdSchema,
  timestamp: z.coerce.date(),
  payload: z.record(z.string(), z.union([z.number(), z.string(), z.boolean()])),
});

/* =========================================================
   CLOUD WORKSPACE
========================================================= */

export const CloudWorkspaceSchema = z.object({
  cloudId: IdSchema,
  name: z.string(),
  slug: z.string(),
  status: CloudStatusEnum,
  plan: CloudPlanEnum,
  deviceCount: z.number().int().nonnegative(),
  onlineCount: z.number().int().nonnegative(),
  memberCount: z.number().int().nonnegative(),
  customDomain: z.string().nullable().optional(),
  region: z.string().optional(),
  createdAt: z.coerce.date().optional(),
});

/* =========================================================
   ALERT
========================================================= */

export const AlertSchema = z.object({
  alertId: IdSchema,
  deviceId: IdSchema,
  deviceName: z.string(),
  cloudId: IdSchema,
  severity: AlertSeverityEnum,
  status: AlertStatusEnum,
  title: z.string(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  acknowledgedAt: z.coerce.date().nullable().optional(),
  resolvedAt: z.coerce.date().nullable().optional(),
});

/* =========================================================
   RULE ENGINE
========================================================= */

export const RuleNodeTypeEnum = z.enum([
  'TRIGGER',    // Entry point — inbound MQTT / HTTP / schedule
  'FILTER',     // Boolean gate — passes or blocks messages
  'SWITCH',     // Multi-way router based on attribute / value
  'TRANSFORM',  // Reshapes or enriches payload inline
  'ACTION',     // Terminal side-effect (send alert, publish MQTT)
  'DELAY',      // Holds message for a configured duration
  'ALARM',      // Creates or clears a device alarm
  'ENRICHMENT', // Fetches external context and merges into message
  'REST_API',   // Outbound HTTP call to external service
  'SAVE_TS',    // Persists telemetry to the time-series database
  'PLACEHOLDER', // Imported node whose type does not exist here — keeps its wires, does nothing
]);

/** What an imported node was before it became a placeholder. */
export const RuleNodeOriginalSchema = z.object({
  /** original node type, e.g. `mqtt in` (Node-RED) or `MODBUS_READ` */
  type: z.string(),
  /** where it came from: `kui` (another kui-ruleset file) or `node-red` */
  source: z.enum(['kui', 'node-red']).optional(),
  /** the original settings, shown read-only */
  settings: z.unknown().optional(),
  /** input / output port ids, so the imported wires stay attached */
  inputs: z.array(z.string()).optional(),
  outputs: z.array(z.string()).optional(),
});

export const RuleNodeSchema = z.object({
  nodeId: IdSchema,
  type: RuleNodeTypeEnum,
  label: z.string(),
  x: z.number(),
  y: z.number(),
  script: z.string().optional(),
  /** node settings (endpoint, credentials…); keys that look like secrets are left out of exports */
  config: z.record(z.string(), z.unknown()).optional(),
  /** only for `PLACEHOLDER` nodes */
  original: RuleNodeOriginalSchema.optional(),
});

export const RuleEdgeSchema = z.object({
  edgeId: IdSchema,
  sourceNodeId: IdSchema,
  sourcePort: z.string(),
  targetNodeId: IdSchema,
  targetPort: z.string(),
});

export const RuleChainSchema = z.object({
  chainId: IdSchema,
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  active: z.boolean().default(false),
  nodes: z.array(RuleNodeSchema),
  edges: z.array(RuleEdgeSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/* =========================================================
   TYPES
========================================================= */

export type DeviceType = z.infer<typeof DeviceTypeEnum>;
export type DeviceStatus = z.infer<typeof DeviceStatusEnum>;
export type DeviceRole = z.infer<typeof DeviceRoleEnum>;
export type TelemetryTopic = z.infer<typeof TelemetryTopicEnum>;
export type CloudStatus = z.infer<typeof CloudStatusEnum>;
export type CloudPlan = z.infer<typeof CloudPlanEnum>;
export type CloudRole = z.infer<typeof CloudRoleEnum>;
export type AlertSeverity = z.infer<typeof AlertSeverityEnum>;
export type AlertStatus = z.infer<typeof AlertStatusEnum>;

export type DeviceLocation = z.infer<typeof DeviceLocationSchema>;
export type Device = z.infer<typeof DeviceSchema>;
export type TelemetryReading = z.infer<typeof TelemetryReadingSchema>;
export type CloudWorkspace = z.infer<typeof CloudWorkspaceSchema>;
export type Alert = z.infer<typeof AlertSchema>;

export type RuleNodeType = z.infer<typeof RuleNodeTypeEnum>;
export type RuleNode = z.infer<typeof RuleNodeSchema>;
export type RuleNodeOriginal = z.infer<typeof RuleNodeOriginalSchema>;
export type RuleEdge = z.infer<typeof RuleEdgeSchema>;
export type RuleChain = z.infer<typeof RuleChainSchema>;
