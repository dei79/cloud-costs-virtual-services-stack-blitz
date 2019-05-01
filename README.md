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
<<TODO>>
  
### Fixed Price Meter distributed on a daily basis
<<TODO>>
  
### Consumption Based Uplift for dedicated Resource Group
<<TODO>>


