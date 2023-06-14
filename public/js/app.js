/*
    REQUIRED ! to clean latestMeasure value before getting all values again
*/
window.localStorage.removeItem("latestMeasure");

/**
 * Benchmark callback performance in milliseconds
 * @param {*} callback
 * @returns {number}
 */
async function benchmark(callback) {
  const startTime = performance.now();
  await callback();
  const endTime = performance.now();

  // time in milliseconds
  const duration = endTime - startTime;

  const benchmarkDiv = document.querySelector("#benchmark");
  benchmarkDiv.innerText = `Benchmark: ${duration}ms`;

  return duration;
}

/**
 * Wrap fetch to get json directly
 * @see  [MDN Reference](https://developer.mozilla.org/docs/Web/API/queueMicrotask)
 * @param {RequestInfo | URL} input
 * @param {RequestInit | undefined} init
 * @returns {Promise<Response>}
 */
async function fetchJson(input, init) {
  const response = await fetch(input, init);
  return await response.json();
}

/**
 * Save latest measure in localStorage
 * @param {Array<number>} measures
 */
function saveLatestMeasure(measures) {
  if (measures.length > 0) {
    const latestMeasure = measures.at(-1);
    window.localStorage.setItem("latestMeasure", JSON.stringify(latestMeasure));
  }
}

async function fetchLatestMeasures() {
  const timestampTableHeader = document.querySelector("#timestamp");
  const luminosityTableHeader = document.querySelector("#luminosity");

  const serializedLatestMeasure = window.localStorage.getItem("latestMeasure");

  let measures = [];

  // If the value in localStorage is not present we want to fetch all measures
  // Else we want to fetch only latest values by providing the latestMeasure timestamp
  if (serializedLatestMeasure === null) {
    measures = await fetchJson("/luminosity/all");
    saveLatestMeasure(measures);
  } else {
    const deserializedLatestMeasure = JSON.parse(serializedLatestMeasure);

    measures = await fetchJson(
      `/luminosity/latest?timestamp=${deserializedLatestMeasure.timestamp}`
    );

    saveLatestMeasure(measures);
  }

  measures.forEach((measure) => {
    const newTimestampCell = document.createElement("td");
    const newLuminosityCell = document.createElement("td");

    newTimestampCell.innerText = new Date(measure.timestamp).toLocaleTimeString(
      "en-US",
      { hour12: false }
    );
    newLuminosityCell.innerText = measure.value;

    newTimestampCell.setAttribute("data-id", measure.id);
    newLuminosityCell.setAttribute("data-id", measure.id);

    timestampTableHeader.insertAdjacentElement("afterend", newTimestampCell);

    luminosityTableHeader.insertAdjacentElement("afterend", newLuminosityCell);
  });
}

/**
 * Analyze production patterns
 * @returns {void}
 */
async function analyzeProductionPatterns() {
  const bestMeasures = await fetchJson(`/luminosity/analyze`);

  // Map an array of ids
  const ids = bestMeasures.map((measure) => measure.id);

  // Clean classes before highlighting (again)
  document
    .querySelectorAll("[data-id]")
    .forEach((element) => element.classList.remove("highlight"));

  // Construct the CSS selector
  const selector = ids.map((id) => `[data-id="${id}"]`).join(",");

  // Iterate over the selected cells
  document.querySelectorAll(selector).forEach((td) => {
    // Highlight each td
    td.classList.add("highlight");
  });

  // Focus highlighted in scroll view
  const firstHighlighted = document.querySelectorAll(".highlight");

  // If there's no td with highlighting, we're probably outside current values and need to fetch latest measures.
  if (!firstHighlighted || firstHighlighted.length === 0) {
    await fetchLatestMeasures();
    await analyzeProductionPatterns();
  }

  Array.from(firstHighlighted).at(-1).scrollIntoView({ behavior: "smooth" });
}
