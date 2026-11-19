/*
 * A form field's rules as the drawn forms' HTML attributes (bpmn-server's elements/FormRules.ts): the browser stops
 * a value that breaks one before it is sent; the engine checks them all again when the form is submitted.
 */
import { constraintsOf } from 'bpmn-server';

/** A field's constraints, as { name: config }: from API v3's `validation` ([{ name, config }]) or the model's field. */
export function constraintsFrom(field): Record<string, any> {
    if (Array.isArray(field?.validation))
        return Object.fromEntries(field.validation.map(c => [String(c.name).toLowerCase(), c.config ?? true]));
    return constraintsOf(field);
}

/** The attributes for the field's input: required, readonly, minlength/maxlength, min/max (a number's or a date's). */
export function ruleAttributes(field): Record<string, any> {
    const c = constraintsFrom(field);
    const attributes: Record<string, any> = {};
    if (c.required) attributes.required = true;
    if (c.readonly) attributes.readonly = true;
    for (const name of ['minlength', 'maxlength'])
        if (c[name] !== undefined && c[name] !== true) attributes[name] = c[name];
    if (field?.type === 'long' || field?.type === 'date')
        for (const name of ['min', 'max'])
            if (c[name] !== undefined && c[name] !== true) attributes[name] = c[name];
    return attributes;
}
