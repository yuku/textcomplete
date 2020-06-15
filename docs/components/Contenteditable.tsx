import React, { useEffect, useRef, FC, HTMLAttributes } from "react"

import {
  StrategyProps,
  Textcomplete,
  TextcompleteOption,
} from "@textcomplete/core"
import { ContenteditableEditor } from "@textcomplete/contenteditable"

interface Props extends HTMLAttributes<HTMLDivElement> {
  strategies: StrategyProps[]
  triggerImmediately?: boolean
  option?: TextcompleteOption
  text: string
}

export const Contenteditable: FC<Props> = (props) => {
  const {
    strategies,
    triggerImmediately,
    option,
    text,
    children,
    ...passthrough
  } = props
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = text
      const editor = new ContenteditableEditor(ref.current)
      const textcomplete = new Textcomplete(editor, strategies, option)
      // if (triggerImmediately) {
      //   const range = document.createRange()
      //   range.setStart(ref.current.firstChild, ref.current.innerText.length)
      //   range.collapse(true)
      //   getSelection().addRange(range)
      //   textcomplete.trigger(editor.getBeforeCursor())
      // }
      return () => {
        textcomplete.destroy()
      }
    }
  }, [ref, strategies, option, triggerImmediately, text])
  return <div ref={ref} contentEditable {...passthrough} />
}
