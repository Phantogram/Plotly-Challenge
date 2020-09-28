// Use the D3 library to read in samples.json.

// Initialize the page with the first samples info, data, charts
function init() {
    var dropDown = d3.select("#selDataset")
    d3.json("samples.json").then(function(data) {
        var names = data.names
        names.forEach( name => { 
            dropDown.append("option").text(name)
        })

    metaData(names[0]) 
    getChart(names[0])

    });
};

// Update all of the plots any time that a new sample is selected.
function optionChanged(name) {
    metaData(name)
    getChart(name)

};

// Display the sample metadata, i.e., an individual's demographic information.
function metaData(sample) {
    var panel = d3.select("#sample-metadata")
    panel.html("")
    d3.json("samples.json").then(function(data) {
        var metadata = data.metadata
        var filteredMeta = metadata.filter(item => item.id == sample)[0]
        var wfreq = filteredMeta.wfreq
        console.log(wfreq)

        // Display each key-value pair from the metadata JSON object somewhere on the page.
        Object.entries(filteredMeta).forEach((key) => {   
            panel.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        })

        // BONUS: ADVANCED CHALLENGE ASSIGNMENT (OPTIONAL)
        // Create the data array for the gauge plot
        var gaugeData = [{

            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wfreq),
            title: { text: `<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week`},
            type: "indicator",
            
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] },
                     steps: [
                      { range: [0, 1], color: "ivory" },
                      { range: [1, 2], color: "beige" },
                      { range: [2, 3], color: "lightgoldenrodyellow" },
                      { range: [3, 4], color: "lemonchiffon" },
                      { range: [4, 5], color: "#ddffcc" },
                      { range: [5, 6], color: "#d9ffcc" },
                      { range: [6, 7], color: "#ccffb3" },
                      { range: [7, 8], color: "#bbff99" },
                      { range: [8, 9], color: "#aaff80" },
                    ]}
                
            }];
        // Define the bar plot layout
        var gaugeLayout = { 
            width: 500, 
            height: 500, 
            margin: { t: 0, b: 40, l:50, r:50 } 
            };
        
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    })

};


function getChart(plot) {

    d3.json("samples.json").then(function(data) {
        var samples = data.samples
        var filteredSamp = samples.filter(sample => sample.id == plot)[0]
        console.log(filteredSamp)
        var ids = samples[0]
        console.log(ids)
        var sampleValues = filteredSamp.sample_values
        console.log(sampleValues)
        var otuIds = filteredSamp.otu_ids
        console.log(otuIds)
        var otuLabels = filteredSamp.otu_labels
        console.log(otuLabels)

        // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs.
        // Create bar trace
        var barTrace = {
            x: sampleValues.slice(0,10).reverse(),
            y: otuIds.slice(0,10).map(otuIds => `OTU ${otuIds}`).reverse(),
            mode: 'markers',
            marker: {size:18},
            text: otuLabels.slice(0,10).reverse(),
            type: "bar",
            orientation: 'h',
          };
          
        // Create the data array for the bar plot
        var barData = [barTrace];
          
        // Define the bar plot layout
        var barLayout = {
            title: "<b>Top 10 OTUs</b>",
            margin: { t: 100, b: 40, l:125, r:50 } 
          };
          
        // Plot the chart to a div tag with id "bar"
        Plotly.newPlot("bar", barData, barLayout);

        // Create a bubble chart that displays each sample.
        // Create bubble trace 
        var bubbleTrace = {
            x: otuIds,
            y: sampleValues,
            mode: "markers",
            marker: { 
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            },
            text: otuLabels
        };

        // Create the data array for the bubble plot
        var bubbleData = [bubbleTrace];

        // Define the bubble plot layout
        var bubbleLayout = { 
            xaxis: {title: "OTU ID"},
            height: 600,
            width: 1200
        };

        // Plot the chart to a div tag with id "bubble"
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        
})}


init();
