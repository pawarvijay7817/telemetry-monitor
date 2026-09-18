import assert from "node:assert/strict";
import test from "node:test";

import { TelemetryService } from "./telemetry.service";

test("initializes each telemetry history with the maximum sample count", () => {
  const service = new TelemetryService();
  const dashboard = service.getDashboard();

  assert.equal(dashboard.velocity.history.length, 100);
  assert.equal(dashboard.pressure.history.length, 100);
  assert.equal(dashboard.temperature.history.length, 100);
  assert.equal(dashboard.velocity.unit, "cm/s");
  assert.equal(dashboard.pressure.unit, "mbar");
  assert.equal(dashboard.temperature.unit, "°C");
});

test("updates values while keeping history bounded", () => {
  const service = new TelemetryService();

  service.update();
  const after = service.getDashboard();

  assert.equal(after.velocity.history.length, 100);
  assert.equal(after.pressure.history.length, 100);
  assert.equal(after.temperature.history.length, 100);
  assert.equal(after.velocity.history.at(-1)?.value, after.velocity.value);
  assert.equal(after.pressure.history.at(-1)?.value, after.pressure.value);
  assert.equal(
    after.temperature.history.at(-1)?.value,
    after.temperature.value,
  );
});
