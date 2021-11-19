const core = require('@actions/core');
import * as httpm from '@actions/http-client';
const github = require('@actions/github');

(async () => {
try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);

    const destinationBranch = github.context.payload.pull_request.base.ref;

    console.log(`base branch: ${destinationBranch}`);

    let client = new httpm.HttpClient("getter");

    var j = await client.getJson('https://raw.githubusercontent.com/rainersigwald/branch-status-action/branch-status/status.json');

    console.log(j);

    console.log(`Branch '${destinationBranch}' is ${j.result[destinationBranch].status} by ${j.result[destinationBranch].by} because ${j.result[destinationBranch].because}`);

} catch (error) {
    core.setFailed(error.message);
}
})();