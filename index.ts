const core = require('@actions/core');
import * as httpm from '@actions/http-client';
import * as  github from '@actions/github';

(async () => {
try {
    const token = core.getInput('repo-token');

    const payload = github.context.payload;
    // Get the JSON webhook payload for the event that triggered the workflow
    const payloadJson = JSON.stringify(payload, undefined, 2)
    console.log(`The event payload: ${payloadJson}`);

    const destinationBranch = payload.pull_request.base.ref;

    console.log(`base branch: ${destinationBranch}`);

    let client = new httpm.HttpClient("getter");

    const octokit = github.getOctokit(token, {});

    var j = await client.getJson('https://raw.githubusercontent.com/rainersigwald/branch-status-action/branch-status/status.json');

    console.log(j);

    const branch = j.result[destinationBranch];

    if (branch != null) {
        await octokit.request('POST /repos/{owner}/{repo}/statuses/{sha}', {
            owner: 'octocat',
            repo: 'hello-world',
            sha: payload.before,
            state: branch.status !== "open" ? 'success' : 'pending',
        })

        if (branch.status !== "open") {
            core.setFailed(`Branch '${destinationBranch}' is ${branch.status} by ${j.result[destinationBranch].by} because ${j.result[destinationBranch].because}`);
        }
        else {
            console.log(`Branch '${destinationBranch}' is ${branch.status} by ${j.result[destinationBranch].by} because ${j.result[destinationBranch].because}`);
        }
    }

    // const pulls = await octokit.rest.pulls.list({
    //     owner: "rainersigwald",
    //     repo: "branch-status-action",
    //     base: destinationBranch,
    //     state: "open"
    // });
    // console.log(JSON.stringify(pulls));

} catch (error) {
    core.setFailed(error.message);
}
})();