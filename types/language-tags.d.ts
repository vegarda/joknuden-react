declare module 'language-tags' {
    export default function tag(tag: string): LanguageTag;
}

interface LanguageSubTagRecord {
    Added: string;
    Description: string[];
    Macrolanguage: string;
    Subtag: string;
    'Suppress-Script': string;
    Type: string;
}

interface LanguageSubTagData {
    record: LanguageSubTagRecord;
    subtag: string;
    type: string;
}

interface LanguageSubTag {
    data: LanguageSubTagData;
    added(): string[];
    comments(): string[];
    deprecated(): string;
    descriptions(): string[];
    format(): string;
    preferred(): LanguageSubTag;
    scope(): string | null;
    script(): LanguageSubTag;
    toString(): string;
    type(): string;
}

interface LanguageTagData {
    tag: string;
}

interface LanguageTag {
    data: LanguageTagData;
    // check(): boolean;
    added(): string;
    deprecated(): string;
    descriptions(): string[];
    errors(): Error[];
    find(type: string): LanguageSubTag;
    format(): string;
    language(): string;
    preferred(): LanguageTag;
    region(): string;
    script(): string;
    subtags(): LanguageSubTag[];
    type(): string;
    valid(): boolean;
}



// export class Tag {
//     constructor(tag: string);
//     public data: {tag: string}
//     public check(tag: string): boolean;
//     public subtags(subtags: string | string[]): string[];
// }
