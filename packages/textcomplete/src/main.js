import Textcomplete from "./textcomplete"
import Textarea from "./textarea"

let editors
if (global.Textcomplete && global.Textcomplete.editors) {
  editors = global.Textcomplete.editors
} else {
  editors = {}
}
editors.Textarea = Textarea

global.Textcomplete = Textcomplete
global.Textcomplete.editors = editors
