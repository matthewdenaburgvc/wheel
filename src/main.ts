import $ from "jquery";
import "./scss/main.scss";
import Wheel from "./ts/wheel";
import { loadNamesFromUrl, shareUrl, saveNames, updateNames, darkModeToggler } from "./ts/utils.ts";

$(document).ready(function() {
  const names = loadNamesFromUrl().randomize();
  if (names.length === 0) {
    for (let i = 1; i <= 6; i++) {
      names.push(`Person ${i}`);
    }
  }

  $("#share").on("click", shareUrl);
  $('#theme-toggle').on("click", darkModeToggler());
  $('#go-button').on("click", saveNames);
  $('#edit-button').on("click", updateNames);

  $(`#people-input`).val(names.join('\n'));

  new Wheel(names).init();
});
