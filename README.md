# Virtual Services on Cloud Costs 

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/virtual-services-stack-blitz?file=calculators.js)

Azure Costs offers virtual services which allow cloud solution providers to inject costs charged in advanced to the customer. This solution allows service providers to deliver a 360° view of the consumed cloud spendings to their customers. Besides this model supports building a consumption-based managed service ecosystem around cloud services on Azure, Amazon Web Services or Google Cloud Platform. More information regarding this and other features are available [here](https://blog.cloud-costs.com/)

Virtual Services are defined and declared based on JavaScript injection hooks to allow realizing complex pricing logic, e.g. Tiered Pricing, Consumption Based uplifts or one shoot per month pricing. This project is intended to be a sandbox where the logic can developed and debugged on the browser development environment StackBlitz based on static demo data. Press the [Edit on StackBlitz ⚡️](https://stackblitz.com/edit/virtual-services-stack-blitz?file=calculators.js) link to starting working in the sandbox.

## Calculators
Cloud Costs offers two different calculator hook which is called for every day a calculation is required. 

```js
function(day: number, month: number, year: number, group: string): number
```
The first hook described with his signature above is the so-called quantity hook and is intended to calculate the quantity of the virtual service meter. It must return a number as the value for the quantity. This hook can be found as function **calculatorQuantity** in the sandbox [here](https://stackblitz.com/edit/virtual-services-stack-blitz?file=calculators.js)

```js
function(day: number, month: number, year: number, quantity: number, group: string): number
```
The second hook described with his signature above is the so-called cost hook and is intended to calculate the costs of a virtual service meter. This hook is always called after the quantity hook and contains the parameter quantity which is the result of the costs hook. It must return a number as the value for the costs as well. This hook can be found as function **calculatorCosts** in the sandbox [here](https://stackblitz.com/edit/virtual-services-stack-blitz?file=calculators.js)

## Global State
The Virtual Service system injects a global state with context related data into the execution engine. The global state is defined in the variable **global** and is available in every hook in the same way. 

### global.getMeters()
As part of the global state, the function getMeters() returns a collection of meter models which allows executing calculations on top of the meters. An element of the collection has the following structure: 

```js
{
  ServiceId: 'DD9330E2-6437-4CF5-9884-A8F39C1553E9',
  MeterId: '55081114-40D1-4F39-A490-F76259F35A5C',
  MeterName: 'Hours',
  MeterResourceGroup: 'RG01',    
  getQuantity: function(day) { return 2; },
  getCost: function(day) { return 0.3 * 2; }
}
```

## Multi Instance Meters
Multi Instance Meters targets a specific requirements which are usualy comes up in more complex managed services. A Multi Instance Meter describes the logic that alle related resource meters are grouped by a specific property defined in the meter definition and every group results in a dedicated consumption meter as part of the resulting services. 

It's possible to bail out one or more groups when returning a negative value in the quantity calculator. the global.getMeters() operation returns only the meters which are part of this group and the group parameter of the calculator function contains the value of the defined group.

A more detailed example is described in the section Examples -> Consumption Based Uplift for Resource Groups with specific capabilities.

## Examples

### Fixed Price Meter at a specific date
The simplest way to define a virtual meter could be a so-called fixed price meter. This kind of meter adds a fee to the customer's dashboard on a specific day in the month for a specific price. It could be used to define a 3rd party SaaS service, for example, sending emails for a 9,95€ per month. 

#### Quantity Calculator
In this example, we design the system in a way that at the 5th of the month the fee becomes applied. The quantity of this fee  should be just 1 because of the subscription ordered by the customer only one time: 

```js   
  return day === 5 ? 1 : 0;
```  

#### Costs Calculator
The example above ensures that the quantity is correctly calculated and only on the specific charging day the value is above 0 which means the costs calculator is straightforward by multiply the price with the quantity. In this example the price is 100,00€ will be multiplied with the quantity: 

```js   
  return quantity * 100;
```  

### Fixed Price Meter distributed daily
The pricing module fixed price distributed daily can be used to emulate for the customer consumption-based pricing for a daily event when the price. In our example, the system takes the fixed price and figures out how long the current month is to distribute the fix prices along the month.

#### Quantity Calculator
The quantity calculator is straightforward because the consumption has a fixed value 1.

```js   
  return 1;
```  

#### Costs Calculator
The costs calculator is the more complex part because it must be evaluated how long is the month to assign the right chunk to the daily costs. Every other mathematic function can be used as well to figure out the daily costs. 

```js
  // define the fixed prices
  var fixedPrice = 100.0;

  // get the days of the requested month
  var daysInMonth = new Date(year, month, 0).getDate();

  // divide the fix price in the right portions
  var fixedPricePortion = fixedPrice / daysInMonth;

  // multiple with the quantity and return 
  return quantity * fixedPricePortion;
```
  
### Consumption Based uplift for dedicated Resource Group
The basic idea behind that example is to build a managed service which costs are related to the consumption of the cloud costs. Typically the uplift is generated on top of just a specific area of the costs, e.g., all services in a dedicated resource group. Additionally, the end user should get an idea of what was the base value the price is calculated from. 

#### Quantity Calculator
In this example, the quantity calculator aggregates all the costs of every meter which is related to the resource group RG01. We are using the costs to store this value as base costs in the quantity of the virtual meter. It gives the customer the transparency to understand what was the underlying database to calculate the costs.

Accessing to the meters happens via the global context and the *getMeters* operation. A couple of javascript functions are applied to the resulting array to build a simple map and reduce function as follows:

```js
  
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
```  

#### Costs Calculator
The costs calculator in this example is responsible for building the uplift as self-based on the base data stored in the quantity of the generated virtual meter. In this example an uplift of 15% is defined so the virtual meters will take 15% of the costs of the targeted resources as shown below:   

```js 
  return quantity * 0.15;
```

### Consumption Based Uplift for Resource Groups with specific capabilities
The idea behind this meter is very simlilar to the example before but not every meter should be uplifted and also a dedicated resource group is not know but the resource group contains in his name a capability flag. Using nomenclatures can be enforced esp. when the managed services is distributed autoamtically via ARM template or other services. This example is using the following definition:

* Every Resource Group starting with the prefix "ms_" is relevant becuase it contains managed services
* The capabilitiy flag is defined in the last two letters of the resourgroup, _pr means premium and _ul means ultimate

The following examples illustrate how the rules will be applied: 

* example_resource_group --> not relevant -> quantity calculator returns -1
* ms_digital_trasnformation_project_pr --> relevant for the premium service, quantity calculator proces the quantity
* ms_production_project_ul --> relevant for the ultimate service but this exmaple defines just the premium service so quantity calculator returns -1

Calculators defined below are targeting the virtual service meter for the premium offering, the ultimate offering must be defined in a seperate service definition.

#### Quantity Calculator
The quantity calculator first of all needs to check of the defined group is relevant for this caluation following the rules defined in the description above. If not the quantity calculator should return a value lower than 0 which indicates this meter group should be ignored for the virtual service. 

```js  
  // verify if the meter is relevant for this group 
  if (!group.startsWith('ms') || !group.endsWith('ul')) 
  {
    return -1;
  }
  
  // request all related meters from the group
  const meters = global.getMeters();
  
  // sum up the quantity of the meters which are in a specific resource group
  const costs = meters
    
  // map the complex model to the meter cost of the requested day becuase it makes 
  // sense to give the customer a chance understanding what is the base of the uplift
  .map(function(meter) { return meter.getCost(day); })

  // aggregate the cost with a js reduce funtion 
  .reduce(function(result, meterCosts) { return meterCosts + result; }, 0); 
    
  // return the calculated costs as result
  return costs;
```  

#### Costs Calculator
The costs calculator adds just the uplift defined for the given managed service but only when the quantity is above 0 other it's intended from the quantity calculator the this meter should be ignored. 

```js  
  // check if we have a positive quantity
  if (quantity < 0) 
  {
    return 0;
  }
  
  // define the uplift for the ultimate plan
  return quantity * 0.15;  
```  
