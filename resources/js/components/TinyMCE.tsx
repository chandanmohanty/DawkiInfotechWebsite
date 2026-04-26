import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface TinyMCEProps {
    value: string;
    onChange: (content: string) => void;
    height?: number;
}

export default function TinyMCE({ value, onChange, height = 500 }: TinyMCEProps) {
    const editorRef = useRef<any>(null);

    return (
        <Editor
            apiKey="eub606wgle1abbfgfjpgo9ogci3p5y2gt2u9n541y0uyrpu2"
            onInit={(_evt, editor) => {
                editorRef.current = editor;
            }}
            value={value}
            onEditorChange={(content) => {
                onChange(content);
            }}
            init={{
                height,
                menubar: true,
                plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'code',
                    'help',
                    'wordcount',
                ],
                toolbar:
                    'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
        />
    );
}
