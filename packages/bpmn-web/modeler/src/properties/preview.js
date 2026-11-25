// The Test tab's data, for the previews of the panel's fields (a label's, an assignment policy's): any add-on's editor
// part may use it.
import { useService } from 'bpmn-js-properties-panel';
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';

/** The Test tab's data for previews, again whenever the tab changes; null without a scenario (or a Test tab). */
export function usePreview() {
    const testPanel = useService('testPanel', false);
    const eventBus = useService('eventBus');
    const [, setVersion] = useState(0);
    useEffect(() => {
        const changed = () => setVersion(v => v + 1);
        eventBus.on('testPanel.changed', changed);
        return () => eventBus.off('testPanel.changed', changed);
    }, [eventBus]);
    return testPanel?.labelPreview?.() ?? null;
}
