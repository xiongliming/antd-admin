/**
 * Created by zealot on 17/6/23.
 */
// in custom-plotly.js
let Plotly = require('plotly.js/lib/core');

// Load in the trace types for pie, and choropleth
Plotly.register([
  require('plotly.js/lib/pie'),
  require('plotly.js/lib/choropleth')
]);

module.exports = Plotly;
