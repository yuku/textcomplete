import React, { FC } from "react"

import { Code } from "../components/Code"
import { Section } from "../components/Section"
import { EMOJI_STRATEGY } from "../strategy"
import { Textarea } from "../components/Textarea"
import { CodeMirror } from "../components/CodeMirror"

interface Props {
  id: string
}

const TEXTARE_CODE = `
const { TextareaEditor } = require("@textcomplete/textarea")

const editor = new TextareaEditor(myTextareaElement)
const textcomplete = new Textcomplete(editor, strategies, option)
`

const CODEMIRROR_CODE = `
const { CodeMirrorEditor } = require("@textcomplete/codemirror")

const editor = new CodeMirrorEditor(myCodeMirror)
const textcomplete = new Textcomplete(editor, strategies, option)
`

export const Editors: FC<Props> = ({ id }) => (
  <Section id={id} title="Editors">
    <ul>
      <li>
        <a href="#textcomplete-textarea">Textarea</a>
      </li>
      <li>
        <a href="#textcomplete-codemirror">CodeMirror</a>
      </li>
    </ul>
    <h3 id="textcomplete-textarea">@textcomplete/textarea</h3>
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
    <h3 id="textcomplete-codemirror">@textcomplete/codemirror</h3>
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
  </Section>
)
