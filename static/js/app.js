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
    let indivData = sampleSamples.filter(sample => (sample.id == indiv.toString()))[0];
    let indivMetaData = sampleMetadata.filter(meta => (meta.id == indiv))[0];

    //setting the individual metaData
    setMetaData(indiv);

    //creating variables for our charts
    let indivSampleIds = indivData.otu_ids;
    let indivSampleValues = indivData.sample_values;
    let indivSampleLabels = indivData.otu_labels;

    
    //Creating the Bar Chart
    let barChart = [{
        let xVal: indivSampleValues.slice(0,10).reverse();
        let yVal: indivSampleIds.slice(0,10).map(ids=> `OTU #{ids}`).reverse();
        let textVal

        x: ,
        y: ,
        text: indivSampleLabels.slice(0,10).reverse(),
        name:'Taxa',
        type:'bar',
        orientation:'h',
    }];

    let barChartLayout = [{
        title: 'Top 10 Sample Values',
        xaxis: {title: 'Samples', fixedrange:true},
        yaxis: {title:'OTU IDs', fixedrange:true},
    }];
    Plotly.newPlot('bar', [barChart], barChartLayout);

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
    
    let bubbleChartLayout = [{
        title: 'Sample Values vs OTU IDs',
        xaxis: {title:'OTU IDs'},
        yaxis: {title:'Sample Values'},

    }];

    Plotly.newPlot('bubble',bubbleChart,bubbleChartLayout);
};

function setMetaData(indiv){
    let indivMetaData = sampleMetadata.filter(meta=>(meta.id==indiv))[0];
    let metaDataDiv = d3.select('#sample-metadata');

    //We need to update the metaData so that we can use the new values when needed.
    //This is done by refreshing the <p> elements
    metaDataDiv.selectAll('p').remove();
    metaDataDiv.selectAll('p').data(Object.entries(indivMetaData)).enter().append('p').text(d=>`${d[0]}:${d[1]}`);
};

function chartUpdate(indiv){
    let indivData = sampleSamples.filter(sample=>(sample.id==indiv.toString()))[0];
    let indivMetaData = sampleMetadata.filter(meta=>(meta.id==indiv))[0];

    let indivSampleIds = indivData.otu_ids;
    let indivSampleValues = indivData.sample_values;
    let indivSampleLabels = indivData.otu_labes;

    let barChartUpdate = {
        x:[indivSampleValues.slice(0,10).reverse()],
        y:[indivSampleIds.slice(0,10).map(ids=>`OTU ${ids}`).reverse()],
        text:[indivSampleLabels.slice(0,10).reverse()],
    };
    console.log(barChartUpdate);
    Plotly.restyle('bar',barChartUpdate);

    let bubblechartUpdate = {
        x:[indivSampleIds],
        y:[indivSampleValues],
        text:[indivSampleLabels],
        'marker.size':[indivSampleValues],
        'marker.color':[indivSampleIds],
    };
    Plotly.restyle('bubble',bubblechartUpdate);
};

function optionChanged(value){
    console.log('Value Changed to:', value);
    setMetaData(value);
    chartUpdate(value);
    };

//launch the charts
initialize();