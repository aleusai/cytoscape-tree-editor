var Mousetrap = require("mousetrap");
const commands = [
    {
      name: "Create the control bar in a separate window (ctrl + w)",
      command() {Mousetrap.trigger('ctrl+w')},
    },
    {
      name: "Raise/lower z-index of Editors (ctrl + o)",
      command() {Mousetrap.trigger('ctrl+w')},
    },
    {
      name: "Tab Shift through the Json view branches (ctrl + t)",
      command() {Mousetrap.trigger('ctrl+t')},
    },
    {
      name: "Hide/Show Editors (ctrl + p)",
      command() {Mousetrap.trigger('ctrl+p')},
    },
    {
      name: "Clone (ctrl c)",
      command() {Mousetrap.trigger('ctrl+c')},
    },
    {
      name: "Delete (ctrl d)",
      command() {Mousetrap.trigger('ctrl+d')},
    },
    {
      name: "Upload File (ctrl+u)",
      command() {Mousetrap.trigger('ctrl+u')},
    },
    {
      name: "Save to File (ctrl+s)",
      command() {Mousetrap.trigger('ctrl+s')},
    },
    {
      name: "Spacing in (ctrl + shift + m",
      command() {Mousetrap.trigger('ctrl + shift + m')},
    },
    {
      name: "Spacing out (ctrl + shift + n",
      command() {Mousetrap.trigger('ctrl + shift + n')},
    },
    {
      name: "Search node by label (ctrl f); clear search and unselect all (ctrl g)",
      command() {Mousetrap.trigger('ctrl + f')},
    },
    {
      name: "Expand/collapse (ctrl k / command k)",
      command() {Mousetrap.trigger('ctrl + k')},
    },
  ];

  export default commands;