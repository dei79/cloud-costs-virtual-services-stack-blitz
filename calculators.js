/* 
 * This functions demonstrate how to deal with the context of Virtual Services in Azure 
 * Costs. The context contains is the communication endpoint to the Costs Platform and 
 * structured as follows: 
 * 
 * Event-Information:
 * 
 * context.event.day - Contains the day for what the platform requires data
 * context.event.month - Contains the month for what the platform requires data
 * context.event.year - Contains the year for what the platform requires data
 * 
 * API Calls: 
 * 
 * context.api.getMeters() - Allows to receive all the meters which are usable.
 * 
 * Structure of a single meter
 * 
 * {
 *    ServiceId: 'Id of the Service',
 *    MeterId: 'ID of the Meter',
 *    MeterName: 'Name of the Meter',
 *    MeterRate: 'Price of the Meter',
 *    MeterQuantity: 'Amount of the Meter on the requested days',
 *    MeterResourceGroup: 'ResourceGroup the meter belongs to'    
 * }
 */

export function calculatorQuantity(context) 
{
  // take the meters 
  const meters = context.api.getMeters();
  
  // sum up the quantity of the meters which are in a specific
  // resource group
  const quantity = meters
    .filter((meter) => meter.MeterResourceGroup === 'RG01')
    .map((meter) => meter.MeterQuantity)
    .reduce((result, meterQuantity) => meterQuantity + result); 

  // done
  return quantity;
}

export function calculatorCosts(context, quantity) 
{
  // take the meters 
  const meters = context.api.getMeters();

  // calculate the costs for all meters in the same resource MeterResourceGroup
  let costs = meters
    .filter((meter) => meter.MeterResourceGroup === 'RG01')
    .map((meter) => meter.MeterRate * meter.MeterQuantity)
    .reduce((result, meterCosts) => meterCosts + result); 

  // uplift the price by 10%
  costs = costs * 1.1;

  // don
  return costs;
}

