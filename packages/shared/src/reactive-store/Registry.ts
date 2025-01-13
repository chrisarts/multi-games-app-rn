import * as GlobalValue from 'effect/GlobalValue';
import { Pipeable } from 'effect/Pipeable';
import { createContext } from 'react';
import Scheduler from 'scheduler';

const TypeId: unique symbol = Symbol.for('PortableGames/registry');
type TypeId = typeof TypeId;

function scheduleTask(f: () => void): void {
  Scheduler.unstable_scheduleCallback(Scheduler.unstable_LowPriority, f);
}
