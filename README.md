# Virtual Services on Cloud Costs 

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/virtual-services-stack-blitz?file=calculators.js)

Azure Costs offers virtual services which allows cloud solution providers to inject costs charged in advanced to the customer. This solution allows service provider to deliver a 360° transparent view of the consumed cloud spendings to their customers. In addition this model supports building a consumption based managed service eco system around cloud services on Azure, Amazon Web Services or Google Cloud Platfom. More information regarding this and other features can be found [here](https://blog.cloud-costs.com/)

Virtual Services are defined and declared based on JavaScript injection hooks to allow realising complex pricing logic e.g. Tiered Pricing, Consumption Based uplifts or one shoot per month pricing. This project is intended to be a sandbox where the logic can be developed on the browser development environment StackBlitz based on static demo data. Presse the [Edit on StackBlitz ⚡️](https://stackblitz.com/edit/virtual-services-stack-blitz?file=calculators.js) link to starting working in the sandbox.

## Calculators
Cloud Costs offers two different calculator hook which is called for every day a calculation is required. 

```js
function(day: number, month: number, year: number): number
```
The first hook described with his signature above is the so called quantity hook and is intended to calculate the quantity of the virtual service meter. It must return a number as value for the quantity. This hook can be found as function **calculatorQuantity** in the sandbox [here](https://stackblitz.com/edit/virtual-services-stack-blitz?file=calculators.js)

```js
function(day: number, month: number, year: number, quantity: number): number
```
The second hook described with his signature aboce is the so called cost hook and is intended to calculte the costs of a virutal service meter. This hook is always called after the quantity hook and contains the parameter quantity which is the result of the costs hook. It must return a number as value for the costs as well. This hook can be found as function **calculatorCosts** in the sandbox [here](https://stackblitz.com/edit/virtual-services-stack-blitz?file=calculators.js)

## Global State
The Virtual Service system injects a global state with context related data into the execution engine. The global state is defined in the variable **global** and can be used in every hook in the same way. 

### global.getMeters()
As part of the global state the function getMeters returns a collection of meter models which allows to execeute calculations on top of the meters. An element of the collection has the following structure: 

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

## Examples

### Fixed Price Meter at a specific date
The most simplest way to define a virtual meter could be a so called fixed price meter. This kind of meter adds a fee to the customers dashboard at a specific day in the month for a specific price. This could be used to define a 3rd party SaaS service, e.g. sending mails for 9,95€ pro month. 

#### Quantity Calculator
In this example we design the system in a way that at the 5th of the month the sure charge should happen. The quantity of this sure charge should be just 1 becuase the subscription was booked one times: 

```js   
  if (day === 5) {
    return 1;
  } else {
    retrun 0;
  }
```  

### Costs Calculator
The example above ensures that the quantity is calculated correctly and only on the specific charging day the value is above 0 which means the costs calculator is very simple by just multiply the price with the quantity. In this example the price is 100,00€ which will be multiplied with the quanity: 

```js   
  return quanity * 100;
```  

### Fixed Price Meter distributed on a daily basis
The pricing module fixed price distributed on a daily basis can be used to emulate for the customer a consumption based pricing on a daily basis event when the price is fixed. In our example the system takes the fixed price and figures out how long the current month is to distribute the fix prices along the month.

#### Quantity Calculator
The quantity calculator is very simple because the consumption is defined with the value 1.

```js   
  return 1;
```  

### Costs Calculator
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
The basic idea behind that example is to build a managed service which costs are related to the consumption of the cloud costs. Typically the uplift is generated on top of just a specific area of the costs, e.g. all services in a dedicated resource group. In adition the end user should get an idea what was the base value the price was calculated from. 

#### Quantity Calculator
In this example the quantity calculator aggregates all the costs of every meter which is related to the resource group RG01. We are using the costs to store this value as base costs in the quantity of the virtual meter. This gives the customer the transparency to understand what was the underlaying database to calculate the costs.

Accessing to the meters happens via the gloabl context and the *getMeters* operation. A couple javascript functions are applied on the resulting array to build a simple map and reduce function as follows:

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

### Costs Calculator
The costs calculator in this example is responsible for building the uplift as self based on the base data stored in the quantity of the generated virtual meter. In this example an uplift of 15% is defined so the virtual meters will take 15% of the costs of the targeted resources as shown below:   

```js 
  return quantity * 0.15;
```


