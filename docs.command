## set permissions first at terminal
# chmod +x docs.command
## then run this:
# ./docs.command

documentation build js/** -f html -o docs
documentation build js/** -f md -o docs/docs.md

# docs.yml should allow a hierarchy but not working yet
# documentation build js/** --config docs.yml -f html -o docs
