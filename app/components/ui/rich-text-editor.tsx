"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// Dynamic import of JoditEditor with ssr: false
const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
    loading: () => <textarea className="w-full min-h-[300px] border rounded p-4 text-zinc-400 bg-zinc-50" value="Loading editor..." readOnly />
});

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const config = useMemo(() => {
        return {
            readonly: false,
            placeholder: placeholder || "Start typing...",
            minHeight: 300,
            buttons: [
                "source", "|",
                "bold", "italic", "underline", "strikethrough", "|",
                "superscript", "subscript", "|",
                "ul", "ol", "|",
                "outdent", "indent", "|",
                "font", "fontsize", "brush", "paragraph", "|",
                "image", "table", "link", "|",
                "align", "undo", "redo", "|",
                "hr", "eraser", "copyformat", "|",
                "fullsize", "selectall", "print"
            ],
            uploader: {
                insertImageAsBase64URI: false,
                url: `${process.env.NEXT_PUBLIC_API_URL}/cloudinary`,
                format: "json",
                // Jodit has its own configuration for mapping properties
                filesPropertyName: "file",
                isSuccess: (resp: any) => resp.success,
                getMessage: (resp: any) => resp.message,
                process: (resp: any) => {
                    const url = resp.secure_url || resp.url || "";
                    return {
                        files: [url],
                        path: url,
                        baseurl: "",
                        error: resp.success ? null : resp.message,
                        msg: resp.message
                    };
                },
                defaultHandlerSuccess: function (this: any, data: any) {
                    if (data.files && data.files.length) {
                        data.files.forEach((file: string) => {
                            this.selection.insertImage(file);
                        });
                    }
                },
                error: (e: Error) => {
                    console.error("Upload error", e);
                }
            }
        };
    }, [placeholder]);

    return (
        <div className="w-full dark:text-black">
            <JoditEditor
                value={value}
                config={config}
                onBlur={(newContent) => onChange(newContent)}
                onChange={() => {}}
            />
        </div>
    );
}
