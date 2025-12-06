import {useState} from "react";

export default function useCopyStatus(timeout = 500) {
    const [copiedKey, setCopied] = useState<string | null>(null);

    const copy = (text: string, field: string) => {
        if (!text || text === "-") return;

        navigator.clipboard.writeText(text).then(() => {
            setCopied(field);
            setTimeout(() => setCopied(prev => (prev === field ? null : prev)), timeout);
        });
    };

    return {copiedKey, copy};
}
