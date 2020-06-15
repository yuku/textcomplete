import React, { FC } from "react"

import {
  DEFAULT_DROPDOWN_CLASS_NAME,
  DEFAULT_DROPDOWN_ITEM_ACTIVE_CLASS_NAME,
  DEFAULT_DROPDOWN_ITEM_CLASS_NAME,
  DEFAULT_DROPDOWN_MAX_COUNT,
  DEFAULT_DROPDOWN_PLACEMENT,
} from "../../packages/textcomplete-core/src/Dropdown"
import { DEFAULT_INDEX } from "../../packages/textcomplete-core/src/Strategy"

import { Code } from "../components/Code"
import { Section } from "../components/Section"

interface Props {
  id: string
}

const INITIALIZE_CODE = `
const { Textcomplete } = require("@textcomplete/core")
const { TextareaEditor } = require("@textcomplete/textarea")

// How to construct the editor object depends on the actual editor class.
// Please read the document of the editor you choose.
const editor = new TextareaEditor(myTextareaElement)

// Start autocompleting
// The strategy and option are described below.
const textcomplete = new Textcomplete(editor, [strategy], option)

// When you finish using it.
// This command also destroys the editor object. 
textcomplete.destroy()
`

const SAMPLE_STRATEGY = `
// This is a sample strategy that autocompletes GitHub-style emoji notation.
// This document page is using almost the same strategy for demo.
{
  // (Optional) Identifier of the strategy. Will be appear on data-strategy
  // attribute of a dropdown element.
  id: "mention",

  // (Optional) This function is called on every change before matching. The
  // first argument is the string from head to cursor. If it returns \`false\`,
  // following matching phase isn't started.
  context: (beforeCursor: string) =>
    // Return false if the cursor is in code block or inline code notation
    // to stop executing the matching phase.
    !isInClode(beforeCursor),

  // (Required) On every change, the string from head to cursor tests with the
  // RegExp. If it matches, the captured substring will be passed to the search
  // parameter's first argument.
  // See also "index" parameter.
  match: /\\B:([\\-+\\w]*)$/,

  // (Optional) Specify the index of target capture group. Default to ${DEFAULT_INDEX}.
  index: 1,

  // (Required) When the current input matches the "match" regexp above, this
  // function is called. The first argument is the captured substring.
  // You can callback only once for each search.
  search: async (
    term: string,
    callback: (results: ResultType[]) => void,
    match: RegExpMatchArray
  ) => {
    callback(await gatherCandidates(term))
  },

  // (Optional) Whether the search results are cached. Default false.
  cache: false,

  // (Optional) Specify how to render each search result on the dropdown UI.
  // The argument is an element of the search results callbacked in the search
  // phase.
  template: ([key, url]) =>
    \`<img src="\${url}"/>&nbsp;<small>\${key}</small>\`,

  // (Required) Specify how to update the editor value. The whole substring
  // matched in the match phase will be replaced by the returned value.
  // Note that it can return a string or an array of two strings. If it returns
  // an array, the matched substring will be replaced by the concatenated string
  // and the cursor will be set between first and second strings.
  replace: (result: ResultType): string => \`:\${result[0]}: \`
}
`

const SAMPLE_OPTION = `
// Default option. All properties are optional recursively.
{
  // Configure a dropdown UI. 
  dropdown: {
    // Class attribute of the dropdown element.
    className: "${DEFAULT_DROPDOWN_CLASS_NAME}",

    // The maximum number of items to be rendered.
    maxCount: ${DEFAULT_DROPDOWN_MAX_COUNT},

    // Placement of the dropdown. "auto", "top" or "bottom".
    placement: "${DEFAULT_DROPDOWN_PLACEMENT}",

    // Return header and footer elements' content
    header: (results: ResultType[]) => "",
    footer: (results: ResultType[]) => "",

    // Whether activate the opposite side item on pressing up or
    // down key when an edge item is active.
    rotate: false,

    // Configure CSS style of the dropdown element.
    style: { display: "none", position: "absolute", zIndex: "1000" },

    // The parent node of the dropdown element.
    parent: document.body,
    
    item: {
      // Class attribute of the each dropdown item element.
      className: "${DEFAULT_DROPDOWN_ITEM_CLASS_NAME}",

      // Active item's class attribute.
      activeClassName: "${DEFAULT_DROPDOWN_ITEM_ACTIVE_CLASS_NAME}",
    }
  }
}
`

export const Usage: FC<Props> = ({ id }) => (
  <Section id={id} title="Usage">
    <Code code="npm install --save @textcomplete/core" language="bash" />
    <p>
      You also need to install an <a href="#editors">editor</a> package. An
      editor encapsulates a HTML element where users will be writing text.
    </p>
    <Code code="npm install --save @textcomplete/textarea" language="bash" />
    <p>
      To use textcomplete, you have to create a <code>Textcomplete</code> object
      with an editor:
    </p>
    <Code code={INITIALIZE_CODE} language="javascript" />
    <h3>How it works</h3>
    <ol>
      <li>(An input event is triggered to the underlying HTML element.)</li>
      <li>
        The <code>editor</code> emits a change event.
      </li>
      <li>
        For each registered strategy:
        <ol>
          <li>[Context phase] Test context (Optional).</li>
          <li>
            [Match phase] Try extracting a search term. If it fails, continue to
            the next strategy.
          </li>
          <li>
            [Search phase] Gather candidates using the search term. The way how
            to gather them is completely up to you.
          </li>
          <li>[Render phase] Show a dropdown UI rendering the candidates.</li>
        </ol>
      </li>
      <li>
        When user selects a dropdown item by either clicking it or pushing an
        enter key, the <code>editor</code>&apos;s value is updated.
      </li>
    </ol>
    <h3 id="strategy">Strategy</h3>
    <p>
      A <code>strategy</code> object represents a rule of autocompletion. The{" "}
      <code>match</code>, <code>search</code> and <code>replace</code> keys are
      required.
    </p>
    <Code code={SAMPLE_STRATEGY} language="typescript" />
    <h3 id="strategy">Option</h3>
    <p>
      An <code>option</code> object affects rest of behavior.
    </p>
    <Code code={SAMPLE_OPTION} language="typescript" />
    <h3 id="events">Events</h3>
    <p>
      Textcomplete provides custom events for most actions. Generally, these
      come in an infinitive and past participle form - where the infinitive (ex.{" "}
      <code>show</code>) is triggered at the start of an event, and its past
      participle form (ex. <code>shown</code>) is triggered on the completion of
      an action.
    </p>
    <p>
      An infinitive events provide <code>preventDefault</code> functionality.
      This provides the ability to stop the execution of an action before it
      starts.
    </p>
    <table>
      <thead>
        <tr>
          <th style={{ minWidth: "100px" }}>Event Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>show</td>
          <td>Fired immediately when the dropdown is going to be shown.</td>
        </tr>
        <tr>
          <td>shown</td>
          <td>
            Fired when the dropdown has been made visible to the user (will wait
            for CSS transitions to complete).
          </td>
        </tr>
        <tr>
          <td>render</td>
          <td>
            Fired immediately when dropdown items are goint to be visible to the
            user.
          </td>
        </tr>
        <tr>
          <td>rendered</td>
          <td>
            Fired when the dropdown items have been visible to the user (will
            wait for CSS transitions to complete).
          </td>
        </tr>
        <tr>
          <td>select</td>
          <td>Fired immediately when a dropdown item is selected.</td>
        </tr>
        <tr>
          <td>selected</td>
          <td>
            Fired when the selected dropdown item was applied to the editor
            (will wait for CSS transitions to complete).
          </td>
        </tr>
        <tr>
          <td>hide</td>
          <td>Fired immediately when the dropdown is going to be hidden.</td>
        </tr>
        <tr>
          <td>hidden</td>
          <td>
            Fired when the dropdown has finished being hidden from the user
            (will wait for CSS transitions to complete).
          </td>
        </tr>
      </tbody>
    </table>
    <p>
      The native <code>input</code> event is dispatched to the textarea element
      when its value is changed because a search result has been selected.
    </p>
  </Section>
)
