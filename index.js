import lodash from 'lodash';

// Function to get the current time and date and return it
function getTime() {
    return new Date();
}

// Context is the flow metadata .ie. when the flow was started, the current block placement in the flow, etc
// Data is the data we get from the previous block
const run = (context, data) => {
    // Get the current time and date
    const currentTime = getTime();
    const result = lodash.add(1, 2);
    console.log(currentTime);
    console.log(result);
    // Return the current time and date
    return { currentTime };
}

const res = run({}, {});
console.log(res);