const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
//Creating universal variables that can be used outside of local functions
let sampleNames;
let sampleMetadata;
let sampleSamples;

function initialize(){
    d3.json(url).then(function(data){
        sampleNames = data.names;
        sampleMetadata = data.metadata;
        sampleSamples = data.samples;

        //Initialize our dropdown, we are inserting our sample values
        let dropDownButton = d3.select('#selDataset');
        for (i=0; i<sampleNames.length; i++){
            dropDownButton.append('option').text(sampleNames[i]).attr('value',sampleNames[i])
        }
        //940 is the first record in samples.json
        initialSetup(940); 
    });
}

function initialSetup(indiv){
    let indivData = sampleSamples.filter(sample => (sample.id == indiv.toString())) [0];
    let indivMetaData = sampleMetadata.filter(meta => (meta.id == indiv))[0];

    //setting the individual metaData
    setMetaData(indiv);

    //creating charts
    let indivSampleIds = indivData.otu._ids;
    let indivSampleValues = indivData.sample_values;
    let indivSampleLabels = indivData.otu_labels;

    //Creating the Bar Chart
    let barChart = [{
        x: indivSampleValues.slice(0,10).reverse(),
        y: indivSampleIds.slice(0,10).map(ids=> `OTU #{ids}`).reverse(),
        text: indivSampleLabels.slice(0,10).reverse(),
    }];
    Plotly.newPlot('bar', barChart, config);

    //Creating the Bubble Chart
    let bubbleChart = [{
        x:indivSampleIds,
        y:indivSampleValues,
        text:indivSampleLabels,
        mode:'markers',
        marker:{
            size:indivSampleValues,
            color:indivSampleIds,
        },

    }];
    Plotly.newPlot('bubble',bubbleChart,config);

    //Creating the Gauge Chart
    let gaugeChart = [{
        value: indivMetaData.wfreq,
        type:'indicator',
        mode:'gauge+number',
    }];
    Plotly.plot('gauge',gaugeChart,config);
};

function setMetaData(indiv){
    let indivMetaData = sampleMetadata.fliter(meta=>(meta.id==indiv))[0];
    let metaDataDiv = d3.select('#sample-metadata');
};
//launch the charts
initialize();