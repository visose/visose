'use strict';

(async () => {
    const response = await fetch("/api/count", {
        method: "post",
        body: JSON.stringify({ page: "index" }),
    });
    console.log("Increment counter: ", response.statusText);
})();