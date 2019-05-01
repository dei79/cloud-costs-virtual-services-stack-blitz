// the global context
var global = {};

// quantity calculator
export function calculatorQuantity(day, month, year) 
{  
  // request all related meters
  const meters = global.getMeters();
  
  // sum up the quantity of the meters which are in a specific resource group
  const costs = meters

    // filter the meters by resource group
    .filter(function(meter) { return meter.MeterResourceGroup.toLowerCase() === 'rg01';})
    
    // map the complex model to the meter cost of the requested day becuase it makes 
    // sense to give the customer a chance understanding what is the base of the uplift
    .map(function(meter) { return meter.getCost(day); })
    
    // aggregate the cost with a js reduce funtion 
    .reduce(function(result, meterCosts) { return meterCosts + result; }, 0); 
    
  // return the calculated costs as result
  return costs;  
}

// costs calculator
export function calculatorCosts(day, month, year, quantity) 
{
    return quantity * 0.15;
}

// helper to emulte the global context
export function setGlobalContext(globalValue)
{    
  global = globalValue;
}
