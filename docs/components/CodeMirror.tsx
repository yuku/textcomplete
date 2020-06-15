import React, { useEffect, useRef, FC, HTMLAttributes } from "react"
import createCodeMirror from "codemirror"

import {
  StrategyProps,
  Textcomplete,
  TextcompleteOption,
} from "@textcomplete/core"
import { CodeMirrorEditor } from "@textcomplete/codemirror"

interface Props extends HTMLAttributes<HTMLDivElement> {
  strategies: StrategyProps[]
  triggerImmediately?: boolean
  option?: TextcompleteOption
  codeMirrorOptions?: createCodeMirror.EditorConfiguration
}

export const CodeMirror: FC<Props> = (props) => {
  const {
    codeMirrorOptions,
    strategies,
    option,
    triggerImmediately,
    ...passthrough
  } = props
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      const cm = createCodeMirror(ref.current, {
        theme: "base16-light",
        ...codeMirrorOptions,
      })
      const div = ref.current.firstChild as HTMLDivElement
      div.style.height = "100px"
      const editor = new CodeMirrorEditor(cm)
      const textcomplete = new Textcomplete(editor, strategies, option)
      if (triggerImmediately) {
        cm.setCursor(0, cm.getValue().length)
        textcomplete.trigger(cm.getValue())
      }
      return () => {
        textcomplete.destroy()
      }
    }
  }, [ref, codeMirrorOptions, strategies, option, triggerImmediately])
  return <div ref={ref} {...passthrough} />
}
