const core = require('@actions/core');
const httpm = require('@actions/http-client');
const github = require('@actions/github');

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

    var res = await httpm.HttpClient.get('https://raw.githubusercontent.com/rainersigwald/branch-status-action/branch-status/status.json').readBody();

    console.log(res);

    let obj = JSON.parse(res);



} catch (error) {
    core.setFailed(error.message);
}