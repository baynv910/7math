let editor;
window.onload = function () {
    editor = com.wiris.jsEditor.JsEditor.newInstance({'language': 'en'});
    editor.insertInto(document.getElementById('editorContainer'));
}