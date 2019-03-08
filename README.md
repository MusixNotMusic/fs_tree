# fs_tree
## 文件类型
|类型|颜色|缩写|
|--|--|--|
|FIFO|pink|FIFO|
|BlockDevice|orange|BD|
|File|#008080|F|
|Directory|#606aa1|/|
|SymbolicLink|yellow|S|
|Socket|purple|Socket|
|CharacterDevice|steelblue|C|

```bash
|--- /
|--- .git/
        |--- COMMIT_EDITMSG [F]
        |--- HEAD [F]
        |--- branches/
        |--- config [F]
        |--- description [F]
        |--- hooks/
                |--- applypatch-msg.sample [F]
                |--- commit-msg.sample [F]
                |--- post-update.sample [F]
                |--- pre-applypatch.sample [F]
                |--- pre-commit.sample [F]
                |--- pre-push.sample [F]
                |--- pre-rebase.sample [F]
                |--- prepare-commit-msg.sample [F]
                |--- update.sample [F]
        |--- index [F]
        |--- info/
                |--- exclude [F]
        |--- logs/
                |--- HEAD [F]
                |--- refs/
                        |--- heads/
                                |--- master [F]
                        |--- remotes/
                                |--- origin/
                                        |--- master [F]
        |--- objects/
                |--- 88/
                        |--- 19cabdffbad0b5cc057a75d5f09680428d4d17 [F]
                |--- d2/
                        |--- 71800d911cbc4e9af4ae1240f40a9c229698f5 [F]
                |--- df/
                        |--- fcbf6ad92c3406bff7cf82c60322450696c0f6 [F]
                |--- info/
                |--- pack/
        |--- refs/
                |--- heads/
                        |--- master [F]
                |--- remotes/
                        |--- origin/
                                |--- master [F]
                |--- tags/
|--- .gitignore [F]
|--- .node_modules [F]
|--- README.md [F]
|--- fs_tree.js [F]
|--- node_modules/
|--- package.json [F]
|--- yarn.lock [F]
```
