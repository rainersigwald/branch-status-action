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

    console.log(`base branch: ${github.context.payload.pull_request.base.ref}`);

    let client = new httpm.HttpClient("getter");

    client.getAgent

    var j = await client.getJson('https://raw.githubusercontent.com/rainersigwald/branch-status-action/branch-status/status.json');

    console.log(j);


} catch (error) {
    core.setFailed(error.message);
}
})();