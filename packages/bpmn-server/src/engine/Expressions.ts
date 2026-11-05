import type { IScriptHandler } from '../interfaces/engine.js';

/**
 * How a value written in a model is read:
 *
 *      $js, $(js), ${js}       an expression: the JavaScript evaluated, its value as it is (a number, a list, ...)
 *      Order ${data.id} done   a text with ${...} parts: each part evaluated and put in its place, a string
 *      anything else           the text as written
 *
 * ${js} is an expression only when it is the whole value: `${a} and ${b}` is a text.
 */

/** A part of a text: the text as written, or the JavaScript of a ${...} in it. */
export type TemplatePart = string | { script: string };

/** The index of the } that closes the { at `open`, skipping quoted strings; -1 when it is not closed. */
function closingBrace(text: string, open: number): number {
    let depth = 0;
    for (let i = open; i < text.length; i++) {
        const c = text[i];
        if (c == '"' || c == "'" || c == '`') {
            for (i++; i < text.length && text[i] != c; i++)
                if (text[i] == '\\') i++;
        }
        else if (c == '{') depth++;
        else if (c == '}' && --depth == 0) return i;
    }
    return -1;
}

/** The parts of a text with ${...} in it; null when it has none, or one of them is not closed. */
export function templateParts(text: any): TemplatePart[] | null {
    if (typeof text !== 'string' || !text.includes('${')) return null;
    const parts: TemplatePart[] = [];
    let literal = '';
    for (let i = 0; i < text.length;) {
        if (text.startsWith('${', i)) {
            const end = closingBrace(text, i + 1);
            if (end < 0) return null;
            if (literal) parts.push(literal);
            literal = '';
            parts.push({ script: text.substring(i + 2, end) });
            i = end + 1;
        }
        else literal += text[i++];
    }
    if (literal) parts.push(literal);
    return parts;
}

/** The JavaScript of an expression ($js, $(js), or ${js} as the whole value); null for any other value. */
export function expressionScript(value: any): string | null {
    if (typeof value !== 'string' || !value.startsWith('$')) return null;
    if (value.startsWith('${')) {
        const parts = templateParts(value);
        if (parts && parts.length == 1 && typeof parts[0] != 'string') return parts[0].script;
        if (parts) return null;     // a text that starts with a ${...} part
    }
    return value.substring(1);
}

/** The JavaScript to run for a value read as an expression: an expression's script, any other value as it is. */
export function scriptOf(expression: string): string {
    return expressionScript(expression) ?? expression;
}

/** A condition's language attribute says FEEL (FEEL, or the spec's URI for it). No language, or any other, is JavaScript. */
export const isFeel = (language: any): boolean => /feel/i.test(String(language ?? ''));

/** A value that is evaluated when the process runs: an expression, or a text with ${...} parts. */
export function isEvaluated(value: any): boolean {
    return expressionScript(value) !== null || templateParts(value) !== null;
}

/** A text with ${...} parts: each part's value in its place ('' for null and undefined). */
export async function evaluateTemplate(handler: IScriptHandler, scope, text: string): Promise<string> {
    let result = '';
    for (const part of templateParts(text) ?? [text]) {
        if (typeof part == 'string')
            result += part;
        else {
            const val = await handler.evaluateExpression(scope, '${' + part.script + '}');
            result += (val ?? '');
        }
    }
    return result;
}

/** A value as written in a model: an expression evaluated, a text with ${...} parts filled in, any other text as it is. */
export async function evaluateText(handler: IScriptHandler, scope, value: any): Promise<any> {
    if (expressionScript(value) !== null)
        return await handler.evaluateExpression(scope, value);
    if (templateParts(value))
        return await evaluateTemplate(handler, scope, value);
    return value;
}

const KEYWORDS = new Set(('break case catch class const continue debugger default delete do else export extends false finally for '
    + 'function if import in instanceof let new null of return super switch this throw true try typeof undefined var void while '
    + 'with yield async await').split(' '));

/**
 * The names a script reads without declaring them: not a property (after a dot), not an object literal's key,
 * not a parameter of a function in it, not declared in it. Quoted strings and comments are skipped.
 */
export function freeNames(script: string): string[] {
    const tokens: string[] = script.match(/(["'`])(?:\\.|(?!\1)[^\\])*\1|\/\/.*|\/\*[\s\S]*?\*\/|[A-Za-z_$][\w$]*|=>|\?\.|\.\.\.|\S/g) || [];
    const isName = (t: string) => /^[A-Za-z_$][\w$]*$/.test(t) && !KEYWORDS.has(t);
    const declared = new Set<string>();
    const declareParameters = (open: number, close: number) => {
        for (let j = open + 1; j < close; j++)
            if (isName(tokens[j]) && tokens[j - 1] != '.' && tokens[j + 1] != ':') declared.add(tokens[j]);
    };
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t == '=>') {
            if (isName(tokens[i - 1])) declared.add(tokens[i - 1]);
            else if (tokens[i - 1] == ')') {
                let depth = 0, j = i - 1;
                for (; j >= 0; j--) {
                    if (tokens[j] == ')') depth++;
                    else if (tokens[j] == '(' && --depth == 0) break;
                }
                declareParameters(j, i - 1);
            }
        }
        else if (t == 'function') {
            let j = i + 1;
            if (isName(tokens[j])) declared.add(tokens[j++]);
            if (tokens[j] == '(') {
                const close = tokens.indexOf(')', j);
                declareParameters(j, close < 0 ? tokens.length : close);
            }
        }
        else if ((t == 'let' || t == 'const' || t == 'var') && isName(tokens[i + 1]))
            declared.add(tokens[i + 1]);
    }
    const names = new Set<string>();
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (!isName(t) || declared.has(t)) continue;
        if (tokens[i - 1] == '.' || tokens[i - 1] == '?.') continue;                      // a property
        if (tokens[i + 1] == ':' && (tokens[i - 1] == '{' || tokens[i - 1] == ',')) continue;   // an object literal's key
        names.add(t);
    }
    return [...names];
}
