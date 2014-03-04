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
* aside from short term pull request branches, ordinarily RC releases will be built from `master` [[2]](#footnote_2)
* the exception for this is when an already released-into-production build must be "hot-fixed"
* at the time of promoting a build from `edge` to `RC`, the source code will be git tagged

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
<a name="footnote_2">[2]</a> The implication of this is that `master` must *always* be in a working state which could be potentially released.<br/>
<a name="footnote_3">[3]</a> A "high-level" job may in fact be implemented by combining several utility jobs, such a job to do particular git operations etc
