## These are real quick commands for a zsh terminal (oh-my-zsh)

[Source](https://github.com/ohmyzsh/ohmyzsh/blob/master/plugins/git/git.plugin.zsh)

- gaa='git add --all'
- gb='git branch'
- gcam='git commit -a -m'
- gl='git pull'
- gp='git push'
- gra='git remote add'
- gsb='git status -sb'
- glols="git log --graph --pretty='%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --stat"

Also some functions like
1. Force push
```shell
function ggfl() {
  [[ "$#" != 1 ]] && local b="$(git_current_branch)"
  git push --force-with-lease origin "${b:=$1}"
}
```

2. Push
```shell
function ggp() {
  if [[ "$#" != 0 ]] && [[ "$#" != 1 ]]; then
    git push origin "${*}"
  else
    [[ "$#" == 0 ]] && local b="$(git_current_branch)"
    git push origin "${b:=$1}"
  fi
}
```

