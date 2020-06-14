import React, { FC } from "react"

import { startsWith } from "./emoji"
import { Textarea } from "./Textarea"

export const App: FC = () => {
  return (
    <div>
      <header>
        <h1>Textcomplete</h1>
        <small>Autocomplete for Textarea</small>
      </header>
      <section>
        <Textarea
          triggerImmediately
          strategies={[
            {
              id: "emoji",
              match: /\B:([\-+\w]*)$/,
              index: 1,
              search: async (term, callback) => {
                callback(await startsWith(term))
              },
              replace: ([key]) => `:${key}: `,
              template: ([key, url]) =>
                `<img src="${url}"/>&nbsp;<small>:${key}:</small>`,
            },
          ]}
          option={{ dropdown: { maxCount: 3 } }}
          defaultValue="Hello, this is the textcomplete :smi"
        />
      </section>
    </div>
  )
}
