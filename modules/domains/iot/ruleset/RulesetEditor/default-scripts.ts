'use client';
import type { RuleNodeType } from '../../types';

/* ─── Default scripts ─────────────────────────────────────────────────────── */

export const DEFAULT_SCRIPTS: Record<RuleNodeType, string> = {
  TRIGGER:
`// Called when a message arrives (MQTT / HTTP / Schedule).
// msg           — raw payload object
// metadata      — device metadata key-value map
// message_type  — string identifier of the inbound topic
return msg;`,
  FILTER:
`// Return true  → True port.  Return false → False port.
var temp = msg.temperature;
return temp !== undefined && temp > 85;`,
  SWITCH:
`// Return the output port key: 'c1', 'c2', 'c3', or 'def'.
var zone = metadata.zone;
if (zone === 'A') return 'c1';
if (zone === 'B') return 'c2';
return 'def';`,
  TRANSFORM:
`// Mutate and return the message.
msg.processedAt = new Date().toISOString();
msg.source = metadata.deviceId;
delete msg._raw;
return msg;`,
  ACTION:
`// Terminal side-effect — no output port.
send({
  deviceId: metadata.deviceId,
  severity: 'CRITICAL',
  message: 'Threshold exceeded: ' + msg.temperature,
});`,
  DELAY:
`// Return delay in milliseconds.
// Out port fires after the delay; Timeout if exceeded.
return 30000; // 30 s`,
  ALARM:
`// Return alarm config. Created → raised; Cleared → resolved.
return {
  name: 'HighTemperature',
  severity: 'CRITICAL',
  details: { temperature: msg.temperature, deviceId: metadata.deviceId },
};`,
  ENRICHMENT:
`// Attach external data. Success → OK; Failure → lookup failed.
msg.deviceLabel = getDeviceLabel(metadata.deviceId);
msg.tags = getDeviceTags(metadata.deviceId);
return msg;`,
  REST_API:
`// Configure outbound HTTP call. Success → 2xx; Failure → error.
return {
  url: 'https://api.example.com/events',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: { deviceId: metadata.deviceId, event: message_type, payload: msg },
};`,
  SAVE_TS:
`// Select fields to persist. Success → saved; Failure → write error.
return {
  keys: ['temperature', 'humidity', 'pressure'],
  ts: msg.timestamp || Date.now(),
};`,
};
