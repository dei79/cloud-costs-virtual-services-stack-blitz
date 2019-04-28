// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = '                                              \
  <h1>Online Coding Sandbox for Azure Costs Virtual Services</h1> \
  <h2>Calculated Data</h2>                                        \
  <div id="data">                                                 \
    <table id="dataTable" border="1" cellpadding="5">             \
      <tr><td>Day</td><td>Quantity</td><td>Costs</td></tr>        \
    </table>                                                      \
  </div>';

// inject the api calls
import('./api.js').then((api) => {

  // inject the calculators calls
  import('./calculators.js').then((calculators) => {
        
    // build the context 
    const context = {
      event: { day: 0, month: 3, year: 2019 },
      api: api
    }

    // find our table element
    var table = document.getElementById("dataTable");

    for(let d = 1; d <= 31; d++) 
    {
      // Create an empty <tr> element and add it to the 1st position of the table:
      var row = table.insertRow(-1);

      // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
      var dayCell = row.insertCell(0);
      var costsCell = row.insertCell(1);
      var quantityCell = row.insertCell(1);

      // calculate quantity
      const dayQuantity = calculators.calculatorQuantity(context);        

      // calculate the costs
      const dayCosts = calculators.calculatorCosts(context, dayQuantity);

      // Add some text to the new cells:
      dayCell.innerHTML = context.event.year + '-' + context.event.month + '-' + d;
      quantityCell.innerHTML = dayQuantity;
      costsCell.innerHTML = dayCosts;
    }            
  })
})