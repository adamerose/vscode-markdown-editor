This subfolder is based off this guide:
https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#scenario-2-building-from-source
Using this as a template:
https://github.com/ckeditor/ckeditor5/tree/master/packages/ckeditor5-build-classic

Any changes to the CKEditor5 editor need to be built by running `npm build` in this folder. The root extension code webview reads `ckeditor.js` from the build folder output.