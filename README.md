# better_git_changelog
Make a changelog from git commits, tags, and releases

```
npm install --save better_git_changelog
better_git_changelog
```

&nbsp; 

&nbsp; 

# What's this, then?
Other changelog making tools were too complex and didn't do what I want.  One was close, but 
didn't cleanly handle the mix of `1.0.0` and `v1.0.0` in the history, and didn't give links
to relevant branches.

So, I made a zero-config CHANGELOG tool.

This is generally intended to be used as a step in the ends of build chains.  The author uses
it by making a command `changelog` in the scripts block of any project's `package.json`, then
writing `better_git_changelog` in there, and can now issue `npm run changelog` to receive
bacon.

&nbsp; 

&nbsp; 

# What does it look like?

[There's an example here](https://github.com/StoneCypher/jssm/blob/main/CHANGELOG.md).
