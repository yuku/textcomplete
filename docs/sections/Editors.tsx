import React, { FC } from "react"

import { Code } from "../components/Code"
import { EMOJI_STRATEGY } from "../strategy"
import { Textarea } from "../components/Textarea"
import { CodeMirror } from "../components/CodeMirror"
import { Contenteditable } from "../components/Contenteditable"

interface Props {
  id: string
}

const TEXTARE_CODE = `
const { TextareaEditor } = require("@textcomplete/textarea")

const editor = new TextareaEditor(myTextareaElement)
const textcomplete = new Textcomplete(editor, strategies, option)
`

const CONTENTEDITABLE_CODE = `
const { ContenteditableEditor } = require("@textcomplete/contenteditable")

const editor = new ContenteditableEditor(myContenteditableElement)
const textcomplete = new Textcomplete(editor, strategies, option)
`

const CODEMIRROR_CODE = `
const CodeMirror = require("codemirror")
const { CodeMirrorEditor } = require("@textcomplete/codemirror")

const cm = CodeMirror(myElement)
const editor = new CodeMirrorEditor(cm)
const textcomplete = new Textcomplete(editor, strategies, option)
`

export const Editors: FC<Props> = ({ id }) => (
  <section>
    <h1 id={id}>Editors</h1>
    <ul>
      <li>
        <a href="#textcomplete-textarea">Textarea</a>
      </li>
      <li>
        <a href="#textcomplete-contenteditable">Contenteditable</a>
      </li>
      <li>
        <a href="#textcomplete-codemirror">CodeMirror</a>
      </li>
    </ul>
    <section>
      <h2 id="textcomplete-textarea">Textarea</h2>
      <p>
        <code>@textcomplete/textarea</code> provides a textcomplete editor for
        HTMLTextAreaElement.
      </p>
      <Code code={TEXTARE_CODE} language="javascript" />
      <Textarea
        triggerImmediately
        strategies={[EMOJI_STRATEGY]}
        option={{ dropdown: { maxCount: 3 } }}
        defaultValue="Hello, Textarea. This is sample. :smi"
      />
    </section>
    <section>
      <h2 id="textcomplete-contenteditable">Contenteditable</h2>
      <p>
        <code>@textcomplete/contenteditable</code> provides a textcomplete
        editor implementation for a contenteditable element. This package is
        experimental.
      </p>
      <Code code={CONTENTEDITABLE_CODE} language="javascript" />
      <Contenteditable
        triggerImmediately
        strategies={[EMOJI_STRATEGY]}
        option={{ dropdown: { maxCount: 3 } }}
        style={{
          padding: "6px 12px",
          marginBottom: "0.5rem",
          background: "#f6f8fa",
          border: "1px solid #e5e7eb",
        }}
        text="Hello, contenteditable.<br/>Currently, this sample is not triggered automatically. :cry"
      />
    </section>
    <section>
      <h2 id="textcomplete-codemirror">CodeMirror</h2>
      <p>
        <code>@textcomplete/codemirror</code> provides a textcomplete editor
        implementation for the <a href="https://codemirror.net/">CodeMirror</a>.
        This package is experimental.
      </p>
      <Code code={CODEMIRROR_CODE} language="javascript" />
      <CodeMirror
        triggerImmediately
        strategies={[EMOJI_STRATEGY]}
        codeMirrorOptions={{
          lineNumbers: true,
          value: "Hello, CodeMirror. This is sample. :smi",
        }}
        option={{ dropdown: { maxCount: 3 } }}
      />
    </section>
  </section>
)
