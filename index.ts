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

    var j = await client.getJson('https://raw.githubusercontent.com/rainersigwald/branch-status-action/branch-status/status.json',
        {
            "Cache-Control": "no-cache"
        });

    console.log(j);

    const branch = j.result[destinationBranch];

    var state: "failure" | "success" | "error" | "pending" = "success";
    var description = `No special state for '${destinationBranch}'`;

    if (branch != null) {
        description = `'${destinationBranch}' is ${branch.status} by ${j.result[destinationBranch].by} because ${j.result[destinationBranch].because}`;

        console.log(description);

        if (branch.status === "blocked") {
            state = "failure";
        } else {
            state = "pending";
        }
    }

    await octokit.request('POST /repos/{owner}/{repo}/statuses/{sha}', {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        sha: payload.after,
        state: state,
        description: description,
        target_url: `https://github.com/rainersigwald/branch-status-action/blob/branch-status/status.json#${destinationBranch}_is_${branch?.status}`,
        context: "Destination branch"
    });


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