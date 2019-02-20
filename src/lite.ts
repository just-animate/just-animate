import { nextAnimationFrame, tick } from './services/tick';
import { Timeline } from './components/timeline';
import { renderers } from './services/animator';
import { renderSubtimeline } from './renderers/renderSubtimeline';

// Register timeline renderers.
renderers.push(renderSubtimeline);

// Export out globals.
export { nextAnimationFrame, Timeline, tick };
