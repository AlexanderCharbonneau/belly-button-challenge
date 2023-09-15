const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// load data from URL
const loadData = () => d3.json(url);

// load data
async function init() {
  try {
    const data = await loadData(); // Load data from the URL
    const dropdownMenu = d3.select("#selDataset");
    const names = data.names; // Extract sample names from data

    // dropdown menu
    names.forEach((id) => {
      dropdownMenu
        .append("option")
        .text(id)
        .property("value", id);
    });

    const sample_one = names[0];
    buildMetadata(sample_one, data); // metadata panel
    buildBarChart(sample_one, data); // bar chart
    buildBubbleChart(sample_one, data); // bubble chart
    buildGaugeChart(sample_one, data); // gauge chart
  } catch (error) {
    console.error("Error loading data:", error); //incase of error
  }
}

// sample metadata panel
function buildMetadata(sample, data) {
  const { metadata } = data;
  const value = metadata.find((result) => result.id == sample);

  d3.select("#sample-metadata").html("");

  // metadata info
  Object.entries(value).forEach(([key, value]) => {
    d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
  });
}

// bar chart
function buildBarChart(sample, data) {
  const sampleInfo = data.samples;
  const value = sampleInfo.find((result) => result.id == sample);
  const valueData = value;

  // extracting
  const otu_ids = valueData.otu_ids;
  const otu_labels = valueData.otu_labels;
  const sample_values = valueData.sample_values;

  // plotting
  const yticks = otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();
  const xticks = sample_values.slice(0, 10).reverse();
  const labels = otu_labels.slice(0, 10).reverse();

  // display bar chart
  const trace = {
    x: xticks,
    y: yticks,
    text: labels,
    type: "bar",
    orientation: "h",
  };

  const layout = {
    title: "Top 10 OTUs Present",
  };

  Plotly.newPlot("bar", [trace], layout);
}

// bubble chart
function buildBubbleChart(sample, data) {
  const sampleInfo = data.samples;
  const value = sampleInfo.find((result) => result.id == sample);
  const valueData = value;

  // extracting bubble
  const otu_ids = valueData.otu_ids;
  const otu_labels = valueData.otu_labels;
  const sample_values = valueData.sample_values;

  // display bubble
  const trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth",
    },
  };

  const layout = {
    title: "Bacteria Per Sample",
    hovermode: "closest",
    xaxis: { title: "OTU ID" },
  };

  Plotly.newPlot("bubble", [trace1], layout);
}

// dropdown selection changes
function optionChanged(value) {
  buildMetadata(value);
  buildBarChart(value);
  buildBubbleChart(value);
  buildGaugeChart(value);
}

// run it
init();
