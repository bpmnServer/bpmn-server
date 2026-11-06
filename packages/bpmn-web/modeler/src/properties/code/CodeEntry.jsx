// A JavaScript field of the properties panel: scripts (script tasks, scripts on events) and expressions
// (conditions, collections). A condition in FEEL is not checked here: the Problems tab checks it, on the server.
// Highlighted, checked as it is typed the way bpmn-server compiles it
// (ScriptHandler: a script is a function body, an expression `return (...)`, a leading $ dropped), and
// completing the names a script can use (ScriptContext): data fields, the item, the application's services.
import { useEffect, useRef } from '@bpmn-io/properties-panel/preact/hooks';
import { useDiagnostics, useShowEntryEvent } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, placeholder as placeholderText } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { syntaxTree, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { autocompletion, closeBrackets, completionKeymap } from '@codemirror/autocomplete';
import { linter, lintGutter } from '@codemirror/lint';
import { javascript } from '@codemirror/lang-javascript';

/** The compile error bpmn-server would hit, or null. */
export function compileError(code, mode) {
    if (!code.trim() || mode === 'feel')
        return null;
    try {
        if (mode === 'expression')
            Function(`return (${code.startsWith('$') ? code.slice(1) : code});`);
        else
            Function(code);
        return null;
    }
    catch (err) {
        return err.message;
    }
}

/** `mode` reads the field's mode as it is now: the language can change while the field is open. */
function lintSource(mode) {
    return view => {
        const code = view.state.doc.toString();
        const message = compileError(code, mode());
        if (!message)
            return [];
        // where the parser gave up, else the whole text
        let from = 0, to = code.length;
        syntaxTree(view.state).iterate({
            enter: node => {
                if (node.type.isError && from === 0 && to === code.length) {
                    from = node.from;
                    to = Math.max(node.to, Math.min(code.length, node.from + 1));
                }
            }
        });
        if (from >= code.length) from = Math.max(0, code.length - 1);
        return [{ from, to, severity: 'error', message: `Does not compile: ${message}` }];
    };
}

function completionSource(scriptContext, element) {
    return context => {
        const path = context.matchBefore(/[\w$]+(?:\.[\w$]+)*\.?[\w$]*$/) || context.matchBefore(/[\w$]*$/);
        if (!path || (path.from === path.to && !context.explicit))
            return null;
        const text = path.text;
        const dot = text.lastIndexOf('.');
        if (dot < 0) {
            return {
                from: path.from,
                options: scriptContext.globals(element).map(([label, detail]) => ({ label, detail, type: 'variable' }))
            };
        }
        const options = scriptContext.members(text.slice(0, dot), element)
            .map(([label, detail]) => ({ label, detail, type: detail === 'function' ? 'function' : 'property' }));
        return options.length ? { from: path.from + dot + 1, options } : null;
    };
}

function CodeField(props) {
    const { element, id, label, description, getValue, setValue, mode = 'script', rows = 6, placeholder } = props;
    const scriptContext = useService('scriptContext');
    const services = { modeling: useService('modeling'), commandStack: useService('commandStack'), bpmnFactory: useService('bpmnFactory') };
    const translate = useService('translate');
    const diagnostics = useDiagnostics(id);
    const host = useRef(null);
    const view = useRef(null);
    const showRef = useShowEntryEvent(id);
    const value = getValue(element) || '';
    const latest = useRef({ setValue, value });
    latest.current = { setValue: text => setValue(text, services), value };
    const currentMode = useRef(mode);
    currentMode.current = mode;
    const checker = useRef(new Compartment());
    const newChecker = () => linter(lintSource(() => currentMode.current), { delay: 300 });

    useEffect(() => {
        let timer, pending = null;
        // written 300 ms after typing stops, and at once when the field is left (Save, another element)
        const flush = () => {
            clearTimeout(timer);
            if (pending !== null && pending !== latest.current.value) latest.current.setValue(pending);
            pending = null;
        };
        const editor = new EditorView({
            parent: host.current,
            state: EditorState.create({
                doc: value,
                extensions: [
                    history(),
                    keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap, ...completionKeymap]),
                    javascript(),
                    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                    bracketMatching(),
                    closeBrackets(),
                    autocompletion({ override: [completionSource(scriptContext, element)], activateOnTyping: true }),
                    checker.current.of(newChecker()),
                    lintGutter(),
                    EditorView.lineWrapping,
                    placeholder ? placeholderText(placeholder) : [],
                    EditorView.contentAttributes.of({ id: `bio-properties-panel-${id}`, 'aria-label': label }),
                    EditorView.theme({ '&': { minHeight: `${Math.max(1, rows) * 1.5}em` } }),
                    EditorView.updateListener.of(update => {
                        if (!update.docChanged) return;
                        clearTimeout(timer);
                        pending = update.state.doc.toString();
                        timer = setTimeout(flush, 300);
                    }),
                    EditorView.domEventHandlers({ blur: () => { flush(); } })
                ]
            })
        });
        view.current = editor;
        showRef.current = { focus: () => editor.focus() };     // Problems' "go to field"
        return () => { flush(); editor.destroy(); };
    }, [element]);

    // the language changed: checked again as it now is (a new checker: nothing else runs one until the text changes)
    useEffect(() => {
        view.current?.dispatch({ effects: checker.current.reconfigure(newChecker()) });
    }, [mode]);

    // a change from elsewhere (undo, another field, a template): shown unless the field is being edited
    useEffect(() => {
        const editor = view.current;
        if (editor && !editor.hasFocus && editor.state.doc.toString() !== value)
            editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } });
    }, [value]);

    const diagnostic = diagnostics.find(d => d.severity === 'error') || diagnostics.find(d => d.severity === 'warning');
    return <div class={`bio-properties-panel-entry bpmn-server-code${diagnostic ? ` has-${diagnostic.severity}` : ''}`} data-entry-id={id}>
        <label class="bio-properties-panel-label" for={`bio-properties-panel-${id}`}>{translate(label)}</label>
        <div class="bpmn-server-code-editor" ref={host} />
        {/* what a group looks for to mark itself as having a value: see isCodeEdited */}
        <span class="bio-properties-panel-input" hidden />
        {diagnostic && <div class="bio-properties-panel-error">{diagnostic.message}</div>}
        {description && <div class="bio-properties-panel-description">{translate(description)}</div>}
    </div>;
}

/** Whether the field has a value (the panel's "edited" dot on the group). */
function isCodeEdited(node) {
    return Boolean(node?.parentNode?.querySelector('.cm-content')?.textContent);
}

/**
 * An entry for a group. `mode`: 'script' (statements) or 'expression' (one value). getValue(element) reads the
 * text; setValue(text, { modeling, commandStack, bpmnFactory }) writes it.
 */
export function codeEntry(element, { id, label, description, getValue, setValue, mode, rows, placeholder }) {
    return { id, element, label, description, getValue, setValue, mode, rows, placeholder, component: CodeField, isEdited: isCodeEdited };
}
