var demoData = [
  {
    ServiceId: 'D47D8474-42C9-445D-BE6B-201685B78DD2',
    MeterId: '8697B963-21E1-442E-98E3-8DDBFEAE9E57',
    MeterName: 'Hours',
    MeterRate: 0.123,
    MeterQuantity: 7,
    MeterResourceGroup: 'RG01'    
  },
  {
    ServiceId: '021F59B2-1220-4B4A-9416-293F6460D9A0',
    MeterId: '55081114-40D1-4F39-A490-F76259F35A5C',
    MeterName: 'Hours',
    MeterRate: 0.123,
    MeterQuantity: 5,
    MeterResourceGroup: 'RG02'    
  },
  {
    ServiceId: 'DD9330E2-6437-4CF5-9884-A8F39C1553E9',
    MeterId: '55081114-40D1-4F39-A490-F76259F35A5C',
    MeterName: 'Hours',
    MeterRate: 0.300,
    MeterQuantity: 2,
    MeterResourceGroup: 'RG01'    
  }
]

export function getMeters() 
{
  return demoData;
}