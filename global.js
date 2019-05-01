var demoData = [
  {
    ServiceId: 'D47D8474-42C9-445D-BE6B-201685B78DD2',
    MeterId: '8697B963-21E1-442E-98E3-8DDBFEAE9E57',
    MeterName: 'Hours',    
    MeterResourceGroup: 'RG01',
    getQuantity: function(day) { return 2; },
    getCost: function(day) { return 0.15 * 2; }
  },
  {
    ServiceId: '021F59B2-1220-4B4A-9416-293F6460D9A0',
    MeterId: '55081114-40D1-4F39-A490-F76259F35A5C',
    MeterName: 'Hours',
    MeterResourceGroup: 'RG02',
    getQuantity: function(day) { return 2; },
    getCost: function(day) { return 0.2 * 2; }
  },
  {
    ServiceId: 'DD9330E2-6437-4CF5-9884-A8F39C1553E9',
    MeterId: '55081114-40D1-4F39-A490-F76259F35A5C',
    MeterName: 'Hours',
    MeterResourceGroup: 'RG01',
    getQuantity: function(day) { return 2; },
    getCost: function(day) { return 0.3 * 2; }
  }
]

export function getMeters() 
{
  return demoData;
}