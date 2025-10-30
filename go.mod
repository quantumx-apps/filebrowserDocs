module github/gtsteffaniak/filebrowser/docs

go 1.25.0

// uncomment this for local development changes to upstream theme
// MUST have theme cloned in same folder as this project
replace github.com/quantumx-apps/filebrowserDocsTheme => ../filebrowserDocsTheme

require (
	github.com/gohugoio/hugo-mod-jslibs-dist/popperjs/v2 v2.21100.20000 // indirect
	github.com/quantumx-apps/filebrowserDocsTheme v1.2.5 // indirect
	github.com/twbs/bootstrap v5.3.8+incompatible // indirect
)
