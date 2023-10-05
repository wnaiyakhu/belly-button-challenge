let data;

// Load data
function loadData() {
    d3.json("samples.json").then(jsonData => {
        data = jsonData;
        console.log(data);

        // Populate the dropdown
        populateDropdown(data);

        // Create the initial charts and display metadata
        updateDashboard(data.names[0]);
    });
}

// Define the populateDropdown function
function populateDropdown(data) {
    let dropdown = d3.select("#selDataset");

    data.names.forEach(sampleId => {
        dropdown.append("option").text(sampleId).property("value", sampleId);
    });
}

// Call the loadData function
loadData();

function createBarChart(sample) {
    // Extract the top 10 OTUs from 'sample'
    let top10SampleValues = sample.sample_values.slice(0, 10);
    let top10OTUIds = sample.otu_ids.slice(0, 10);
    let top10OTULabels = sample.otu_labels.slice(0, 10);
    // Create the horizontal bar chart
    let trace = {
        x: top10SampleValues,
        y: top10OTUIds.map(otuId => `OTU ${otuId}`),
        text: top10OTULabels,
        type: "bar",
        orientation: "h"
    };

    let data = [trace];

    Plotly.react("bar-chart", data);
}

// Define the createBubbleChart function
function createBubbleChart(sample) {

    let trace = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: 'markers',
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids,
            colorscale: 'Viridis'
        }
    };

    let data = [trace];
    let layout = {
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot("bubble-chart", data, layout);
}

// Display the sample metadata, i.e., an individual's demographic information
function displayMetadata(metadata) {

    let metadataDiv = d3.select("#sample-metadata");

    metadataDiv.html("");

    Object.entries(metadata).forEach(([key, value]) => {
        metadataDiv.append("p").text(`${key}: ${value}`);
    });
}

d3.select("#selDataset").on("change", function () {
    let selectedSampleId = d3.select(this).property("value");
    updateDashboard(selectedSampleId);
});

function updateDashboard(selectedSampleId) {
    let selectedSample = data.samples.find(sample => sample.id === selectedSampleId);
    let selectedMetadata = data.metadata.find(metadata => metadata.id.toString() === selectedSampleId);

    createBarChart(selectedSample);
    createBubbleChart(selectedSample);
    displayMetadata(selectedMetadata);
}






  


