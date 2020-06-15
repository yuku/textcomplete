import React, {
  useEffect,
  useRef,
  TextareaHTMLAttributes,
  CSSProperties,
  FC,
} from "react"

import {
  StrategyProps,
  Textcomplete,
  TextcompleteOption,
} from "@textcomplete/core"
import { TextareaEditor } from "@textcomplete/textarea"

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  triggerImmediately?: boolean
  strategies: StrategyProps[]
  option?: TextcompleteOption
  focus?: boolean
}

const DEFAULT_STYLE: CSSProperties = {
  width: "100%",
  resize: "none",
}

export const Textarea: FC<Props> = (props) => {
  const {
    strategies,
    triggerImmediately,
    option,
    focus,
    ...passthrough
  } = props
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (ref.current) {
      const editor = new TextareaEditor(ref.current)
      const textcomplete = new Textcomplete(editor, strategies, option)
      if (focus) {
        ref.current.focus()
      }
      if (triggerImmediately) {
        const value = ref.current.value
        ref.current.setSelectionRange(value.length, value.length)
        textcomplete.trigger(value)
      }
      return () => {
        textcomplete.destroy()
      }
    }
  }, [ref, strategies, option, triggerImmediately, focus])
  return <textarea ref={ref} style={DEFAULT_STYLE} rows={5} {...passthrough} />
}
