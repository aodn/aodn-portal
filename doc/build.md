Following is a proposal for the portal versioning and build/deployment workflow.  [[1]](#footnote_1)

Authors: @tojofo @jkburges @danfruehauf @dnahodil @anguss00 

## Versioning
* a unique `version number` will be given to each release candidate, and will remain unchanged when the release candidate is promoted to production
* the `version number` will follow the [SemVer](http://semver.org/) scheme, but in short: `<major>.<minor>.<patch>`
* a `build number` will be assigned (ordinarily, there will only be one build for each version), for each build of a particular version 
* the `build number` will simply be the timestamp when the build was done, with format `yyyyMMddHHmmss`
* any deployment will be uniquely identifiable by the combination of the `version number` and `build number` and these parameters will be visible from the app for ease of bug reporting

## Git branching and tagging
* normal process around (short-lived) features branches and github pull requests into `master` remains unchanged
* when it is decided that `master` is ready to become a release candidate, a `RC branch` named `<major>.<minor>` will be created; the previous `RC branch` should also be deleted at this point
* any subsequent patches will be done on the same `RC branch`, but with an incremented patch number (e.g. `<major>.<minor>.<patch + 1>`)
* any subsequent features will result in a new `RC branch` (e.g. `<major>.<minor + 1>`) [[2]](#footnote_2)
* every RC version will be tagged

## Implementation in Jenkins
There will be three high-level [[3]](#footnote_3) jenkins jobs - edge, RC and prod.

### edge
* triggered on every git commit
* runs tests

### RC
* triggered manually (single click, no parameters)
* deletes previous RC branch
* create new RC branch from the sha used in the most recent `edge` job
* copies the `war` and `md5sum` from the most recent `edge` job, making it available for chef to deploy in to the RC environment.

### prod
* triggered manually (single click, no parameters)
* copies the `war` and `md5sum` from the most recent `RC` job, making it available for chef to deploy in to the production environment.

#### Footnotes
<a name="footnote_1">[1]</a> Hopefully it can become the standard across all of our apps.<br/>
<a name="footnote_2">[2]</a> This scenario can often happen in portal when an RC version is released in time for the review on the last day of sprint.  Following that, another release (which includes new features) must be done for the work completed on the final day.<br/>
<a name="footnote_3">[3]</a> A "high-level" job may in fact be implemented by combining several utility jobs, such a job to do particular git operations etc