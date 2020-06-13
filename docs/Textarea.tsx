import React, {
  useEffect,
  useRef,
  TextareaHTMLAttributes,
  CSSProperties,
  ReactElement,
} from "react"

import {
  Textarea as TextareaEditor,
  StrategyProps,
  Textcomplete,
  TextcompleteOption,
} from "textcomplete"

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  triggerImmediately?: boolean
  strategies: StrategyProps[]
  option?: TextcompleteOption
}

const DEFAULT_STYLE: CSSProperties = {
  width: "100%",
  resize: "none",
}

export function Textarea<T>(props: TextareaProps): ReactElement {
  const { strategies, triggerImmediately, option, ...passthough } = props
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (ref.current) {
      const editor = new TextareaEditor(ref.current)
      const textcomplete = new Textcomplete(editor, strategies, option)
      if (triggerImmediately) {
        const value = ref.current.value
        ref.current.focus()
        ref.current.setSelectionRange(value.length, value.length)
        textcomplete.trigger(value)
      }
      return () => {
        textcomplete.destroy()
      }
    }
  }, [ref, strategies, option, triggerImmediately])
  return <textarea ref={ref} style={DEFAULT_STYLE} rows={5} {...passthough} />
}
